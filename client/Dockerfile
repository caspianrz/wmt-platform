FROM node:20-alpine AS build-env
WORKDIR /app

# Install Alpine build tools
RUN apk update && apk add --no-cache \ 
		python3 \ 
		make \ 
		g++ \ 
		cairo-dev \
    pango-dev \
    giflib-dev \
    jpeg-dev \
    librsvg-dev \
    pkgconfig \
    bash \
    git

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (dev included)
RUN npm ci

# Copy the source code
COPY . .

# Build React app
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
