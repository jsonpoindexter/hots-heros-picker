export interface Payload {
  urlName: string
  value: boolean
}

export interface Hero {
  name: string
  urlName: string
}

export enum Team {
  red,
  blue,
}

export interface Player {
  name: string
  team: Team
  selectedId: number | null // Hero index
  bannedIds: number[]
}
