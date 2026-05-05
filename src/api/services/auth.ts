import { applyQaDelay, applyQaForcedError, ApiClientError } from '../client';
import { mockState } from '../../mocks/state';
import type { AuthResponse, User } from '../types';

let tokenCounter = 0;
function issueToken(userId: string): string {
  tokenCounter += 1;
  const token = `mock_${userId}_${tokenCounter}`;
  mockState.sessions.set(token, userId);
  return token;
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  await applyQaDelay();
  applyQaForcedError();
  const user = mockState.users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password,
  );
  if (!user) {
    throw new ApiClientError(401, {
      code: 'invalid_credentials',
      message: 'Email or password is incorrect.',
    });
  }
  if (user.locked) {
    throw new ApiClientError(423, { code: 'account_locked', message: 'This account is locked.' });
  }
  const token = issueToken(user.id);
  return { token, user: stripPassword(user) };
}

export async function logout(token: string | null): Promise<void> {
  await applyQaDelay();
  applyQaForcedError();
  if (token) mockState.sessions.delete(token);
}

export async function getMe(token: string): Promise<User> {
  await applyQaDelay();
  applyQaForcedError();
  const userId = mockState.sessions.get(token);
  const user = userId ? mockState.users.find((u) => u.id === userId) : undefined;
  if (!user) {
    throw new ApiClientError(401, { code: 'unauthorized', message: 'Not signed in.' });
  }
  return stripPassword(user);
}

function stripPassword(user: { password: string } & User): User {
  const { password: _pw, ...publicUser } = user;
  return publicUser;
}
