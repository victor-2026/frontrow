import { http, HttpResponse } from 'msw';

import { endpoints } from '../../api/endpoints';
import type { AuthResponse } from '../../api/types';
import { mockState } from '../state';

let tokenCounter = 0;
function issueToken(userId: string): string {
  tokenCounter += 1;
  const token = `mock_token_${userId}_${tokenCounter}`;
  mockState.sessions.set(token, userId);
  return token;
}

export const authHandlers = [
  http.post(endpoints.auth.login(), async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockState.users.find(
      (u) => u.email.toLowerCase() === body.email.toLowerCase() && u.password === body.password,
    );
    if (!user) {
      return HttpResponse.json(
        { code: 'invalid_credentials', message: 'Email or password is incorrect.' },
        { status: 401 },
      );
    }
    if (user.locked) {
      return HttpResponse.json(
        { code: 'account_locked', message: 'This account is locked.' },
        { status: 423 },
      );
    }
    const token = issueToken(user.id);
    const { password: _pw, ...publicUser } = user;
    const res: AuthResponse = { token, user: publicUser };
    return HttpResponse.json(res);
  }),

  http.post(endpoints.auth.logout(), ({ request }) => {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
    if (token) mockState.sessions.delete(token);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(endpoints.auth.me(), ({ request }) => {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
    const userId = token ? mockState.sessions.get(token) : undefined;
    const user = userId ? mockState.users.find((u) => u.id === userId) : undefined;
    if (!user) {
      return HttpResponse.json(
        { code: 'unauthorized', message: 'Not signed in.' },
        { status: 401 },
      );
    }
    const { password: _pw, ...publicUser } = user;
    return HttpResponse.json(publicUser);
  }),
];
