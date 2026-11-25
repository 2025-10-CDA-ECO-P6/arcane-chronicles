'use client';

import type { SearchBarProps } from './SearchBar.types';

import { Button } from '@/components/lib/Button/Button';
import { Input } from '@/components/lib/form/Input/Input';

import { useSearchBar } from '@/hooks/useSearchBar';
import { getOtherParams, getParam } from '@/lib/searchParams';
import styles from './SearchBar.module.scss';

export function SearchBar({
  label,
  name,
  pathname,
  params,
  placeholder,
  className,
}: SearchBarProps) {
  const currentSearch = getParam(params, name);
  const { isExpanded, containerRef, openOnFirstClick, closeOnEscape } = useSearchBar(
    Boolean(currentSearch),
  );

  const classes = [styles['search-bar'], isExpanded && styles['search-bar--open'], className]
    .filter(Boolean)
    .join(' ');
  const keptParams = getOtherParams(params, name);

  return (
    <search
      ref={containerRef}
      className={classes}
      data-open={isExpanded || undefined}
      onKeyDown={closeOnEscape}
    >
      <form action={pathname} className={styles['search-bar__form']}>
        <Input
          label={label}
          srOnly
          inputType="search"
          name={name}
          defaultValue={currentSearch}
          placeholder={placeholder}
          className={styles['search-bar__input']}
        />
        {keptParams.map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <Button
          color="primary"
          buttonType="submit"
          icon="search-sharp"
          iconOnly
          buttonText="Rechercher"
          className={styles['search-bar__button']}
          handleClick={openOnFirstClick}
        />
      </form>
    </search>
  );
}
