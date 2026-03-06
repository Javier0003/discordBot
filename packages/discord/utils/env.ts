import 'dotenv/config'


const {
  BOT_TOKEN,
} = process.env


if (!BOT_TOKEN) {
  throw new Error("Missing BOT_TOKEN environment variable");
}

export {
  BOT_TOKEN,
}