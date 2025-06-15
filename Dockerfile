FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Le code source sera monté par Docker Compose, pas besoin de COPY .

EXPOSE 3000

CMD ["npm", "run", "dev"]