FROM node:alpine
WORKDIR /node
COPY package.json .
RUN npm install
COPY . .
EXPOSE $PORT
CMD ["npm", "run", "dev"]

