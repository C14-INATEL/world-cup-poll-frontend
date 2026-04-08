export interface Game {
  id: string
  date: string
  status: string
  apiId: number
  firstTeamCountryCode: string
  secondTeamCountryCode: string
  firstTeamName: string | null
  secondTeamName: string | null
  firstTeamGoals: number | null
  secondTeamGoals: number | null
  firstTeamCrestUrl: string | null
  secondTeamCrestUrl: string | null
}
