FROM node:20.11.1

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

RUN npx prisma generate

COPY . .

CMD [ "pnpm", "start" ]