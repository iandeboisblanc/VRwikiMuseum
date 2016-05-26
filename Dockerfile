FROM node
RUN npm install -g babel
RUN npm install -g webpack

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
ADD . /app

RUN webpack

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80
CMD ["npm", "run", "docker-start"]