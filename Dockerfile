# node
FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

# nginx
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]