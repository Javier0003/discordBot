import { Score } from './osu-daily.config'

export default async function getOsuRecent(user: number, token: string): Promise<Score[]> {
  const json = await fetch(
    `https://osu.ppy.sh/api/v2/users/${user}/scores/recent?include_fails=1&mode=osu&limit=5`,
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
