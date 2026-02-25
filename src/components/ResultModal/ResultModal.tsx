import { AlertTriangle, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Ticket } from "../../types/types";
import "./ResultModal.scss";

interface ResultModalProps {
  isOpen: boolean;
  result: {
    status: "success" | "warning" | "error";
    ticket: Ticket | null;
    message: string;
    subMessage?: string;
  } | null;
  onClose: () => void;
  onScanNext?: () => void;
}

export function ResultModal({
  isOpen,
  result,
  onClose,
  onScanNext,
}: ResultModalProps) {
  if (!result) return null;

  const { status, ticket, message, subMessage } = result;

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="result-modal__icon" />;
      case "warning":
        return <XCircle className="result-modal__icon" />;
      case "error":
        return <AlertTriangle className="result-modal__icon" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="result-modal">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="result-modal__backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`result-modal__content result-modal__content--${status}`}
          >
            {/* Header/Status Indicator */}
            <div
              className={`result-modal__header result-modal__header--${status}`}
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                {getIcon()}
              </motion.div>
              <h2 className="result-modal__message">{message}</h2>
            </div>

            {/* Ticket Info Content */}
            <div className="result-modal__body">
              {status === "success" && ticket ? (
                <div className="result-modal__ticket">
                  <div className="result-modal__ticket-card">
                    <p className="result-modal__label">Phòng chiếu</p>
                    <p className="result-modal__room">{ticket.room}</p>

                    <div className="result-modal__divider" />

                    <p className="result-modal__label">Ghế ngồi</p>
                    <p className="result-modal__seats">
                      {ticket.seats.join(", ")}
                    </p>
                  </div>

                  <div className="result-modal__movie-info">
                    <p className="result-modal__movie-title">
                      {ticket.movieTitle}
                    </p>
                    <p className="result-modal__showtime">
                      Suất chiếu: {ticket.showtime}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="result-modal__error">
                  <p className="result-modal__error-message">{subMessage}</p>
                  {status === "warning" && ticket?.checkInTime && (
                    <div className="result-modal__warning-box">
                      <p className="result-modal__warning-label">
                        Thời gian check-in trước đó:
                      </p>
                      <p className="result-modal__warning-time">
                        {ticket.checkInTime}
                      </p>
                    </div>
                  )}
                  {status === "error" && ticket && (
                    <div className="result-modal__ticket-details">
                      <div className="result-modal__detail-item">
                        <span className="result-modal__detail-label">
                          Mã vé:
                        </span>
                        <span className="result-modal__detail-value">
                          {ticket.code}
                        </span>
                      </div>
                      <div className="result-modal__detail-item">
                        <span className="result-modal__detail-label">
                          Phim:
                        </span>
                        <span className="result-modal__detail-value">
                          {ticket.movieTitle}
                        </span>
                      </div>
                      <div className="result-modal__detail-item">
                        <span className="result-modal__detail-label">
                          Room:
                        </span>
                        <span className="result-modal__detail-value">
                          {ticket.room}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="result-modal__actions">
              <button
                onClick={onClose}
                className="result-modal__button result-modal__button--secondary"
              >
                Đóng
              </button>
              {onScanNext && (
                <button
                  onClick={onScanNext}
                  className={`result-modal__button result-modal__button--primary result-modal__button--${status}`}
                >
                  Quét tiếp
                  <ArrowRight className="result-modal__button-icon" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
