import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrainerColumn } from '../battle/TrainerColumn';
import { vi, describe, it, expect } from 'vitest';

describe('TrainerColumn Component', () => {
  const defaultProps = {
    winner: null,
    bagOpen: false,
    setBagOpen: vi.fn(),
    items: { potions: 5, fullRestores: 2 },
    handleUseItem: vi.fn(),
    playerTeam: [
      { name: 'Pikachu', displayName: 'Pikachu', currentHp: 100, maxHp: 100, species: 'Pikachu' }
    ],
    activeRequest: null,
    playerSlots: [0],
    currentFormat: { guide: { title: 'Test Format', tips: ['Tip 1'] } },
    setShowCalc: vi.fn(),
    setStage: vi.fn(),
  };

  it('renders the Trainer card by default', () => {
    render(<TrainerColumn {...defaultProps} />);
    expect(screen.getByAltText('Trainer Red')).toBeInTheDocument();
    expect(screen.getByText('🎒 Items (7 left)')).toBeInTheDocument();
  });

  it('calls setBagOpen(true) when Items button is clicked', () => {
    render(<TrainerColumn {...defaultProps} />);
    const itemsBtn = screen.getByText(/Items \(\d+ left\)/);
    fireEvent.click(itemsBtn);
    expect(defaultProps.setBagOpen).toHaveBeenCalledWith(true);
  });

  it('renders the Bag UI when bagOpen is true', () => {
    render(<TrainerColumn {...defaultProps} bagOpen={true} />);
    expect(screen.getByText('Items Bag')).toBeInTheDocument();
    expect(screen.getByText(/Potion ×5/)).toBeInTheDocument();
    expect(screen.getByText(/Full Restore ×2/)).toBeInTheDocument();
  });

  it('calls handleUseItem with correct arguments when an item is clicked', () => {
    render(<TrainerColumn {...defaultProps} bagOpen={true} />);
    const potionBtn = screen.getByText(/Potion ×5/);
    fireEvent.click(potionBtn);
    expect(defaultProps.handleUseItem).toHaveBeenCalledWith('potion');
  });

  it('calls setBagOpen(false) when Cancel is clicked', () => {
    render(<TrainerColumn {...defaultProps} bagOpen={true} />);
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(defaultProps.setBagOpen).toHaveBeenCalledWith(false);
  });
});
