import type { ChangeEventHandler, InputHTMLAttributes } from 'react';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  label: string;
  srOnly?: boolean;
  inputType?: InputType;
  error?: string;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
}
