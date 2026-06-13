import { act, fireEvent, render, screen } from '@testing-library/react';
import { io as mockSocketIo } from 'socket.io-client';
import App from './app/App.jsx';

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => {
    const React = require('react');
    const renderableChildren = React.Children.toArray(children).filter(
      (child) => typeof child.type !== 'string'
    );

    return <div data-testid="game-canvas">{renderableChildren}</div>;
  },
}));

jest.mock('@react-three/drei', () => ({
  PointerLockControls: () => <div data-testid="pointer-lock-controls" />,
  Sky: () => <div data-testid="sky" />,
}));

jest.mock('./environment/Atmosphere', () => ({
  __esModule: true,
  default: () => <div data-testid="atmosphere" />,
  SUN_POSITION: [80, 35, -120],
}));

jest.mock('./scenes/normal/GameScene', () => function MockGameScene() {
  return <div data-testid="game-scene" />;
});

jest.mock('./scenes/battleRoyale/BattleRoyaleArena', () => function MockBattleRoyaleArena() {
  return <div data-testid="battle-royale-arena" />;
});

jest.mock('./scenes/battleRoyale/BattleRoyaleDropScene', () => function MockBattleRoyaleDropScene() {
  return <div data-testid="battle-royale-drop-scene" />;
});

beforeEach(() => {
  const handlers = {};
  const socket = {
    id: 'socket-1',
    connected: false,
    connect: jest.fn(() => {
      socket.connected = true;
      handlers.connect?.();
    }),
    disconnect: jest.fn(() => {
      socket.connected = false;
    }),
    emit: jest.fn((event, payload, callback) => {
      if (event === 'createRoom') {
        callback?.(null, {
          ok: true,
          room: {
            biomeId: payload.biomeId,
            code: 'BR123',
            countdownRemaining: 0,
            creatures: [],
            dropRemaining: 0,
            hostId: 'socket-1',
            matchRemaining: 0,
            phase: 'lobby',
            players: [
              {
                dropPointId: payload.dropPointId,
                id: 'socket-1',
                isReady: payload.isReady,
                name: payload.playerName,
                score: 0,
              },
            ],
            winnerIds: [],
          },
        });
      }
    }),
    on: jest.fn((event, handler) => {
      handlers[event] = handler;
    }),
    timeout: jest.fn(() => socket),
  };

  global.__mockBattleRoyaleSocket = socket;
  global.__mockBattleRoyaleHandlers = handlers;
  mockSocketIo.mockImplementation(() => socket);
});

test('renders the mode selector first', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /choose game mode/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /normal mode/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /battle royale/i })).toBeInTheDocument();
  expect(screen.queryByTestId('game-canvas')).not.toBeInTheDocument();
});

test('clicking Normal Mode renders the existing game shell', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /normal mode/i }));

  expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
  expect(screen.getByTestId('pointer-lock-controls')).toBeInTheDocument();
  expect(screen.getByTestId('game-scene')).toBeInTheDocument();
  expect(screen.getByText(/voxel legends prototype/i)).toBeInTheDocument();
  expect(screen.getByText(/move with wasd or arrow keys/i)).toBeInTheDocument();
  expect(screen.getByText(/recall\/send companion with e/i)).toBeInTheDocument();
  expect(screen.getByText(/throw with spacebar/i)).toBeInTheDocument();
  expect(screen.getByText(/adjust power with q\/r or mouse wheel/i)).toBeInTheDocument();
  expect(screen.getByText(/power: 33%/i)).toBeInTheDocument();
  expect(screen.getAllByText(/standard ball/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/great ball/i)).toBeInTheDocument();
  expect(screen.getByText(/ultra ball/i)).toBeInTheDocument();
  expect(screen.getByText(/creatures caught: 0/i)).toBeInTheDocument();
});

test('clicking Battle Royale renders the lobby shell', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /battle royale/i }));

  expect(screen.getByTestId('battle-royale-shell')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /battle royale lobby/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/player name/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create room/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /join room/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /drop location/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /mark ready/i })).toBeInTheDocument();
  expect(screen.queryByTestId('game-canvas')).not.toBeInTheDocument();
});

