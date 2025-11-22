FROM archlinux:latest

# Install dependencies
RUN pacman -Syu --noconfirm bash wget bzip2 curl gcc && \
    pacman -Scc --noconfirm

# Set Miniconda version
ENV MINICONDA_VERSION=py311_26.1.1-1
ENV CONDA_DIR=/opt/conda

# Download and install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh && \
    bash /tmp/miniconda.sh -b -p $CONDA_DIR && \
    rm /tmp/miniconda.sh

# Update PATH
ENV PATH=$CONDA_DIR/bin:$PATH

# Accept Anaconda ToS before running conda update
RUN conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main && \
    conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r

# Update conda + cleanup
RUN conda update -n base -c defaults conda -y && \
    conda clean -afy

# Create env
RUN conda create -n sharif-wm python=3.10.14 -y

# Install torch + cuda inside env (using conda run)
RUN conda run -n sharif-wm conda install -y \
    pytorch torchvision pytorch-cuda=12.4 -c pytorch -c nvidia

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN pip install -r requirements.txt

# Download checkpoint using the env
RUN mkdir -p checkpoints && \
    conda run -n sharif-wm wget https://dl.fbaipublicfiles.com/watermark_anything/wam_mit.pth -P checkpoints/
