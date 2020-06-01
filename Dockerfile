FROM node:12-alpine3.10
WORKDIR /build

COPY package* ./
RUN npm ci

COPY . ./
RUN npm run build

FROM node:12-alpine3.10
WORKDIR /app

COPY package* ./
RUN npm install --only=prod

COPY . .

COPY --from=0 /build/dist ./

CMD ["nodejs", "./src/server/index.js"]
