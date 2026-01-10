import { useState, useRef } from 'react';
import { domToPng } from 'modern-screenshot';
import { Upload, Type, Palette, ChevronRight, Monitor, Film, Aperture, Sliders, Move, Sparkles, Sun, Droplets, RotateCcw, ZoomIn, Layers, Grid3X3 } from 'lucide-react';

// Collapsible Section Component - moved outside to prevent re-creation on each render
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2 hover:text-neutral-300 transition-colors"
      >
        <Icon size={12} />
        {title}
        <ChevronRight size={12} className={`ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  );
}

export default function App() {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Content
  const [mainText, setMainText] = useState('Exclusive');
  const [subText, setSubText] = useState('Review 2024');
  const [image, setImage] = useState(null);

  // Style settings
  const [glowColor, setGlowColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [overlayOpacity, setOverlayOpacity] = useState(0.2);
  const [blurAmount, setBlurAmount] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(3);

  // Text positioning
  const [textPosition, setTextPosition] = useState('center');
  const [textOffsetX, setTextOffsetX] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);

  const [baseFontSize, setBaseFontSize] = useState(120);
  const [subFontSize, setSubFontSize] = useState(24); // subtitle font size
  const [isModern, setIsModern] = useState(true);

  // Visuals
  const [showGrain, setShowGrain] = useState(true);
  const [showCinemaBars, setShowCinemaBars] = useState(true);
  const [activeBadge, setActiveBadge] = useState('NEW');
  const [showLightLeak, setShowLightLeak] = useState(true);

  // Image Grading
  const [imgBrightness, setImgBrightness] = useState(100);
  const [imgContrast, setImgContrast] = useState(120);
  const [imgSaturation, setImgSaturation] = useState(100);
  const [vignetteStrength, setVignetteStrength] = useState(0.4);

  // NEW: Advanced Image Controls
  const [imgHueRotate, setImgHueRotate] = useState(0); // degrees
  const [imgSepia, setImgSepia] = useState(10); // 0-100%
  const [imgZoom, setImgZoom] = useState(100); // 100% = normal
  const [imgRotation, setImgRotation] = useState(0); // degrees
  const [imgOffsetX, setImgOffsetX] = useState(0);
  const [imgOffsetY, setImgOffsetY] = useState(0);

  // NEW: Gradient Overlay
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#ff0080');
  const [gradientColor2, setGradientColor2] = useState('#7928ca');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientOpacity, setGradientOpacity] = useState(0.3);

  // NEW: Text Stroke
  const [textStrokeEnabled, setTextStrokeEnabled] = useState(false);
  const [textStrokeColor, setTextStrokeColor] = useState('#000000');
  const [textStrokeWidth, setTextStrokeWidth] = useState(2);

  // NEW: 3D Text Effect
  const [text3DEnabled, setText3DEnabled] = useState(false);
  const [text3DColor, setText3DColor] = useState('#000000');
  const [text3DDepth, setText3DDepth] = useState(4);

  // NEW: Scanlines Effect
  const [showScanlines, setShowScanlines] = useState(false);
  const [scanlinesOpacity, setScanlinesOpacity] = useState(0.1);

  // NEW: Chromatic Aberration
  const [chromaticEnabled, setChromaticEnabled] = useState(true);
  const [chromaticAmount, setChromaticAmount] = useState(3);

  // NEW: Presets
  const presets = {
    none: { name: 'Default', icon: '✨' },
    cinematic: { name: 'Cinematic', icon: '🎬', settings: { imgContrast: 120, imgSaturation: 90, vignetteStrength: 0.6, showCinemaBars: true, overlayOpacity: 0.3 } },
    neon: { name: 'Neon', icon: '💜', settings: { imgSaturation: 150, gradientEnabled: true, gradientColor1: '#ff0080', gradientColor2: '#00ffff', gradientOpacity: 0.25, glowIntensity: 5 } },
    vintage: { name: 'Vintage', icon: '📷', settings: { imgSepia: 30, imgSaturation: 80, imgContrast: 110, showGrain: true, vignetteStrength: 0.5 } },
    dramatic: { name: 'Dramatic', icon: '⚡', settings: { imgContrast: 140, imgBrightness: 90, vignetteStrength: 0.7, overlayOpacity: 0.25 } },
    cool: { name: 'Cool', icon: '❄️', settings: { imgHueRotate: 180, imgSaturation: 90, gradientEnabled: true, gradientColor1: '#0066ff', gradientColor2: '#00ccff', gradientOpacity: 0.2 } },
    warm: { name: 'Warm', icon: '🔥', settings: { imgHueRotate: 20, imgSaturation: 120, gradientEnabled: true, gradientColor1: '#ff6600', gradientColor2: '#ffcc00', gradientOpacity: 0.15 } },
  };

  const applyPreset = (presetKey) => {
    if (presetKey === 'none') {
      // Reset to defaults
      setImgBrightness(100); setImgContrast(100); setImgSaturation(100);
      setVignetteStrength(0.4); setShowCinemaBars(false); setOverlayOpacity(0.2);
      setGradientEnabled(false); setGlowIntensity(3); setImgSepia(0); setImgHueRotate(0);
      setShowGrain(true);
      return;
    }
    const preset = presets[presetKey];
    if (preset?.settings) {
      Object.entries(preset.settings).forEach(([key, value]) => {
        const setterName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
        const setters = {
          setImgBrightness, setImgContrast, setImgSaturation, setVignetteStrength,
          setShowCinemaBars, setOverlayOpacity, setGradientEnabled, setGradientColor1,
          setGradientColor2, setGradientOpacity, setGlowIntensity, setImgSepia,
          setImgHueRotate, setShowGrain
        };
        if (setters[setterName]) setters[setterName](value);
      });
    }
  };

  // Base64 Noise Pattern
  const noisePattern = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABEREQAAAAAAABCQkIAAABpC5fOAAAACHRSTlMA9wD+/v39/V0C+skAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABDSURBVDjLY2AYBaNg2AJGJiBpCqSdgKQrkHYDkm5A0h1IegBJTQYmIClLBqYhI0hKk4FpyAii0mRgGjKCpDQZGCkAAOsL9wa9rS11AAAAAElFTkSuQmCC";

  const getAdaptiveFontSize = () => {
    const length = mainText.length;
    const multiplier = length < 8 ? 1 : length < 15 ? 0.8 : length < 25 ? 0.6 : 0.4;
    return Math.max(40, baseFontSize * multiplier);
  };

  const calculatedFontSize = getAdaptiveFontSize();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      // Target resolution: 1024 × 576
      const targetWidth = 1024;
      const targetHeight = 576;
      const currentWidth = cardRef.current.offsetWidth;
      const scale = targetWidth / currentWidth;

      const dataUrl = await domToPng(cardRef.current, {
        width: targetWidth,
        height: targetHeight,
        scale: scale,
        backgroundColor: '#000000',
      });

      const link = document.createElement('a');
      link.download = `Thumbnail_1024x576_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Export error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getGlowStyle = (intensity) => {
    if (intensity === 0) return { color: textColor };
    const blur = intensity * 10;

    let style = {
      color: textColor,
      textShadow: `
        0 0 ${blur * 0.5}px ${glowColor}80,
        0 0 ${blur}px ${glowColor}60,
        0 0 ${blur * 2}px ${glowColor}40
      `,
    };

    // Add text stroke
    if (textStrokeEnabled) {
      style.WebkitTextStroke = `${textStrokeWidth}px ${textStrokeColor}`;
    }

    // Add 3D effect
    if (text3DEnabled) {
      const shadows = [];
      for (let i = 1; i <= text3DDepth; i++) {
        shadows.push(`${i}px ${i}px 0 ${text3DColor}`);
      }
      style.textShadow = shadows.join(', ') + (intensity > 0 ? `, 0 0 ${blur}px ${glowColor}60` : '');
    }

    return style;
  };

  const getPositionStyles = () => {
    return { transform: `translate(${textOffsetX}px, ${textOffsetY}px)` };
  };

  const getAlignmentClasses = () => {
    switch (textPosition) {
      case 'left': return 'items-start text-left pl-16';
      case 'right': return 'items-end text-right pr-16';
      default: return 'items-center text-center';
    }
  };

  const getImageFilter = () => {
    return `brightness(${imgBrightness}%) contrast(${imgContrast}%) saturate(${imgSaturation}%) blur(${blurAmount}px) hue-rotate(${imgHueRotate}deg) sepia(${imgSepia}%)`;
  };

  const getImageTransform = () => {
    return `scale(${imgZoom / 100}) rotate(${imgRotation}deg) translate(${imgOffsetX}px, ${imgOffsetY}px)`;
  };



  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 flex flex-col lg:flex-row overflow-hidden">

      {/* LEFT: Canvas */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 lg:p-12 bg-[#0a0a0a]">

        <div className="absolute top-6 left-8 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs font-medium tracking-widest uppercase">Thumbnail Studio Pro</span>
        </div>

        {/* Canvas Area */}
        <div className="relative w-full max-w-5xl aspect-video shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10 group">

          <div
            ref={cardRef}
            data-card-root="true"
            className="w-full h-full relative bg-black overflow-hidden flex flex-col justify-center"
          >
            {/* 1. Background Image with filters */}
            {image ? (
              <>
                <img
                  src={image}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: getImageFilter(),
                    transform: getImageTransform(),
                    transformOrigin: 'center center',
                  }}
                />
                {/* Chromatic Aberration Effect */}
                {chromaticEnabled && (
                  <>
                    <img
                      src={image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50 pointer-events-none"
                      style={{
                        filter: getImageFilter(),
                        transform: `${getImageTransform()} translateX(${chromaticAmount}px)`,
                        transformOrigin: 'center center',
                      }}
                    />
                    <img
                      src={image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50 pointer-events-none"
                      style={{
                        filter: `${getImageFilter()} hue-rotate(120deg)`,
                        transform: `${getImageTransform()} translateX(-${chromaticAmount}px)`,
                        transformOrigin: 'center center',
                      }}
                    />
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              </div>
            )}

            {/* 2. Gradient Overlay */}
            {gradientEnabled && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`,
                  opacity: gradientOpacity,
                  mixBlendMode: 'overlay',
                }}
              ></div>
            )}

            {/* 3. Light Leaks */}
            {showLightLeak && (
              <>
                <div
                  className="absolute top-0 left-0 w-[70%] h-[70%] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top left, ${accentColor}60 0%, transparent 60%)`,
                    opacity: 0.6
                  }}
                ></div>
                <div
                  className="absolute bottom-0 right-0 w-[60%] h-[60%] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at bottom right, ${glowColor}50 0%, transparent 70%)`,
                    opacity: 0.5
                  }}
                ></div>
              </>
            )}

            {/* 4. Cinematic Overlay (Dim) */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-500"
              style={{ opacity: overlayOpacity }}
            ></div>

            {/* 5. Vignette */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(circle, transparent 40%, black 140%)`,
                opacity: vignetteStrength
              }}
            ></div>

            {/* 6. Film Grain */}
            {showGrain && (
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url('${noisePattern}')`,
                  backgroundSize: '150px 150px',
                  opacity: 0.15,
                  backgroundRepeat: 'repeat'
                }}
              ></div>
            )}

            {/* 7. Scanlines */}
            {showScanlines && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${scanlinesOpacity}) 2px, rgba(0,0,0,${scanlinesOpacity}) 4px)`,
                }}
              ></div>
            )}

            {/* 8. Cinema Bars */}
            {showCinemaBars && (
              <>
                <div className="absolute top-0 left-0 right-0 h-[10%] bg-black z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black z-20"></div>
              </>
            )}

            {/* 9. Content with offset */}
            <div
              className={`relative z-10 w-full h-full flex flex-col justify-center p-12 ${getAlignmentClasses()}`}
            >
              <div style={getPositionStyles()} className="transition-transform duration-75 flex flex-col items-inherit">
                {activeBadge && (
                  <div className={`
                    mb-6 px-4 py-1.5 rounded-full border uppercase text-xs font-bold tracking-widest
                    ${textPosition === 'left' ? 'self-start' : textPosition === 'right' ? 'self-end' : 'self-center'}
                  `}
                    style={{
                      borderColor: accentColor,
                      backgroundColor: `${accentColor}40`,
                      color: 'white',
                      boxShadow: `0 0 20px ${accentColor}40`
                    }}
                  >
                    {activeBadge}
                  </div>
                )}

                <h1
                  className={`leading-tight tracking-tight ${isModern ? 'font-sans font-bold' : 'font-serif italic'}`}
                  style={{
                    fontSize: `${calculatedFontSize}px`,
                    lineHeight: 1.1,
                    ...getGlowStyle(glowIntensity)
                  }}
                >
                  {mainText}
                </h1>

                {subText && (
                  <p
                    className="mt-4 font-medium tracking-wide text-white/90 uppercase opacity-90"
                    style={{ letterSpacing: '0.2em', fontSize: `${subFontSize}px` }}
                  >
                    {subText}
                  </p>
                )}
              </div>
            </div>

            {/* Glass reflection */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
              }}
            ></div>
          </div>
        </div>

        <div className="mt-8 text-neutral-500 text-xs font-medium tracking-widest uppercase flex gap-6">
          <span className="flex items-center gap-2"><Monitor size={14} /> Pro Color Grading</span>
          <span className="flex items-center gap-2"><Move size={14} /> Free Move</span>
          <span className="flex items-center gap-2"><Sparkles size={14} /> Premium Effects</span>
        </div>
      </div>

      {/* RIGHT: Inspector */}
      <div className="w-full lg:w-[420px] bg-[#111111] border-l border-white/5 flex flex-col h-screen lg:h-auto overflow-y-auto">

        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">Studio Inspector</h2>
          <p className="text-neutral-500 text-sm mt-1">Professional thumbnail design</p>
        </div>

        <div className="p-6 space-y-6 flex-1">

          {/* PRESETS */}
          <Section title="Quick Presets" icon={Sparkles}>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className="p-2 rounded-lg bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/5 transition-all flex flex-col items-center gap-1"
                >
                  <span className="text-lg">{preset.icon}</span>
                  <span className="text-[9px] text-neutral-400 uppercase">{preset.name}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* MEDIA + GRADING */}
          <Section title="Image Grading" icon={Sliders}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <label className="cursor-pointer bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors rounded-xl h-16 flex flex-col items-center justify-center border border-white/5 group">
                <Upload size={16} className="text-neutral-400 group-hover:text-white mb-1 transition-colors" />
                <span className="text-[9px] text-neutral-400 group-hover:text-white uppercase tracking-wider">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {image && (
                <button onClick={() => setImage(null)} className="cursor-pointer bg-[#1c1c1e] hover:bg-red-500/10 hover:border-red-500/50 transition-colors rounded-xl h-16 flex flex-col items-center justify-center border border-white/5 group">
                  <span className="text-[9px] text-neutral-400 group-hover:text-red-400 uppercase tracking-wider">Remove</span>
                </button>
              )}
            </div>

            <div className="space-y-2 bg-[#1c1c1e] p-3 rounded-xl border border-white/5">
              {[
                { label: 'Bright', value: imgBrightness, set: setImgBrightness, min: 0, max: 200 },
                { label: 'Contrast', value: imgContrast, set: setImgContrast, min: 0, max: 200 },
                { label: 'Saturate', value: imgSaturation, set: setImgSaturation, min: 0, max: 200 },
                { label: 'Hue', value: imgHueRotate, set: setImgHueRotate, min: 0, max: 360 },
                { label: 'Sepia', value: imgSepia, set: setImgSepia, min: 0, max: 100 },
              ].map(({ label, value, set, min, max }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[9px] uppercase text-neutral-500 w-14">{label}</span>
                  <input
                    type="range" min={min} max={max} step="1"
                    value={value}
                    onChange={(e) => set(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <span className="text-[9px] text-neutral-500 w-8 text-right">{value}</span>
                </div>
              ))}
              <div className="w-full h-px bg-white/5 my-1"></div>
              {[
                { label: 'Blur', value: blurAmount, set: setBlurAmount, min: 0, max: 20 },
                { label: 'Vignette', value: vignetteStrength, set: setVignetteStrength, min: 0, max: 1, step: 0.1 },
              ].map(({ label, value, set, min, max, step = 1 }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[9px] uppercase text-neutral-500 w-14">{label}</span>
                  <input
                    type="range" min={min} max={max} step={step}
                    value={value}
                    onChange={(e) => set(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* IMAGE TRANSFORM */}
          <Section title="Image Transform" icon={ZoomIn} defaultOpen={false}>
            <div className="space-y-2 bg-[#1c1c1e] p-3 rounded-xl border border-white/5">
              {[
                { label: 'Zoom', value: imgZoom, set: setImgZoom, min: 50, max: 200, suffix: '%' },
                { label: 'Rotate', value: imgRotation, set: setImgRotation, min: -180, max: 180, suffix: '°' },
                { label: 'Offset X', value: imgOffsetX, set: setImgOffsetX, min: -200, max: 200 },
                { label: 'Offset Y', value: imgOffsetY, set: setImgOffsetY, min: -200, max: 200 },
              ].map(({ label, value, set, min, max, suffix = '' }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[9px] uppercase text-neutral-500 w-14">{label}</span>
                  <input
                    type="range" min={min} max={max} step="1"
                    value={value}
                    onChange={(e) => set(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <span className="text-[9px] text-neutral-500 w-10 text-right">{value}{suffix}</span>
                </div>
              ))}
              <button
                onClick={() => { setImgZoom(100); setImgRotation(0); setImgOffsetX(0); setImgOffsetY(0); }}
                className="w-full mt-2 text-[10px] text-neutral-400 hover:text-white py-1 flex items-center justify-center gap-1"
              >
                <RotateCcw size={10} /> Reset Transform
              </button>
            </div>
          </Section>

          {/* GRADIENT OVERLAY */}
          <Section title="Gradient Overlay" icon={Layers} defaultOpen={false}>
            <div className="space-y-3 bg-[#1c1c1e] p-3 rounded-xl border border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gradientEnabled}
                  onChange={(e) => setGradientEnabled(e.target.checked)}
                  className="rounded bg-[#3a3a3c] border-none"
                />
                <span className="text-[10px] text-neutral-400 uppercase">Enable Gradient</span>
              </label>
              {gradientEnabled && (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 mb-1">Color 1</label>
                      <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 mb-1">Color 2</label>
                      <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase text-neutral-500 w-14">Angle</span>
                    <input type="range" min="0" max="360" value={gradientAngle} onChange={(e) => setGradientAngle(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                    <span className="text-[9px] text-neutral-500 w-8">{gradientAngle}°</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase text-neutral-500 w-14">Opacity</span>
                    <input type="range" min="0" max="1" step="0.05" value={gradientOpacity} onChange={(e) => setGradientOpacity(parseFloat(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* TYPOGRAPHY */}
          <Section title="Typography" icon={Type}>
            <div className="space-y-2">
              <input
                type="text"
                value={mainText}
                onChange={(e) => setMainText(e.target.value)}
                className="w-full bg-[#1c1c1e] border-none rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                placeholder="Main Title"
              />
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                className="w-full bg-[#1c1c1e] border-none rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                placeholder="Subtitle"
              />
            </div>

            {/* Text Effects */}
            <div className="space-y-2 bg-[#1c1c1e] p-3 rounded-xl border border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={textStrokeEnabled} onChange={(e) => setTextStrokeEnabled(e.target.checked)} className="rounded bg-[#3a3a3c] border-none" />
                <span className="text-[10px] text-neutral-400 uppercase">Text Stroke</span>
              </label>
              {textStrokeEnabled && (
                <div className="flex gap-2 items-center">
                  <input type="color" value={textStrokeColor} onChange={(e) => setTextStrokeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="range" min="1" max="8" value={textStrokeWidth} onChange={(e) => setTextStrokeWidth(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={text3DEnabled} onChange={(e) => setText3DEnabled(e.target.checked)} className="rounded bg-[#3a3a3c] border-none" />
                <span className="text-[10px] text-neutral-400 uppercase">3D Text</span>
              </label>
              {text3DEnabled && (
                <div className="flex gap-2 items-center">
                  <input type="color" value={text3DColor} onChange={(e) => setText3DColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="range" min="1" max="10" value={text3DDepth} onChange={(e) => setText3DDepth(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                </div>
              )}
            </div>

            {/* Position Controls */}
            <div className="bg-[#1c1c1e] p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex gap-2">
                {['left', 'center', 'right'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setTextPosition(pos)}
                    className={`flex-1 h-8 rounded border border-white/10 flex items-center justify-center transition-all ${textPosition === pos ? 'bg-white text-black' : 'hover:bg-white/10 text-neutral-400'}`}
                  >
                    <div className={`w-4 h-0.5 bg-current rounded-full ${pos === 'left' ? '-ml-1' : pos === 'right' ? '-mr-1' : ''}`}></div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[9px]">X</span>
                  <input type="range" min="-300" max="300" step="10" value={textOffsetX} onChange={(e) => setTextOffsetX(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[9px]">Y</span>
                  <input type="range" min="-200" max="200" step="10" value={textOffsetY} onChange={(e) => setTextOffsetY(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                </div>
              </div>
            </div>
          </Section>

          {/* EFFECTS */}
          <Section title="Effects" icon={Aperture}>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Grain', active: showGrain, toggle: setShowGrain, icon: Film },
                { label: 'Bars', active: showCinemaBars, toggle: setShowCinemaBars, icon: Monitor },
                { label: 'Leaks', active: showLightLeak, toggle: setShowLightLeak, icon: Sun },
                { label: 'Lines', active: showScanlines, toggle: setShowScanlines, icon: Grid3X3 },
                { label: 'RGB', active: chromaticEnabled, toggle: setChromaticEnabled, icon: Droplets },
              ].map(({ label, active, toggle, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => toggle(!active)}
                  className={`p-2 rounded-lg border text-[9px] font-medium transition-all flex flex-col items-center justify-center gap-1 ${active ? 'bg-white/10 border-white/20 text-white' : 'bg-[#1c1c1e] border-transparent text-neutral-400'}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {showScanlines && (
              <div className="flex items-center gap-3 bg-[#1c1c1e] p-2 rounded-lg">
                <span className="text-[9px] uppercase text-neutral-500">Intensity</span>
                <input type="range" min="0.05" max="0.3" step="0.01" value={scanlinesOpacity} onChange={(e) => setScanlinesOpacity(parseFloat(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
              </div>
            )}

            {chromaticEnabled && (
              <div className="flex items-center gap-3 bg-[#1c1c1e] p-2 rounded-lg">
                <span className="text-[9px] uppercase text-neutral-500">RGB Split</span>
                <input type="range" min="1" max="10" value={chromaticAmount} onChange={(e) => setChromaticAmount(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
              </div>
            )}

            <div className="pt-1">
              <label className="block text-[9px] text-neutral-500 mb-2 uppercase">Badge</label>
              <div className="flex gap-1.5 flex-wrap">
                {[null, 'LIVE', '4K', 'PRO', 'NEW', 'HOT', '🔥'].map((badge) => (
                  <button
                    key={badge || 'none'}
                    onClick={() => setActiveBadge(badge)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${activeBadge === badge ? 'bg-white text-black border-white' : 'bg-[#1c1c1e] text-neutral-500 border-white/5 hover:border-white/20'}`}
                  >
                    {badge || 'None'}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* COLORS */}
          <Section title="Colors & Size" icon={Palette}>
            <div className="flex items-center gap-3 bg-[#1c1c1e] p-3 rounded-xl border border-white/5">
              <div className="flex-1">
                <label className="block text-[9px] text-neutral-500 mb-1 uppercase">Glow</label>
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: glowColor }}></div>
                  <input type="color" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="opacity-0 absolute w-8 h-8 cursor-pointer" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-neutral-500 mb-1 uppercase">Accent</label>
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: accentColor }}></div>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="opacity-0 absolute w-8 h-8 cursor-pointer" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-neutral-500 mb-1 uppercase">Text</label>
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: textColor }}></div>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="opacity-0 absolute w-8 h-8 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="space-y-2 bg-[#1c1c1e] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase text-neutral-500 w-16">Title Size</span>
                <input type="range" min="40" max="200" step="5" value={baseFontSize} onChange={(e) => setBaseFontSize(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                <span className="text-[9px] text-neutral-500 w-8 text-right">{baseFontSize}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase text-neutral-500 w-16">Sub Size</span>
                <input type="range" min="12" max="60" step="2" value={subFontSize} onChange={(e) => setSubFontSize(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                <span className="text-[9px] text-neutral-500 w-8 text-right">{subFontSize}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase text-neutral-500 w-16">Glow</span>
                <input type="range" min="0" max="10" step="1" value={glowIntensity} onChange={(e) => setGlowIntensity(parseInt(e.target.value))} className="flex-1 h-1 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-white" />
                <span className="text-[9px] text-neutral-500 w-8 text-right">{glowIntensity}</span>
              </div>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#111111]/90 backdrop-blur-md sticky bottom-0">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50 font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Rendering...</span>
            ) : (
              <>
                <span>Export Design</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
