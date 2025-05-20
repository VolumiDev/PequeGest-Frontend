# Stage 1: build Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: servidor NGINX
FROM nginx:stable-alpine

# Borra la configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu nginx.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copia los ficheros del build de Angular
COPY --from=build /app/dist/peque-front/browser/. /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
