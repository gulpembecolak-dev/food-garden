import './ui.css';

export default function Card({ as: Tag = 'section', variant = 'surface', padding = 'md', className = '', children, ...rest }) {
  const cls = ['ui-card', `ui-card--${variant}`, `ui-card--p-${padding}`, className].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <header className="ui-card__head">
      <div>
        <h3 className="ui-card__title">{title}</h3>
        {subtitle && <p className="ui-card__sub">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
