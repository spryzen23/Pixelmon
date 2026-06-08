import { Button } from './Button';

export function EmptyState({ icon, message, actionLabel, onAction }) {
  return (
    <div className="px-empty-state">
      {icon && <span className="px-empty-state-icon">{icon}</span>}
      <p>{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
