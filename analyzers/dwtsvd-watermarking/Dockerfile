FROM docker.arvancloud.ir/alpine:latest as builder

RUN apk update && apk add g++ cmake opencv make opencv-dev pkgconfig

WORKDIR /app

COPY . /app

RUN cmake -DCMAKE_INSTALL_PREFIX=/usr/local -B build  \
	&& cmake --build build \
	&& cmake --install build
