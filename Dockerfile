FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Crée un dossier pour les dépendances
VOLUME ["/app/node_modules"]

EXPOSE 3000

CMD ["npm", "run", "dev"]