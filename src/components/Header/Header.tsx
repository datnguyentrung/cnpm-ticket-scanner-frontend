import { format } from "date-fns";
import { Clock, Film, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import BackButton from "../BackButton";
import "./Header.scss";

interface HeaderProps {
  showClock?: boolean;
  showUserInfo?: boolean;
  showBackButton?: boolean;
}

export default function Header({
  showClock = true,
  showUserInfo = true,
  showBackButton = false,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (showClock) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showClock]);

  return (
    <header className="header">
      <div className="header__left">
        {showBackButton && <BackButton />}
        <div className="header__logo">
          <Film className="header__logo-icon" />
        </div>
        <h1 className="header__title">CINEMA GATEKEEPER</h1>
      </div>

      <div className="header__right">
        {showClock && (
          <>
            <div className="header__clock">
              <div className="header__clock-time">
                <Clock className="header__clock-icon" />
                <span>{format(currentTime, "HH:mm:ss")}</span>
              </div>
              <span className="header__clock-date">
                {format(currentTime, "EEEE, d MMMM yyyy")}
              </span>
            </div>

            <div className="header__divider"></div>
          </>
        )}

        {showUserInfo && (
          <div className="header__user">
            <div className="header__user-avatar">
              <User className="header__user-icon" />
            </div>
            <div className="header__user-info">
              <span className="header__user-name">Dat Jax</span>
              <span className="header__user-location">
                <MapPin className="header__user-location-icon" /> Gate: 01
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
