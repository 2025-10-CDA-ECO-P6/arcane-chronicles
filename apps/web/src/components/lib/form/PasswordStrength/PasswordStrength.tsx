import { ProgressBar } from '@/components/lib/ui/ProgressBar/ProgressBar';
import { Toggletip } from '@/components/lib/ui/Toggletip/Toggletip';
import { checkPasswordRules } from '@/lib/passwordRules';

import styles from './PasswordStrength.module.scss';
import type { PasswordStrengthProps } from './PasswordStrength.types';

export function PasswordStrength({ password, rulesId }: PasswordStrengthProps) {
  const rules = checkPasswordRules(password);
  const metCount = rules.filter((rule) => rule.isMet).length;
  const missingLabels = rules.filter((rule) => !rule.isMet).map((rule) => rule.label);

  return (
    <div className={styles.strength}>
      <ProgressBar
        value={metCount}
        max={rules.length}
        color="hostile"
        completeColor="primary"
        className={styles.strength__bar}
      />
      <Toggletip label="Règles du mot de passe" placement="top">
        <ul className={styles.strength__rules}>
          {rules.map(({ label, isMet }) => (
            <li
              key={label}
              className={[
                styles.strength__rules__item,
                isMet && styles['strength__rules__item--met'],
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span aria-hidden="true">{isMet ? '✓' : '✗'}</span>
              {label}
              <span className="sr-only">{isMet ? ' : respectée' : ' : non respectée'}</span>
            </li>
          ))}
        </ul>
      </Toggletip>
      <p id={rulesId} className="sr-only">
        {missingLabels.length > 0
          ? `Règles à respecter : ${missingLabels.join(', ')}.`
          : 'Toutes les règles du mot de passe sont respectées.'}
      </p>
    </div>
  );
}
