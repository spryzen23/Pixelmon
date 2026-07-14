export function Button({
  variant = 'default',
  sm = false,
  className = '',
  type = 'button',
  ...props
}) {
  const cls = [
    'btn',
    variant === 'primary' ? 'primary' : '',
    variant === 'ghost' ? 'ghost' : '',
    variant === 'danger' ? 'danger' : '',
    variant === 'secondary' ? '' : '',
    sm ? 'sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={cls} {...props} />;
}
