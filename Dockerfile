FROM node:14.15.3@sha256:75e1dc0763f97d0907b81e378d0242ab9034fb54544430898b99a3ac71fa0928 AS build

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY tsconfig.json tsconfig.build.json ./
COPY .yarn ./.yarn
COPY src ./src

RUN yarn install --immutable --immutable-cache
RUN yarn build

FROM node:14.15.3-slim@sha256:ddc3c66e079c9725b54cea772b568b461fcfe58db0429f9d90e2b23d4006f3ef

ENV PORT 4000

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY --from=build /app/dist ./dist

RUN yarn install --immutable --immutable-cache

EXPOSE $PORT

CMD ["node", "dist/main.js"]
