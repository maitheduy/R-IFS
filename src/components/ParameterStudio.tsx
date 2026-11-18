import React from 'react';
import { IFSConfig, MapParams } from '../types';
import { PAPER_DEFAULT_CONFIG } from '../utils/math';
import { Sliders, RotateCcw, Plus, Trash2, Palette, Sparkles, CheckCircle2 } from 'lucide-react';

interface ParameterStudioProps {
  config: IFSConfig;
  setConfig: React.Dispatch<React.SetStateAction<IFSConfig>>;
  onResetDefault: () => void;
}

export const ParameterStudio: React.FC<ParameterStudioProps> = ({
  config,
  setConfig,
  onResetDefault,
}) => {
  const handleMapChange = (index: number, field: keyof MapParams, value: any) => {
    const updatedMaps = [...config.maps];
    updatedMaps[index] = { ...updatedMaps[index], [field]: value };
    setConfig({ ...config, maps: updatedMaps });
  };

  const handleAddMap = () => {
    const newId = config.maps.length;
    const newMap: MapParams = {
      id: newId,
      name: `Ánh xạ g${newId}`,
      scale: 0.5,
      rotationDeg: (newId * 120) % 360,
      tx: Math.cos((newId * 120 * Math.PI) / 180),
      ty: Math.sin((newId * 120 * Math.PI) / 180),
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      probability: 1.0,
    };
    setConfig({ ...config, maps: [...config.maps, newMap], numMaps: config.maps.length + 1 });
  };

  const handleRemoveMap = (index: number) => {
    if (config.maps.length <= 1) return;
    const updatedMaps = config.maps.filter((_, idx) => idx !== index);
    setConfig({ ...config, maps: updatedMaps, numMaps: updatedMaps.length });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/60 border border-indigo-500/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sliders className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Parameter Studio (R-IFS)</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              Interactive
            </span>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl">
            Tùy chỉnh linh hoạt các hệ số hình học (tỉ số co r, góc quay &theta;, phép tịnh tiến c) và màu sắc của từng hàm trong hệ R-IFS.
          </p>
        </div>

        <button
          onClick={onResetDefault}
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-all border border-slate-700 shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khôi phục mặc định bài báo</span>
        </button>
      </div>

      {/* Main Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Settings */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-5 shadow-xl">
          <h3 className="text-base font-semibold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Thông tin hệ IFS</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300">Tên hệ R-IFS</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Mô tả toán học</label>
              <textarea
                rows={3}
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-indigo-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lý thuyết R-IFS bài báo RC-000004:</span>
              </div>
              <p>
                Hệ gồm phép quay R(z) = &omega;z (&omega; = e^(2&pi;i/3)) và phép co f(z) = z/2 + 1. Sinh ra 3 ánh xạ co g&amp;#8320;, g&amp;#8321;, g&amp;#8322; với tỉ số co 1/2 tạo ra tam giác Sierpiński.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddMap}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm ánh xạ mới</span>
          </button>
        </div>

        {/* Right: Maps Parameter Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Danh sách các hàm ánh xạ co &amp; màu sắc ({config.maps.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.maps.map((map, index) => (
              <div
                key={map.id ?? index}
                className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 relative group"
              >
                {/* Header card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="color"
                      value={map.color}
                      onChange={(e) => handleMapChange(index, 'color', e.target.value)}
                      className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                      title="Chọn màu hiển thị"
                    />
                    <input
                      type="text"
                      value={map.name}
                      onChange={(e) => handleMapChange(index, 'name', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-indigo-500 w-36"
                    />
                  </div>

                  {config.maps.length > 1 && (
                    <button
                      onClick={() => handleRemoveMap(index)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Xóa ánh xạ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sliders for Scale, Rotation, Translation */}
                <div className="space-y-3 text-xs">
                  {/* Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Tỉ số co (Scale r):</span>
                      <span className="font-mono text-white">{map.scale.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.01"
                      value={map.scale}
                      onChange={(e) => handleMapChange(index, 'scale', Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Rotation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Góc quay (Rotation &theta;):</span>
                      <span className="font-mono text-white">{map.rotationDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={map.rotationDeg}
                      onChange={(e) => handleMapChange(index, 'rotationDeg', Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Translation X & Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Dịch chuyển X (c_x):</span>
                        <span className="font-mono text-white">{map.tx.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-3"
                        max="3"
                        step="0.05"
                        value={map.tx}
                        onChange={(e) => handleMapChange(index, 'tx', Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Dịch chuyển Y (c_y):</span>
                        <span className="font-mono text-white">{map.ty.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-3"
                        max="3"
                        step="0.05"
                        value={map.ty}
                        onChange={(e) => handleMapChange(index, 'ty', Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
