import { useEffect, useRef } from "react";

interface UseConfirmExitOptions {
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useConfirmExit(options?: UseConfirmExitOptions) {
  const {
    message = "Apakah yakin mau keluar dari grup? Semua data akan terhapus!",
    onConfirm,
    onCancel,
  } = options || {};

  const historyIndex = useRef<number>(Date.now());

  useEffect(() => {
    // === Handle CLOSE TAB / REFRESH ===
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // simpan state index
    window.history.replaceState({ idx: historyIndex.current }, "");

    const handlePopState = (event: PopStateEvent) => {
      const prevIdx = (event.state && event.state.idx) || 0;

      // kalau idx lebih kecil → berarti user tekan BACK
      if (prevIdx < historyIndex.current) {
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          onConfirm?.();
          historyIndex.current = prevIdx; // update index
        } else {
          onCancel?.();
          // dorong balik supaya stay
          window.history.pushState({ idx: historyIndex.current }, "");
        }
      } else {
        // navigasi maju (router.push / forward) → biarin aja
        historyIndex.current = prevIdx;
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [message, onConfirm, onCancel]);
}
