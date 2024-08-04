import { Score } from '../events/events/daily-map'
import getOsuToken from './osu-token'

export default async function getOsuRecent(user: number) {
  const token = await getOsuToken()
  const json = await fetch(
    `https://osu.ppy.sh/api/v2/users/${user}/scores/recent?include_fails=0&mode=osu&limit=5`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const userPlays = (await json.json()) as Score[]

  return userPlays
}
