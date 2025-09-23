FROM node:22.18.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
RUN npm migrate:up
CMD ["npm", "run", "dev"]