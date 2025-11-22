git pull origin main

pnpm install

sudo docker-compose down

sudo docker-compose build

sudo docker-compose up -d

sleep 5

pnpm migrate

sudo docker-compose down

sudo docker-compose up -d