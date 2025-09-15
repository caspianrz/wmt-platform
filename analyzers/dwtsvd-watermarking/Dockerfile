FROM alpine:3

RUN apk update && apk add g++ cmake opencv make opencv-dev pkgconfig

WORKDIR /app

COPY *.cpp ./
COPY *.h ./
COPY CMakeLists.txt .

RUN mkdir build && cd build && cmake -DBUILD_SHARED_LIBS=OFF -DCMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++" -DCMAKE_BUILD_TYPE=Release .. && make

COPY build/diwatermark bin/
