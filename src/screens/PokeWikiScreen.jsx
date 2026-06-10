import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { typeIconUrl } from '../game/assets';
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  TrendingUp,
  Cpu,
  RefreshCw
} from 'lucide-react';
import {
  fetchAllPokemon3DData,
  getPokemonStats,
  getPokemonEvolutionChain
} from '../services/pokewikiApi';
import '../styles/pokewiki.css';
import '../styles/minigames.css';

const GENERATION_RANGES = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

const STAT_COLORS = {
  hp: '#10b981', // green
  attack: '#ef4444', // red
  defense: '#3b82f6', // blue
  specialAttack: '#a855f7', // purple
  specialDefense: '#14b8a6', // teal
  speed: '#eab308' // yellow
};

export function PokeWikiScreen() {
  const { goTo } = useGame();

  // Navigation Sub-routing state: 'grid' | 'details' | 'evolution'
  const [view, setView] = useState('grid');

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data States
  const [all3DData, setAll3DData] = useState([]);
  const [pokemonData, setPokemonData] = useState(null); // Detailed PokeAPI stats
  const [evolutionData, setEvolutionData] = useState([]); // Evolution chain

  // Grid filter states
  const [generationFilter, setGenerationFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [generationFilter, formFilter, searchInput]);

  // Selected Detail states
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [selectedForm, setSelectedForm] = useState('regular');
  const [selectedAnimation, setSelectedAnimation] = useState('');
  const [availableForms, setAvailableForms] = useState([]);
  const [availableAnimations, setAvailableAnimations] = useState([]);

  // References
  const modelViewerRef = useRef(null);
  const selectedAnimationRef = useRef(selectedAnimation);
  useEffect(() => {
    selectedAnimationRef.current = selectedAnimation;
  }, [selectedAnimation]);

  // Initialize model-viewer client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@google/model-viewer').catch(err => {
        console.error('Failed to load @google/model-viewer:', err);
      });
    }
  }, []);

  // Fetch initial 3D dataset
  const load3DData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllPokemon3DData();
      setAll3DData(data);
    } catch (err) {
      console.error(err);
      setError('Could not load 3D assets from local game server database. Please verify your game server is running and data/MergedOpt.json is present.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load3DData();
  }, [load3DData]);

  // Handle detailed stats & forms loading when selectedPokemonId changes
  useEffect(() => {
    if (!selectedPokemonId || view !== 'details') return;

    let active = true;

    async function loadDetails() {
      setLoading(true);
      setError(null);
      try {
        const stats = await getPokemonStats(selectedPokemonId);
        if (!active) return;
        setPokemonData(stats);

        // Map forms from 3D data
        const found3D = all3DData.find(p => p.id.toString() === selectedPokemonId.toString());
        if (found3D && found3D.forms) {
          const forms = found3D.forms.map(f => ({
            name: f.name,
            formName: f.formName,
            model: f.model,
            animations: f.animations
          }));
          setAvailableForms(forms);

          // Default to regular form if available, else first form
          const defaultForm = forms.find(f => f.formName === 'regular') || forms[0];
          if (defaultForm) {
            setSelectedForm(defaultForm.formName);
          }
        } else {
          setAvailableForms([]);
          setSelectedForm('regular');
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError(`Failed to retrieve stats for Pokémon ID: ${selectedPokemonId}.`);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [selectedPokemonId, all3DData, view]);

  // Update animations list when selectedForm or availableForms changes
  useEffect(() => {
    const currentForm = availableForms.find(f => f.formName === selectedForm);
    if (currentForm) {
      const anims = Object.keys(currentForm.animations || {});
      setAvailableAnimations(anims);
      setSelectedAnimation(anims[0] || '');
    } else {
      setAvailableAnimations([]);
      setSelectedAnimation('');
    }
  }, [selectedForm, availableForms]);

  // Hook model-viewer dynamic animation listings
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleModelLoad = () => {
      const anims = modelViewer.availableAnimations || [];
      if (anims.length > 0) {
        setAvailableAnimations(anims);
        if (!selectedAnimationRef.current || !anims.includes(selectedAnimationRef.current)) {
          setSelectedAnimation(anims[0]);
        }
      }
    };

    modelViewer.addEventListener('load', handleModelLoad);
    return () => {
      modelViewer.removeEventListener('load', handleModelLoad);
    };
  }, [selectedPokemonId, selectedForm]);

  // Fetch Evolution Chain data
  const loadEvolutionChain = useCallback(async (pokemonName) => {
    setLoading(true);
    setError(null);
    try {
      const evolutions = await getPokemonEvolutionChain(pokemonName);
      setEvolutionData(evolutions);
      setView('evolution');
    } catch (err) {
      console.error(err);
      setError(`Failed to load evolution line for ${pokemonName}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute filtered Pokémon forms for the grid list
  const filteredFormsGrid = useMemo(() => {
    if (!all3DData || all3DData.length === 0) return [];

    let filtered = [...all3DData];

    // Filter by Generation
    if (generationFilter !== 'all') {
      const [start, end] = GENERATION_RANGES[generationFilter];
      filtered = filtered.filter(p => p.id >= start && p.id <= end);
    }

    // Filter by Search Query (ID, Name, or Form name match)
    if (searchInput) {
      const searchLower = searchInput.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.id.toString() === searchLower ||
        p.name.toLowerCase().includes(searchLower) ||
        p.forms?.some(form => form.name.toLowerCase().includes(searchLower))
      );
    }

    // Expand Forms to individual items for form filters
    let expandedForms = [];
    if (formFilter === 'all') {
      expandedForms = filtered.flatMap(p =>
        (p.forms || []).map(f => ({ ...f, id: p.id }))
      );
    } else {
      expandedForms = filtered.flatMap(p =>
        (p.forms || [])
          .filter(f => f.formName === formFilter)
          .map(f => ({ ...f, id: p.id }))
      );
    }

    return expandedForms;
  }, [all3DData, generationFilter, formFilter, searchInput]);

  const ITEMS_PER_PAGE = 24;

  const totalPages = useMemo(() => {
    return Math.ceil(filteredFormsGrid.length / ITEMS_PER_PAGE);
  }, [filteredFormsGrid]);

  const paginatedPokemon = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredFormsGrid.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFormsGrid, page]);

  const handleCardClick = (pokemon) => {
    setSelectedPokemonId(pokemon.id);
    setSelectedForm(pokemon.formName);
    setView('details');
  };

  const handlePrevPokemon = () => {
    const prevId = parseInt(selectedPokemonId) - 1;
    if (prevId >= 1) {
      setSelectedPokemonId(prevId);
    }
  };

  const handleNextPokemon = () => {
    const nextId = parseInt(selectedPokemonId) + 1;
    if (nextId <= 1025) {
      setSelectedPokemonId(nextId);
    }
  };

  const currentFormModelUrl = useMemo(() => {
    const form = availableForms.find(f => f.formName === selectedForm);
    return form?.model || null;
  }, [selectedForm, availableForms]);

  const currentFormDisplayName = useMemo(() => {
    const form = availableForms.find(f => f.formName === selectedForm);
    return form?.name || '';
  }, [selectedForm, availableForms]);

  // Helper to resolve 3D model for evolution grid
  const getEvolution3DInfo = (nameOrId) => {
    const byId = all3DData.find(p => p.id.toString() === nameOrId.toString());
    if (byId) return byId;

    const cleanName = String(nameOrId).toLowerCase().trim();
    return all3DData.find(p => p.name && p.name.toLowerCase() === cleanName);
  };

  const getEvolutionIdFromUrl = (url) => {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  };

  return (
    <div className="minigames-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Pixelmon Academy Library</p>
          <h1 className="minigames-title">PokéWiki 3D</h1>
        </div>
        <div className="minigames-header-stats">
          <button
            type="button"
            className="btn-back"
            onClick={() => {
              if (view === 'details') {
                setView('grid');
              } else if (view === 'evolution') {
                setView('details');
              } else {
                goTo(SCREENS.minigameHub);
              }
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      <main className="minigames-dashboard" style={{ marginTop: '10px' }}>
        {loading && view === 'grid' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <RefreshCw className="animate-spin text-[var(--px-accent)] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Preloading 3D Assets</h3>
            <p className="text-gray-400 max-w-md">
              Loading 3D models index from the local game server. This should take just a moment.
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[300px] glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'var(--px-danger)' }}>
            <span style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</span>
            <h3 className="text-xl font-bold mb-2 text-red-400">Connection Interrupted</h3>
            <p className="text-gray-300 max-w-lg mb-6">{error}</p>
            <button className="pokewiki-btn-search" onClick={() => {
              if (view === 'grid') load3DData();
              else if (selectedPokemonId) setSelectedPokemonId(selectedPokemonId);
            }}>
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && view === 'grid' && (
          <div className="pokewiki-scroll-container">
            {/* Filter controls */}
            <div className="pokewiki-controls-bar">
              <select
                value={formFilter}
                onChange={(e) => setFormFilter(e.target.value)}
                className="pokewiki-select"
              >
                <option value="all">All Forms</option>
                <option value="regular">Regular</option>
                <option value="alolan">Alolan</option>
                <option value="galar">Galarian</option>
                <option value="hisuian">Hisuian</option>
                <option value="mega">Mega</option>
                <option value="gmax">G-Max</option>
                <option value="xy">Mega X/Y</option>
                <option value="unique">Unique</option>
                <option value="shiny">Shiny</option>
                <option value="primal">Primal</option>
                <option value="origin">Origin</option>
                <option value="multiform">Multi Form</option>
              </select>

              <select
                value={generationFilter}
                onChange={(e) => setGenerationFilter(e.target.value)}
                className="pokewiki-select"
              >
                <option value="all">All Generations</option>
                <option value="1">Gen 1 (Kanto)</option>
                <option value="2">Gen 2 (Johto)</option>
                <option value="3">Gen 3 (Hoenn)</option>
                <option value="4">Gen 4 (Sinnoh)</option>
                <option value="5">Gen 5 (Unova)</option>
                <option value="6">Gen 6 (Kalos)</option>
                <option value="7">Gen 7 (Alola)</option>
                <option value="8">Gen 8 (Galar)</option>
                <option value="9">Gen 9 (Paldea)</option>
              </select>

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Pokémon name or ID..."
                className="pokewiki-input"
              />

              <button className="pokewiki-btn-search">
                <Search size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Search
              </button>
            </div>

            {/* Grid List */}
            {filteredFormsGrid.length === 0 ? (
              <div className="text-center p-12 glass-panel">
                <p className="text-gray-400">No matching Pokémon found. Try broadening your filter selections.</p>
              </div>
            ) : (
              <>
                <div className="pokewiki-grid">
                  {paginatedPokemon.map((poke) => (
                    <div
                      key={`${poke.id}-${poke.formName}`}
                      className="pokewiki-card"
                      onClick={() => handleCardClick(poke)}
                    >
                      <div className="pokewiki-card-model-container">
                        <model-viewer
                          src={poke.model}
                          alt={`Model of ${poke.name}`}
                          camera-controls
                          interaction-prompt="none"
                          environment-image="neutral"
                          class="pokewiki-card-model"
                          loading="lazy"
                        ></model-viewer>
                      </div>
                      <div className="pokewiki-card-id">#{poke.id}</div>
                      <h3 className="pokewiki-card-name">{poke.name}</h3>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pokewiki-pagination">
                    <button
                      className="pokewiki-btn-nav"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className="pokewiki-page-indicator">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="pokewiki-btn-nav"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Detailed Stats Screen */}
        {!loading && !error && view === 'details' && pokemonData && (
          <div className="pokewiki-details-layout">
            {/* Left 3D Panel */}
            <div className="pokewiki-details-panel">
              <div className="flex justify-between items-center mb-4">
                <button className="pokewiki-btn-nav" onClick={() => setView('grid')}>
                  <Home size={15} style={{ marginRight: '6px' }} /> Grid
                </button>
                <span className="text-sm font-semibold text-gray-400">ID #{pokemonData.id}</span>
              </div>

              <div className="pokewiki-model-display">
                {currentFormModelUrl ? (
                  <model-viewer
                    ref={modelViewerRef}
                    src={currentFormModelUrl}
                    alt={`Model of ${pokemonData.name}`}
                    camera-controls
                    touch-action="pan-y"
                    environment-image="neutral"
                    class="w-full h-full"
                    animation-name={selectedAnimation || ''}
                    autoplay
                  ></model-viewer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img src={pokemonData.spriteUrl} alt={pokemonData.name} className="w-32 h-32 object-contain" />
                    <p className="text-sm text-gray-400 mt-2">3D model loading or unavailable</p>
                  </div>
                )}
              </div>

              <div className="pokewiki-details-selector">
                {availableForms.length > 1 && (
                  <div className="pokewiki-selector-group">
                    <label className="pokewiki-selector-label">Select Form</label>
                    <select
                      value={selectedForm}
                      onChange={(e) => setSelectedForm(e.target.value)}
                      className="pokewiki-select w-full"
                    >
                      {availableForms.map((f) => (
                        <option key={f.formName} value={f.formName}>
                          {f.formName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {availableAnimations.length > 0 && (
                  <div className="pokewiki-selector-group">
                    <label className="pokewiki-selector-label">Select Animation</label>
                    <select
                      value={selectedAnimation}
                      onChange={(e) => setSelectedAnimation(e.target.value)}
                      className="pokewiki-select w-full"
                    >
                      {availableAnimations.map((anim) => (
                        <option key={anim} value={anim}>
                          {anim}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Right Information Panel */}
            <div className="pokewiki-details-panel">
              <h2 className="text-2xl font-bold capitalize text-white mb-2" style={{ fontFamily: 'var(--px-font-title)' }}>
                {pokemonData.name} {currentFormDisplayName && `(${currentFormDisplayName})`}
              </h2>

              <div className="pokewiki-types-flex">
                {pokemonData.types.map((type) => (
                  <div
                    key={type}
                    className={`pokewiki-type-tag tag-${type}`}
                  >
                    <img src={typeIconUrl(type)} alt={type} width={14} height={14} />
                    <span>{type}</span>
                  </div>
                ))}
              </div>

              <div className="pokewiki-meta-grid">
                <div className="pokewiki-meta-box">
                  <div className="pokewiki-meta-label">Height</div>
                  <div className="pokewiki-meta-value">{pokemonData.height / 10} m</div>
                </div>
                <div className="pokewiki-meta-box">
                  <div className="pokewiki-meta-label">Weight</div>
                  <div className="pokewiki-meta-value">{pokemonData.weight / 10} kg</div>
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="pokewiki-section-title">
                  <TrendingUp size={16} /> Base Stats
                </h3>

                <div className="pokewiki-stats-table">
                  {Object.entries(pokemonData.stats).map(([statKey, statVal]) => {
                    const color = STAT_COLORS[statKey] || '#888888';
                    const maxVal = 255;
                    const percent = Math.min(100, Math.floor((statVal / maxVal) * 100));

                    // Normalize spacing in labels
                    const displayName = statKey
                      .replace('specialAttack', 'Sp. Atk')
                      .replace('specialDefense', 'Sp. Def')
                      .replace('hp', 'HP');

                    return (
                      <div key={statKey} className="pokewiki-stat-row">
                        <span className="pokewiki-stat-name">{displayName}</span>
                        <span className="pokewiki-stat-val">{statVal}</span>
                        <div className="pokewiki-stat-bar-container">
                          <div
                            className="pokewiki-stat-bar"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: color,
                              boxShadow: `0 0 8px ${color}80`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pokewiki-details-footer">
                <button
                  className="pokewiki-btn-nav"
                  onClick={handlePrevPokemon}
                  disabled={parseInt(selectedPokemonId) <= 1}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  className="pokewiki-btn-action"
                  onClick={() => loadEvolutionChain(pokemonData.name)}
                >
                  <Cpu size={16} /> Evolution Chain
                </button>

                <button
                  className="pokewiki-btn-nav"
                  onClick={handleNextPokemon}
                  disabled={parseInt(selectedPokemonId) >= 1025}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Evolution chain view */}
        {!loading && !error && view === 'evolution' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="flex justify-between items-center mb-6">
              <button className="pokewiki-btn-nav" onClick={() => setView('details')}>
                <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Stats
              </button>
              <h2 className="text-xl font-bold text-center text-white" style={{ margin: 0 }}>
                Evolution Chain of <span className="capitalize text-[var(--px-accent)]">{selectedPokemonId ? getEvolution3DInfo(selectedPokemonId)?.name || '' : ''}</span>
              </h2>
              <button className="pokewiki-btn-nav" onClick={() => setView('grid')}>
                <Home size={15} style={{ marginRight: '6px' }} /> Grid
              </button>
            </div>

            {evolutionData.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-400">No evolution chain available for this Pokémon.</p>
              </div>
            ) : (
              <div className="pokewiki-evolution-grid">
                {evolutionData.map((stage) => {
                  const evId = getEvolutionIdFromUrl(stage.url);
                  const info3D = getEvolution3DInfo(evId);
                  const modelUrl = info3D?.forms?.[0]?.model || null;
                  const defaultFormName = info3D?.forms?.[0]?.formName || 'regular';

                  return (
                    <div
                      key={stage.name}
                      className="pokewiki-card w-64 h-80"
                    >
                      <div className="pokewiki-card-model-container h-44">
                        {modelUrl ? (
                          <model-viewer
                            src={modelUrl}
                            alt={`Model of ${stage.name}`}
                            camera-controls
                            interaction-prompt="none"
                            environment-image="neutral"
                            class="pokewiki-card-model"
                            autoplay
                          ></model-viewer>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-xs border border-dashed border-gray-700 rounded-lg">
                            3D Model Pending
                          </div>
                        )}
                      </div>
                      <p className="text-lg font-bold capitalize text-white mt-4 mb-2">
                        {stage.name}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedPokemonId(evId);
                          setSelectedForm(defaultFormName);
                          setView('details');
                        }}
                        className="pokewiki-btn-search text-xs py-2 px-4"
                        style={{ marginTop: 'auto' }}
                      >
                        <Info size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> View Stats
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default PokeWikiScreen;
