FROM node:8.16.1-jessie
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000

CMD ["node", "app.js"]
