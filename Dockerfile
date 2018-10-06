# node
FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ARG api
RUN API_ROUTE="$api" npm run build
RUN echo "Building with API_ROUTE=$api"

# nginx
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]