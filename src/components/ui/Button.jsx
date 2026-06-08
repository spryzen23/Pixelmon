export function Button({ variant = 'default', className = '', ...props }) {
  const cls = ['btn', variant === 'primary' ? 'primary' : '', className].filter(Boolean).join(' ');
  return <button type="button" className={cls} {...props} />;
}
