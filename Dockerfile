FROM node:8.15-alpine as build-stage

# Add all our files install and start
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PROD_API=https://aircnc-backend-api-prod.herokuapp.com/

EXPOSE 4000
CMD ["npm", "run", "start:production"]