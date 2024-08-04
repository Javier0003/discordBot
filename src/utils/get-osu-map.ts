import getOsuToken, { Beatmap } from './osu-token'

export default async function getOsuMap(id: number): Promise<Beatmap> {
  const token = await getOsuToken()
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
