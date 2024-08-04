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
    body: env.osuBody
  })
  if(!res.ok) throw new Error('Failed to get osu token')

  const json = await res.json() as osuToken;

  return json.access_token
}

export type Beatmap = {
  beatmapset_id: number;
  difficulty_rating: number;
  id: number;
  mode: string;
  status: string;
  total_length: number;
  user_id: number;
  version: string;
  accuracy: number;
  ar: number;
  bpm: number;
  convert: boolean;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  cs: number;
  deleted_at: string | null;
  drain: number;
  hit_length: number;
  is_scoreable: boolean;
  last_updated: string;
  mode_int: number;
  passcount: number;
  playcount: number;
  ranked: number;
  url: string;
  checksum: string;
  beatmapset: {
    artist: string;
    artist_unicode: string;
    covers: {
      cover: string;
      'cover@2x': string;
      card: string;
      'card@2x': string;
      list: string;
      'list@2x': string;
      slimcover: string;
      'slimcover@2x': string;
    };
    creator: string;
    favourite_count: number;
    hype: null | number;
    id: number;
    nsfw: boolean;
    offset: number;
    play_count: number;
    preview_url: string;
    source: string;
    spotlight: boolean;
    status: string;
    title: string;
    title_unicode: string;
    track_id: number | null;
    user_id: number;
    video: boolean;
    bpm: number;
    can_be_hyped: boolean;
    deleted_at: string | null;
    discussion_enabled: boolean;
    discussion_locked: boolean;
    is_scoreable: boolean;
    last_updated: string;
    legacy_thread_url: string;
    nominations_summary: {
      current: number;
      eligible_main_rulesets: any[]; // Replace with appropriate type if known
      required_meta: { [key: string]: any }; // Replace with appropriate type if known
    };
    ranked: number;
    ranked_date: string | null;
    storyboard: boolean;
    submitted_date: string;
    tags: string;
    availability: {
      download_disabled: boolean;
      more_information: string | null;
    };
    ratings: number[];
  };
  failtimes: {
    exit: number[];
    fail: number[];
  };
  max_combo: number;
};
