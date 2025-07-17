FROM node:22-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ openjdk21-jdk python3
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "node", "index.js" ]