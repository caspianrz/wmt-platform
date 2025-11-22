import os
import os.path
import json
import argparse
import random

import omegaconf
from PIL import Image
import base64
import io

import torch
from torchvision import transforms

from watermark_anything.data.transforms import default_transform, normalize_img, unnormalize_img
from watermark_anything.models import Wam, build_embedder, build_extractor
from watermark_anything.augmentation.augmenter import Augmenter
from watermark_anything.data.transforms import default_transform, normalize_img, unnormalize_img
from watermark_anything.modules.jnd import JND

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

pushstack = list()

def pushdir(dirname):
  global pushstack
  pushstack.append(os.getcwd())
  os.chdir(dirname)

def popdir():
  global pushstack
  os.chdir(pushstack.pop())

def load_model_from_checkpoint(json_path, ckpt_path):
    """
    Load a model from a checkpoint file and a JSON file containing the parameters.
    Args:
    - json_path (str): the path to the JSON file containing the parameters
    - ckpt_path (str): the path to the checkpoint file
    """
    # Load the JSON file
    with open(json_path, 'r') as file:
        params = json.load(file)
    # Create an argparse Namespace object from the parameters
    args = argparse.Namespace(**params)
    # print(args)
    
    # Load configurations
    embedder_cfg = omegaconf.OmegaConf.load(args.embedder_config)
    embedder_params = embedder_cfg[args.embedder_model]
    extractor_cfg = omegaconf.OmegaConf.load(args.extractor_config)
    extractor_params = extractor_cfg[args.extractor_model]
    augmenter_cfg = omegaconf.OmegaConf.load(args.augmentation_config)
    attenuation_cfg = omegaconf.OmegaConf.load(args.attenuation_config)
        
    # Build models
    embedder = build_embedder(args.embedder_model, embedder_params, args.nbits)
    extractor = build_extractor(extractor_cfg.model, extractor_params, args.img_size, args.nbits)
    augmenter = Augmenter(**augmenter_cfg)
    attenuation : JND | None = None
    try:
        attenuation = JND(**attenuation_cfg[args.attenuation], preprocess=unnormalize_img, postprocess=normalize_img)
    except:
        attenuation = None
    
    # Build the complete model
    wam = Wam(embedder, extractor, augmenter, attenuation, args.scaling_w, args.scaling_i)
    
    # Load the model weights
    if os.path.exists(ckpt_path):
        checkpoint = torch.load(ckpt_path, map_location='cpu')
        wam.load_state_dict(checkpoint)
    else:
        print("Checkpoint path does not exist:", ckpt_path)
    
    return wam

def create_random_mask(img_pt, num_masks=1, mask_percentage=0.1, max_attempts=100):
    _, _, height, width = img_pt.shape
    mask_area = int(height * width * mask_percentage)
    masks = torch.zeros((num_masks, 1, height, width), dtype=img_pt.dtype)

    if mask_percentage >= 0.999:
        # Full mask for entire image
        return torch.ones((num_masks, 1, height, width), dtype=img_pt.dtype).to(img_pt.device)

    for ii in range(num_masks):
        placed = False
        attempts = 0
        while not placed and attempts < max_attempts:
            attempts += 1

            max_dim = int(mask_area ** 0.5)
            mask_width = random.randint(1, max_dim)
            mask_height = mask_area // mask_width

            # Allow broader aspect ratios for larger masks
            aspect_ratio = mask_width / mask_height if mask_height != 0 else 0
            if 0.25 <= aspect_ratio <= 4:  # Looser ratio constraint
                if mask_height <= height and mask_width <= width:
                    x_start = random.randint(0, width - mask_width)
                    y_start = random.randint(0, height - mask_height)
                    overlap = False
                    for jj in range(ii):
                        if torch.sum(masks[jj, :, y_start:y_start + mask_height, x_start:x_start + mask_width]) > 0:
                            overlap = True
                            break
                    if not overlap:
                        masks[ii, :, y_start:y_start + mask_height, x_start:x_start + mask_width] = 1
                        placed = True

        if not placed:
            # Fallback: just fill a central region if all attempts fail
            center_h = height // 2
            center_w = width // 2
            half_area = int((mask_area // 2) ** 0.5)
            h_half = min(center_h, half_area)
            w_half = min(center_w, half_area)
            masks[ii, :, center_h - h_half:center_h + h_half, center_w - w_half:center_w + w_half] = 1

    return masks.to(img_pt.device)

def load_img(path):
    img = Image.open(path).convert("RGB")
    img = default_transform(img).unsqueeze(0).to(device)
    return img

def load_img_from_base64(base64_str):
    # Decode the base64 string into bytes
    img_bytes = base64.b64decode(base64_str)
    
    # Open image from bytes
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    
    # Apply your existing transform and move to device
    img = default_transform(img).unsqueeze(0).to(device)
    return img

def tensor_to_base64(img_tensor):
    """
    Convert a tensor image (1xCxHxW) to base64 string.
    Assumes img_tensor is already in [0,1] range.
    """
    # Remove batch dimension
    img_tensor = img_tensor.squeeze(0).to(device)
    
    # Convert to PIL Image
    img_pil = transforms.ToPILImage()(img_tensor)  # if img in [0,1]

    # Save to a bytes buffer
    buffer = io.BytesIO()
    img_pil.save(buffer, format="JPG")
    buffer.seek(0)

    # Encode as base64
    img_base64 = base64.b64encode(buffer.read()).decode("utf-8")
    return img_base64
