"use client";

import { useEffect } from "react";
import socket from "../lib/socket";

export default function ProctoringGuard({
  children,
  examId,
}: {
  children: React.ReactNode;
  examId: string;
}) {
  useEffect(() => {
    // TAB SWITCH
    const handleBlur = () => {
      socket.emit("proctor_event", {
        examId,
        eventType: "TAB_SWITCH",
      });
    };

    // FULLSCREEN EXIT
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        socket.emit("proctor_event", {
          examId,
          eventType: "EXIT_FULLSCREEN",
        });
      }
    };

    // RIGHT CLICK BLOCK
    const blockRightClick = (e: any) => e.preventDefault();

    // COPY PASTE BLOCK
    const blockCopyPaste = (e: any) => e.preventDefault();

    // KEY BLOCK
    const blockKeys = (e: KeyboardEvent) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.key === "F12" ||
        e.key === "Tab"
      ) {
        socket.emit("proctor_event", {
          examId,
          eventType: "BLOCKED_KEY",
        });
        e.preventDefault();
      }
    };

    // IDLE DETECTION
    let idleTimer: any;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        socket.emit("proctor_event", {
          examId,
          eventType: "IDLE",
        });
      }, 60000);
    };

    document.addEventListener("mousemove", resetIdle);
    document.addEventListener("keydown", resetIdle);

    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("contextmenu", blockRightClick);
    document.addEventListener("copy", blockCopyPaste);
    document.addEventListener("paste", blockCopyPaste);
    document.addEventListener("keydown", blockKeys);

    // FORCE FULLSCREEN
    document.documentElement.requestFullscreen();

    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, [examId]);

  return <>{children}</>;
}