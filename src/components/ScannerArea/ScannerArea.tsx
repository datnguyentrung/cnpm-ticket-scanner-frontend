import { motion } from "motion/react";
import "./ScannerArea.scss";

interface ScannerAreaProps {
  isProcessing: boolean;
  onScan: () => void;
}

export default function ScannerArea({
  isProcessing,
  onScan,
}: ScannerAreaProps) {
  return (
    <div className="scanner-area">
      {/* Simulated Camera Feed */}
      <div className="scanner-area__camera" onClick={onScan} />

      <div className="scanner-area__overlay">
        {/* Loading Overlay */}
        {isProcessing && (
          <div className="scanner-area__loading">
            <div className="scanner-area__spinner" />
            <p className="scanner-area__loading-text">ĐANG KIỂM TRA...</p>
          </div>
        )}

        {/* Scanner Frame */}
        <div className="scanner-area__frame">
          {/* Corner Accents */}
          <div className="scanner-area__corner scanner-area__corner--top-left" />
          <div className="scanner-area__corner scanner-area__corner--top-right" />
          <div className="scanner-area__corner scanner-area__corner--bottom-left" />
          <div className="scanner-area__corner scanner-area__corner--bottom-right" />

          {/* Laser Scanning Animation */}
          <motion.div
            className="scanner-area__laser"
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="scanner-area__pulse" />
        </div>

        <p className="scanner-area__instruction">Di chuyển camera vào mã QR</p>
      </div>

      {/* Hidden button for demo */}
      <button
        onClick={onScan}
        className="scanner-area__button"
        aria-label="Simulate Scan"
      />
    </div>
  );
}
