import { applyQaDelay, applyQaForcedError, ApiClientError } from '../client';
import { mockState } from '../../mocks/state';
import type { Event } from '../types';

export type EventFilters = {
  q?: string;
  genre?: string;
};

export async function listEvents(filters: EventFilters = {}): Promise<Event[]> {
  await applyQaDelay();
  applyQaForcedError();
  const q = filters.q?.toLowerCase();
  const genre = filters.genre?.toLowerCase();
  let results = [...mockState.events];
  if (q) {
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.venue.city.toLowerCase().includes(q),
    );
  }
  if (genre) {
    results = results.filter((e) => e.genre.toLowerCase() === genre);
  }
  return results;
}

export async function getEvent(id: string): Promise<Event> {
  await applyQaDelay();
  applyQaForcedError();
  const event = mockState.events.find((e) => e.id === id);
  if (!event) {
    throw new ApiClientError(404, { code: 'not_found', message: `Event ${id} not found.` });
  }
  return event;
}
