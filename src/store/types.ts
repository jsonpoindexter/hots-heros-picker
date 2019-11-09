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
  team: Team | null
  selectedId: number | null // Hero index
  bannedIds: number[]
}
