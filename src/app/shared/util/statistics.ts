import { Performance } from '@app/models/performance';
import { Player } from '@app/models/player';
import { PlayerStats } from '@app/models/player-stats';
import { RealFixture } from '@app/models/real-fixture';
import { mean } from 'lodash-es';

export const statistics = (player: Player, performances: Performance[], currentRealFixture: RealFixture): PlayerStats => {
  let ps: PlayerStats;
  let performanceAvg = 0;
  const rankings = performances
    .filter((performance: Performance) => performance.minutes > 0)
    .map((performance: Performance) => performance.ranking);
  performanceAvg = mean(rankings);
  let performancesTrend: Performance[] = [];
  const performanceForTrend = performances.filter(
    (performance: Performance) => performance.realFixture.prepared && performance.realFixture._id !== currentRealFixture._id
  );
  performancesTrend = performanceForTrend.length > 5 ? performanceForTrend.slice(performanceForTrend.length - 5) : performanceForTrend;
  ps = {
    player,
    performanceAvg,
    trend: performancesTrend,
  };
  return ps;
};

export const statsTooltip = (stats: PlayerStats): string => {
  let trend = '<ul>';
  for (const ranking of stats.trend) {
    trend += `<li>${ranking}</li>`;
  }
  trend += '</ul>';
  return `
  <p>Valutazione media: ${stats.performanceAvg}</p>
  <p>Ultime valutazioni:</p>
  ${trend}
  `;
};
