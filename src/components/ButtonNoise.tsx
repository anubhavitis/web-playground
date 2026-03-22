import { useRef, useEffect } from "react";

export default function ButtonNoise({ alpha = 25 }: { alpha?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const size = 64;
    canvas.width = size;
    canvas.height = size;

    let animationId: number;
    let frame = 0;

    const draw = () => {
      if (frame % 4 === 0) {
        const img = ctx.createImageData(size, size);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = Math.random() * 255;
          img.data[i] = v;
          img.data[i + 1] = v;
          img.data[i + 2] = v;
          img.data[i + 3] = alpha;
        }
        ctx.putImageData(img, 0, 0);
      }
      frame++;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [alpha]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
