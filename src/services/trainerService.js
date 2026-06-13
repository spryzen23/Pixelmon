import { api } from '../api';

export async function fetchTrainer(trainerId) {
  return api.getPlayer(trainerId);
}

export async function createTrainer(userId, trainer) {
  const user = await api.getPlayer(userId);
  const nextTrainers = [...(user.trainers || []), trainer];
  return api.patchPlayer(userId, { trainers: nextTrainers });
}

export async function patchTrainer(trainerId, data) {
  return api.patchPlayer(trainerId, data);
}
