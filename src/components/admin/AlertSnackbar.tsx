"use client";

import { Snackbar, Alert, SnackbarProps, AlertProps } from "@mui/material";
import { useState, useEffect } from "react";

export type AlertSeverity = "success" | "error" | "info" | "warning";

export interface AlertMessage {
  message: string;
  severity: AlertSeverity;
}

export interface AlertSnackbarProps {
  autoHideDuration?: number;
  anchorOrigin?: SnackbarProps["anchorOrigin"];
  alertVariant?: AlertProps["variant"];
}

// Singleton 패턴을 위한 알림 이벤트 관리
class AlertService {
  private static instance: AlertService;
  private listeners: ((message: AlertMessage | null) => void)[] = [];

  private constructor() {}

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  public subscribe(listener: (message: AlertMessage | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public showAlert(message: string, severity: AlertSeverity = "success") {
    this.listeners.forEach((listener) => listener({ message, severity }));
  }

  public hideAlert() {
    this.listeners.forEach((listener) => listener(null));
  }
}

// 외부에서 사용할 수 있는 싱글톤 인스턴스
export const alertService = AlertService.getInstance();

export default function AlertSnackbar({
  autoHideDuration = 5000,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  alertVariant = "filled",
}: AlertSnackbarProps) {
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 알림 서비스에 구독
    const unsubscribe = alertService.subscribe((message) => {
      if (message) {
        setAlert(message);
        setOpen(true);
      } else {
        setOpen(false);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      {alert ? (
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          variant={alertVariant}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      ) : (
        <div />
      )}
    </Snackbar>
  );
}
