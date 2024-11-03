FROM node:22-alpine

WORKDIR /usr/src/app

COPY --chown=node:node ./ .

RUN yarn install

USER node

ENV NODE_ENV production

CMD [ "yarn", "db:prod" ]
