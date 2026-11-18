import { Complex, IFSConfig, MapParams, ProofStep } from '../types';

// Complex number helpers
export function add(z1: Complex, z2: Complex): Complex {
  return { x: z1.x + z2.x, y: z1.y + z2.y };
}

export function sub(z1: Complex, z2: Complex): Complex {
  return { x: z1.x - z2.x, y: z1.y - z2.y };
}

export function mul(z1: Complex, z2: Complex): Complex {
  return {
    x: z1.x * z2.x - z1.y * z2.y,
    y: z1.x * z2.y + z1.y * z2.x,
  };
}

export function scaleComplex(z: Complex, s: number): Complex {
  return { x: z.x * s, y: z.y * s };
}

// Rotate by angle in radians
export function rotate(z: Complex, angleRad: number): Complex {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: z.x * cos - z.y * sin,
    y: z.x * sin + z.y * cos,
  };
}

// Apply affine map: z' = scale * (rotate(z, theta) ) + translation
export function applyMap(z: Complex, map: MapParams): Complex {
  const rad = (map.rotationDeg * Math.PI) / 180;
  const rotated = rotate(z, rad);
  const scaled = scaleComplex(rotated, map.scale);
  return {
    x: scaled.x + map.tx,
    y: scaled.y + map.ty,
  };
}

// Default paper configuration: RC-000004-RIS-M0
// R(z) = w * z where w = e^(2pi i / 3), f(z) = z/2 + 1
// g0 = f, g1 = R o f, g2 = R^2 o f
export const PAPER_DEFAULT_CONFIG: IFSConfig = {
  name: "Tam giác Sierpiński (RC-000004-RIS-M0)",
  description: "Hệ R-IFS với phép co f(z) = z/2 + 1 và phép quay R(z) = ωz (ω = e^(2πi/3)). Sinh ra 3 ánh xạ co g0, g1, g2.",
  rotationAngleDeg: 120,
  numMaps: 3,
  baseContraction: {
    scale: 0.5,
    tx: 1.0,
    ty: 0.0,
  },
  maps: [
    {
      id: 0,
      name: "g0 = f (Scale 0.5, Rot 0°)",
      scale: 0.5,
      rotationDeg: 0,
      tx: 1.0,
      ty: 0.0,
      color: "#ef4444", // Red (Map 0)
      probability: 1.0,
    },
    {
      id: 1,
      name: "g1 = R ∘ f (Scale 0.5, Rot 120°)",
      scale: 0.5,
      rotationDeg: 120,
      // For R(f(z)): R(z/2 + 1) = w(z/2 + 1) = w z / 2 + w
      // w = cos(120) + i sin(120) = -0.5 + i * 0.866025
      // w * 1 = -0.5 + i * 0.866025
      tx: -0.5,
      ty: 0.8660254037844386,
      color: "#3b82f6", // Blue (Map 1)
      probability: 1.0,
    },
    {
      id: 2,
      name: "g2 = R² ∘ f (Scale 0.5, Rot 240°)",
      scale: 0.5,
      rotationDeg: 240,
      // w^2 = cos(240) + i sin(240) = -0.5 - i * 0.866025
      tx: -0.5,
      ty: -0.8660254037844386,
      color: "#10b981", // Emerald (Map 2)
      probability: 1.0,
    },
  ],
};

