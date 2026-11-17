import { useId } from 'react';

import type { InputProps } from './Input.types';

export function Input({
  label,
  srOnly = false,
  inputType = 'text',
  error,
  invalid = false,
  handleChange,
  id,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="form-field">
      <label className={srOnly ? 'form-label sr-only' : 'form-label'} htmlFor={inputId}>
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        className={className ? `form-input ${className}` : 'form-input'}
        type={inputType}
        onChange={handleChange}
        aria-invalid={error || invalid ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
