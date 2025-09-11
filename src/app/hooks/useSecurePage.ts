"use client";

import { useEffect } from "react";

export function useSecurePage(options?: { blockCopy?: boolean; blockScreenshot?: boolean }) {
  useEffect(() => {
    const preventContextMenu = (e: Event) => e.preventDefault();
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("⚠️ Copy tidak diperbolehkan di halaman ini!");
    };

    const checkDevTools = () => {
      if (
        options?.blockScreenshot &&
        (window.outerWidth - window.innerWidth > 200 ||
          window.outerHeight - window.innerHeight > 200)
      ) {
        document.body.innerHTML = "<h1>🚫 Akses dilarang!</h1>";
      }
    };

    // Aktifkan proteksi sesuai opsi
    document.addEventListener("contextmenu", preventContextMenu);
    if (options?.blockCopy) {
      document.addEventListener("copy", preventCopy);
    }
    if (options?.blockScreenshot) {
      window.addEventListener("resize", checkDevTools);
    }

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("copy", preventCopy);
      window.removeEventListener("resize", checkDevTools);
    };
  }, [options]);
}
