import { applyQaDelay, applyQaForcedError, ApiClientError } from '../client';
import { mockState } from '../../mocks/state';
import { now } from '../../state/qa';
import type { AppNotification } from '../types';

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

export async function listNotifications(token: string | null): Promise<AppNotification[]> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = requireUser(token);
  return mockState.notifications
    .filter((n) => n.userId === userId)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markNotificationRead(
  token: string | null,
  id: string,
): Promise<AppNotification> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = requireUser(token);
  const target = mockState.notifications.find((n) => n.id === id && n.userId === userId);
  if (!target) {
    throw new ApiClientError(404, { code: 'not_found', message: 'Notification not found.' });
  }
  if (!target.readAt) target.readAt = now().toISOString();
  return target;
}

export async function markAllNotificationsRead(token: string | null): Promise<void> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = requireUser(token);
  const stamp = now().toISOString();
  for (const n of mockState.notifications) {
    if (n.userId === userId && !n.readAt) n.readAt = stamp;
  }
}
