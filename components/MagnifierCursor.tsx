"use client";

import React, { useEffect, useRef, useState } from "react";

export function MagnifierCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // High-precision coordinates
  const mousePos = useRef({ x: -200, y: -200 });
  const currentPos = useRef({ x: -200, y: -200 });
  const lastCssVars = useRef({ x: -200, y: -200 });
  const lastTimeRef = useRef<number>(0);
  const hoveringRef = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // 1. Precise Touch Device Detection
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    // Add class to body to hide the standard OS arrow on desktop
    document.body.classList.add("has-custom-cursor");

    // Check reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    // 2. High-Frequency Pointer Tracking
    const onPointerMove = (e: PointerEvent) => {
      // Ensure visibility once pointer enters
      if (!isVisible) setIsVisible(true);

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Efficient hit testing without triggering repeated React re-renders
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("a, button, input, select, textarea, [role='button'], .clickable-target, label")
        );
        if (isClickable !== hoveringRef.current) {
          hoveringRef.current = isClickable;
          setIsHoveringClickable(isClickable);
        }
      }
    };

    const onPointerDown = () => setIsMouseDown(true);
    const onPointerUp = () => setIsMouseDown(false);
    const onPointerLeave = () => setIsVisible(false);
    const onPointerEnter = () => setIsVisible(true);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);

    // 3. Ultra-Smooth Animation Loop with Delta-Time Exponential Smoothing
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (prefersReducedMotion) {
        currentPos.current.x = mousePos.current.x;
        currentPos.current.y = mousePos.current.y;
      } else {
        // Exponential smoothing: 1 - exp(-speed * dt)
        // Speed = 34 gives silky responsive tracking with zero micro-stutter
        const factor = 1 - Math.exp(-34 * dt);
        currentPos.current.x += (mousePos.current.x - currentPos.current.x) * factor;
        currentPos.current.y += (mousePos.current.y - currentPos.current.y) * factor;
      }

      if (cursorRef.current) {
        // Center the lens directly over the focal point (lens center is at 18px, 18px)
        const tx = currentPos.current.x - 18;
        const ty = currentPos.current.y - 18;
        cursorRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      // Update CSS variables for the hero magnifier reveal only when position moves by > 0.5px
      const dx = Math.abs(currentPos.current.x - lastCssVars.current.x);
      const dy = Math.abs(currentPos.current.y - lastCssVars.current.y);
      if (dx > 0.5 || dy > 0.5) {
        lastCssVars.current.x = currentPos.current.x;
        lastCssVars.current.y = currentPos.current.y;
        document.documentElement.style.setProperty("--cursor-x", `${currentPos.current.x}px`);
        document.documentElement.style.setProperty("--cursor-y", `${currentPos.current.y}px`);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      motionQuery.removeEventListener("change", onMotionChange);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (isTouch) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] select-none will-change-transform hidden md:block transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-200px, -200px, 0)",
      }}
      aria-hidden="true"
    >
      <div
        className={`transition-transform duration-150 ease-out origin-[18px_18px] ${
          isMouseDown ? "scale-90" : isHoveringClickable ? "scale-125" : "scale-100"
        }`}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          {/* Outer Lens Rim */}
          <circle
            cx="18"
            cy="18"
            r="14"
            stroke="#07090c"
            strokeWidth="3.5"
            className="opacity-95"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            stroke={isHoveringClickable ? "#19e3d0" : "#d9cfb8"}
            strokeWidth={isHoveringClickable ? "2" : "1.5"}
            className="transition-colors duration-150"
          />

          {/* Forensic Lens Glass Highlight */}
          <circle
            cx="18"
            cy="18"
            r="12"
            fill="#19e3d0"
            fillOpacity={isHoveringClickable ? "0.15" : "0.06"}
            className="transition-all duration-150"
          />

          {/* Forensic Reticle Crosshair (Highlights and sharpens on hover) */}
          <path
            d="M18 9V14M18 22V27M9 18H14M22 18H27"
            stroke={isHoveringClickable ? "#19e3d0" : "#d9cfb8"}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={isHoveringClickable ? "1" : "0.55"}
            className="transition-opacity duration-150"
          />

          {/* Center Target Focal Pin */}
          <circle
            cx="18"
            cy="18"
            r={isMouseDown ? "2.2" : "1.2"}
            fill={isHoveringClickable ? "#b3202a" : "#19e3d0"}
            className="transition-all duration-150"
          />

          {/* Forensic Lens Handle (Extends down-right at 45 degrees) */}
          <path
            d="M28.5 28.5L42 42"
            stroke="#07090c"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M28.5 28.5L42 42"
            stroke="#d9cfb8"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="29" cy="29" r="2" fill="#19e3d0" />
        </svg>
      </div>
    </div>
  );
}

export default MagnifierCursor;
