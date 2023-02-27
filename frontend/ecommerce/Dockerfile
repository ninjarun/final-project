
FROM node:18.14.0-alpine

RUN apk update 


WORKDIR /FINAL_PROJECT/frontend/ecommerce

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]