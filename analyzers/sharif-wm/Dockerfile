FROM archlinux:latest

# 1) Install dependencies + uv
RUN pacman -Syu --noconfirm \
        opencv \
        libglvnd \
        mesa \
        glew \
        qt5-base \
        bash \
        wget \
        curl \
        gcc \
        python \
        python-pip \
        uv && \
    pacman -Scc --noconfirm

WORKDIR /app

# 2) Copy project
COPY . /app

# 3) Create uv virtual environment
RUN uv venv .venv

# 4) Install PyTorch (choose one):
RUN uv pip install \
    torch \
    torchvision \
    torchaudio \
    --index-url https://download.pytorch.org/whl/cu124

# 5) Install project dependencies
COPY requirements.txt requirements.txt
RUN uv pip install -r requirements.txt

# 6) Download checkpoint
RUN mkdir -p checkpoints && \
    wget https://dl.fbaipublicfiles.com/watermark_anything/wam_mit.pth -P checkpoints/

# 7) Run app using the uv virtualenv python
CMD [".venv/bin/python", "api.py"]

