# node
FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm run build

# nginx
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]