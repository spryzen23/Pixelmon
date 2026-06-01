import { render, screen } from '@testing-library/react';
import App from './App.jsx';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => {
    const React = require('react');
    const renderableChildren = React.Children.toArray(children).filter(
      (child) => typeof child.type !== 'string'
    );

    return <div data-testid="game-canvas">{renderableChildren}</div>;
  },
}));

jest.mock('./components/GameScene', () => function MockGameScene() {
  return <div data-testid="game-scene" />;
});

test('renders the 3D game shell', () => {
  render(<App />);

  expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
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
