import { Router } from 'express';
import { startNewBattle, makeChoice } from '../services/battleService.js';

export const battleRouter = Router();

// Endpoint to start a new Showdown-simulated battle
battleRouter.post('/start', (req, res, next) => {
  try {
    const { team, difficulty, weather } = req.body;
    const result = startNewBattle({ team, difficulty, weather });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

// Endpoint to execute a turn choice (move, switch, or item)
battleRouter.post('/choice', (req, res, next) => {
  try {
    const { battleId, choice } = req.body;
    if (!battleId || !choice) {
      return res.status(400).json({ error: 'battleId and choice are required' });
    }
    const result = makeChoice(battleId, choice);
    res.json(result);
  } catch (e) {
    next(e);
  }
});
