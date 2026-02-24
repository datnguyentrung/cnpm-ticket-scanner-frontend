import { QrCode } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "./StaffHome.scss";

export default function StaffHome() {
  const navigate = useNavigate();

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
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="staff-home__overview"
          >
            <div className="staff-home__overview-header">
              <h2 className="staff-home__overview-title">Shift Overview</h2>
              <span className="staff-home__overview-badge">LIVE</span>
            </div>

            <div className="staff-home__overview-grid">
              <div className="staff-home__overview-left">
                <div className="staff-home__movie-info">
                  <p className="staff-home__label">Next Movie</p>
                  <h3 className="staff-home__movie-title">
                    Avengers: Secret Wars
                  </h3>
                  <p className="staff-home__movie-room">
                    <span className="staff-home__room-indicator" /> Room 03
                    (IMAX)
                  </p>
                </div>
                <div>
                  <p className="staff-home__label">Time</p>
                  <p className="staff-home__time">14:00 - 16:30</p>
                </div>
              </div>

              <div className="staff-home__overview-right">
                <div className="staff-home__stats">
                  <div>
                    <p className="staff-home__label">Checked-in</p>
                    <p className="staff-home__stats-number">
                      120 <span className="staff-home__stats-total">/ 200</span>
                    </p>
                  </div>
                  <div className="staff-home__percentage">60%</div>
                </div>

                <div className="staff-home__progress-wrapper">
                  <div className="staff-home__progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="staff-home__progress-fill"
                    >
                      <div className="staff-home__progress-pulse" />
                    </motion.div>
                  </div>
                  <p className="staff-home__progress-text">
                    80 guests remaining to scan
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
