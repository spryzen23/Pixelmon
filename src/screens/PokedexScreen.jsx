import { useEffect, useState } from 'react';
import { api } from '../api';
import { typeIconUrl } from '../game/assets';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';

export function PokedexScreen() {
  const { session, goTo } = useGame();
  const region = session?.regionId || 'kanto';
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getPokedex(region, page, 40).then(setData).catch(console.error);
  }, [region, page]);

  return (
    <div className="screen screen-shell pokedex-screen">
      <h2 className="screen-title">Pokédex — {region}</h2>
      <ul className="dex-list">
        {data?.pokemon?.map((p) => (
          <li key={p.entryId}>
            {p.displayName}
            {p.types?.map((t) => (
              <img key={t} src={typeIconUrl(t)} alt={t} width={18} height={18} />
            ))}
          </li>
        ))}
      </ul>
      <div className="btn-row">
        <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span>
          Page {page} / {data ? Math.ceil(data.total / data.limit) : '?'}
        </span>
        <Button
          disabled={data && page * data.limit >= data.total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
        <Button onClick={() => goTo(session ? SCREENS.inGame : SCREENS.mapSelect)}>
          Back
        </Button>
      </div>
    </div>
  );
}
