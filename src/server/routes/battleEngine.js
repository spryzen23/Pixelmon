import { Router } from 'express';
import {
  battleEngineCatalog,
  createBattleEngineSession,
  getBattleEngineSession,
  submitBattleEngineChoice,
} from '../services/battleEngineService.js';

export const battleEngineRouter = Router();

battleEngineRouter.post('/sessions', (req, res, next) => {
  try {
    res.status(201).json(createBattleEngineSession(req.body));
  } catch (error) {
    next(error);
  }
});

battleEngineRouter.get('/sessions/:battleId', (req, res, next) => {
  try {
    res.json(getBattleEngineSession(req.params.battleId));
  } catch (error) {
    next(error);
  }
});

battleEngineRouter.post('/sessions/:battleId/choices', (req, res, next) => {
  try {
    const { side = 'p1', choice } = req.body || {};
    res.json(submitBattleEngineChoice(req.params.battleId, side, choice));
  } catch (error) {
    next(error);
  }
});

battleEngineRouter.get('/catalog/moves/:id', (req, res) => {
  const record = battleEngineCatalog.getMove(req.params.id);
  if (!record) return res.status(404).json({ error: 'Move not found' });
  return res.json(record);
});

battleEngineRouter.get('/catalog/abilities/:id', (req, res) => {
  const record = battleEngineCatalog.getAbility(req.params.id);
  if (!record) return res.status(404).json({ error: 'Ability not found' });
  return res.json(record);
});

battleEngineRouter.get('/catalog/items/:id', (req, res) => {
  const record = battleEngineCatalog.getItem(req.params.id);
  if (!record) return res.status(404).json({ error: 'Item not found' });
  return res.json(record);
});
