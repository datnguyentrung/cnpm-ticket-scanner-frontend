import { Search } from "lucide-react";
import "./ManualEntry.scss";

interface ManualEntryProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export default function ManualEntry({
  value,
  onChange,
  onSubmit,
  isProcessing,
}: ManualEntryProps) {
  return (
    <div className="manual-entry">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isProcessing}
        placeholder={isProcessing ? "Đang xử lý..." : "Nhập mã vé thủ công..."}
        className="manual-entry__input"
      />
      <button
        onClick={onSubmit}
        disabled={!value || isProcessing}
        className={`manual-entry__button ${
          value && !isProcessing ? "manual-entry__button--active" : ""
        }`}
      >
        {isProcessing ? (
          <div className="manual-entry__spinner" />
        ) : (
          <Search className="manual-entry__icon" size={18} />
        )}
        Check
      </button>
    </div>
  );
}
