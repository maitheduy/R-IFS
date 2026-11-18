import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IFSConfig, SimulatorState } from '../types';
import { applyMap } from '../utils/math';
import { Play, Pause, RotateCcw, Download, ZoomIn, ZoomOut, RefreshCw, Palette, Sparkles } from 'lucide-react';

interface SimulatorCanvasProps {
  config: IFSConfig;
  onSelectPreset: (key: string) => void;
  currentPresetKey: string;
}

interface Point {
  x: number;
  y: number;
  mapIndex: number;
}

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  config,
  onSelectPreset,
  currentPresetKey,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<SimulatorState>({
    pointsPerFrame: 5000,
    totalPoints: 0,
    isRunning: true,
    colorMode: 'map',
    pointSize: 1.5,
    opacity: 0.85,
    speedMultiplier: 1,
    zoom: 1.0,
    panX: 0,
    panY: 0,
  });

  const [fps, setFps] = useState<number>(60);
  const pointsRef = useRef<Point[]>([]);
  const currentPointRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset and pre-calculate points when config changes
  useEffect(() => {
    if (!config.maps || config.maps.length === 0) return;
    const maps = config.maps;
    const initialPoints: Point[] = [];
    const totalProb = maps.reduce((sum, m) => sum + m.probability, 0);
    let cur = { x: 1.0, y: 0.5 };

    // Run 30,000 initial iterations to populate attractor instantly
    for (let i = 0; i < 30000; i++) {
      let r = Math.random() * totalProb;
      let accum = 0;
      let chosenMap = maps[0];
      let chosenIdx = 0;

      for (let j = 0; j < maps.length; j++) {
        accum += maps[j].probability;
        if (r <= accum) {
          chosenMap = maps[j];
          chosenIdx = j;
          break;
        }
      }

      const nextZ = applyMap(cur, chosenMap);
      cur = { x: nextZ.x, y: nextZ.y };
      
      if (i > 20) {
        initialPoints.push({ x: cur.x, y: cur.y, mapIndex: chosenIdx });
      }
    }

    pointsRef.current = initialPoints;
    currentPointRef.current = cur;
    setState((prev) => ({ ...prev, totalPoints: initialPoints.length }));
  }, [config]);

  // Chaos game iteration step
  const stepChaosGame = useCallback(() => {
    if (!config.maps || config.maps.length === 0) return;
    const maps = config.maps;
    const newPoints: Point[] = [];
    const totalProb = maps.reduce((sum, m) => sum + m.probability, 0);

    let cur = currentPointRef.current;
    const batchSize = state.pointsPerFrame;

    for (let i = 0; i < batchSize; i++) {
      let r = Math.random() * totalProb;
      let accum = 0;
      let chosenMap = maps[0];
      let chosenIdx = 0;

      for (let j = 0; j < maps.length; j++) {
        accum += maps[j].probability;
        if (r <= accum) {
          chosenMap = maps[j];
          chosenIdx = j;
          break;
        }
      }

      const nextZ = applyMap(cur, chosenMap);
      cur = { x: nextZ.x, y: nextZ.y };
      
      if (pointsRef.current.length + newPoints.length > 10) {
        newPoints.push({ x: cur.x, y: cur.y, mapIndex: chosenIdx });
      }
    }

    currentPointRef.current = cur;
    pointsRef.current = [...pointsRef.current, ...newPoints];
    if (pointsRef.current.length > 400000) {
      pointsRef.current = pointsRef.current.slice(pointsRef.current.length - 400000);
    }

    setState((prev) => ({ ...prev, totalPoints: pointsRef.current.length }));
  }, [config, state.pointsPerFrame]);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = lastTime;

    const render = (time: number) => {
      frameCount++;
      if (time - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = time;
      }

      if (state.isRunning) {
        stepChaosGame();
      }

      drawCanvas();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [state.isRunning, state.colorMode, state.pointSize, state.opacity, state.zoom, state.panX, state.panY, stepChaosGame]);

  // Draw canvas function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#090d16'; // Deep Slate 950
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // Transform coordinate system: center origin, scale, pan
    ctx.translate(width / 2 + state.panX, height / 2 + state.panY);
    
    // Auto-scale to fit view
    const baseScale = Math.min(width, height) / 3.5;
    const scale = baseScale * state.zoom;
    ctx.scale(scale, -scale); // Invert Y for mathematical coordinates

    // Draw detailed coordinate grid lines and labels
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1 / scale;
    ctx.fillStyle = '#64748b';
    ctx.font = `${11 / scale}px sans-serif`;

    for (let x = -3; x <= 3; x += 1) {
      if (x === 0) continue;
      ctx.beginPath();
      ctx.moveTo(x, -3); ctx.lineTo(x, 3);
      ctx.stroke();

      ctx.save();
      ctx.translate(x, 0);
      ctx.scale(1, -1);
      ctx.fillText(x.toString(), -4 / scale, 14 / scale);
      ctx.restore();
    }

    for (let y = -3; y <= 3; y += 1) {
      if (y === 0) continue;
      ctx.beginPath();
      ctx.moveTo(-3, y); ctx.lineTo(3, y);
      ctx.stroke();

      ctx.save();
      ctx.translate(0, y);
      ctx.scale(1, -1);
      ctx.fillText(y.toString(), 8 / scale, 4 / scale);
      ctx.restore();
    }

    // Draw main coordinate axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
    ctx.moveTo(0, -10); ctx.lineTo(0, 10);
    ctx.stroke();

    // Origin label
    ctx.save();
    ctx.translate(0, 0);
    ctx.scale(1, -1);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('0', -10 / scale, 14 / scale);
    ctx.restore();

    // Highlight fixed points for Sierpinski paper config
    if (config.name.includes('Sierpiński')) {
      const fixedPoints = [
        { name: 'A = 2 (z=2)', x: 2, y: 0, color: '#ef4444' },
        { name: 'B = 2ω', x: -1, y: Math.sqrt(3), color: '#3b82f6' },
        { name: 'C = 2ω²', x: -1, y: -Math.sqrt(3), color: '#10b981' },
      ];

      // Draw dashed equilateral triangle connecting fixed points
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.45)';
      ctx.lineWidth = 1.5 / scale;
      ctx.setLineDash([6 / scale, 4 / scale]);
      ctx.beginPath();
      ctx.moveTo(fixedPoints[0].x, fixedPoints[0].y);
      ctx.lineTo(fixedPoints[1].x, fixedPoints[1].y);
      ctx.lineTo(fixedPoints[2].x, fixedPoints[2].y);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw vertex dots and labels
      fixedPoints.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6 / scale, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5 / scale;
        ctx.stroke();

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.scale(1, -1);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${12 / scale}px sans-serif`;
        ctx.fillText(pt.name, 10 / scale, -6 / scale);
        ctx.restore();
      });
    }

    // Draw points
    const pts = pointsRef.current;
    const pointRadius = state.pointSize / scale;

    if (state.colorMode === 'map') {
      const mapColors = config.maps.map((m) => m.color);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.fillStyle = mapColors[p.mapIndex % mapColors.length] || '#3b82f6';
        ctx.globalAlpha = state.opacity;
        ctx.fillRect(p.x - pointRadius/2, p.y - pointRadius/2, pointRadius, pointRadius);
      }
    } else if (state.colorMode === 'rainbow') {
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const hue = (i * 0.05) % 360;
        ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
        ctx.globalAlpha = state.opacity;
        ctx.fillRect(p.x - pointRadius/2, p.y - pointRadius/2, pointRadius, pointRadius);
      }
    } else if (state.colorMode === 'monochrome') {
      ctx.fillStyle = '#818cf8';
      ctx.globalAlpha = state.opacity;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.fillRect(p.x - pointRadius/2, p.y - pointRadius/2, pointRadius, pointRadius);
      }
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.fillRect(p.x - pointRadius/2, p.y - pointRadius/2, pointRadius, pointRadius);
      }
    }

    ctx.restore();
  };

  // Canvas Mouse Pan & Zoom
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setState((prev) => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setState((prev) => ({
      ...prev,
      zoom: Math.max(0.2, Math.min(15, prev.zoom * zoomFactor)),
    }));
  };

  const handleResetView = () => {
    setState((prev) => ({ ...prev, zoom: 1.0, panX: 0, panY: 0 }));
  };

  const handleClearPoints = () => {
    pointsRef.current = [];
    currentPointRef.current = { x: 0.5, y: 0.5 };
    setState((prev) => ({ ...prev, totalPoints: 0 }));
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `r-ifs-attractor-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Resize canvas to match container reliably
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth || 900;
      canvas.height = parent.clientHeight || 650;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)]">
      {/* Left Sidebar: Controls & Presets */}
      <div className="lg:col-span-1 space-y-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Chaos Game Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Thuật toán trò chơi hỗn độn vẽ attractor của hệ R-IFS.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Mẫu hệ IFS (Presets)</label>
            <select
              value={currentPresetKey}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="sierpinski_paper">Tam giác Sierpiński (Bài báo RC-000004)</option>
              <option value="barnsley_fern">Dương xỉ Barnsley (Fern)</option>
              <option value="hexagonal_snowflake">Bông tuyết lục giác (Snowflake)</option>
              <option value="quad_square">Họa tiết ô vuông 4 góc</option>
            </select>
          </div>

          {/* Active Maps Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Các ánh xạ sinh (Maps) & Màu sắc</span>
              <span className="text-[10px] text-indigo-400 font-mono">{config.maps.length} hàm</span>
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {config.maps.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: m.color }} />
                    <span className="font-medium text-slate-200 truncate max-w-[130px]">{m.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">r={m.scale.toFixed(2)}, θ={m.rotationDeg}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Mode */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chế độ tô màu (Color Mode)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setState(s => ({ ...s, colorMode: 'map' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  state.colorMode === 'map' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Theo ánh xạ (Map)
              </button>
              <button
                onClick={() => setState(s => ({ ...s, colorMode: 'rainbow' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  state.colorMode === 'rainbow' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Cầu vồng (Rainbow)
              </button>
              <button
                onClick={() => setState(s => ({ ...s, colorMode: 'density' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  state.colorMode === 'density' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Mật độ (Density)
              </button>
              <button
                onClick={() => setState(s => ({ ...s, colorMode: 'monochrome' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  state.colorMode === 'monochrome' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Đơn sắc (Indigo)
              </button>
            </div>
          </div>

          {/* Sliders: Points per frame & Point Size */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Tốc độ vẽ (Điểm/khung):</span>
                <span className="text-indigo-400 font-mono">{state.pointsPerFrame.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="1000"
                value={state.pointsPerFrame}
                onChange={(e) => setState(s => ({ ...s, pointsPerFrame: Number(e.target.value) }))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Kích thước điểm:</span>
                <span className="text-indigo-400 font-mono">{state.pointSize.toFixed(1)}px</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={state.pointSize}
                onChange={(e) => setState(s => ({ ...s, pointSize: Number(e.target.value) }))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom stats & action buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <div className="text-slate-400">Tổng số điểm:</div>
              <div className="text-white font-mono font-bold text-sm">{state.totalPoints.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400">FPS:</div>
              <div className="text-emerald-400 font-mono font-bold">{fps} fps</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setState(s => ({ ...s, isRunning: !s.isRunning }))}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl font-medium text-xs shadow-lg transition-all ${
                state.isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {state.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{state.isRunning ? 'Tạm dừng' : 'Chạy tiếp'}</span>
            </button>

            <button
              onClick={handleClearPoints}
              className="flex items-center justify-center py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition-all"
              title="Đặt lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleExportPNG}
              className="flex items-center justify-center py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all"
              title="Tải ảnh PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Main Area: Interactive Canvas */}
      <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col relative overflow-hidden min-h-[550px] lg:min-h-[700px]">
        {/* Canvas Toolbar overlay */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg">
          <button
            onClick={() => setState(s => ({ ...s, zoom: Math.min(15, s.zoom * 1.2) }))}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Phóng to (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setState(s => ({ ...s, zoom: Math.max(0.2, s.zoom / 1.2) }))}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Thu nhỏ (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Khôi phục góc nhìn mặc định"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Element */}
        <div className="flex-1 w-full h-full relative cursor-crosshair">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-full block absolute inset-0"
          />
        </div>

        {/* Bottom helper bar */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-center text-xs text-slate-400 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
          <span className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mẹo: Kéo chuột để di chuyển canvas, lăn chuột để phóng to/thu nhỏ.</span>
          </span>
          <span className="font-mono text-indigo-300">
            Zoom: {Math.round(state.zoom * 100)}% | Điểm: {state.totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
