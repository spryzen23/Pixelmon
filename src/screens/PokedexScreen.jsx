import { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { typeIconUrl } from '../game/assets';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { ScreenFrame, ScreenFooter } from '../components/ui/layout/ScreenFrame';

const PAGE_SIZE = 8;

export function PokedexScreen() {
  const { session, goTo } = useGame();
  const region = session?.regionId || 'kanto';
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getPokedex(region, page, PAGE_SIZE).then(setData).catch(console.error);
  }, [region, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const entries = useMemo(() => data?.pokemon || [], [data]);

  const header = (
    <div>
      <h2 className="screen-title">Pokédex</h2>
      <p className="screen-subtitle">{region}</p>
    </div>
  );

  const footer = (
    <ScreenFooter>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <Button onClick={() => goTo(session ? SCREENS.inGame : SCREENS.dashboard)}>Back</Button>
    </ScreenFooter>
  );

  return (
    <ScreenFrame className="pokedex-screen" header={header} footer={footer}>
      <div className="dex-grid">
        {entries.map((p) => (
          <div key={p.entryId} className="dex-grid-cell glass-panel">
            <span className="dex-grid-name">{p.displayName}</span>
            <div className="type-icons">
              {p.types?.map((t) => (
                <img key={t} src={typeIconUrl(t)} alt={t} width={16} height={16} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScreenFrame>
  );
}
