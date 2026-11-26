import Image from 'next/image';

import type { SidebarProfileProps } from './SidebarProfile.types';

import { getInitial } from '@/lib/format';
import styles from './SidebarProfile.module.scss';

export function SidebarProfile({ user, campaignCount, inProgressCount }: SidebarProfileProps) {
  return (
    <div className={styles['sidebar-profile']}>
      <div className={styles['sidebar-profile__avatar']}>
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt="" width={74} height={74} unoptimized />
        ) : (
          <span aria-hidden>{getInitial(user.displayName)}</span>
        )}
      </div>
      <div className={styles['sidebar-profile__info']}>
        <p className={styles['sidebar-profile__name']}>{user.displayName}</p>
        <p>Campagnes&nbsp;: {campaignCount}</p>
        <p>En cours&nbsp;: {inProgressCount}</p>
      </div>
    </div>
  );
}
