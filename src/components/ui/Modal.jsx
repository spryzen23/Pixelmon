import { useEffect } from "react";
import { Button } from "./Button";

export function Modal({ open, title, children, onClose, actions }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="px-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="px-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "px-modal-title" : undefined}
      >
        {title && (
          <h2 className="px-modal-title" id="px-modal-title">
            {title}
          </h2>
        )}
        <div className="px-modal-body">{children}</div>
        <div className="px-modal-actions">
          {actions ?? <Button onClick={onClose}>Close</Button>}
        </div>
      </div>
    </div>
  );
}
