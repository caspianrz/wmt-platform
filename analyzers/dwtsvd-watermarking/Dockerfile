FROM alpine:latest as builder

RUN apk update && apk add g++ cmake opencv make opencv-dev pkgconfig asio-dev libarchive-dev

WORKDIR /app

COPY . /app

RUN cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local -B build \
	&& cmake --build build \
	&& cmake --install build

CMD ["/app/build/api"]
