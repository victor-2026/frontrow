import { byId, waitForId, tapId, typeIntoId } from './helpers';

describe('Login', () => {
  it('signs in with the demo account', async () => {
    await waitForId('screen.events');

    await byId('tab.profile').click();

    await tapId('profile.signInButton');
    await typeIntoId('login.emailInput', 'demo@frontrow.app');
    await typeIntoId('login.passwordInput', 'demo1234');
    await tapId('login.submitButton');

    await waitForId('profile.signOutButton');
  });
});
