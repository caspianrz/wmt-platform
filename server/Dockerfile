FROM alpine:3

RUN sed -i 's/dl-cdn.alpinelinux.org/alpine.global.ssl.fastly.net/g' /etc/apk/repositories

RUN apk update && apk add nodejs npm

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

CMD ["npm", "run", "start"]
