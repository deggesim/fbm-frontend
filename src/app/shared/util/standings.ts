import { FantasyTeam } from '@app/shared/models/fantasy-team';
import { Match } from '@app/shared/models/match';
import { TableItem } from '@app/shared/models/table-item';

export const calculator = (fantasyTeam: FantasyTeam, matches: Match[], trend: number): TableItem => {
  // init values
  let points = 0;
  let games = 0;
  let won = 0;
  let lost = 0;
  let rankingMade = 0;
  let rankingAgainst = 0;
  let pointsMade = 0;
  let pointsAgainst = 0;
  let difference = 0;
  let trendString = '';
  const pointsMadeArray: number[] = [];
  const pointsAgainstArray: number[] = [];

  for (const match of matches) {
    const homeScore = match.homeScore;
    const awayScore = match.awayScore;
    const homeRanking = match.homeRanking;
    const awayRanking = match.awayRanking;
    if (homeScore != null && awayScore != null) {
      if (match.homeTeam._id === fantasyTeam._id) {
        // stiamo analizzando la squadra di casa
        games++;
        if (homeScore > awayScore) {
          // la squadra di casa ha vinto
          points += 2;
          won++;
          trendString += 'V';
        } else if (homeScore < awayScore) {
          // la squadra di casa ha perso
          lost++;
          trendString += 'P';
        } else {
          // pareggio (possibile solo in gare andata e ritorno)
          points += 1;
          trendString += 'N';
        }
        rankingMade += homeRanking != null ? homeRanking : 0;
        rankingAgainst += awayRanking != null ? awayRanking : 0;
        pointsMade += homeScore;
        pointsAgainst += awayScore;
        difference += homeScore - awayScore;
        pointsMadeArray.push(homeScore);
        pointsAgainstArray.push(awayScore);
      } else if (match.awayTeam._id === fantasyTeam._id) {
        // stiamo analizzando la squadra in trasferta
        games++;
        if (homeScore < awayScore) {
          // la squadra in trasferta ha vinto
          points += 2;
          won++;
          trendString += 'V';
        } else if (homeScore > awayScore) {
          // la squadra in trasferta ha perso
          lost++;
          trendString += 'P';
        } else {
          // pareggio (possibile solo in gare andata e ritorno)
          points += 1;
          trendString += 'N';
        }
        rankingMade += awayRanking != null ? awayRanking : 0;
        rankingAgainst += homeRanking != null ? homeRanking : 0;
        pointsMade += awayScore;
        pointsAgainst += homeScore;
        difference += awayScore - homeScore;
        pointsMadeArray.push(awayScore);
        pointsAgainstArray.push(homeScore);
      }
    }
  }

  let tableItem: TableItem;
  if (games > 0) {
    const pointsPenalty = fantasyTeam.pointsPenalty == null ? 0 : fantasyTeam.pointsPenalty;
    const trendStringLength = trendString.length;
    let trendPointsMade = 0;
    let trendPointsAgainst = 0;
    let trendAvaragePointsMade = 0;
    let trendAvaragePointsAgainst = 0;
    if (trendStringLength > trend) {
      const startIndex = trendStringLength - trend;
      trendString = trendString.substring(startIndex, trendStringLength);
      for (let ii = pointsMadeArray.length - trend; ii < pointsMadeArray.length; ii++) {
        trendPointsMade += pointsMadeArray[ii];
      }
      for (let jj = pointsAgainstArray.length - trend; jj < pointsAgainstArray.length; jj++) {
        trendPointsAgainst += pointsAgainstArray[jj];
      }
      trendAvaragePointsMade = trendPointsMade / trend;
      trendAvaragePointsAgainst = trendPointsAgainst / trend;
    } else {
      trendAvaragePointsMade = pointsMade / games;
      trendAvaragePointsAgainst = pointsAgainst / games;
    }

    tableItem = {
      fantasyTeam,
      points: points - pointsPenalty,
      games,
      won,
      lost,
      rankingMade,
      rankingAgainst,
      avarageRankingMade: rankingMade / games,
      avarageRankingAgainst: rankingAgainst / games,
      pointsMade,
      pointsAgainst,
      avaragePointsMade: pointsMade / games,
      avaragePointsAgainst: pointsAgainst / games,
      difference,
      trend: trendString,
      trendAvaragePointsMade,
      trendAvaragePointsAgainst,
    };
  } else {
    tableItem = { fantasyTeam };
  }
  return tableItem;
};
