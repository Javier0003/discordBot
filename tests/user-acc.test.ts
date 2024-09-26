import { eq } from 'drizzle-orm'
import { plays } from '../drizzle/schemas/schema'
import { db } from '../src/utils/db'
import { scores } from '../src/events/commands/user-info'
import OsuDaily from '../src/events/commands/osu-daily'

function getAvgAccuracy(scores: scores[]): string {
  if (scores.length === 0) return '0%'

  const total = scores.reduce((acc: number, score: scores) => acc + Number(score.accuracy), 0)

  return `${OsuDaily.accuracy(total / scores.length)}%`
}

async function test() {
  const res = await db
    .select()
    .from(plays)
    .where(eq(plays.uId, '642690500276649985'))

  console.log(getAvgAccuracy(res))
}

test()
