import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion } from "motion/react";
import "./ScannerArea.scss";

interface ScannerAreaProps {
  isProcessing: boolean;
  onScan: (text: string) => void;
}

export default function ScannerArea({
  isProcessing,
  onScan,
}: ScannerAreaProps) {
  // const [lastScan, setLastScan] = useState("");

  // Hàm này tự động chạy khi camera bắt được mã QR
  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && !isProcessing) {
      const text = detectedCodes[0].rawValue;
      // if (text && text !== lastScan) {
      //   setLastScan(text);
      //   console.log("Mã vừa quét được:", text);
      //   // Gọi callback từ parent component để xử lý
      //   onScan(text);
      // }
      console.log("Mã vừa quét được:", text);
      // Gọi callback từ parent component để xử lý
      onScan(text);
    }
  };

  // Hàm này chạy khi người dùng bấm "Chặn" quyền camera hoặc máy không có camera
  const handleError = (error: unknown) => {
    console.error("Lỗi Camera:", error);
    alert(
      "Không thể mở Camera. Vui lòng cấp quyền hoặc kiểm tra lại thiết bị!",
    );
  };

  return (
    <div className="scanner-area">
      {/* Real Camera Scanner */}
      <div className="scanner-area__camera">
        <Scanner onScan={handleScan} onError={handleError} scanDelay={1000} />
      </div>

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
    </div>
  );
}
