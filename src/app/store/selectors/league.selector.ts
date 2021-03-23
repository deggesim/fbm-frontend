import { AppState } from "../app.state";

export const selectLeagueInfo = (state: AppState) => state.leagueInfo.info;
export const selectLeagueStatus = (state: AppState) => state.leagueInfo.status;