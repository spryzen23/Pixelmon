export function cleanName(ident) {
  if (!ident) return '';
  const colonIdx = ident.indexOf(':');
  if (colonIdx !== -1) {
    return ident.slice(colonIdx + 1).trim();
  }
  return ident;
}

export function normalizePokemonKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function speciesFromDetails(details) {
  return String(details || '').split(',')[0].trim();
}

export function findTeamIndexForRequestPokemon(requestPokemon, team, fallbackIndex = 0) {
  if (!requestPokemon || !team) return fallbackIndex;
  
  const reqName = normalizePokemonKey(cleanName(requestPokemon.ident));
  const reqSpecies = normalizePokemonKey(speciesFromDetails(requestPokemon.details));
  
  for (let i = 0; i < team.length; i++) {
    const p = team[i];
    const pName = normalizePokemonKey(p.displayName || p.name);
    const pSpecies = normalizePokemonKey(p.species);
    
    if (reqName === pName || reqName === pSpecies || reqSpecies === pName || reqSpecies === pSpecies) {
      return i;
    }
  }
  return fallbackIndex;
}

export function getRequestSlotForTeamIndex(activeRequest, team, targetTeamIndex) {
  if (!activeRequest?.side?.pokemon) return targetTeamIndex;
  
  const targetPokemon = team[targetTeamIndex];
  if (!targetPokemon) return targetTeamIndex;
  
  const targetName = normalizePokemonKey(targetPokemon.displayName || targetPokemon.name);
  const targetSpecies = normalizePokemonKey(targetPokemon.species);
  
  for (let i = 0; i < activeRequest.side.pokemon.length; i++) {
    const reqP = activeRequest.side.pokemon[i];
    const reqName = normalizePokemonKey(cleanName(reqP.ident));
    const reqSpecies = normalizePokemonKey(speciesFromDetails(reqP.details));
    
    if (reqName === targetName || reqName === targetSpecies || reqSpecies === targetName || reqSpecies === targetSpecies) {
      return i;
    }
  }
  return targetTeamIndex;
}

export function findRequestPokemonForTeamIndex(activeRequest, team, targetTeamIndex) {
  if (!activeRequest?.side?.pokemon) return null;
  const slotIdx = getRequestSlotForTeamIndex(activeRequest, team, targetTeamIndex);
  return activeRequest.side.pokemon[slotIdx] || null;
}

export function parseCondition(condStr) {
  if (!condStr || condStr.includes('fnt') || condStr.startsWith('0')) {
    return { currentHp: 0, maxHp: 100, status: 'fnt' };
  }
  const [hpPart, statusPart] = condStr.split(' ');
  const [current, max] = hpPart.split('/').map(Number);
  return {
    currentHp: current || 0,
    maxHp: max || 100,
    status: statusPart || 'none'
  };
}

export function findTeamIndexForBattleIdent(ident, team, request, fallbackIndex = 0) {
  const identKey = normalizePokemonKey(cleanName(ident));
  const directIndex = team.findIndex((pokemon) => (
    [pokemon.displayName, pokemon.name, pokemon.species, pokemon.id].map(normalizePokemonKey).includes(identKey)
  ));
  if (directIndex >= 0) return directIndex;

  const requestPokemon = (request?.side?.pokemon || []).find((pokemon) => (
    normalizePokemonKey(cleanName(pokemon.ident)) === identKey
  ));
  return requestPokemon ? findTeamIndexForRequestPokemon(requestPokemon, team, fallbackIndex) : fallbackIndex;
}

export function getActiveTeamIndexFromRequest(request, team, fallbackIndex = 0) {
  const requestPokemon = request?.side?.pokemon || [];
  const requestIndex = requestPokemon.findIndex((pokemon) => pokemon.active);
  if (requestIndex === -1) return fallbackIndex;
  return findTeamIndexForRequestPokemon(requestPokemon[requestIndex], team, requestIndex);
}

export function syncTeamFromRequest(team, request) {
  const nextTeam = [...team];
  request?.side?.pokemon?.forEach((requestPokemon, requestIndex) => {
    const teamIndex = findTeamIndexForRequestPokemon(requestPokemon, nextTeam, requestIndex);
    if (nextTeam[teamIndex]) {
      const details = requestPokemon.details || '';
      let gender = null;
      if (details.includes(', M')) gender = '♂';
      else if (details.includes(', F')) gender = '♀';

      nextTeam[teamIndex] = {
        ...nextTeam[teamIndex],
        ...parseCondition(requestPokemon.condition),
        ...(gender ? { gender } : {})
      };
    }
  });
  return nextTeam;
}
