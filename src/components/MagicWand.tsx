import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'spark' | 'smoke' | 'trail' | 'spell';
}

export default function MagicWand() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 3) {
        // Create gorgeous light trail particles (Magic Cyan or Royal Gold)
        const trailColor = isHovered ? '#59E1FF' : '#D4AF37';
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: dx * -0.15 + (Math.random() * 0.4 - 0.2),
          vy: dy * -0.15 + (Math.random() * 0.4 - 0.2),
          size: Math.random() * 4 + 2,
          color: trailColor,
          alpha: 1,
          decay: 0.03,
          type: 'trail'
        });

        // If hovering interactive elements, spawn extra Sparks & magical Purple Smoke!
        if (isHovered) {
          // Spark
          particlesRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() * 3 - 1.5) + dx * 0.1,
            vy: (Math.random() * 3 - 1.5) + dy * 0.1,
            size: Math.random() * 3 + 1,
            color: '#FFD87A', // Warm Candle
            alpha: 1,
            decay: 0.04,
            type: 'spark'
          });

          // Smoke
          particlesRef.current.push({
            x: e.clientX + (Math.random() * 10 - 5),
            y: e.clientY + (Math.random() * 10 - 5),
            vx: (Math.random() * 0.6 - 0.3),
            vy: (Math.random() * -0.5 - 0.3), // drifts upward
            size: Math.random() * 8 + 4,
            color: '#1A1830', // Deep Purple smoke
            alpha: 0.4,
            decay: 0.015,
            type: 'smoke'
          });
        } else {
          // Standard ambient sparks
          if (Math.random() > 0.4) {
            particlesRef.current.push({
              x: e.clientX,
              y: e.clientY,
              vx: Math.random() * 1 - 0.5,
              vy: Math.random() * -0.5 - 0.2,
              size: Math.random() * 2 + 0.5,
              color: '#FFD87A',
              alpha: 0.8,
              decay: 0.02,
              type: 'spark'
            });
          }
        }

        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Cast Spell: Huge explosion of spell sparkles (Gold + Cyan + Purple)
      const colors = ['#D4AF37', '#59E1FF', '#FFD87A', '#1A1830', '#ffffff'];
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.012,
          type: 'spell'
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('interactive-wand')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;
    const canvas = canvasRef.current;
    
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render trails, smokes, and sparks
        particlesRef.current.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.type === 'smoke') {
            p.size += 0.2; // smoke spreads
          }
          
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(idx, 1);
            return;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          
          if (p.type === 'smoke') {
            // Soft fluffy purple smoke circles
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#1A1830';
            ctx.fillStyle = 'rgba(26, 24, 48, 0.2)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'trail') {
            // Bright neon trail glow
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Spark / Spell bursts (star-like glow)
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        });

        // Draw Wand handle pointing to cursor tip
        if (mousePos.x > 0 && mousePos.y > 0) {
          ctx.save();
          
          // Wand vector coordinates
          const tipX = mousePos.x;
          const tipY = mousePos.y;
          // Wand handle angles slightly down-right (e.g. +20px, +40px)
          const hndX = mousePos.x + 18;
          const hndY = mousePos.y + 36;

          // 1. Draw Wand Wood Handle
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          const woodGrad = ctx.createLinearGradient(tipX, tipY, hndX, hndY);
          woodGrad.addColorStop(0, '#FFD87A'); // Gold glowing tip collar
          woodGrad.addColorStop(0.3, '#784315'); // Mahogany brown
          woodGrad.addColorStop(1, '#3a1f07'); // Ebony dark wood base
          ctx.strokeStyle = woodGrad;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          
          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(hndX, hndY);
          ctx.stroke();

          // 2. Draw glowing collar at the tip of the wand
          ctx.shadowBlur = isHovered ? 18 : 8;
          ctx.shadowColor = isHovered ? '#59E1FF' : '#D4AF37';
          ctx.fillStyle = isHovered ? '#59E1FF' : '#D4AF37';
          ctx.beginPath();
          ctx.arc(tipX, tipY, isHovered ? 4.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();

          // 3. Spell Aura circle overlay
          if (isHovered) {
            ctx.strokeStyle = 'rgba(89, 225, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.restore();
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, isHovered]);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="magic-wand-canvas"
        className="fixed inset-0 pointer-events-none z-[99999] hidden md:block"
        style={{ mixBlendMode: 'screen' }}
      />
      <style>{`
        @media (min-width: 768px) {
          body, button, a, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
