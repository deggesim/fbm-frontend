import { Performance } from '@app/models/performance';
import { Player } from '@app/models/player';
import { PlayerStats } from '@app/models/player-stats';
import { RealFixture } from '@app/models/real-fixture';
import { mean } from 'lodash-es';

export const statistics = (player: Player, performances: Performance[], currentRealFixture: RealFixture, trend?: number): PlayerStats => {
  let ps: PlayerStats;
  let performanceAvg = 0;
  const rankings = performances
    .filter((performance: Performance) => performance.minutes > 0)
    .map((performance: Performance) => performance.ranking);
  performanceAvg = mean(rankings);
  let performancesTrend: Performance[] = [];
  const filteredPerformances = performances.filter(
    (performance: Performance) => performance.realFixture.prepared && performance.realFixture._id !== currentRealFixture._id
  );
  if (trend != null) {
    performancesTrend =
      filteredPerformances.length > trend ? filteredPerformances.slice(filteredPerformances.length - trend) : filteredPerformances;
  } else {
    performancesTrend = filteredPerformances;
  }
  ps = {
    player,
    performanceAvg,
    trend: performancesTrend,
  };
  return ps;
};
