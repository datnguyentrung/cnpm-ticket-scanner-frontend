import { TicketAPI } from "@/apis/ticketing/TicketAPI";
import type { ApiResponse } from "@/types/ApiType";
import { useState } from "react";
import Header from "../../components/Header/Header";
import ManualEntry from "../../components/ManualEntry/ManualEntry";
import RecentScans from "../../components/RecentScans/RecentScans";
import { ResultModal } from "../../components/ResultModal";
import ScannerArea from "../../components/ScannerArea/ScannerArea";
import type { RecentScan, TicketDetailResponse } from "../../types/types";
import { formatTimeHM } from "../../utils/format";
import { validateTicket } from "../../utils/validateTicket";
import "./ScannerPage.scss";

export default function ScannerPage() {
  const [manualCode, setManualCode] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "success" | "warning" | "error";
    ticket: TicketDetailResponse | null;
    message: string;
    subMessage?: string;
  } | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const playSound = (type: "success" | "error") => {
    try {
      const AudioContext =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof window.AudioContext;
          }
        ).webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "success") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          1200,
          audioCtx.currentTime + 0.1,
        );
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.15,
        );
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      } else {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          100,
          audioCtx.currentTime + 0.2,
        );
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.3,
        );
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleScan = async (code: string) => {
    if (!code || isProcessing) return;

    if (!validateTicket(code)) {
      setScanResult({
        status: "error",
        ticket: null,
        message: "LỖI: MÃ VÉ KHÔNG HỢP LỆ",
        subMessage: "Vui lòng quét mã QR hợp lệ.",
      });
      playSound("error");
      setShowResult(true);
      return;
    }

    setIsProcessing(true);
    setManualCode(code);

    try {
      const response: ApiResponse<TicketDetailResponse> =
        await TicketAPI.updateTicketStatus(code, { status: "USED" });

      // Handle success response (statusCode: 200)
      if (response.statusCode === 200 && response.message === "SUCCESS") {
        const ticketData = response.data;

        setScanResult({
          status: "success",
          ticket: ticketData,
          message: "HỢP LỆ - MỜI VÀO",
          subMessage: "Vé hợp lệ. Chúc quý khách xem phim vui vẻ!",
        });

        playSound("success");
        setShowResult(true);

        // Add to recent scans
        const newScan: RecentScan = {
          id: Date.now().toString(),
          ticket: ticketData,
          timestamp: formatTimeHM(new Date()),
          scanStatus: "success",
        };
        setRecentScans((prev) => [newScan, ...prev].slice(0, 5));
      }
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật trạng thái vé:", error);

      // Handle error responses
      const errorResponse = (
        error as {
          response?: {
            data?: ApiResponse<TicketDetailResponse>;
          };
        }
      )?.response?.data;

      if (errorResponse) {
        // Handle 409 - Already Used
        if (
          errorResponse.statusCode === 409 &&
          errorResponse.message === "ALREADY_USED"
        ) {
          const checkInTime = errorResponse.data?.checkInTime
            ? formatTimeHM(new Date(errorResponse.data.checkInTime))
            : "trước đó";

          setScanResult({
            status: "warning",
            ticket: errorResponse.data,
            message: "CẢNH BÁO: VÉ ĐÃ SỬ DỤNG",
            subMessage: `Vé này đã được check-in vào lúc ${checkInTime}.`,
          });
          playSound("error");
        }
        // Handle 422 - Ticket Not Paid
        else if (
          errorResponse.statusCode === 422 &&
          errorResponse.message === "TICKET_NOT_PAID"
        ) {
          const currentStatus = errorResponse.data?.status || "UNKNOWN";

          setScanResult({
            status: "error",
            ticket: errorResponse.data,
            message: "LỖI: VÉ CHƯA THANH TOÁN",
            subMessage: `Vé này chưa được thanh toán. Trạng thái hiện tại: ${currentStatus}.`,
          });
          playSound("error");
        }
        // Handle other errors
        else {
          setScanResult({
            status: "error",
            ticket: null,
            message: "LỖI: KHÔNG THỂ KIỂM TRA VÉ",
            subMessage:
              errorResponse.message ||
              "Đã có lỗi xảy ra khi kiểm tra vé. Vui lòng thử lại.",
          });
          playSound("error");
        }
      } else {
        // Handle network or other errors
        setScanResult({
          status: "error",
          ticket: null,
          message: "LỖI: KHÔNG THỂ KẾT NỐI",
          subMessage:
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        });
        playSound("error");
      }

      setShowResult(true);
    } finally {
      setIsProcessing(false);
      setManualCode("");
    }
  };

  return (
    <div className="scanner-page">
      <Header showClock={false} showUserInfo={true} showBackButton={true} />

      <main className="scanner-page__content">
        <div className="scanner-page__left">
          <ScannerArea isProcessing={isProcessing} onScan={handleScan} />
        </div>

        <div className="scanner-page__right">
          <ManualEntry
            value={manualCode}
            onChange={setManualCode}
            onSubmit={() => handleScan(manualCode)}
            isProcessing={isProcessing}
          />

          <RecentScans scans={recentScans} />
        </div>
      </main>

      <ResultModal
        isOpen={showResult}
        result={scanResult}
        onClose={() => setShowResult(false)}
        onScanNext={() => {
          setShowResult(false);
          setManualCode("");
        }}
      />
    </div>
  );
}
