import { useState } from "react";
import Header from "../../components/Header/Header";
import ManualEntry from "../../components/ManualEntry/ManualEntry";
import RecentScans from "../../components/RecentScans/RecentScans";
import { ResultModal } from "../../components/ResultModal";
import ScannerArea from "../../components/ScannerArea/ScannerArea";
import { tickets } from "../../data/mockData";
import type { RecentScan, Ticket } from "../../types/types";
import "./ScannerPage.scss";

export default function ScannerPage() {
  const [manualCode, setManualCode] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "success" | "warning" | "error";
    ticket: Ticket | null;
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

    setIsProcessing(true);
    setManualCode(code);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Normalize code
    const normalizedCode = code.trim().toUpperCase();

    // Find ticket
    const ticket = tickets.find((t) => t.code === normalizedCode);

    let resultStatus: "success" | "warning" | "error" = "error";
    let message = "";
    let subMessage = "";

    if (ticket) {
      if (ticket.status === "valid") {
        resultStatus = "success";
        message = "HỢP LỆ - MỜI VÀO";
        subMessage = "Vé hợp lệ. Chúc quý khách xem phim vui vẻ!";
      } else if (ticket.status === "used") {
        resultStatus = "warning";
        message = "CẢNH BÁO: VÉ ĐÃ SỬ DỤNG";
        subMessage = `Vé này đã được check-in vào lúc ${ticket.checkInTime || "trước đó"}.`;
      } else {
        resultStatus = "error";
        message = "LỖI: VÉ KHÔNG HỢP LỆ";
        subMessage = "Vé bị hủy hoặc không có hiệu lực.";
      }
    } else {
      resultStatus = "error";
      message = "LỖI: KHÔNG TÌM THẤY VÉ";
      subMessage =
        "Mã QR không tồn tại trên hệ thống hoặc chưa được thanh toán.";
    }

    setScanResult({
      status: resultStatus,
      ticket: ticket || null,
      message,
      subMessage,
    });

    playSound(resultStatus === "success" ? "success" : "error");
    setShowResult(true);
    setIsProcessing(false);

    // Add to recent scans if valid or used
    if (ticket) {
      const newScan: RecentScan = {
        id: Date.now().toString(),
        ticket,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        scanStatus: resultStatus,
      };
      setRecentScans((prev) => [newScan, ...prev].slice(0, 5));
    }

    setManualCode("");
  };

  const simulateCameraClick = () => {
    // Pick a random ticket code for demo purposes
    const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
    // Or sometimes a fake one
    const isFake = Math.random() > 0.8;
    const code = isFake ? "FAKE123" : randomTicket.code;
    handleScan(code);
  };

  return (
    <div className="scanner-page">
      <Header showClock={false} showUserInfo={true} showBackButton={true} />

      <main className="scanner-page__content">
        <div className="scanner-page__left">
          <ScannerArea
            isProcessing={isProcessing}
            onScan={simulateCameraClick}
          />
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