test('creating a Battle Royale room syncs room and player state', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /battle royale/i }));
  fireEvent.change(screen.getByLabelText(/player name/i), {
    target: { value: 'Ash' },
  });
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

  const mockSocket = global.__mockBattleRoyaleSocket;

  expect(mockSocket.connect).toHaveBeenCalled();
  expect(mockSocket.emit).toHaveBeenCalledWith(
    'createRoom',
    expect.objectContaining({
      playerName: 'Ash',
    }),
    expect.any(Function)
  );
  expect(screen.getByText(/server: connected/i)).toBeInTheDocument();
  expect(screen.getByText(/BR123/i)).toBeInTheDocument();
  expect(screen.getByText('Ash')).toBeInTheDocument();
});

test('Battle Royale room phase changes render countdown, flyover, and match views', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /battle royale/i }));
  fireEvent.change(screen.getByLabelText(/player name/i), {
    target: { value: 'Ash' },
  });
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

  act(() => {
    global.__mockBattleRoyaleHandlers.roomUpdated({
      biomeId: 0,
      code: 'BR123',
      countdownRemaining: 5,
      creatures: [],
      dropRemaining: 0,
      hostId: 'socket-1',
      matchRemaining: 0,
      phase: 'countdown',
      players: [
        {
          dropPointId: 'center-ruins',
          id: 'socket-1',
          isReady: true,
          name: 'Ash',
          score: 0,
        },
        {
          dropPointId: 'north-ridge',
          id: 'socket-2',
          isReady: true,
          name: 'Misty',
          score: 0,
        },
      ],
      winnerIds: [],
    });
  });

  expect(screen.getByTestId('battle-royale-match')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /dropping in 5/i })).toBeInTheDocument();

  act(() => {
    global.__mockBattleRoyaleHandlers.roomUpdated({
      biomeId: 0,
      code: 'BR123',
      countdownRemaining: 0,
      creatures: [],
      dropRemaining: 7,
      hostId: 'socket-1',
      matchRemaining: 0,
      phase: 'dropping',
      players: [
        {
          dropPointId: 'center-ruins',
          id: 'socket-1',
          isReady: true,
          name: 'Ash',
          score: 0,
        },
        {
          dropPointId: 'north-ridge',
          id: 'socket-2',
          isReady: true,
          name: 'Misty',
          score: 0,
        },
      ],
      winnerIds: [],
    });
  });

  expect(screen.getByRole('heading', { name: /flying over drop zone/i })).toBeInTheDocument();
  expect(screen.getByTestId('battle-royale-drop-scene')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();

  act(() => {
    global.__mockBattleRoyaleHandlers.roomUpdated({
      biomeId: 0,
      code: 'BR123',
      countdownRemaining: 0,
      creatures: [],
      dropRemaining: 0,
      hostId: 'socket-1',
      matchRemaining: 120,
      phase: 'playing',
      players: [
        {
          dropPointId: 'center-ruins',
          id: 'socket-1',
          isReady: true,
          name: 'Ash',
          score: 1,
        },
        {
          dropPointId: 'north-ridge',
          id: 'socket-2',
          isReady: true,
          name: 'Misty',
          score: 0,
        },
      ],
      winnerIds: [],
    });
  });

  expect(screen.getByRole('heading', { name: /catch race live/i })).toBeInTheDocument();
  expect(screen.getByTestId('battle-royale-arena')).toBeInTheDocument();
  expect(screen.getByText('2:00')).toBeInTheDocument();
  expect(screen.getByText(/1 catches/i)).toBeInTheDocument();
});

test('Battle Royale shows fallback countdown when all players are ready in lobby', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /battle royale/i }));
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

  act(() => {
    global.__mockBattleRoyaleHandlers.roomUpdated({
      biomeId: 0,
      code: 'BR123',
      countdownRemaining: 0,
      creatures: [],
      dropRemaining: 0,
      hostId: 'socket-1',
      matchRemaining: 0,
      phase: 'lobby',
      players: [
        {
          dropPointId: 'center-ruins',
          id: 'socket-1',
          isReady: true,
          name: 'Ash',
          score: 0,
        },
        {
          dropPointId: 'north-ridge',
          id: 'socket-2',
          isReady: true,
          name: 'Misty',
          score: 0,
        },
      ],
      winnerIds: [],
    });
  });

  expect(screen.getByRole('heading', { name: /dropping in 5/i })).toBeInTheDocument();
  expect(global.__mockBattleRoyaleSocket.emit).toHaveBeenCalledWith(
    'requestCountdownStart',
    { roomCode: 'BR123' }
  );
});
