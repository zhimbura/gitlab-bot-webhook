FROM node
ADD package.json package-lock.json /
RUN npm install

COPY . .

RUN npm install

EXPOSE 80

CMD [ "npm", "run", "start" ]
