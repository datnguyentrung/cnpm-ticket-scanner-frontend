import type { ShowtimeResponse } from "@/types/types";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { formatTimeHM } from "../../utils/format";
import "./ShiftOverview.scss";

interface ShiftOverviewProps {
  showtime: ShowtimeResponse;
}

export default function ShiftOverview({ showtime }: ShiftOverviewProps) {
  const [progress, setProgress] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const start = new Date(showtime.startTime);
      const end = new Date(showtime.endTime);

      // Calculate progress percentage
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      const progressPercent = Math.max(
        0,
        Math.min(100, (elapsed / totalDuration) * 100),
      );

      // Calculate remaining minutes
      const remaining = Math.max(
        0,
        Math.ceil((end.getTime() - now.getTime()) / (1000 * 60)),
      );

      setProgress(Math.round(progressPercent));
      setRemainingMinutes(remaining);
    };

    // Calculate immediately
    calculateProgress();

    // Update every minute
    const interval = setInterval(calculateProgress, 60000);

    return () => clearInterval(interval);
  }, [showtime.startTime, showtime.endTime]);

  const getStatus = () => {
    const now = new Date().toISOString();
    if (showtime.startTime > now) return "upcoming";
    if (showtime.endTime < now) return "ended";
    return "live";
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="shift-overview"
    >
      <div className="shift-overview__header">
        <h2 className="shift-overview__title">Shift Overview</h2>
        <span
          className={`shift-overview__badge shift-overview__badge--${status}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="shift-overview__grid">
        <div className="shift-overview__left">
          <div className="shift-overview__movie-info">
            <p className="shift-overview__label">Movie</p>
            <h3 className="shift-overview__movie-title">
              {showtime.movieResponse.title}
            </h3>
            <p className="shift-overview__movie-room">
              <span className="shift-overview__room-indicator" />{" "}
              {`Room: ${showtime.roomResponse.roomName} - ${showtime.roomResponse.type}`}
            </p>
          </div>
          <div>
            <p className="shift-overview__label">Age Rating</p>
            <p className="shift-overview__age-rating">
              {showtime.movieResponse.ageRating}
            </p>
          </div>
        </div>

        <div className="shift-overview__right">
          <div className="shift-overview__stats">
            <div>
              <p className="shift-overview__label">Checked-in</p>
              <p className="shift-overview__stats-number">
                {formatTimeHM(showtime.startTime)}{" "}
                <span className="shift-overview__stats-total">
                  - {formatTimeHM(showtime.endTime)}
                </span>
              </p>
            </div>
            <div className="shift-overview__percentage">{progress}%</div>
          </div>

          <div className="shift-overview__progress-wrapper">
            <div className="shift-overview__progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="shift-overview__progress-fill"
              >
                <div className="shift-overview__progress-pulse" />
              </motion.div>
            </div>
            <p className="shift-overview__progress-text">
              {remainingMinutes > 0
                ? `Ends in ${remainingMinutes} min${remainingMinutes !== 1 ? "s" : ""}`
                : "Ended"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
