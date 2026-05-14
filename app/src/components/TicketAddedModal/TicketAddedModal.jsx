import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TicketAddedModal.css";

export default function TicketAddedModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      modalRef.current?.querySelectorAll(focusableSelector) || [],
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="ticket-modal-backdrop"
      onMouseDown={(modalEvent) => {
        if (modalEvent.target === modalEvent.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="ticket-modal panel-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
        ref={modalRef}
      >
        <button
          type="button"
          className="ticket-modal-close"
          onClick={onClose}
          aria-label="Close ticket confirmation"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        <div className="ticket-modal-copy">
          <h2 id="ticket-modal-title">Ticket added to cart</h2>
          <p>Your ticket selection is saved in your cart.</p>
        </div>

        <div className="ticket-modal-actions">
          <button
            type="button"
            className="event-detail-button secondary-button"
            onClick={onClose}
          >
            Find more events
          </button>
          <button
            type="button"
            className="event-detail-button primary-button"
            onClick={() => navigate("/cart")}
          >
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}
