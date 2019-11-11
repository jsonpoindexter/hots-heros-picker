export interface Hero {
  name: string
  urlName: string
}

export enum Team {
  red,
  blue,
}

export interface Player {
  id: string
  name: string
  team: Team | null
  selectedId: number | null // Hero index
  bannedIds: number[]
}

export interface PlayerNamePayload {
  id: string
  name: string
}

export interface SelectPayload {
  name: string
  heroId: number
}
