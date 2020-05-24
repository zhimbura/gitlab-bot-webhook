FROM node
ADD package.json package-lock.json /
RUN npm install

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "start" ]
