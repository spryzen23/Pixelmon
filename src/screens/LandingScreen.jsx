import { useEffect, useRef, useState } from "react";
import { useGame, SCREENS } from "../context/GameContext";
import { getStoredToken, verifySession } from "../services/authService";

const CAROUSEL_POKEMON = [
  { id: "0001", name: "Bulbasaur" },
  { id: "0004", name: "Charmander" },
  { id: "0007", name: "Squirtle" },
  { id: "0025", name: "Pikachu" },
  { id: "0039", name: "Jigglypuff" },
  { id: "0052", name: "Meowth" },
  { id: "0054", name: "Psyduck" },
  { id: "0063", name: "Abra" },
  { id: "0079", name: "Slowpoke" },
  { id: "0094", name: "Gengar" },
  { id: "0113", name: "Chansey" },
  { id: "0129", name: "Magikarp" },
  { id: "0131", name: "Lapras" },
  { id: "0133", name: "Eevee" },
  { id: "0143", name: "Snorlax" },
  { id: "0147", name: "Dratini" },
  { id: "0150", name: "Mewtwo" },
  { id: "0151", name: "Mew" },
  { id: "0152", name: "Chikorita" },
  { id: "0155", name: "Cyndaquil" },
  { id: "0158", name: "Totodile" },
  { id: "0175", name: "Togepi" },
  { id: "0196", name: "Espeon" },
  { id: "0197", name: "Umbreon" },
  { id: "0245", name: "Suicune" },
  { id: "0249", name: "Lugia" },
  { id: "0250", name: "Ho-Oh" },
  { id: "0252", name: "Treecko" },
  { id: "0255", name: "Torchic" },
  { id: "0258", name: "Mudkip" },
  { id: "0282", name: "Gardevoir" },
  { id: "0302", name: "Sableye" },
  { id: "0330", name: "Flygon" },
  { id: "0350", name: "Milotic" },
  { id: "0359", name: "Absol" },
  { id: "0371", name: "Bagon" },
  { id: "0376", name: "Metagross" },
  { id: "0380", name: "Latias" },
  { id: "0381", name: "Latios" },
  { id: "0382", name: "Kyogre" },
  { id: "0383", name: "Groudon" },
  { id: "0384", name: "Rayquaza" },
  { id: "0385", name: "Jirachi" },
  { id: "0387", name: "Turtwig" },
  { id: "0390", name: "Chimchar" },
  { id: "0393", name: "Piplup" },
  { id: "0403", name: "Shinx" },
  { id: "0417", name: "Pachirisu" },
  { id: "0430", name: "Honchkrow" },
  { id: "0445", name: "Garchomp" },
  { id: "0447", name: "Riolu" },
  { id: "0448", name: "Lucario" },
  { id: "0468", name: "Togekiss" },
  { id: "0471", name: "Glaceon" },
  { id: "0483", name: "Dialga" },
  { id: "0484", name: "Palkia" },
  { id: "0487", name: "Giratina" },
  { id: "0490", name: "Manaphy" },
  { id: "0493", name: "Arceus" },
  { id: "0495", name: "Snivy" },
  { id: "0498", name: "Tepig" },
  { id: "0501", name: "Oshawott" },
  { id: "0643", name: "Reshiram" },
  { id: "0644", name: "Zekrom" },
  { id: "0646", name: "Kyurem" },
  { id: "0650", name: "Chespin" },
  { id: "0653", name: "Fennekin" },
  { id: "0656", name: "Froakie" },
  { id: "0700", name: "Sylveon" },
  { id: "0716", name: "Xerneas" },
  { id: "0717", name: "Yveltal" },
  { id: "0718", name: "Zygarde" },
  { id: "0721", name: "Volcanion" },
  { id: "0722", name: "Rowlet" },
  { id: "0725", name: "Litten" },
  { id: "0728", name: "Popplio" },
  { id: "0785", name: "Tapu Koko" },
  { id: "0789", name: "Cosmog" },
  { id: "0791", name: "Solgaleo" },
  { id: "0792", name: "Lunala" },
  { id: "0800", name: "Necrozma" },
  { id: "0810", name: "Grookey" },
  { id: "0813", name: "Scorbunny" },
  { id: "0816", name: "Sobble" },
  { id: "0888", name: "Zacian" },
  { id: "0889", name: "Zamazenta" },
  { id: "0890", name: "Eternatus" },
  { id: "0906", name: "Sprigatito" },
  { id: "0909", name: "Fuecoco" },
  { id: "0912", name: "Quaxly" },
  { id: "1007", name: "Koraidon" },
  { id: "1008", name: "Miraidon" },
];

const GAMEPLAY_POKEMON = [
  { id: "0006", name: "Charizard" },
  { id: "0025", name: "Pikachu" },
  { id: "0094", name: "Gengar" },
  { id: "0144", name: "Articuno" },
  { id: "0145", name: "Zapdos" },
  { id: "0146", name: "Moltres" },
  { id: "0150", name: "Mewtwo" },
  { id: "0248", name: "Tyranitar" },
  { id: "0384", name: "Rayquaza" },
];

const HERO_FLOATER_IDS = [
  "0149",
  "0373",
  "0248",
  "0006",
  "0144",
  "0018",
  "0227",
];

const TYPES = [
  { name: "fire", emoji: "&#x1F525;" },
  { name: "water", emoji: "&#x1F4A7;" },
  { name: "grass", emoji: "&#x1F33F;" },
  { name: "electric", emoji: "&#x26A1;" },
  { name: "psychic", emoji: "&#x1F52E;" },
  { name: "ice", emoji: "&#x1F9CA;" },
  { name: "dragon", emoji: "&#x1F409;" },
  { name: "dark", emoji: "&#x1F311;" },
  { name: "fairy", emoji: "&#x1F338;" },
  { name: "fighting", emoji: "&#x1F94A;" },
  { name: "poison", emoji: "&#x2620;&#xFE0F;" },
  { name: "ground", emoji: "&#x1F3D4;&#xFE0F;" },
  { name: "rock", emoji: "&#x1FAA8;" },
  { name: "ghost", emoji: "&#x1F47B;" },
  { name: "bug", emoji: "&#x1F41B;" },
  { name: "steel", emoji: "&#x1F529;" },
  { name: "flying", emoji: "&#x1F985;" },
  { name: "normal", emoji: "&#x2B50;" },
];

const NOTES = [
  130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0,
  523.25, 587.33, 659.25, 783.99, 880.0,
];

const CHORD_PROGRESSIONS = [
  [130.81, 196.0, 261.63, 329.63],
  [164.81, 246.94, 329.63, 392.0],
  [110.0, 164.81, 220.0, 261.63],
  [87.31, 130.81, 174.61, 220.0],
];

