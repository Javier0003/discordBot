import MapasOsu from '../src/events/events/daily-map'

function add(dailyMap: any, user: any, userPlay: any) {
  MapasOsu.addPlay({
    mapId: dailyMap.id,
    uid: user[0].id,
    rank: userPlay.rank,
    score: userPlay.score,
    accuracy: userPlay.accuracy,
    points: 0
  })
}
async function savePlays(){
  await MapasOsu.savePlays()
}

add({ id: '4557411' }, [{ id: '239560262' }], { rank: 'A', score: 1000000, accuracy: 99.9 }) // Should be added
add({ id: '4557411' }, [{ id: '239560262' }], { rank: 'A', score: 1500000, accuracy: 99.9 }) // Should change
add({ id: '4557411' }, [{ id: `239560262` }], { rank: 'A', score: 3000, accuracy: 99.9 }) // Should not change
add({ id: '4557411' }, [{ id: `843593438` }], { rank: 'A', score: 1000000, accuracy: 99.9 }) // Should be added
add({ id: '4557411' }, [{ id: `1251251612` }], { rank: 'A', score: 3000000, accuracy: 99.9 }) // Should be added
add({ id: '4557411' }, [{ id: `12566723123` }], { rank: 'A', score: 4000000, accuracy: 99.9 }) // Should not change


savePlays()
