"use client";

import { useEffect } from "react";

export default function ContentProtection() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // ==========================================
    // SHARED "ACCESS DENIED" TRIGGER
    // ==========================================
    let alreadyTriggered = false;

    const triggerAccessDenied = () => {
      if (alreadyTriggered) return;
      alreadyTriggered = true;

      // Clear all intervals/timeouts
      clearInterval(consoleInterval);
      clearInterval(resizeInterval);
      clearInterval(devtoolsDetectInterval);

      document.body.innerHTML = `
        <div style="
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          height:100vh;
          background:black;
          color:white;
          font-family:sans-serif;
          text-align:center;
        ">
          <h1 style="font-size:3rem;margin-bottom:1rem;">🚫 Access Denied</h1>
          <p style="font-size:1.2rem;color:#ff4444;">Developer tools are not allowed.</p>
          <p style="font-size:0.9rem;color:#888;margin-top:1rem;">Close developer tools and refresh the page.</p>
        </div>
      `;

      // Page ko completely lock kar do
      document.addEventListener("keydown", (e) => e.preventDefault(), true);
      document.addEventListener("contextmenu", (e) => e.preventDefault(), true);
    };

    // ==========================================
    // 1. DEVTOOLS DETECTION - Window Size Method
    // ==========================================
    // Jab docked devtools open hota hai, window size change hoti hai
    const threshold = 160;

    const checkWindowSize = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        triggerAccessDenied(); // ✅ AB CALL HO RAHA HAI
      }
    };

    const resizeInterval = setInterval(checkWindowSize, 1000);
    window.addEventListener("resize", checkWindowSize);

    // ==========================================
    // 2. DEVTOOLS DETECTION - Console Trick
    // ==========================================
    // Jab devtools open hota hai, console.log special objects
    // ko differently handle karta hai
    const devtoolsDetectInterval = setInterval(() => {
      const startTime = performance.now();

      // debugger statement ka alternative - regex trick
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          triggerAccessDenied(); // ✅ AB CALL HO RAHA HAI
          return "";
        },
      });
    

      // Timing-based detection
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        triggerAccessDenied(); // ✅ AB CALL HO RAHA HAI
      }
    }, 2000);

    // ==========================================
    // 3. DEVTOOLS DETECTION - toString() Method
    // ==========================================
    const detectViaToString = setInterval(() => {
      const obj = {
        toString: function () {
          triggerAccessDenied(); // ✅ AB CALL HO RAHA HAI
          return "";
        },
      };
      console.debug(obj);
    }, 3000);

    // ==========================================
    // 4. CONSOLE CLEARING
    // ==========================================
    const consoleInterval = setInterval(() => {
      console.clear();
    }, 1000);

    // ==========================================
    // 5. KEYBOARD SHORTCUT BLOCKING
    // ==========================================
    const preventInspect = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "i"].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && ["J", "j"].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && ["C", "c"].includes(e.key)) ||
        (e.ctrlKey && ["u", "U"].includes(e.key)) ||
        (e.ctrlKey && ["s", "S"].includes(e.key)) ||
        (e.ctrlKey && ["p", "P"].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerAccessDenied(); // ✅ Shortcut use karne pe bhi trigger
        return false;
      }
    };

    // ==========================================
    // 6. MOUSE PROTECTION
    // ==========================================
    const preventContext = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventSelect = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      e.preventDefault();
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    // ==========================================
    // 7. ATTACH ALL LISTENERS
    // ==========================================
    document.addEventListener("keydown", preventInspect, true);
    document.addEventListener("contextmenu", preventContext, true);
    document.addEventListener("selectstart", preventSelect);
    document.addEventListener("dragstart", preventDrag);

    // Initial check (agar pehle se devtools open hai)
    checkWindowSize();

    // ==========================================
    // 8. CSS INJECTION
    // ==========================================
    const style = document.createElement("style");
    style.id = "content-protection-style";
    style.innerHTML = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      img {
        pointer-events: none;
        -webkit-user-drag: none;
      }
    `;
    document.head.appendChild(style);

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      clearInterval(consoleInterval);
      clearInterval(resizeInterval);
      clearInterval(devtoolsDetectInterval);
      clearInterval(detectViaToString);
      window.removeEventListener("resize", checkWindowSize);
      document.removeEventListener("keydown", preventInspect, true);
      document.removeEventListener("contextmenu", preventContext, true);
      document.removeEventListener("selectstart", preventSelect);
      document.removeEventListener("dragstart", preventDrag);

      const existingStyle = document.getElementById("content-protection-style");
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  return null;
}
