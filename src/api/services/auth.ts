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

/** Single demo OTP that always works in scenarios. Real apps would email it. */
export const DEMO_OTP = '123456';
const resetTokens = new Map<string, string>(); // resetToken -> email

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

export const PROFILE_BIO_MAX = 160;
export const PROFILE_NAME_MAX = 50;

export async function updateProfile(
  token: string | null,
  input: { displayName: string; bio: string },
): Promise<User> {
  await applyQaDelay();
  applyQaForcedError();
  if (!token) {
    throw new ApiClientError(401, { code: 'unauthorized', message: 'Sign in required.' });
  }
  const userId = mockState.sessions.get(token);
  const user = userId ? mockState.users.find((u) => u.id === userId) : undefined;
  if (!user) {
    throw new ApiClientError(401, { code: 'unauthorized', message: 'Session expired.' });
  }
  const displayName = input.displayName.trim();
  const bio = input.bio.trim();
  if (!displayName) {
    throw new ApiClientError(400, {
      code: 'invalid_displayName',
      message: 'Display name is required.',
    });
  }
  if (displayName.length > PROFILE_NAME_MAX) {
    throw new ApiClientError(400, {
      code: 'invalid_displayName',
      message: `Display name must be ≤ ${PROFILE_NAME_MAX} characters.`,
    });
  }
  if (bio.length > PROFILE_BIO_MAX) {
    throw new ApiClientError(400, {
      code: 'invalid_bio',
      message: `Bio must be ≤ ${PROFILE_BIO_MAX} characters.`,
    });
  }
  user.displayName = displayName;
  user.bio = bio || undefined;
  return stripPassword(user);
}

function stripPassword(user: { password: string } & User): User {
  const { password: _pw, ...publicUser } = user;
  return publicUser;
}

export async function forgotPassword(email: string): Promise<{ sent: boolean }> {
  await applyQaDelay();
  applyQaForcedError();
  // Privacy-first: always return success regardless of whether the user exists.
  return { sent: true };
}

export async function verifyOtp(input: {
  email: string;
  code: string;
}): Promise<{ resetToken: string }> {
  await applyQaDelay();
  applyQaForcedError();
  if (input.code !== DEMO_OTP) {
    throw new ApiClientError(400, {
      code: 'invalid_otp',
      message: 'That code is incorrect or expired.',
    });
  }
  let token = '';
  for (const [t, mail] of resetTokens) {
    if (mail === input.email.toLowerCase()) {
      token = t;
      break;
    }
  }
  if (!token) {
    token = `reset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    resetTokens.set(token, input.email.toLowerCase());
  }
  return { resetToken: token };
}

export async function resetPassword(input: {
  resetToken: string;
  newPassword: string;
}): Promise<{ ok: true }> {
  await applyQaDelay();
  applyQaForcedError();
  const email = resetTokens.get(input.resetToken);
  if (!email) {
    throw new ApiClientError(400, {
      code: 'invalid_reset_token',
      message: 'Reset session expired. Request a new code.',
    });
  }
  if (input.newPassword.length < 6) {
    throw new ApiClientError(400, {
      code: 'weak_password',
      message: 'Password must be at least 6 characters.',
    });
  }
  const user = mockState.users.find((u) => u.email.toLowerCase() === email);
  if (!user) {
    throw new ApiClientError(404, { code: 'not_found', message: 'No account found.' });
  }
  user.password = input.newPassword;
  resetTokens.delete(input.resetToken);
  return { ok: true };
}
