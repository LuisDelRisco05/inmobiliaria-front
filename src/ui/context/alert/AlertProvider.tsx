// src/ui/context/alert/AlertProvider.tsx

import { useState } from "react";
import { AlertContext } from "./alertContext";
import AlertMessage from "@/ui/components/common/AlertMessage";

type AlertType = "success" | "error" | "info";

interface AlertMessage {
  id: number;
  type: AlertType;
  message: string;
}

let idCounter = 0;

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const showAlert = (message: string, type: AlertType = "info") => {
    const id = ++idCounter;
    const alert = { id, message, type };
    setAlerts((prev) => [...prev, alert]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000); // 4 segundos
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {/* Mostrar las alertas arriba a la derecha */}
      <div className="toast toast-top toast-end z-[999] space-y-2">
        {alerts.map((alert) => (
          <AlertMessage
            key={alert.id}
            message={alert.message}
            type={alert.type}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}
