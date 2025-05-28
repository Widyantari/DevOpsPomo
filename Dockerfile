# Step 1: Build React app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY . .
RUN npm run build

# Step 2: Serve via Nginx
FROM nginx:alpine

# Tambahkan custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]