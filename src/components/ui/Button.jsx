import './ui.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className = '',
  children,
  ...rest
}) {
  const cls = ['ui-btn', `ui-btn--${variant}`, `ui-btn--${size}`, className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {iconLeft && <span className="ui-btn__icon">{iconLeft}</span>}
      <span className="ui-btn__label">{children}</span>
      {iconRight && <span className="ui-btn__icon">{iconRight}</span>}
    </button>
  );
}
