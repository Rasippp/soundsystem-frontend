# =====================================
# 🏗️ STAGE 1: BUILD (Node)
# =====================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =====================================
# 🚀 STAGE 2: SERVE (Nginx)
# =====================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
