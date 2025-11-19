export function generateTeamsSimple(players: string[]) {
  const teamA: string[] = [];
  const teamB: string[] = [];

  players.forEach((p, i) => {
    if (i % 2 === 0) teamA.push(p);
    else teamB.push(p);
  });

  return { teamA, teamB };
}