export const PRESET_CONFIGS: Record<string, IFSConfig> = {
  sierpinski_paper: PAPER_DEFAULT_CONFIG,
  
  barnsley_fern: {
    name: "Dương xỉ Barnsley (Barnsley Fern)",
    description: "IFS cổ điển 4 ánh xạ tạo ra hình lá dương xỉ tựa thật.",
    rotationAngleDeg: 0,
    numMaps: 4,
    baseContraction: { scale: 0.85, tx: 0, ty: 0 },
    maps: [
      { id: 0, name: "Cuống lá (Stem)", scale: 0.16, rotationDeg: 0, tx: 0, ty: 0, color: "#10b981", probability: 0.01 },
      { id: 1, name: "Thân chính (Main Leaf)", scale: 0.85, rotationDeg: 2.86, tx: 0, ty: 1.6, color: "#059669", probability: 0.85 },
      { id: 2, name: "Nhánh trái (Left Leaflet)", scale: 0.3, rotationDeg: -49.0, tx: 0, ty: 1.6, color: "#34d399", probability: 0.07 },
      { id: 3, name: "Nhánh phải (Right Leaflet)", scale: 0.3, rotationDeg: 49.0, tx: 0, ty: 0.44, color: "#047857", probability: 0.07 },
    ],
  },

  hexagonal_snowflake: {
    name: "Bông tuyết lục giác (Hexagonal Snowflake)",
    description: "Hệ 6 nhánh quay đối xứng 60 độ kết hợp phép co tỉ lệ 1/3.",
    rotationAngleDeg: 60,
    numMaps: 6,
    baseContraction: { scale: 1/3, tx: 2/3, ty: 0 },
    maps: [
      { id: 0, name: "Map 0 (0°)", scale: 1/3, rotationDeg: 0, tx: 2/3, ty: 0, color: "#3b82f6", probability: 1 },
      { id: 1, name: "Map 1 (60°)", scale: 1/3, rotationDeg: 60, tx: 0.333, ty: 0.577, color: "#60a5fa", probability: 1 },
      { id: 2, name: "Map 2 (120°)", scale: 1/3, rotationDeg: 120, tx: -0.333, ty: 0.577, color: "#93c5fd", probability: 1 },
      { id: 3, name: "Map 3 (180°)", scale: 1/3, rotationDeg: 180, tx: -2/3, ty: 0, color: "#3b82f6", probability: 1 },
      { id: 4, name: "Map 4 (240°)", scale: 1/3, rotationDeg: 240, tx: -0.333, ty: -0.577, color: "#60a5fa", probability: 1 },
      { id: 5, name: "Map 5 (300°)", scale: 1/3, rotationDeg: 300, tx: 0.333, ty: -0.577, color: "#93c5fd", probability: 1 },
    ],
  },

  quad_square: {
    name: "Họa tiết vuông 4 góc (Square IFS)",
    description: "IFS 4 ánh xạ co tỉ lệ 1/2 dịch chuyển ở 4 góc.",
    rotationAngleDeg: 90,
    numMaps: 4,
    baseContraction: { scale: 0.5, tx: 1, ty: 1 },
    maps: [
      { id: 0, name: "Top-Right", scale: 0.5, rotationDeg: 0, tx: 0.5, ty: 0.5, color: "#8b5cf6", probability: 1 },
      { id: 1, name: "Top-Left", scale: 0.5, rotationDeg: 90, tx: -0.5, ty: 0.5, color: "#ec4899", probability: 1 },
      { id: 2, name: "Bottom-Left", scale: 0.5, rotationDeg: 180, tx: -0.5, ty: -0.5, color: "#f59e0b", probability: 1 },
      { id: 3, name: "Bottom-Right", scale: 0.5, rotationDeg: 270, tx: 0.5, ty: -0.5, color: "#10b981", probability: 1 },
    ],
  },
};

