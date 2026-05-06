import { applyQaDelay, applyQaForcedError, ApiClientError } from '../client';
import { mockState } from '../../mocks/state';

function requireUser(token: string | null): string {
  if (!token) {
    throw new ApiClientError(401, { code: 'unauthorized', message: 'Sign in required.' });
  }
  const userId = mockState.sessions.get(token);
  if (!userId) {
    throw new ApiClientError(401, { code: 'unauthorized', message: 'Session expired.' });
  }
  return userId;
}

function bucket(userId: string): Set<string> {
  let s = mockState.favorites.get(userId);
  if (!s) {
    s = new Set();
    mockState.favorites.set(userId, s);
  }
  return s;
}

export async function listFavoriteEventIds(token: string | null): Promise<string[]> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = requireUser(token);
  return [...bucket(userId)];
}

export async function addFavorite(token: string | null, eventId: string): Promise<void> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = requireUser(token);
  if (!mockState.events.some((e) => e.id === eventId)) {
    throw new ApiClientError(404, { code: 'not_found', message: 'Event not found.' });
  }
  bucket(userId).add(eventId);
}

export async function removeFavorite(token: string | null, eventId: string): Promise<void> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = requireUser(token);
  bucket(userId).delete(eventId);
}
