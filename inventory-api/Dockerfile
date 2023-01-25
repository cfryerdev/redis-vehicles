FROM node:16-alpine as base
WORKDIR .
COPY package.json .
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm i
COPY --chown=node:node . ./
RUN rm .env
USER node
CMD ["npm", "start"]