export const PAPER_PROOF_STEPS: ProofStep[] = [
  {
    stepNumber: 1,
    titleVi: "Bước 1: R là phép đẳng cự (Isometric)",
    titleEn: "Step 1: R is an isometry",
    contentVi: "Với mọi z, w thuộc C, |R(z) - R(w)| = |ωz - ωw| = |ω||z - w| = |z - w|. Vì |ω| = 1 nên R bảo toàn khoảng cách, là phép quay góc 120 độ và không phải là phép co Lipschitz nhỏ hơn 1.",
    contentEn: "For all z, w in C, |R(z) - R(w)| = |ωz - ωw| = |z - w|. R preserves distance (isometry) and is a rotation by 120°.",
    formula: "|R(z) - R(w)| = |z - w|"
  },
  {
    stepNumber: 2,
    titleVi: "Bước 2: f là phép co (Contraction)",
    titleEn: "Step 2: f is a contraction",
    contentVi: "Với mọi z, w thuộc C, |f(z) - f(w)| = |(z/2 + 1) - (w/2 + 1)| = 1/2 |z - w|. Do đó f là phép co với tỉ số co chính xác 1/2.",
    contentEn: "For all z, w, |f(z) - f(w)| = 1/2 |z - w|. Thus f is a strict contraction with ratio 1/2.",
    formula: "|f(z) - f(w)| = \\frac{1}{2}|z - w|"
  },
  {
    stepNumber: 3,
    titleVi: "Bước 3: Ba ánh xạ sinh ra đều là phép co",
    titleEn: "Step 3: Generated maps are contractions",
    contentVi: "Xét g_j(z) = ω^j (z/2 + 1) với j = 0, 1, 2. Ta có |g_j(z) - g_j(w)| = |ω^j| (1/2)|z - w| = 1/2 |z - w|. Vậy F = {f, R ∘ f, R² ∘ f} là IFS gồm 3 phép co tỉ số 1/2.",
    contentEn: "Let g_j(z) = ω^j (z/2 + 1). All three maps have contraction ratio 1/2.",
    formula: "g_j(z) = \\omega^j \\left(\\frac{z}{2} + 1\\right), \\quad |g_j(z) - g_j(w)| = \\frac{1}{2}|z - w|"
  },
  {
    stepNumber: 4,
    titleVi: "Bước 4: Ba điểm cố định tạo thành tam giác đều",
    titleEn: "Step 4: Fixed points form an equilateral triangle",
    contentVi: "Điểm cố định của f là z = 2. Áp dụng R và R² ta được các đỉnh A = 2, B = 2ω, C = 2ω² là 3 đỉnh của tam giác đều tâm tại 0.",
    contentEn: "Fixed point of f is 2. Rotating gives A = 2, B = 2ω, C = 2ω² forming an equilateral triangle centered at origin.",
    formula: "A = 2, \\quad B = 2\\omega, \\quad C = 2\\omega^2, \\quad \\omega = e^{2\\pi i / 3}"
  },
  {
    stepNumber: 5,
    titleVi: "Bước 5: Attractor của IFS ba ánh xạ là tam giác Sierpiński",
    titleEn: "Step 5: Attractor is the Sierpinski Triangle",
    contentVi: "Theo định lý Hutchinson, tập K thỏa mãn K = g_0(K) ∪ g_1(K) ∪ g_2(K) tồn tại duy nhất và là tam giác Sierpiński kinh điển.",
    contentEn: "By Hutchinson's Theorem, the unique attractor K satisfying K = g_0(K) ∪ g_1(K) ∪ g_2(K) is the Sierpinski triangle.",
    formula: "K = \\bigcap_{n \\ge 0} K_n, \\quad K_{n+1} = g_0(K_n) \\cup g_1(K_n) \\cup g_2(K_n)"
  },
  {
    stepNumber: 6,
    titleVi: "Bước 6: K bất biến dưới R-IFS hai ánh xạ",
    titleEn: "Step 6: K is invariant under the 2-map R-IFS",
    contentVi: "Áp dụng R vào phương trình bất biến của K và dùng tính chất R³ = id, ta thu được R(K) ∪ f(K) = K. Tức là K bất biến dưới {R, f}.",
    contentEn: "Applying R and using R³ = id yields R(K) ∪ f(K) = K, proving K is invariant under the R-IFS {R, f}.",
    formula: "R(K) \\cup f(K) = K"
  },
  {
    stepNumber: 7,
    titleVi: "Bước 7: K là tập bất biến tối tiểu (MinInv)",
    titleEn: "Step 7: K is the minimal invariant set",
    contentVi: "Mọi tập compact bất biến S của R-IFS {R, f} cũng bất biến dưới F, do đó chứa attractor K. Suy ra MinInv({R, f}) = Attr(F) = K.",
    contentEn: "Any compact invariant set S of {R, f} is also invariant under F, hence contains K. Thus MinInv({R, f}) = K.",
    formula: "\\operatorname{MinInv}(\\mathcal{R}) = \\operatorname{Attr}(\\mathcal{F}) = K"
  }
];
