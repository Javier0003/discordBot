type ranks = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'
type mods = 'DT' | 'HR' | 'HD' | 'FL' | 'NC'
const ranks: ranks[] = ['F', 'D', 'C', 'B', 'A', 'S', 'SS']

type map = {
  minRank: ranks
  mods: mods[]
}
type play = {
  rank: ranks
  mods: mods[]
}

function validateRank(requiredRank: ranks, rank: ranks): boolean {
  const requiredIndex = ranks.indexOf(requiredRank)
  const rankIndex = ranks.indexOf(rank)

  return requiredIndex <= rankIndex
}

function aprovedPlay(userPlay: play, dailyMap: map) {
  if (
    (validateRank(dailyMap.minRank, userPlay.rank) &&
      dailyMap.mods.every((mod) => userPlay.mods.includes(mod))) ||
    (validateRank(dailyMap.minRank, userPlay.rank) &&
      dailyMap.mods.length === 0)
  ) {
    console.log('Approved play')
  } else {
    console.log('Not approved play')
  }
}

aprovedPlay({ rank: 'A', mods: [] }, { minRank: 'SS', mods: [] }) // Not approved play

aprovedPlay({ rank: 'SS', mods: ['FL'] }, { minRank: 'SS', mods: ['FL', 'HD'] }) // not aproved play

// Approved play with mods even if the map has no mods
aprovedPlay({ rank: 'SS', mods: ['DT'] }, { minRank: 'SS', mods: [] })

// Approved play with mods that are not required
aprovedPlay({ rank: 'D', mods: ['FL', 'DT'] }, { minRank: 'D', mods: ['FL'] })

// Approved play with mods that are not required
aprovedPlay({ rank: 'C', mods: ['FL'] }, { minRank: 'D', mods: ['FL'] })