const LANDING_TRAINERS = [
  { id: "player-21", name: "Arc Runner", src: "/assets/players/player%20(21).glb", type: "Cyber" },
  { id: "player-5", name: "Explorer", src: "/assets/players/player%20(5).glb", type: "Adventure" },
  { id: "player-9", name: "Aero Kinetic", src: "/assets/players/player%20(9).glb", type: "Sci-Fi" },
  { id: "player-8", name: "Glitch Weaver", src: "/assets/players/player%20(8).glb", type: "Voxel" },
  { id: "player-6", name: "Field Scout", src: "/assets/players/player%20(6).glb", type: "Scout" },
];

export function LandingScreen() {
  const { goTo, setUser } = useGame();
  const canvasRef = useRef(null);
  const [selectedTrainerIdx, setSelectedTrainerIdx] = useState(0);

  // Loader sequence states
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("pixelmon-landing-loaded");
    }
    return true;
  });
  const [progress, setProgress] = useState(0);
  const [logText, setLogText] = useState(
    "SYSTEM INITIATED. SCANNING SECTOR..."
  );
  const [fadeOutLoader, setFadeOutLoader] = useState(false);

  // Audio system states
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const padNodesRef = useRef([]);
  const masterGainRef = useRef(null);
  const currentScrollSpeedRef = useRef(0);
  const currentProgressionIndexRef = useRef(0);

  // Header scrolling state
  const [scrolled, setScrolled] = useState(false);

  // Stats Counters state
  const [countedStats, setCountedStats] = useState({
    pokemon: 0,
    biomes: 0,
    modes: 0,
  });

  // Load model-viewer dynamically in browser
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("model-viewer-script")
    ) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  // 1. Loader simulation
  useEffect(() => {
    if (!showLoader) return;

    const logLines = [
      "SYSTEM INITIATED. SCANNING SECTOR...",
      "BOOTING PIXELMON OS v0.9...",
      "ESTABLISHING SECURE ONCHAIN GRID...",
      "SYNCING ENTIRE GENERATION 1-9 INDEX...",
      "MOUNTING 3D VOXEL GEOMETRY CACHE...",
      "LOADING 8 BIOME TOPOGRAPHICAL MAPS...",
      "SPAWNING TURN-BASED ARENA SCRIPTS...",
      "PARSING VOXEL SHADERS & LIGHTING...",
      "PIXELMON TERMINAL OS LOADED.",
      "TRAINER INTERFACE ACTIVE.",
    ];

    let currentProgress = 0;
    let logIndex = 0;

    const updateLoader = () => {
      currentProgress += Math.random() * 9 + 4;
      if (currentProgress >= 100) {
        setProgress(100);
        setLogText(logLines[logLines.length - 1]);
        setTimeout(() => {
          setFadeOutLoader(true);
          setTimeout(() => {
            setShowLoader(false);
            sessionStorage.setItem("pixelmon-landing-loaded", "true");
          }, 600);
        }, 600);
        return;
      }

      setProgress(Math.floor(currentProgress));
      const expectedLogIndex = Math.floor(
        (currentProgress / 100) * logLines.length
      );
      if (expectedLogIndex > logIndex && expectedLogIndex < logLines.length) {
        logIndex = expectedLogIndex;
        setLogText(logLines[logIndex]);
      }

      setTimeout(updateLoader, Math.random() * 120 + 40);
    };

    const timer = setTimeout(updateLoader, 200);
    return () => clearTimeout(timer);
  }, [showLoader]);

  // 2. Background particles canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const particles = [];
    const count = 45;

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.color =
          Math.random() > 0.4
            ? "rgba(255, 51, 68, 0.15)"
            : "rgba(255, 225, 53, 0.15)";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3. Ambient Retro Synth Sound Engine (Web Audio API)
  const playNote = (freq, type, duration, vol = 0.05) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx || audioCtx.state === "suspended") return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    filter.type = "lowpass";
    const speed = currentScrollSpeedRef.current;
    const baseFreq = 650;
    const maxFreq = 2200;
    const cutoff = baseFreq + (maxFreq - baseFreq) * speed;
    filter.frequency.setValueAtTime(cutoff, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + duration
    );

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainRef.current);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  };

  const playPad = () => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const chords = CHORD_PROGRESSIONS[currentProgressionIndexRef.current];

    currentProgressionIndexRef.current =
      (currentProgressionIndexRef.current + 1) % CHORD_PROGRESSIONS.length;

    padNodesRef.current.forEach((node) => {
      try {
        node.gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      } catch {
        /* ignore */
      }
    });
    padNodesRef.current = [];

    chords.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      const speed = currentScrollSpeedRef.current;
      const baseFreq = 450;
      const cutoff = baseFreq + 800 * speed;
      filter.frequency.setValueAtTime(cutoff, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.035, now + 0.8);
      gainNode.gain.setValueAtTime(0.035, now + 5.5);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGainRef.current);

      osc.start();
      osc.stop(now + 8.0);

      padNodesRef.current.push({ osc, gain: gainNode });
    });
  };

  const startMelody = () => {
    let step = 0;
    synthIntervalRef.current = setInterval(() => {
      const audioCtx = audioCtxRef.current;
      if (!audioCtx || audioCtx.state === "suspended") return;

      if (step % 8 === 0) {
        playPad();
      }

      if (Math.random() > 0.35) {
        const scaleIndex = Math.floor(Math.random() * 5) + 5;
        const freq = NOTES[scaleIndex];
        const noteType = Math.random() > 0.7 ? "triangle" : "sine";
        const dur = Math.random() > 0.5 ? 1.4 : 0.7;
        playNote(freq, noteType, dur, 0.025);
      }

      step++;
    }, 1000);
  };

  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(
        0,
        audioCtxRef.current.currentTime
      );
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }

    const audioCtx = audioCtxRef.current;

    if (!isAudioPlaying) {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      setIsAudioPlaying(true);
      masterGainRef.current.gain.linearRampToValueAtTime(
        0.7,
        audioCtx.currentTime + 1.2
      );
      startMelody();
    } else {
      setIsAudioPlaying(false);
      masterGainRef.current.gain.linearRampToValueAtTime(
        0,
        audioCtx.currentTime + 0.8
      );
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      setTimeout(() => {
        padNodesRef.current.forEach((node) => {
          try {
            node.osc.stop();
          } catch {
            /* ignore */
          }
        });
        padNodesRef.current = [];
      }, 1000);
    }
  };

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
      padNodesRef.current.forEach((node) => {
        try {
          node.osc.stop();
        } catch {
          /* ignore */
        }
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // 4. Scroll events, nav transition, stats counters, 3D scroll animations
  useEffect(() => {
    if (showLoader) return;

    // Nav scrolled class trigger
    const handleScrollNav = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScrollNav, { passive: true });

    // Stats counter intersection observer
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const targetPokemon = 1025;
          const targetBiomes = 8;
          const targetModes = 6;
          const duration = 1800;
          const startTime = performance.now();

          const tick = (now) => {
            const progressTime = Math.min((now - startTime) / duration, 1);
            // Ease out quad
            const eased =
              progressTime < 0.5
                ? 2 * progressTime * progressTime
                : -1 + (4 - 2 * progressTime) * progressTime;

            setCountedStats({
              pokemon: Math.floor(eased * targetPokemon),
              biomes: Math.floor(eased * targetBiomes),
              modes: Math.floor(eased * targetModes),
            });

            if (progressTime < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
          statsObserver.disconnect(); // Trigger once
        });
      },
      { threshold: 0.5 }
    );

    const statsEl = document.querySelector(".hero-stats");
    if (statsEl) statsObserver.observe(statsEl);

    // Scroll Reveal Intersection Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".reveal")
      .forEach((el) => revealObserver.observe(el));

    // 3D Scroll controller state variables
    let lastScrollTop = 0;
    let scrollSpeed = 0;
    const decay = 0.92;
    let animationFrameId;

    const sections = [
      { id: "hero", el: document.getElementById("hero") },
      { id: "showcase", el: document.getElementById("showcase") },
      { id: "modes", el: document.getElementById("modes") },
      { id: "biomes", el: document.getElementById("biomes") },
      { id: "types", el: document.getElementById("types") },
      { id: "gameplay", el: document.getElementById("gameplay") },
    ];

    const animateSection = (id, progressVal, _focus, _center) => {
      if (id === "hero") {
        const pkball = document.getElementById("hero-pokeball-3d-model");
        if (pkball) {
          const rotation = progressVal * 720;
          pkball.setAttribute("camera-orbit", `${rotation}deg 75deg 3m`);
          pkball.style.transform = `translateX(-50%) translateY(${progressVal * -80}px) scale(${1 - progressVal * 0.25})`;
        }

        const floaters = document.querySelectorAll(".hero-pokemon");
        floaters.forEach((fl, idx) => {
          const shift = progressVal * (30 + idx * 10);
          fl.style.transform = `translateY(${shift}px) rotate(${progressVal * 90}deg)`;
        });
      } else if (id === "showcase") {
        const cards = document.querySelectorAll(".model-card");
        const count = cards.length;
        cards.forEach((card, idx) => {
          const cardOffset = idx / count;
          let cardProgress = progressVal * 4.5 - cardOffset * 3.2;
          cardProgress = Math.max(0, Math.min(1.5, cardProgress));

          const focusDist = Math.abs(cardProgress - 0.7);

          if (focusDist < 0.35) {
            const y = (cardProgress - 0.7) * 750;
            const x = 0;
            const z = -300 * (focusDist / 0.35);
            const rotX = (cardProgress - 0.7) * -65;

            card.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, ${z}px) rotateX(${rotX}deg)`;
            card.style.left = "50%";

            const baseOpacity = 1 - focusDist / 0.35;
            const opacity = Math.pow(baseOpacity, 4);
            card.style.opacity = Math.max(0, Math.min(1, opacity));

            const blur = Math.max(0, (focusDist - 0.08) * 18);
            card.style.filter = `blur(${blur}px)`;
            card.style.pointerEvents = focusDist < 0.15 ? "auto" : "none";

            const viewer = card.querySelector("model-viewer");
            if (viewer) {
              const rot = (cardProgress - 0.35) * 800;
              viewer.setAttribute("camera-orbit", `${rot}deg 75deg 3m`);

              const scale = 0.85 + (1 - focusDist / 0.35) * 0.4;
              viewer.style.transform = `scale(${Math.max(0.85, Math.min(1.25, scale))})`;
              viewer.style.transition = "transform 0.1s ease-out";
            }
          } else {
            card.style.opacity = "0";
            card.style.transform = "translate3d(-50%, -1500px, -1000px)";
            card.style.pointerEvents = "none";
          }
        });
      } else if (id === "biomes") {
        const grid = document.querySelector(".biomes-grid");
        if (grid) {
          const sticky = document.querySelector(".biomes-scroll-container");
          if (sticky) {
            const rect = sticky.getBoundingClientRect();
            const totalScrollable = sticky.scrollHeight - window.innerHeight;
            const scrolledInSection = -rect.top;
            let ratio = scrolledInSection / totalScrollable;
            ratio = Math.max(0, Math.min(1, ratio));

            const maxTranslate = grid.scrollWidth - window.innerWidth;
            if (maxTranslate > 0) {
              grid.style.transform = `translateX(${-ratio * maxTranslate}px)`;
            }
          }
        }
      } else if (id === "types") {
        const grid = document.getElementById("typesGrid");
        if (grid) {
          const rotY = progressVal * 360;
          const rotX = Math.sin(progressVal * Math.PI) * 15;
          grid.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }
      }
    };

    const handleScroll3D = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const globalProgress = docHeight > 0 ? scrollTop / docHeight : 0;

      document.documentElement.style.setProperty(
        "--scroll-progress",
        globalProgress
      );

      const diff = Math.abs(scrollTop - lastScrollTop);
      scrollSpeed = Math.min(100, scrollSpeed + diff * 0.15);
      lastScrollTop = scrollTop;

      sections.forEach((sec) => {
        if (!sec.el) return;
        const rect = sec.el.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        const entrance = rect.top - viewHeight;
        const totalDist = rect.height + viewHeight;
        let progressVal = -entrance / totalDist;
        progressVal = Math.max(0, Math.min(1, progressVal));
        sec.el.style.setProperty("--sec-progress", progressVal);

        const center = rect.top + rect.height / 2 - viewHeight / 2;
        const distFromCenter = Math.abs(center);
        const focus = Math.max(0, 1 - distFromCenter / (viewHeight * 0.8));
        sec.el.style.setProperty("--sec-focus", focus);

        animateSection(sec.id, progressVal, focus, center);
      });
    };

    window.addEventListener("scroll", handleScroll3D, { passive: true });
    handleScroll3D(); // initial call

    const tick = () => {
      scrollSpeed *= decay;
      if (scrollSpeed < 0.05) scrollSpeed = 0;

      document.documentElement.style.setProperty(
        "--scroll-speed",
        scrollSpeed / 100
      );
      currentScrollSpeedRef.current = scrollSpeed / 100;

      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("scroll", handleScrollNav);
      window.removeEventListener("scroll", handleScroll3D);
      cancelAnimationFrame(animationFrameId);
      statsObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [showLoader]);

  // Handle Play Button Authentication verification
  const handlePlayClick = async (e) => {
    if (e) e.preventDefault();

    const token = getStoredToken();
    if (token) {
      try {
        const res = await verifySession(token);
        if (res.success && res.user) {
          setUser(res.user);
          goTo(SCREENS.dashboard);
          return;
        }
      } catch (err) {
        console.error("Session verify failed, clearing token:", err);
      }
    }
    // No valid token: navigate to auth screen
    goTo(SCREENS.auth);
  };

  if (showLoader) {
    return (
      <div className="landing-root">
        <div id="pokedex-loader" className={fadeOutLoader ? "fade-out" : ""}>
          <div className="loader-content">
            <pre className="ascii-art" id="loader-ascii">
              {`     .--------.
   /   ______   \\
  /  /        \\  \\
 |  |    ()    |  |
  \\  \\________/  /
   \\            /
     '--------'`}
            </pre>
            <div className="loader-title">PIXELMON OS v0.9</div>
            <div className="loader-bar-wrap">
              <div
                className="loader-bar"
                id="loader-progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="loader-log" id="loader-log">
              {logText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-root">
      {/* BACKGROUND & OVERLAYS */}
      <canvas id="bg-particles" ref={canvasRef}></canvas>
      <div className="grid-overlay"></div>

      {/* NAV */}
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo" onClick={(e) => e.preventDefault()}>
          <div className="nav-pokeball" aria-hidden="true"></div>
          <span className="gradient-text">Pixelmon</span>
        </a>

        <ul className="nav-links">
          <li>
            <a href="#modes">Game Modes</a>
          </li>
          <li>
            <a href="#biomes">Biomes</a>
          </li>
          <li>
            <a href="#gameplay">Gameplay</a>
          </li>
          <li>
            <a
              href="#play"
              className="btn-play-nav"
              id="nav-play-btn"
              onClick={handlePlayClick}
            >
              Play Now &rarr;
            </a>
          </li>
          <li>
            <button
              id="audio-toggle"
              className={`audio-toggle ${isAudioPlaying ? "active" : ""}`}
              onClick={toggleAudio}
              aria-label="Toggle Soundtrack"
              title="Toggle Soundtrack"
            >
              <div className="audio-icon">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </div>
            </button>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg">
          <div className="hero-bg-gradient"></div>
          <div className="hero-bg-stars"></div>
          <div className="hud-overlay"></div>
        </div>

        {/* Floating Silhouettes */}
        <div className="hero-floaters" id="heroFloaters">
          {HERO_FLOATER_IDS.map((id, i) => {
            const sz = 120 + i * 20;
            return (
              <div
                key={id}
                className="floater"
                style={{
                  width: `${sz}px`,
                  height: `${sz}px`,
                  top: `${10 + i * 12}%`,
                  left: `${5 + i * 13}%`,
                  animationDuration: `${8 + i * 1.5}s`,
                  animationDelay: `-${i * 2}s`,
                }}
              >
                <model-viewer
                  src={`/assets/models/glb/regular/${parseInt(id, 10)}.glb`}
                  alt=""
                  auto-rotate=""
                  rotation-per-second="15deg"
                  disable-zoom=""
                  disable-pan=""
                  loading="lazy"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            );
          })}
        </div>

        <div className="pokeball-deco pokeball-deco-1" aria-hidden="true"></div>

        {/* Floating 3D Pokeball Portal */}
        <div className="hero-pokeball-3d">
          <model-viewer
            id="hero-pokeball-3d-model"
            src="/assets/pokeballs/standard.glb"
            alt="Interactive Pokeball"
            auto-rotate-delay="0"
            camera-controls=""
            disable-zoom=""
            disable-pan=""
            shadow-intensity="0.8"
            exposure="1.2"
            loading="eager"
            style={{ width: "100%", height: "100%" }}
          ></model-viewer>
        </div>

        <div className="hero-content">
          <div className="hero-badge" id="heroBadge">
            <span className="hero-badge-dot"></span>
            Now Live &mdash; 1025 Pokemon Available
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">PIXEL</span>
            <br />
            <span style={{ color: "var(--px-pokered)" }}>MON</span>
          </h1>
          <p className="hero-title-sub">Voxel Legends</p>

          <p className="hero-desc">
            Explore 8 unique biomes, catch over 1,000 Pokemon, battle friends in
            real-time arenas, and build your ultimate trainer legacy &mdash; all
            in your browser.
          </p>

          <div className="hero-cta-group">
            <a
              href="#play"
              className="btn-primary"
              id="hero-play-btn"
              onClick={handlePlayClick}
            >
              <span className="btn-pokeball-icon" aria-hidden="true"></span>
              Play Free Now
            </a>
            <a href="#modes" className="btn-secondary">
              &darr; Explore Modes
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">
                {countedStats.pokemon.toLocaleString()}+
              </div>
              <div className="hero-stat-label">Pokemon</div>
            </div>
            <div>
              <div className="hero-stat-num">{countedStats.biomes}</div>
              <div className="hero-stat-label">Biomes</div>
            </div>
            <div>
              <div className="hero-stat-num">{countedStats.modes}+</div>
              <div className="hero-stat-label">Game Modes</div>
            </div>
          </div>
        </div>

        {/* Right: Trainer */}
        <div className="hero-visual">
          <div className="hero-trainer-wrap">
            <div className="hero-trainer-glow"></div>

            {/* 3D Pikachu orbiting top-right */}
            <div
              className="hero-pokemon"
              style={{
                top: "8%",
                right: "-2%",
                animationDuration: "5.2s",
                animationDelay: "0s",
              }}
            >
              <model-viewer
                src="/assets/models/glb/regular/25.glb"
                alt="Pikachu"
                auto-rotate=""
                auto-rotate-delay="0"
                rotation-per-second="30deg"
                camera-controls=""
                disable-zoom=""
                disable-pan=""
                style={{
                  width: "100px",
                  height: "100px",
                  filter: "drop-shadow(0 4px 20px rgba(255,212,63,0.6))",
                }}
                poster="/assets/images/thumbnails/0025.png"
                loading="lazy"
                shadow-intensity="0"
              />
            </div>
            {/* 3D Charizard orbiting left */}
            <div
              className="hero-pokemon"
              style={{
                top: "38%",
                left: "-8%",
                animationDuration: "4.8s",
                animationDelay: "-2s",
              }}
            >
              <model-viewer
                src="/assets/models/glb/regular/6.glb"
                alt="Charizard"
                auto-rotate=""
                auto-rotate-delay="0"
                rotation-per-second="25deg"
                camera-controls=""
                disable-zoom=""
                disable-pan=""
                style={{
                  width: "110px",
                  height: "110px",
                  filter: "drop-shadow(0 4px 20px rgba(255,100,0,0.6))",
                }}
                poster="/assets/images/thumbnails/0006.png"
                loading="lazy"
                shadow-intensity="0"
              />
            </div>
            {/* 3D Mewtwo bottom-right */}
            <div
              className="hero-pokemon"
              style={{
                bottom: "18%",
                right: "-3%",
                animationDuration: "6s",
                animationDelay: "-1s",
              }}
            >
              <model-viewer
                src="/assets/models/glb/regular/150.glb"
                alt="Mewtwo"
                auto-rotate=""
                auto-rotate-delay="0"
                rotation-per-second="20deg"
                camera-controls=""
                disable-zoom=""
                disable-pan=""
                style={{
                  width: "90px",
                  height: "90px",
                  filter: "drop-shadow(0 4px 20px rgba(150,50,255,0.6))",
                }}
                poster="/assets/images/thumbnails/0150.png"
                loading="lazy"
                shadow-intensity="0"
              />
            </div>

            <div className="hero-trainer-container">
              <model-viewer
                id="heroTrainer3D"
                className="hero-trainer-3d"
                src={LANDING_TRAINERS[selectedTrainerIdx].src}
                alt={LANDING_TRAINERS[selectedTrainerIdx].name}
                auto-rotate
                camera-controls
                disable-zoom
                disable-pan
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1.2"
                autoplay
                interaction-prompt="none"
              />
              
              {/* Sleek Selector HUD */}
              <div className="trainer-selector">
                {LANDING_TRAINERS.map((trainer, idx) => (
                  <button
                    key={trainer.id}
                    className={`trainer-selector-btn ${selectedTrainerIdx === idx ? "active" : ""}`}
                    onClick={() => setSelectedTrainerIdx(idx)}
                    title={`${trainer.name} (${trainer.type})`}
                  >
                    <span className="trainer-selector-dot"></span>
                    <span className="trainer-selector-label">{trainer.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D SHOWCASE SECTION */}
      <section id="showcase">
        <div className="hud-overlay"></div>
        <div className="showcase-inner">
          <div className="section-head">
            <div className="section-label reveal">3D Models</div>
            <h2 className="section-title reveal reveal-delay-1">
              Meet Them in <span className="gradient-text">3D</span>
            </h2>
            <p
              className="section-sub reveal reveal-delay-2"
              style={{ margin: "0 auto" }}
            >
              Every Pokemon is a fully rigged 3D model. Drag to rotate &mdash;
              see them from any angle before you catch them.
            </p>
          </div>

          <div className="showcase-grid">
            {/* Rayquaza */}
            <div
              className="model-card reveal"
              style={{ "--mc-glow": "rgba(39,174,96,0.3)" }}
            >
              <model-viewer
                src="/assets/models/glb/regular/384.glb"
                alt="Rayquaza"
                auto-rotate=""
                auto-rotate-delay="500"
                rotation-per-second="20deg"
                camera-controls=""
                environment-image="neutral"
                shadow-intensity="0.5"
                exposure="1.2"
                poster="/assets/images/thumbnails/0384.png"
                loading="lazy"
              />
              <div className="model-card-overlay"></div>
              <div className="model-hint">&#x21BA; Drag to rotate</div>
              <div className="model-card-info">
                <div className="model-card-name">Rayquaza</div>
                <div className="model-card-types">
                  <span className="model-type-badge type-dragon">
                    &#x1F409; Dragon
                  </span>
                  <span className="model-type-badge type-flying">
                    &#x1F985; Flying
                  </span>
                </div>
              </div>
            </div>

            {/* Lucario */}
            <div
              className="model-card reveal reveal-delay-1"
              style={{ "--mc-glow": "rgba(41,128,185,0.4)" }}
            >
              <model-viewer
                src="/assets/models/glb/regular/448.glb"
                alt="Lucario"
                auto-rotate=""
                auto-rotate-delay="500"
                rotation-per-second="22deg"
                camera-controls=""
                environment-image="neutral"
                shadow-intensity="0.5"
                exposure="1.2"
                poster="/assets/images/thumbnails/0448.png"
                loading="lazy"
              />
              <div className="model-card-overlay"></div>
              <div className="model-hint">&#x21BA; Drag to rotate</div>
              <div className="model-card-info">
                <div className="model-card-name">Lucario</div>
                <div className="model-card-types">
                  <span className="model-type-badge type-fighting">
                    &#x1F94A; Fighting
                  </span>
                  <span className="model-type-badge type-steel">
                    &#x1F529; Steel
                  </span>
                </div>
              </div>
            </div>

            {/* Gengar */}
            <div
              className="model-card reveal reveal-delay-2"
              style={{ "--mc-glow": "rgba(127,0,255,0.3)" }}
            >
              <model-viewer
                src="/assets/models/glb/regular/94.glb"
                alt="Gengar"
                auto-rotate=""
                auto-rotate-delay="500"
                rotation-per-second="18deg"
                camera-controls=""
                environment-image="neutral"
                shadow-intensity="0.4"
                exposure="1.0"
                poster="/assets/images/thumbnails/0094.png"
                loading="lazy"
              />
              <div className="model-card-overlay"></div>
              <div className="model-hint">&#x21BA; Drag to rotate</div>
              <div className="model-card-info">
                <div className="model-card-name">Gengar</div>
                <div className="model-card-types">
                  <span className="model-type-badge type-ghost">
                    &#x1F47B; Ghost
                  </span>
                  <span className="model-type-badge type-poison">
                    &#x2620;&#xFE0F; Poison
                  </span>
                </div>
              </div>
            </div>

            {/* Charizard */}
            <div
              className="model-card reveal"
              style={{ "--mc-glow": "rgba(238,21,21,0.3)" }}
            >
              <model-viewer
                src="/assets/models/glb/regular/6.glb"
                alt="Charizard"
                auto-rotate=""
                auto-rotate-delay="500"
                rotation-per-second="22deg"
                camera-controls=""
                environment-image="neutral"
                shadow-intensity="0.5"
                exposure="1.3"
                poster="/assets/images/thumbnails/0006.png"
                loading="lazy"
              />
              <div className="model-card-overlay"></div>
              <div className="model-hint">&#x21BA; Drag to rotate</div>
              <div className="model-card-info">
                <div className="model-card-name">Charizard</div>
                <div className="model-card-types">
                  <span className="model-type-badge type-fire">
                    &#x1F525; Fire
                  </span>
                  <span className="model-type-badge type-flying">
                    &#x1F985; Flying
                  </span>
                </div>
              </div>
            </div>

            {/* Mewtwo */}
            <div
              className="model-card reveal reveal-delay-1"
              style={{ "--mc-glow": "rgba(200,50,255,0.3)" }}
            >
              <model-viewer
                src="/assets/models/glb/regular/150.glb"
                alt="Mewtwo"
                auto-rotate=""
                auto-rotate-delay="500"
                rotation-per-second="18deg"
                camera-controls=""
                environment-image="neutral"
                shadow-intensity="0.4"
                exposure="1.1"
                poster="/assets/images/thumbnails/0150.png"
                loading="lazy"
              />
              <div className="model-card-overlay"></div>
              <div className="model-hint">&#x21BA; Drag to rotate</div>
              <div className="model-card-info">
                <div className="model-card-name">Mewtwo</div>
                <div className="model-card-types">
                  <span className="model-type-badge type-psychic">
                    &#x1F52E; Psychic
                  </span>
                </div>
              </div>
            </div>

            {/* Garchomp */}
            <div
              className="model-card reveal reveal-delay-2"
              style={{ "--mc-glow": "rgba(100,150,255,0.3)" }}
            >
              <model-viewer
                src="/assets/models/glb/regular/445.glb"
                alt="Garchomp"
                auto-rotate=""
                auto-rotate-delay="500"
                rotation-per-second="24deg"
                camera-controls=""
                environment-image="neutral"
                shadow-intensity="0.5"
                exposure="1.2"
                poster="/assets/images/thumbnails/0445.png"
                loading="lazy"
              />
              <div className="model-card-overlay"></div>
              <div className="model-hint">&#x21BA; Drag to rotate</div>
              <div className="model-card-info">
                <div className="model-card-name">Garchomp</div>
                <div className="model-card-types">
                  <span className="model-type-badge type-dragon">
                    &#x1F409; Dragon
                  </span>
                  <span className="model-type-badge type-ground">
                    &#x1F3D4;&#xFE0F; Ground
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL */}
      <section id="carousel" aria-label="Featured Pokemon">
        <p className="carousel-label">
          &mdash; Featuring 1025+ Pokemon from all generations &mdash;
        </p>
        <div className="ticker-wrapper">
          <div className="ticker-track" id="ticker1">
            {CAROUSEL_POKEMON.map((p) => (
              <div key={`${p.id}-t1`} className="ticker-card" title={p.name}>
                <img
                  src={`/assets/images/thumbnails/${p.id}.png`}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.parentElement.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
          <div className="ticker-track" id="ticker2">
            {CAROUSEL_POKEMON.map((p) => (
              <div key={`${p.id}-t2`} className="ticker-card" title={p.name}>
                <img
                  src={`/assets/images/thumbnails/${p.id}.png`}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.parentElement.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAME MODES */}
      <section id="modes" className="section">
        <div className="section-inner">
          <div className="section-head">
            <div className="section-label reveal">Game Modes</div>
            <h2 className="section-title reveal reveal-delay-1">
              Every Way to <span className="gradient-text">Play</span>
            </h2>
            <p
              className="section-sub reveal reveal-delay-2"
              style={{ margin: "0 auto" }}
            >
              From open-world exploration to high-stakes PvP battles &mdash;
              Pixelmon has a mode for every type of trainer.
            </p>
          </div>

          <div className="modes-grid">
            <div
              className="mode-card reveal"
              style={{
                "--card-color": "rgba(238,21,21,0.15)",
                "--card-glow": "rgba(238,21,21,0.2)",
                "--card-text": "#ff8080",
              }}
              onClick={handlePlayClick}
            >
              <div className="mode-card-top" style={{ height: "100px" }}>
                <div>
                  <span
                    className="mode-tag"
                    style={{
                      background: "rgba(238,21,21,0.15)",
                      color: "#ff8080",
                      borderColor: "rgba(238,21,21,0.25)",
                    }}
                  >
                    PvP
                  </span>
                  <div
                    className="mode-icon-wrap"
                    style={{
                      background: "rgba(238,21,21,0.15)",
                      borderColor: "rgba(238,21,21,0.2)",
                      marginTop: "0.75rem",
                    }}
                  >
                    &#x2694;&#xFE0F;
                  </div>
                </div>
                <div style={{ width: "100px", height: "100px" }}>
                  <model-viewer
                    src="/assets/models/glb/regular/448.glb"
                    alt="Lucario"
                    auto-rotate=""
                    rotation-per-second="25deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
              </div>
              <div>
                <h3 className="mode-name">Battle Arena</h3>
                <p className="mode-desc">
                  Face off against other trainers in intense turn-based Pokemon
                  battles. Build your ultimate team and climb the ranks.
                </p>
              </div>
              <div
                className="mode-arrow"
                style={{ background: "rgba(238,21,21,0.15)" }}
              >
                &rarr;
              </div>
            </div>

            <div
              className="mode-card reveal reveal-delay-1"
              style={{
                "--card-color": "rgba(63,255,168,0.12)",
                "--card-glow": "rgba(63,255,168,0.15)",
                "--card-text": "#3fffa8",
              }}
              onClick={handlePlayClick}
            >
              <div className="mode-card-top" style={{ height: "100px" }}>
                <div>
                  <span
                    className="mode-tag"
                    style={{
                      background: "rgba(63,255,168,0.12)",
                      color: "#3fffa8",
                      borderColor: "rgba(63,255,168,0.2)",
                    }}
                  >
                    Explore
                  </span>
                  <div
                    className="mode-icon-wrap"
                    style={{
                      background: "rgba(63,255,168,0.12)",
                      borderColor: "rgba(63,255,168,0.15)",
                      marginTop: "0.75rem",
                    }}
                  >
                    &#x1F30D;
                  </div>
                </div>
                <div style={{ width: "100px", height: "100px" }}>
                  <model-viewer
                    src="/assets/models/glb/regular/6.glb"
                    alt="Charizard"
                    auto-rotate=""
                    rotation-per-second="25deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
              </div>
              <div>
                <h3 className="mode-name">Open World</h3>
                <p className="mode-desc">
                  Roam freely across 8 biomes in a 3D voxel world. Encounter
                  wild Pokemon, discover hidden areas, and catch &apos;em all.
                </p>
              </div>
              <div
                className="mode-arrow"
                style={{ background: "rgba(63,255,168,0.12)" }}
              >
                &rarr;
              </div>
            </div>

            <div
              className="mode-card reveal reveal-delay-2"
              style={{
                "--card-color": "rgba(255,170,102,0.15)",
                "--card-glow": "rgba(255,170,102,0.15)",
                "--card-text": "#ffaa66",
              }}
              onClick={handlePlayClick}
            >
              <div className="mode-card-top" style={{ height: "100px" }}>
                <div>
                  <span
                    className="mode-tag"
                    style={{
                      background: "rgba(255,170,102,0.15)",
                      color: "#ffaa66",
                      borderColor: "rgba(255,170,102,0.2)",
                    }}
                  >
                    Multiplayer
                  </span>
                  <div
                    className="mode-icon-wrap"
                    style={{
                      background: "rgba(255,170,102,0.15)",
                      borderColor: "rgba(255,170,102,0.15)",
                      marginTop: "0.75rem",
                    }}
                  >
                    &#x1F451;
                  </div>
                </div>
                <div style={{ width: "100px", height: "100px" }}>
                  <model-viewer
                    src="/assets/models/glb/regular/384.glb"
                    alt="Rayquaza"
                    auto-rotate=""
                    rotation-per-second="25deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
              </div>
              <div>
                <h3 className="mode-name">Battle Royale</h3>
                <p className="mode-desc">
                  Last trainer standing wins. Enter massive multi-trainer
                  battles where only the strongest survive.
                </p>
              </div>
              <div
                className="mode-arrow"
                style={{ background: "rgba(255,170,102,0.15)" }}
              >
                &rarr;
              </div>
            </div>

            <div
              className="mode-card reveal"
              style={{
                "--card-color": "rgba(79,128,225,0.15)",
                "--card-glow": "rgba(79,128,225,0.15)",
                "--card-text": "#6b9fff",
              }}
              onClick={handlePlayClick}
            >
              <div className="mode-card-top" style={{ height: "100px" }}>
                <div>
                  <span
                    className="mode-tag"
                    style={{
                      background: "rgba(79,128,225,0.15)",
                      color: "#6b9fff",
                      borderColor: "rgba(79,128,225,0.2)",
                    }}
                  >
                    Collection
                  </span>
                  <div
                    className="mode-icon-wrap"
                    style={{
                      background: "rgba(79,128,225,0.15)",
                      borderColor: "rgba(79,128,225,0.15)",
                      marginTop: "0.75rem",
                    }}
                  >
                    &#x1F4D5;
                  </div>
                </div>
                <div style={{ width: "100px", height: "100px" }}>
                  <model-viewer
                    src="/assets/models/glb/regular/151.glb"
                    alt="Mew"
                    auto-rotate=""
                    rotation-per-second="25deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
              </div>
              <div>
                <h3 className="mode-name">Pokedex</h3>
                <p className="mode-desc">
                  Complete your Pokedex by catching every species. Browse stats,
                  types, and evolutionary chains for all 1025 Pokemon.
                </p>
              </div>
              <div
                className="mode-arrow"
                style={{ background: "rgba(79,128,225,0.15)" }}
              >
                &rarr;
              </div>
            </div>

            <div
              className="mode-card reveal reveal-delay-1"
              style={{
                "--card-color": "rgba(200,100,255,0.15)",
                "--card-glow": "rgba(200,100,255,0.15)",
                "--card-text": "#d888ff",
              }}
              onClick={handlePlayClick}
            >
              <div className="mode-card-top" style={{ height: "100px" }}>
                <div>
                  <span
                    className="mode-tag"
                    style={{
                      background: "rgba(200,100,255,0.15)",
                      color: "#d888ff",
                      borderColor: "rgba(200,100,255,0.2)",
                    }}
                  >
                    Fun
                  </span>
                  <div
                    className="mode-icon-wrap"
                    style={{
                      background: "rgba(200,100,255,0.15)",
                      borderColor: "rgba(200,100,255,0.15)",
                      marginTop: "0.75rem",
                    }}
                  >
                    &#x1F3AE;
                  </div>
                </div>
                <div style={{ width: "100px", height: "100px" }}>
                  <model-viewer
                    src="/assets/models/glb/regular/133.glb"
                    alt="Eevee"
                    auto-rotate=""
                    rotation-per-second="25deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
              </div>
              <div>
                <h3 className="mode-name">Minigame Hub</h3>
                <p className="mode-desc">
                  Daily Grid puzzles, Clue Guesser, Trivia Training and more.
                  Test your Pokemon knowledge in fun mini-challenges.
                </p>
              </div>
              <div
                className="mode-arrow"
                style={{ background: "rgba(200,100,255,0.15)" }}
              >
                &rarr;
              </div>
            </div>

            <div
              className="mode-card reveal reveal-delay-2"
              style={{
                "--card-color": "rgba(255,212,63,0.12)",
                "--card-glow": "rgba(255,212,63,0.15)",
                "--card-text": "#ffd43f",
              }}
              onClick={handlePlayClick}
            >
              <div className="mode-card-top" style={{ height: "100px" }}>
                <div>
                  <span
                    className="mode-tag"
                    style={{
                      background: "rgba(255,212,63,0.12)",
                      color: "#ffd43f",
                      borderColor: "rgba(255,212,63,0.2)",
                    }}
                  >
                    Story
                  </span>
                  <div
                    className="mode-icon-wrap"
                    style={{
                      background: "rgba(255,212,63,0.12)",
                      borderColor: "rgba(255,212,63,0.12)",
                      marginTop: "0.75rem",
                    }}
                  >
                    &#x2B50;
                  </div>
                </div>
                <div style={{ width: "100px", height: "100px" }}>
                  <model-viewer
                    src="/assets/models/glb/regular/249.glb"
                    alt="Lugia"
                    auto-rotate=""
                    rotation-per-second="25deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
              </div>
              <div>
                <h3 className="mode-name">Campaign</h3>
                <p className="mode-desc">
                  Embark on an epic story-driven adventure. Battle gym leaders,
                  defeat the Elite Four, and become Champion.
                </p>
              </div>
              <div
                className="mode-arrow"
                style={{ background: "rgba(255,212,63,0.12)" }}
              >
                &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIOMES */}
      <section id="biomes" className="section biomes-scroll-container">
        <div className="biomes-sticky-wrapper">
          <div className="section-inner">
            <div className="section-head">
              <div className="section-label reveal">World</div>
              <h2 className="section-title reveal reveal-delay-1">
                8 Epic <span className="gradient-text">Biomes</span>
              </h2>
              <p
                className="section-sub reveal reveal-delay-2"
                style={{ margin: "0 auto" }}
              >
                Each biome is home to unique Pokemon species. Brave volcanic
                peaks, frozen tundras, and dimensions beyond reality.
              </p>
            </div>

            <div className="biomes-grid">
              {/* Grass Biome */}
              <div
                className="biome-card reveal"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#0d2a0d,#1a4a1a,#0a1f0a)",
                  "--biome-glow": "rgba(39,174,96,0.3)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/1.glb"
                    alt="Bulbasaur"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x1F33F; Grass Biome</div>
                  <div className="biome-sub">
                    Starter zone &middot; Peaceful
                  </div>
                </div>
              </div>

              {/* Desert Biome */}
              <div
                className="biome-card reveal reveal-delay-1"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#2a1a08,#4a3010,#1f1205)",
                  "--biome-glow": "rgba(255,180,50,0.3)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/27.glb"
                    alt="Sandshrew"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">
                    &#x1F3DC;&#xFE0F; Desert Biome
                  </div>
                  <div className="biome-sub">Ground types &middot; Harsh</div>
                </div>
              </div>

              {/* Volcanic Biome */}
              <div
                className="biome-card reveal reveal-delay-2"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#2a0808,#4a1010,#1f0505)",
                  "--biome-glow": "rgba(238,21,21,0.4)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/6.glb"
                    alt="Charizard"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x1F30B; Volcanic Biome</div>
                  <div className="biome-sub">Fire types &middot; Extreme</div>
                </div>
              </div>

              {/* Icy Biome */}
              <div
                className="biome-card reveal reveal-delay-3"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#081a2a,#103050,#050f1f)",
                  "--biome-glow": "rgba(100,200,255,0.3)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/131.glb"
                    alt="Lapras"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x1F9CA; Icy Biome</div>
                  <div className="biome-sub">Ice types &middot; Frozen</div>
                </div>
              </div>

              {/* Cave Biome */}
              <div
                className="biome-card reveal"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#0f0f14,#1a1a24,#08080f)",
                  "--biome-glow": "rgba(100,100,200,0.3)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/94.glb"
                    alt="Gengar"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x1F987; Cave Biome</div>
                  <div className="biome-sub">Ghost types &middot; Dark</div>
                </div>
              </div>

              {/* Sky Biome */}
              <div
                className="biome-card reveal reveal-delay-1"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#0a1840,#122260,#060e28)",
                  "--biome-glow": "rgba(79,128,225,0.4)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/384.glb"
                    alt="Rayquaza"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x2601;&#xFE0F; Sky Biome</div>
                  <div className="biome-sub">Flying types &middot; Vast</div>
                </div>
              </div>

              {/* Moonlit Biome */}
              <div
                className="biome-card reveal reveal-delay-2"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#120a2a,#1e1040,#0a0618)",
                  "--biome-glow": "rgba(200,100,255,0.3)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/197.glb"
                    alt="Umbreon"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x1F319; Moonlit Biome</div>
                  <div className="biome-sub">
                    Dark &amp; Fairy &middot; Mystical
                  </div>
                </div>
              </div>

              {/* Distortion Realm */}
              <div
                className="biome-card reveal reveal-delay-3"
                style={{
                  "--biome-gradient":
                    "linear-gradient(160deg,#200a30,#300a50,#100520)",
                  "--biome-glow": "rgba(255,50,255,0.3)",
                }}
              >
                <div className="biome-bg"></div>
                <div className="biome-overlay"></div>
                <div className="biome-pattern"></div>
                <div className="biome-model-wrap">
                  <model-viewer
                    src="/assets/models/glb/regular/487.glb"
                    alt="Giratina"
                    auto-rotate=""
                    rotation-per-second="20deg"
                    disable-zoom=""
                    disable-pan=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  ></model-viewer>
                </div>
                <div className="biome-info">
                  <div className="biome-name">&#x1F300; Distortion Realm</div>
                  <div className="biome-sub">Legendaries &middot; Endgame</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POKEDEX STRIP */}
      <section id="pokedex-strip">
        <div className="strip-inner">
          <div className="strip-text">
            <div
              className="section-label reveal"
              style={{ marginBottom: "0.75rem" }}
            >
              Pokedex
            </div>
            <h2 className="reveal reveal-delay-1">
              Complete Your
              <br />
              <span className="gradient-text">Collection</span>
            </h2>
            <p
              className="reveal reveal-delay-2"
              style={{
                color: "var(--px-text-muted)",
                fontSize: "1rem",
                lineHeight: "1.7",
                maxWidth: "460px",
                marginTop: "0.75rem",
              }}
            >
              With 1025 Pokemon across all 9 generations &mdash; including
              regional variants, Mega Evolutions, and Gigantamax forms &mdash;
              there&apos;s always a new one to catch.
            </p>
          </div>
          <div className="strip-stats reveal reveal-delay-1">
            <div className="strip-stat">
              <div className="strip-stat-num">1025</div>
              <div className="strip-stat-label">Total Pokemon</div>
            </div>
            <div className="strip-stat">
              <div className="strip-stat-num">9</div>
              <div className="strip-stat-label">Generations</div>
            </div>
            <div className="strip-stat">
              <div className="strip-stat-num">18</div>
              <div className="strip-stat-label">Types</div>
            </div>
            <div className="strip-stat">
              <div className="strip-stat-num">&#x221E;</div>
              <div className="strip-stat-label">Replayability</div>
            </div>
          </div>
        </div>
      </section>

      {/* TYPES */}
      <section id="types">
        <div className="types-inner">
          <div className="section-head" style={{ textAlign: "left" }}>
            <div className="section-label reveal">Battle System</div>
            <h2 className="section-title reveal reveal-delay-1">
              Master All <span className="gradient-text">18 Types</span>
            </h2>
            <p className="section-sub reveal reveal-delay-2">
              Type matchups are the heart of Pokemon strategy. Build a balanced
              team and exploit type weaknesses to dominate every battle.
            </p>
          </div>
          <div className="types-grid reveal reveal-delay-1" id="typesGrid">
            {TYPES.map((t) => (
              <div key={t.name} className={`type-pill type-${t.name}`}>
                <span dangerouslySetInnerHTML={{ __html: t.emoji }} /> {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMEPLAY / CONTROLS */}
      <section id="gameplay">
        <div className="gameplay-inner">
          <div>
            <div className="section-label reveal">Controls</div>
            <h2 className="section-title reveal reveal-delay-1">
              Jump In &amp;
              <br />
              <span className="gradient-text">Start Playing</span>
            </h2>
            <p className="section-sub reveal reveal-delay-2">
              No downloads. No installs. Just open your browser and start your
              Pokemon adventure.
            </p>

            <div className="controls-grid" style={{ marginTop: "2rem" }}>
              <div className="control-item reveal">
                <span className="control-key">WASD</span>
                <span className="control-desc">
                  Move your trainer through the world
                </span>
              </div>
              <div className="control-item reveal reveal-delay-1">
                <span className="control-key">F</span>
                <span className="control-desc">
                  Throw Pokeball at wild Pokemon
                </span>
              </div>
              <div className="control-item reveal reveal-delay-2">
                <span className="control-key">E</span>
                <span className="control-desc">Send out companion Pokemon</span>
              </div>
              <div className="control-item reveal reveal-delay-3">
                <span className="control-key">1 2 3</span>
                <span className="control-desc">
                  Switch ball type (Standard / Great / Ultra)
                </span>
              </div>
              <div className="control-item reveal reveal-delay-1">
                <span className="control-key">Q / R</span>
                <span className="control-desc">Adjust throw power</span>
              </div>
              <div className="control-item reveal reveal-delay-2">
                <span className="control-key">ESC</span>
                <span className="control-desc">Pause / open menu</span>
              </div>
            </div>

            <div
              style={{ marginTop: "2rem" }}
              className="reveal reveal-delay-3"
            >
              <a
                href="#play"
                className="btn-primary"
                style={{ display: "inline-flex", width: "fit-content" }}
                onClick={handlePlayClick}
              >
                <span className="btn-pokeball-icon"></span>
                Start Your Journey
              </a>
            </div>
          </div>

          <div
            className="gameplay-pokemon-grid reveal reveal-delay-1"
            id="gpPokemonGrid"
          >
            {GAMEPLAY_POKEMON.map((p) => (
              <div
                key={p.id}
                className="gp-pokemon-card"
                data-name={p.name}
                title={p.name}
              >
                <model-viewer
                  src={`/assets/models/glb/regular/${parseInt(p.id, 10)}.glb`}
                  alt={p.name}
                  auto-rotate=""
                  rotation-per-second="25deg"
                  disable-zoom=""
                  disable-pan=""
                  loading="lazy"
                  style={{ width: "85%", height: "85%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <div
              className="nav-pokeball"
              style={{ width: "24px", height: "24px" }}
              aria-hidden="true"
            ></div>
            <span className="gradient-text">Pixelmon</span>
            <span
              style={{
                color: "var(--px-text-dim)",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Voxel Legends
            </span>
          </div>

          <ul className="footer-links">
            <li>
              <a href="#modes">Modes</a>
            </li>
            <li>
              <a href="#biomes">Biomes</a>
            </li>
            <li>
              <a href="#gameplay">How to Play</a>
            </li>
            <li>
              <a href="#play" onClick={handlePlayClick}>
                Play Now
              </a>
            </li>
          </ul>

          <div className="footer-copy">
            <p>&copy; 2025 Pixelmon Voxel Legends</p>
            <p style={{ marginTop: "4px" }}>
              Fan-made Pokemon game &middot; Not affiliated with Nintendo or
              Game Freak
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
