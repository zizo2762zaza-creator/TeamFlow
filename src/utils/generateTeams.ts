export interface Player {
  name: string;
  level: number; // 1 to 5
}

export interface Team {
  players: Player[];
  average: number;
}

export function generateBalancedTeams(players: Player[], teamsCount: number): Team[] {
  if (teamsCount <= 0) return [];

  const sorted = [...players].sort((a, b) => b.level - a.level);
  const teams: Team[] = Array.from({ length: teamsCount }, () => ({ players: [], average: 0 }));

  sorted.forEach((player, index) => {
    const teamIndex = index % teamsCount;
    teams[teamIndex].players.push(player);
  });

  teams.forEach(team => {
    const sum = team.players.reduce((acc, p) => acc + p.level, 0);
    team.average = team.players.length ? sum / team.players.length : 0;
  });

  return teams;
}
