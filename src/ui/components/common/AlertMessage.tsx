// src/ui/components/common/AlertMessage.tsx

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

export type AlertType = "success" | "error" | "info";

interface AlertMessageProps {
  message: string;
  type?: AlertType;
  duration?: number;
}

export default function AlertMessage({
  message,
  type = "info",
  duration = 3000,
}: AlertMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <>
      { type === "success" && <div className="alert alert-success"><div className="flex items-center gap-2"><FaCheckCircle /> {message}</div></div> }
      { type === "error" && <div className="alert alert-error"><div className="flex items-center gap-2"><FaTimesCircle /> {message}</div></div> }
      { type === "info" && <div className="alert alert-info"><div className="flex items-center gap-2"><FaInfoCircle /> {message}</div></div> }
    </>
  );
}

    {/* <div className={`alert alert-success shadow-lg animate-fade-in-down`}>
      <div className="flex items-center gap-2">
        {type === "success" && <FaCheckCircle />}
        {type === "error" && <FaTimesCircle />}
        {type === "info" && <FaInfoCircle />}
        <span>{message}</span>
      </div>
    </div> */}
