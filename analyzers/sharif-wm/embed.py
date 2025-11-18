#!/usr/bin/env python

# Seems like we need to delete some stuff.

import os
import os.path
import sys

import torch

from torchvision.utils import save_image

from watermark_anything.data.transforms import unnormalize_img

import util

base_dir = os.path.dirname(os.path.abspath(__file__))

def embed(inp, outp, uid):
    exp_dir = os.path.join(base_dir, "checkpoints")
    json_path = os.path.join(exp_dir, "params.json")
    ckpt_path = os.path.join(exp_dir, "wam_mit.pth")
    wam = util.load_model_from_checkpoint(json_path, ckpt_path).to(util.device)

    seed = 42
    torch.manual_seed(seed)

    proportion_masked = 0.5  # Proportion of the image to be watermarked (0.5 means 50% of the image)

# Output path
    outputpath = outp
    outputDir = os.path.dirname(outputpath)
    os.makedirs(outputDir, exist_ok=True)

    n = int(uid)
    print(f'{n:032b}')
    wm_msg = torch.tensor([int(b) for b in f"{n:032b}"], dtype=torch.float32).unsqueeze(0).to(util.device)

# save_path = "wm_msg.pt"  # you can choose any path
# torch.save(wm_msg, save_path)
    img_pt = util.load_img(inp).to(util.device)
    output = wam.embed(img_pt, wm_msg)
    mask = util.create_random_mask(img_pt, num_masks=1, mask_percentage=proportion_masked)
    img_w = output['imgs_w'] * mask + img_pt * (1 - mask)
    save_image(unnormalize_img(img_w), outputpath)

    import qrcode

    qr = qrcode.QRCode(version= 1, box_size = 16, border = 5)
    qr.add_data(f'{n:032b}')
    qr.make(fit = True)
    msg_img = qr.make_image(fill_color = 'black', back_color = 'white')
    msg_path : str = outputpath + '_qr.jpg'
    msg_img.save(msg_path)
    return f'{n:032b}'

if __name__ == "__main__":
    embed(sys.argv[1], sys.argv[2], sys.argv[3])
