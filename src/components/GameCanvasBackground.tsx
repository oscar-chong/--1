import { useEffect, useRef } from 'react';

interface Props {
  mode: 'calm' | 'exciting' | 'danger';
}

export default function GameCanvasBackground({ mode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Particle nodes representing knowledge neurons & cells
    const count = 45;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 1.5,
      hue: Math.random() > 0.5 ? 160 : 210, // emerald or cyan
      pulse: Math.random() * Math.PI,
    }));

    // Heartbeat pulse wave
    let waveOffset = 0;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (modeRef.current === 'danger') {
        bgGrad.addColorStop(0, '#1c0c16');
        bgGrad.addColorStop(1, '#0c0710');
      } else if (modeRef.current === 'exciting') {
        bgGrad.addColorStop(0, '#091e2b');
        bgGrad.addColorStop(1, '#060d17');
      } else {
        bgGrad.addColorStop(0, '#0a1926');
        bgGrad.addColorStop(1, '#050b12');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render rhythmic soft EKG / heartbeat line in lower region
      waveOffset += dt * 1.5;
      ctx.beginPath();
      ctx.strokeStyle = modeRef.current === 'danger' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 4) {
        const norm = (x / width) * 12 + waveOffset;
        let y = height * 0.75 + Math.sin(norm) * 8;
        // Periodic heartbeat spike
        const spikeCycle = (x + waveOffset * 100) % 360;
        if (spikeCycle > 140 && spikeCycle < 170) {
          y -= Math.sin(((spikeCycle - 140) / 30) * Math.PI) * 45;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Render connected network particles
      ctx.lineWidth = 1;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += dt * 2;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw connections
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = modeRef.current === 'danger'
              ? `rgba(251, 113, 133, ${alpha})`
              : `rgba(45, 212, 191, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw node
        const glow = Math.sin(p.pulse) * 0.3 + 0.7;
        ctx.fillStyle = modeRef.current === 'danger'
          ? `rgba(251, 113, 133, ${0.4 * glow})`
          : `rgba(56, 189, 248, ${0.4 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + (glow - 0.7) * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      data-testid="game-background-canvas"
    />
  );
}
