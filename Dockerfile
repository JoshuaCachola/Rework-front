FROM node:8.15-alpine as build-stage

# Add all our files install and start
WORKDIR /usr/src/app
COPY package.json .
RUN npm install 

COPY . .

EXPOSE 4000
CMD ["npm", "run", "start"]