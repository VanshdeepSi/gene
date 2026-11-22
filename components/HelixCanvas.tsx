"use client";

import React, { useEffect, useRef } from "react";

interface HelixCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function HelixCanvas({ className = "" }: HelixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 90; // Capped strictly under 120
    const lensRadius = isMobile ? 0 : 120; // Disable lens scanning on mobile

    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseOver = false;

    // Handle mouse movement for evidence lens scanning
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (e.clientY - rect.top) * dpr;
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initialize dust / noir atmospheric particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width * dpr,
        y: Math.random() * height * dpr,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: (0.4 + Math.random() * 0.8) * dpr, // Gentle downward forensic rain/dust
        size: (0.8 + Math.random() * 1.6) * dpr,
        alpha: 0.15 + Math.random() * 0.35,
      });
    }

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    // Helix Geometry Parameters
    const numRungs = isMobile ? 40 : 56;
    const helixRadius = isMobile ? 55 * dpr : 110 * dpr;
    const rungSpacing = isMobile ? 22 * dpr : 28 * dpr;
    const rotationSpeed = 0.007;
    let rotationAngle = 0;

    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const actualWidth = canvas.width;
      const actualHeight = canvas.height;
      // Center helix slightly to the right of text for asymmetrical noir editorial layout
      const helixCenterX = isMobile ? actualWidth * 0.5 : actualWidth * 0.65;
      const helixStartY = (actualHeight - numRungs * rungSpacing) * 0.5;

      rotationAngle += rotationSpeed;

      // 1. Draw atmospheric particles (noir dust / faint rain)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > actualHeight) {
          p.y = -10;
          p.x = Math.random() * actualWidth;
        }
        if (p.x < 0) p.x = actualWidth;
        if (p.x > actualWidth) p.x = 0;

        ctx.fillStyle = `rgba(217, 207, 184, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Compute 3D positions for DNA rungs
      interface RungData {
        y: number;
        x1: number;
        z1: number;
        x2: number;
        z2: number;
        index: number;
      }

      const rungs: RungData[] = [];
      for (let i = 0; i < numRungs; i++) {
        const y = helixStartY + i * rungSpacing;
        const angle = rotationAngle + i * 0.28;

        const x1 = helixCenterX + Math.cos(angle) * helixRadius;
        const z1 = Math.sin(angle) * helixRadius;

        const x2 = helixCenterX + Math.cos(angle + Math.PI) * helixRadius;
        const z2 = Math.sin(angle + Math.PI) * helixRadius;

        rungs.push({ y, x1, z1, x2, z2, index: i });
      }

      // Sort by depth (average z) so back elements render behind front elements
      rungs.sort((a, b) => (a.z1 + a.z2) / 2 - (b.z1 + b.z2) / 2);

      // 3. Render DNA rungs and base-pair nodes
      for (let i = 0; i < rungs.length; i++) {
        const r = rungs[i];
        const midX = (r.x1 + r.x2) / 2;
        const midY = r.y;

        // Calculate proximity to magnifying lens center
        let lensIntensity = 0;
        if (isMouseOver && lensRadius > 0) {
          const dist = Math.hypot(midX - mouseX, midY - mouseY);
          if (dist < lensRadius * dpr) {
            lensIntensity = Math.max(0, 1 - dist / (lensRadius * dpr));
          }
        }

        // Relative depth brightness
        const depthFactor = ((r.z1 + r.z2) / (helixRadius * 2) + 1) * 0.5; // 0 (back) to 1 (front)
        const baseAlpha = 0.12 + depthFactor * 0.25;

        // Color modulation: glow bright cyan/teal when under lens, subtle aged-paper dim when outside
        let strokeColor = `rgba(217, 207, 184, ${baseAlpha})`;
        let lineWidth = (1 + depthFactor * 0.8) * dpr;

        if (lensIntensity > 0) {
          const glowAlpha = Math.min(1, baseAlpha + lensIntensity * 0.8);
          strokeColor = `rgba(25, 227, 208, ${glowAlpha})`;
          lineWidth = (1.5 + lensIntensity * 2.5 + depthFactor) * dpr;

          // Glow shadow under lens
          ctx.shadowColor = "#19e3d0";
          ctx.shadowBlur = 14 * lensIntensity * dpr;
        } else {
          ctx.shadowBlur = 0;
        }

        // Base pair connecting bridge
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(r.x1, r.y);
        ctx.lineTo(r.x2, r.y);
        ctx.stroke();

        // Node 1 (Strand Alpha)
        const node1Dist = Math.hypot(r.x1 - mouseX, r.y - mouseY);
        const node1InLens = isMouseOver && node1Dist < lensRadius * dpr;
        const node1Radius = (2.2 + depthFactor * 1.8 + (node1InLens ? 2.5 : 0)) * dpr;

        ctx.beginPath();
        if (node1InLens) {
          ctx.fillStyle = r.index % 2 === 0 ? "#19e3d0" : "#b3202a"; // Forensic pair distinction
        } else {
          ctx.fillStyle = `rgba(217, 207, 184, ${baseAlpha * 1.5})`;
        }
        ctx.arc(r.x1, r.y, node1Radius, 0, Math.PI * 2);
        ctx.fill();

        // Node 2 (Strand Beta)
        const node2Dist = Math.hypot(r.x2 - mouseX, r.y - mouseY);
        const node2InLens = isMouseOver && node2Dist < lensRadius * dpr;
        const node2Radius = (2.2 + (1 - depthFactor) * 1.8 + (node2InLens ? 2.5 : 0)) * dpr;

        ctx.beginPath();
        if (node2InLens) {
          ctx.fillStyle = r.index % 2 === 0 ? "#b3202a" : "#19e3d0";
        } else {
          ctx.fillStyle = `rgba(25, 227, 208, ${baseAlpha * 1.2})`;
        }
        ctx.arc(r.x2, r.y, node2Radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
export default HelixCanvas;
