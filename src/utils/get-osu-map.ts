import { Beatmap } from './osu-daily.config'

export default async function getOsuMap(id: number, token: string): Promise<Beatmap> {
  const res = await fetch(
    `https://osu.ppy.sh/api/v2/beatmaps/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const map = (await res.json()) as Beatmap
  
  return map
}
