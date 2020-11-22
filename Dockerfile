FROM node:lts

WORKDIR /usr/src/app

COPY . .

RUN yarn install --pure-lockfile --non-interactive
RUN yarn build:prod

CMD ["./wait-for-it.sh", "conf-rabbit:5672", "--", "yarn", "start"]
