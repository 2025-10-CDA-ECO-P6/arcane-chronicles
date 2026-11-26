import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArcaneProvider, useArcane } from './ArcaneContext';

const user = { id: '1', displayName: 'Maître Ying', email: 'mj@example.com', avatarUrl: null };
let handleUser: ReturnType<typeof useArcane>['handleUser'];

function SessionProbe() {
  const context = useArcane();
  handleUser = context.handleUser;
  return <p>{context.isAuthenticated ? context.currentUser?.displayName : 'guest'}</p>;
}

describe('ArcaneProvider', () => {
  it('starts with the user sent by the server', () => {
    render(
      <ArcaneProvider initialUser={user}>
        <SessionProbe />
      </ArcaneProvider>,
    );

    expect(screen.getByText('Maître Ying')).toBeInTheDocument();
  });

  it('updates the user on login and logout', () => {
    render(
      <ArcaneProvider initialUser={null}>
        <SessionProbe />
      </ArcaneProvider>,
    );

    act(() => handleUser(user));
    expect(screen.getByText('Maître Ying')).toBeInTheDocument();

    act(() => handleUser(null));
    expect(screen.getByText('guest')).toBeInTheDocument();
  });

  it('follows a new user sent by the server after a refresh', () => {
    const { rerender } = render(
      <ArcaneProvider initialUser={user}>
        <SessionProbe />
      </ArcaneProvider>,
    );

    rerender(
      <ArcaneProvider initialUser={null}>
        <SessionProbe />
      </ArcaneProvider>,
    );

    expect(screen.getByText('guest')).toBeInTheDocument();
  });
});
