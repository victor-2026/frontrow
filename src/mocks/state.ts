import { seed } from './seed';
import type { Event, Ticket, User } from '../api/types';

type SeedUser = User & { password: string };

/**
 * In-memory state for the mock backend. Survives a session, gets re-seeded
 * by the QA Debug Menu via `applyScenario`.
 */
export const mockState = {
  events: [...seed.events] as Event[],
  users: [...seed.users] as SeedUser[],
  tickets: [...seed.tickets] as Ticket[],
  sessions: new Map<string, string>(), // token -> userId
};

export function resetMockState(): void {
  mockState.events = [...seed.events];
  mockState.users = [...seed.users];
  mockState.tickets = [...seed.tickets];
  mockState.sessions = new Map();
}
