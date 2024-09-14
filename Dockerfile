FROM node:lts-alpine as clientBuilder

COPY client/package.json .

COPY client/tsconfig.json .

COPY client/views views
COPY client/public public
COPY client/src src

RUN npm install --legacy-peer-deps

RUN npm run build

FROM node:lts-alpine as builder

RUN apk add python3 make g++

COPY package.json .

RUN npm install --legacy-peer-deps

COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

COPY src src

ENV NODE_ENV=production

RUN npm run build

FROM node:lts-alpine as prod

WORKDIR /app

COPY --from=builder package.json .

ENV NODE_ENV=production

RUN npm install --ignore-optional --legacy-peer-deps

COPY ormconfig.js .

COPY --from=builder dist dist

COPY --from=clientBuilder build client/build
COPY --from=clientBuilder views client/views

COPY views views

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 5000

ENTRYPOINT ["node", "dist/main.js"]

CMD ["serve"]
