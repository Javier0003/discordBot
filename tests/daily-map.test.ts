import { generateDailyRandomMap } from '../src/events/events/daily-map'

const main = async () => {
  const xd = await generateDailyRandomMap()

  console.log(xd)
  console.log("----------------------included----------------------")
}

for (let i = 0; i < 3; i++){
  main()
}
