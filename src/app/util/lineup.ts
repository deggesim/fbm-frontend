import { PlayerStatus } from '@app/models/fantasy-roster';
import { League, Role } from '@app/models/league';
import { Lineup } from '@app/models/lineup';
import { AppConfig, isEmpty } from '@app/shared/globals';

export const lineUpValid = (fullLineup: Lineup[], league: League): boolean => {
  if (fullLineup == null || isEmpty(fullLineup)) {
    return false;
  }
  // count real players in lineup
  const lineup = fullLineup.filter(player => player != null);
  if (lineup.length < AppConfig.MinPlayersInLineup) {
    return false;
  } else {
    // check for player contracts (the team must be real to be valid)
    for (const player of lineup) {
      if (!player.fantasyRoster.roster.team.real) {
        return false;
      }
    }

    // check roles for starters. No exception here!
    for (let i = 0; i <= AppConfig.Starters - 1; i++) {

      const starter = lineup[i];
      const role = starter.fantasyRoster.roster.player.role;
      const spot = starter.spot;
      const leagueRole: Role = league.roles.find(r => r.role === role);
      const spotFound = leagueRole.spots.find(s => s === spot);
      if (spotFound == null) {
        return false;
      }

    }

    // formation still valid: check roles for bench, one exception allowed
    let roleException = 0;
    for (let i = AppConfig.FirstBenchPlayerIndex; i <= AppConfig.LastBenchPlayerIndex; i++) {

      const benchPlayer = lineup[i];
      const role = benchPlayer.fantasyRoster.roster.player.role;
      const spot = benchPlayer.spot;
      const leagueRole: Role = league.roles.find(r => r.role === role);
      const spotFound = leagueRole.spots.find(s => s === spot);
      if (spotFound == null) {
        roleException++;

        let jollyValid = false;
        // the exception is valid if the role is adjacent to a legitimate role
        for (const leagueRoleSpot of leagueRole.spots) {
          if (leagueRoleSpot <= AppConfig.LastBenchPlayerIndex + 1 && leagueRoleSpot === spot - 1 || leagueRoleSpot === spot + 1) {
            jollyValid = true;
            break;
          }
        }
        if (!jollyValid) {
          return false;
        }
      }

    }
    if (roleException > 1) {
      return false;
    }
  }
  return true;
};

export const count = (lineup: Lineup[], status: PlayerStatus) => {
  let countPlayers = 0;
  for (const player of lineup) {
    if (player != null && player.fantasyRoster.status === status) {
      countPlayers++;
    }
  }
  return countPlayers;
};
