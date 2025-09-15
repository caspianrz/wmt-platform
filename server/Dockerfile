FROM alpine:3
RUN apk update && apk add nodejs npm gcompat opencv-dev

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY package.json package-lock.json ./
COPY . .
RUN npm run build
EXPOSE 9990
CMD ["npm", "run", "start"]
