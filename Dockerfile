FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/dist/peque-front/browser/. /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
