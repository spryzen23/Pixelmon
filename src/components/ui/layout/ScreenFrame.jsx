export function ScreenFrame({
  header,
  footer,
  children,
  className = '',
  wide = false,
}) {
  const cls = [
    'px-frame',
    'screen',
    wide ? 'px-frame-wide' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {header != null && <header className="px-frame-header">{header}</header>}
      <main className="px-frame-body">{children}</main>
      {footer != null && <footer className="px-frame-footer">{footer}</footer>}
    </div>
  );
}

export function ScreenHeader({ eyebrow, title, subtitle, actions, className = '' }) {
  return (
    <div className={`px-screen-header ${className}`}>
      <div className="px-screen-header-text">
        {eyebrow && <p className="px-screen-eyebrow">{eyebrow}</p>}
        {title && <h1 className="px-screen-title">{title}</h1>}
        {subtitle && <p className="px-screen-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="px-screen-header-actions">{actions}</div>}
    </div>
  );
}

export function ScreenFooter({ children, className = '' }) {
  return <div className={`px-screen-footer btn-row ${className}`}>{children}</div>;
}
