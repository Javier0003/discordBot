import OsuDaily from '../src/events/commands/osu-daily'

//@ts-expect-error test 
console.log(OsuDaily.validateMods({mods: ['AP']},{mods: ['AP', 'HT']}))
//@ts-expect-error test 
console.log(OsuDaily.validateMods({mods: ['NC']},{mods: ['AP', 'HT']}))
//@ts-expect-error test 
console.log(OsuDaily.validateMods({mods: ['AP']},{mods: ['AP', 'HT']}))