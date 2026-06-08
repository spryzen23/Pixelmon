import { TextField } from './TextField';

export function PasswordField({ label = 'Password', ...props }) {
  return <TextField label={label} type="password" autoComplete="current-password" {...props} />;
}
