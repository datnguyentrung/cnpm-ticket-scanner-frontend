import { ShowtimeAPI } from "@/apis/ticketing/ShowtimeAPI";
import { QrCode } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ShiftOverview from "../../components/ShiftOverview";
import type { ShowtimeResponse } from "../../types/types";
import "./StaffHome.scss";

export default function StaffHome() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = React.useState<ShowtimeResponse[]>([]);

  React.useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const data = await ShowtimeAPI.getShowtimesByDate(today);
        setShowtimes(data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, []);

  return (
    <div className="staff-home">
      <Header showClock={true} showUserInfo={true} />

      <main className="staff-home__main">
        {/* Decorative Background Elements */}
        <div className="staff-home__bg-decoration staff-home__bg-decoration--1" />
        <div className="staff-home__bg-decoration staff-home__bg-decoration--2" />

        <div className="staff-home__content">
          {/* Primary Action Button */}
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/scan")}
            className="staff-home__scan-button"
          >
            <div className="staff-home__scan-button-pulse" />

            <QrCode className="staff-home__scan-button-icon" />
            <span className="staff-home__scan-button-text">START SCANNING</span>
            <span className="staff-home__scan-button-subtext">
              Ready for check-in
            </span>
          </motion.button>

          {/* Shift Overview Card */}
          <div className="staff-home__showtimes-wrapper">
            {showtimes.length > 0 ? (
              showtimes
                .sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime(),
                )
                .map((showtime) => (
                  <ShiftOverview
                    key={showtime.showtimeId}
                    showtime={showtime}
                  />
                ))
            ) : (
              <p className="staff-home__no-showtimes">
                No showtimes available for today.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
