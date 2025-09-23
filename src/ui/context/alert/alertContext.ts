import type { AlertType } from "@/ui/components/common/AlertMessage";
import { createContext } from "react";

interface AlertContextValue {
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

export const AlertContext = createContext<AlertContextValue | null>(null);