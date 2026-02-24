import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./BackButton.scss";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({
  to = "/",
  label = "Quay lại",
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(to)} className="back-button">
      <ArrowLeft className="back-button__icon" />
      <span className="back-button__text">{label}</span>
    </button>
  );
}
