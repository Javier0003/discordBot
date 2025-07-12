const osuConfig = {
  dailyMaps: {
    maximumDifficulty: 8,
    minimumDifficulty: 5,
    modConfig: {
      DTMax: 7,
      NCMax: 7,
      EZMax: 6,
      HRMax: 7,
      FLMax: 5,
      anyDTMax: 3.7
    }
  },
  dailyChangeHour: 5,
  badModCombos: [
    ['DT', 'EZ'],
    ['HT', 'EZ'],
    ["NC", 'HR'],
    ["DT", 'HR']
  ] as mods[][],

  /**
   * 0:'D'
   * 1:'C'
   * 2:'B'
   * 3:'A'
   * 4:'S'
   * 5:'SS'
   * */
  difficultyWeights: [2, 8, 32, 16, 2, 1],

  ranks: ['D', 'C', 'B', 'A', 'S', 'SS', 'SH', 'SSH', 'X'] as OsuRanks[],

  modChances: {
    speed: {
      nomod: 75,
      DTNC: 98
    },
    diff: {
      nomod: 75,
      hr: 98
    },
    HD: 0.2,
    FL: 0.05,
    NF: 0.01
  },

  mapGeneratorNumber: 4705543,

  points: {
    completePoints: 10,
    noNFwhenNF: 2,
    FLPlay: 2,
    multiplierForBetterRankThanAsked: 2
  },

  recentWaitForInteractionTime: 30_000,

  modBansWhenNotAskedFor: ['DT', 'NC', 'HR', 'NF', 'HD', 'EZ'] as mods[]
} as const

export default osuConfig

export type Beatmap = {
  beatmapset_id: number
  difficulty_rating: number
  id: number
  mode: string
  status: string
  total_length: number
  user_id: number
  version: string
  accuracy: number
  ar: number
  bpm: number
  convert: boolean
  count_circles: number
  count_sliders: number
  count_spinners: number
  cs: number
  deleted_at: string | null
  drain: number
  hit_length: number
  is_scoreable: boolean
  last_updated: string
  mode_int: number
  passcount: number
  playcount: number
  ranked: number
  url: string
  checksum: string
  beatmapset: {
    artist: string
    artist_unicode: string
    covers: {
      cover: string
      'cover@2x': string
      card: string
      'card@2x': string
      list: string
      'list@2x': string
      slimcover: string
      'slimcover@2x': string
    }
    creator: string
    favourite_count: number
    hype: null | number
    id: number
    nsfw: boolean
    offset: number
    play_count: number
    preview_url: string
    source: string
    spotlight: boolean
    status: string
    title: string
    title_unicode: string
    track_id: number | null
    user_id: number
    video: boolean
    bpm: number
    can_be_hyped: boolean
    deleted_at: string | null
    discussion_enabled: boolean
    discussion_locked: boolean
    is_scoreable: boolean
    last_updated: string
    legacy_thread_url: string
    nominations_summary: {
      current: number
      eligible_main_rulesets: unknown[] // Replace with appropriate type if known
      required_meta: { [key: string]: unknown } // Replace with appropriate type if known
    }
    ranked: number
    ranked_date: string | null
    storyboard: boolean
    submitted_date: string
    tags: string
    availability: {
      download_disabled: boolean
      more_information: string | null
    }
    ratings: number[]
  }
  failtimes: {
    exit: number[]
    fail: number[]
  }
  max_combo: number
}

type statistics = {
  count_100: number | null
  count_300: number | null
  count_50: number | null
  count_geki: number | null
  count_katu: number | null
  count_miss: number | null
}

export type Score = {
  accuracy: number
  best_id: number | null
  created_at: string
  id: number
  max_combo: number
  mode: string
  mode_int: number
  mods: mods[]
  passed: boolean
  perfect: boolean
  pp: number | null
  rank: OsuRanks
  replay: boolean
  score: number
  statistics: {
    count_100: number
    count_300: number
    count_50: number
    count_geki: number | null
    count_katu: number | null
    count_miss: number
  }
  type: string
  user_id: number
  current_user_attributes: {
    pin: number | null
  }
  beatmap: {
    beatmapset_id: number
    difficulty_rating: number
    id: number
    mode: string
    status: string
    total_length: number
    user_id: number
    version: string
    accuracy: number
    ar: number
    bpm: number
    convert: boolean
    count_circles: number
    count_sliders: number
    count_spinners: number
    cs: number
    deleted_at: string | null
    drain: number
    hit_length: number
    is_scoreable: boolean
    last_updated: string
    mode_int: number
    passcount: number
    playcount: number
    ranked: number
    url: string
    checksum: string
  }
  beatmapset: {
    artist: string
    artist_unicode: string
    covers: {
      cover: string
      'cover@2x': string
      card: string
      'card@2x': string
      list: string
      'list@2x': string
      slimcover: string
      'slimcover@2x': string
    }
    creator: string
    favourite_count: number
    hype: null | number
    id: number
    nsfw: boolean
    offset: number
    play_count: number
    preview_url: string
    source: string
    spotlight: boolean
    status: string
    title: string
    title_unicode: string
    track_id: number | null
    user_id: number
    video: boolean
  }
  user: {
    avatar_url: string
    country_code: string
    default_group: string
    id: number
    is_active: boolean
    is_bot: boolean
    is_deleted: boolean
    is_online: boolean
    is_supporter: boolean
    last_visit: string
    pm_friends_only: boolean
    profile_colour: string | null
    username: string
  }
}

export type UserPlay = {
  accuracy: number
  max_combo: number
  mods: mods[]
  passed: boolean
  perfect: boolean
  rank: OsuRanks
  statistics: statistics
  score: number
}

export type mods =
  | 'HD'
  | 'DT'
  | 'HR'
  | 'NF'
  | 'EZ'
  | 'HT'
  | 'SD'
  | 'NC'
  | 'PF'
  | 'FL'
  | 'RX'
  | 'AP'
  | 'SO'
  | 'nomod'

export type OsuRanks = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SH' | 'SSH'

export type DailyMap = {
  id: number
  mods: mods[]
  minRank: OsuRanks
  name: string
}

export type dailyPlays = {
  uid: string
  mapId: number
  score: number
  rank: OsuRanks
  accuracy: number
  points: number
  pp: number
  combo: number
}

export interface Welcome {
  scores: ScoreBest[];
}

export interface ScoreBest {
  accuracy:                number;
  best_id:                 number;
  created_at:              Date;
  id:                      number;
  max_combo:               number;
  mode:                    string;
  mode_int:                number;
  mods:                    mods[];
  passed:                  boolean;
  perfect:                 boolean;
  pp:                      number;
  rank:                    string;
  replay:                  boolean;
  score:                   number;
  statistics:              Statistics;
  type:                    string;
  user_id:                 number;
  current_user_attributes: CurrentUserAttributes;
}

export interface CurrentUserAttributes {
  pin: null;
}

export interface Statistics {
  count_100:  number;
  count_300:  number;
  count_50:   number;
  count_geki: null;
  count_katu: null;
  count_miss: number;
}

