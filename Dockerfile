FROM node:12-slim as build
WORKDIR /usr/node
COPY package.json package-lock.json* ./
RUN npm install -g @angular/cli@^10.2.0
RUN npm install --no-optional && npm cache clean --force
COPY ./ .
RUN ng build --aot=true --buildOptimizer=true --source-map=false --prod --output-path ./dist

FROM nginx:1.19-alpine as deploy
COPY --from=build /usr/node/dist /usr/share/nginx/html/
COPY --from=build /usr/node/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80





