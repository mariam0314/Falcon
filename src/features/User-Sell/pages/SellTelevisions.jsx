import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SellTelevisions() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/sell", { replace: true });
  }, [navigate]);
  return null;
}
