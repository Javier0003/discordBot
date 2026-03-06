import env from '../env'
type osuToken = {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
}

export default async function getOsuToken (){
  const res = await fetch('https://osu.ppy.sh/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: env.osu.osuBody
  })
  if(!res.ok) throw new Error('Failed to get osu token')

  const json = await res.json() as osuToken;

  return json.access_token
}
