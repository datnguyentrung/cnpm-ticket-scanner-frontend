import { RotateCcw, Zap } from "lucide-react";
import type { RecentScan } from "../../types/types";
import "./RecentScans.scss";

interface RecentScansProps {
  scans: RecentScan[];
}

export default function RecentScans({ scans }: RecentScansProps) {
  return (
    <div className="recent-scans">
      <div className="recent-scans__header">
        <h3 className="recent-scans__title">
          <RotateCcw className="recent-scans__title-icon" size={14} />
          Lịch sử quét
        </h3>
        <span className="recent-scans__count">{scans.length} vé gần nhất</span>
      </div>

      <div className="recent-scans__list">
        {scans.length === 0 ? (
          <div className="recent-scans__empty">Chưa có lịch sử quét</div>
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id}
              className={`recent-scans__item recent-scans__item--${scan.scanStatus}`}
            >
              <div className="recent-scans__item-left">
                <div
                  className={`recent-scans__item-badge recent-scans__item-badge--${scan.scanStatus}`}
                >
                  {scan.ticket.roomName}
                </div>
                <div className="recent-scans__item-info">
                  <p className="recent-scans__item-title">
                    {scan.ticket.movieTitle}
                  </p>
                  <p className="recent-scans__item-seats">
                    <Zap
                      size={10}
                      className={`recent-scans__item-icon recent-scans__item-icon--${scan.scanStatus}`}
                    />
                    {scan.ticket.seatRow}
                    {scan.ticket.seatNumber}
                  </p>
                </div>
              </div>
              <div className="recent-scans__item-right">
                <p className="recent-scans__item-time">{scan.timestamp}</p>
                <p
                  className={`recent-scans__item-status recent-scans__item-status--${scan.scanStatus}`}
                >
                  {scan.scanStatus === "success"
                    ? "Hợp lệ"
                    : scan.scanStatus === "warning"
                      ? "Đã dùng"
                      : "Lỗi"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
