export const toastType = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning'
};

export const isEmpty = (obj: any) => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

export enum AppConfig {
  'Starters' = 5,
  'PlayersInBench' = 5,
  'MinPlayersInLineup' = 10,
  'MaxPlayersInLineup' = 12,
  'DefaultGrade' = 5.5,
  'NecessaryGrades' = 10,
  'FirstBenchPlayerIndex' = 5,
  'LastBenchPlayerIndex' = 9
}
