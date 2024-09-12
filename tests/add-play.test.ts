// import { plays } from '../drizzle/schemas/schema'
// import MapasOsu from '../src/events/events/daily-map'
import { asc, desc, eq } from 'drizzle-orm'
import { mapas, plays } from '../drizzle/schemas/schema'
import { db } from '../src/utils/db'

// async function add(dailyMap: any, user: any, userPlay: any) {
//   await MapasOsu.addPlay({
//     mapId: dailyMap.id,
//     uid: user[0].id,
//     rank: userPlay.rank,
//     score: userPlay.score,
//     accuracy: userPlay.accuracy,
//     points: 0
//   })
// }
// async function savePlays() {
//   await add({ id: '2965574' }, [{ id: '843593438469292082' }], {
//     rank: 'A',
//     score: 1000000,
//     accuracy: 99.9
//   }) // Should be added

//   await add({ id: '2965574' }, [{ id: '1241' }], {
//     rank: 'A',
//     score: 1200000,
//     accuracy: 99.9
//   }) // Should be added

//   await add({ id: '2965574' }, [{ id: '2347' }], {
//     rank: 'A',
//     score: 1400000,
//     accuracy: 99.9
//   }) // Should be added

//   await add({ id: '2965574' }, [{ id: '843593438469292082' }], {
//     rank: 'A',
//     score: 1500000,
//     accuracy: 99.9
//   }) // Should change

//   await add({ id: '2965574' }, [{ id: `843593438469292082` }], {
//     rank: 'A',
//     score: 3000,
//     accuracy: 99.9
//   }) // Should not change

//   await MapasOsu.savePlays()

//   // console.log(await db.select().from(plays))
// }

// // add({ id: '2965574' }, [{ id: `843593438` }], {
// //   rank: 'A',
// //   score: 1000000,
// //   accuracy: 99.9
// // }) // Should be added
async function test() {
  const map = await db
    .select()
    .from(mapas)
    .orderBy(desc(mapas.oldMapId))
    .limit(1)
  const order = await db
    .select()
    .from(plays)
    .orderBy(asc(plays.puntos))
    .where(eq(plays.mapId, map[0].oldMapId))


  console.log(order)
}

test()
// savePlays()
