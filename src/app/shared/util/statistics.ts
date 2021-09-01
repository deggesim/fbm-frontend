import { Performance } from '@app/models/performance';
import { Player } from '@app/models/player';
import { PlayerStats } from '@app/models/player-stats';
import { mean } from 'lodash-es';

export const statistics = (player: Player, performances: Performance[]): PlayerStats => {
  let ps: PlayerStats;
  let performanceAvg = 0;
  const rankings = performances
    .filter((performance: Performance) => performance.minutes > 0)
    .map((performance: Performance) => performance.ranking);
  performanceAvg = mean(rankings);
  const size = performances.length;
  let performancesTrend: Performance[] = [];
  const performanceForTrend = performances.filter((performance: Performance) => performance.hasOwnProperty('ranking'));
  performancesTrend = size > 5 ? performanceForTrend.slice(performanceForTrend.length - 5) : performances;
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
