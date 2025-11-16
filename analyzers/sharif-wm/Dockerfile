FROM docker.arvancloud.ir/conda/miniconda3 as conda
RUN conda create -n "sharif-wm" python=3.10.14 && conda activate "sharif-wm" && conda install pytorch torchvision pytorch-cuda=12.4 -c pytorch -c nvidia

WORKDIR /app
COPY . /app

RUN pip install -r requirements.txt
RUN wget https://dl.fbaipublicfiles.com/watermark_anything/wam_mit.pth -P checkpoints/
