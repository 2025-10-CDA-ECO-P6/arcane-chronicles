import type { CampaignSummary } from '@arcane-chronicles/shared';
import type { QuantityLabels } from '@/lib/format';
import type { CampaignCountsProps } from './CampaignCounts.types';

import { formatQuantity } from '@/lib/format';
import styles from './CampaignCounts.module.scss';

interface CountDisplay extends QuantityLabels {
  name: keyof CampaignSummary['counts'];
  icon: string;
}

const COUNTS: CountDisplay[] = [
  {
    name: 'chapters',
    singular: 'chapitre',
    plural: 'chapitres',
    none: 'Aucun',
    icon: 'book-outline',
  },
  { name: 'quests', singular: 'quête', plural: 'quêtes', none: 'Aucune', icon: 'debian' },
  {
    name: 'sessions',
    singular: 'session',
    plural: 'sessions',
    none: 'Aucune',
    icon: 'refresh-line',
  },
  { name: 'heroes', singular: 'héros', plural: 'héros', none: 'Aucun', icon: 'theatre' },
];

export function CampaignCounts({ counts }: CampaignCountsProps) {
  return (
    <ul className={styles['campaign-counts']}>
      {COUNTS.map((count) => (
        <li key={count.name} className={`${styles['campaign-counts__item']} icon--${count.icon}`}>
          {formatQuantity(counts[count.name], count)}
        </li>
      ))}
    </ul>
  );
}
