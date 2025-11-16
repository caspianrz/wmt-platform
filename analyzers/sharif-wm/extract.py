#!/usr/bin/env python

import util
import os
import sys

import torch
import torch.nn.functional as F

from watermark_anything.data.metrics import msg_predict_inference


util.pushdir(os.path.dirname(os.path.abspath(__file__)))
exp_dir = "checkpoints"
json_path = os.path.join(exp_dir, "params.json")
ckpt_path = os.path.join(exp_dir, 'wam_mit.pth') 
wam = util.load_model_from_checkpoint(json_path, ckpt_path).to(util.device).eval()

seed = 42
torch.manual_seed(seed)

# Parameters
num_imgs = 121  # Number of images to watermark from the folder
proportion_masked = 0.5  # Proportion of the image to be watermarked (0.5 means 50% of the image)

load_path = "wm_msg.pt"
wm_msg = torch.load(ckpt_path)

img_w = util.load_img(sys.argv[1])
preds = wam.detect(img_w)["preds"]  # [1, 33, 256, 256]
mask_preds = F.sigmoid(preds[:, 0, :, :])  # [1, 256, 256], predicted mask 
bit_preds = preds[:, 1:, :, :]
pred_message = msg_predict_inference(bit_preds, mask_preds).cpu().float()  # [1, 32]


def msg2str(msg):
    return "".join([('1' if el else '0') for el in msg])

import qrcode

qr = qrcode.QRCode(version= 1, box_size = 16, border = 5)
qr.add_data(f'{msg2str(pred_message[0])}')
qr.make(fit = True)
msg_img = qr.make_image(fill_color = 'black', back_color = 'white')
msg_path : str = sys.argv[2] + '.jpg'
msg_img.save(msg_path)

util.popdir()
