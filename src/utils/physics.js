// Constantes físicas
const g = 9.81; // aceleração da gravidade (m/s²)
const rho_base = 1000; // densidade da água a 20°C (kg/m³)

// Viscosidade dinâmica da água em função da temperatura (Pa·s)
// Aproximação simplificada
const getViscosity = (T) => {
  // Fórmula empírica para água entre 0-100°C
  return 0.001 * Math.exp(-0.02 * (T - 20));
};

// Densidade da água em função da temperatura (kg/m³)
const getDensity = (T) => {
  // Aproximação: densidade diminui com o aumento da temperatura
  return rho_base * (1 - 0.0002 * (T - 20));
};

/**
 * Calcula a pressão hidrostática
 * P = ρ * g * h
 * @param {number} h - altura da coluna de água (m)
 * @param {number} T - temperatura (°C)
 * @returns {object} - pressão em Pa e fórmula
 */
export const calcPressaoHidrostatica = (h, T = 20) => {
  const rho = getDensity(T);
  const P = rho * g * h;
  return {
    value: P,
    unit: 'Pa',
    formula: 'P = ρ × g × h',
    calculation: `P = ${rho.toFixed(2)} kg/m³ × ${g} m/s² × ${h.toFixed(2)} m = ${P.toFixed(2)} Pa`,
    description: 'Pressão hidrostática na base do recipiente'
  };
};

/**
 * Calcula o empuxo
 * E = ρ * g * V_submerso
 * @param {number} V - volume submerso (m³)
 * @param {number} T - temperatura (°C)
 * @returns {object} - empuxo em N e fórmula
 */
export const calcEmpuxo = (V, T = 20) => {
  const rho = getDensity(T);
  const E = rho * g * V;
  return {
    value: E,
    unit: 'N',
    formula: 'E = ρ × g × V',
    calculation: `E = ${rho.toFixed(2)} kg/m³ × ${g} m/s² × ${V.toFixed(4)} m³ = ${E.toFixed(2)} N`,
    description: 'Força de empuxo exercida pela água'
  };
};

/**
 * Calcula o volume acumulado
 * V = ∫ Q dt (aproximação por soma de Riemann)
 * @param {number} Q - vazão atual (L/min)
 * @param {number} volumeAnterior - volume anterior (L)
 * @param {number} deltaT - intervalo de tempo (min)
 * @returns {object} - volume acumulado
 */
export const calcVolumeAcumulado = (Q, volumeAnterior = 0, deltaT = 1/60) => {
  const V = volumeAnterior + Q * deltaT;
  return {
    value: V,
    unit: 'L',
    formula: 'V = ∫ Q dt',
    calculation: `V = ${volumeAnterior.toFixed(2)} L + ${Q.toFixed(2)} L/min × ${(deltaT * 60).toFixed(1)} s = ${V.toFixed(2)} L`,
    description: 'Volume total acumulado no recipiente'
  };
};

/**
 * Calcula o Número de Reynolds
 * Re = (ρ * v * D) / μ
 * @param {number} Q - vazão (L/min)
 * @param {number} D - diâmetro do tubo (m)
 * @param {number} T - temperatura (°C)
 * @returns {object} - número de Reynolds e tipo de escoamento
 */
export const calcReynolds = (Q, D = 0.025, T = 20) => {
  const rho = getDensity(T);
  const mu = getViscosity(T);
  
  // Converter vazão de L/min para m³/s
  const Q_m3s = Q / 60000;
  
  // Calcular velocidade: v = Q / A
  const A = Math.PI * Math.pow(D / 2, 2);
  const v = Q_m3s / A;
  
  const Re = (rho * v * D) / mu;
  
  let tipo = '';
  if (Re < 2300) tipo = 'Laminar';
  else if (Re < 4000) tipo = 'Transição';
  else tipo = 'Turbulento';
  
  return {
    value: Re,
    unit: '',
    formula: 'Re = (ρ × v × D) / μ',
    calculation: `Re = (${rho.toFixed(2)} kg/m³ × ${v.toFixed(3)} m/s × ${D} m) / ${mu.toFixed(6)} Pa·s = ${Re.toFixed(0)}`,
    description: `Tipo de escoamento: ${tipo}`,
    tipo
  };
};

/**
 * Calcula tempo para encher o recipiente
 * t = V_total / Q
 * @param {number} volumeAtual - volume atual (L)
 * @param {number} volumeTotal - capacidade total (L)
 * @param {number} Q - vazão (L/min)
 * @returns {object} - tempo restante
 */
export const calcTempoParaEncher = (volumeAtual, volumeTotal, Q) => {
  if (Q <= 0) {
    return {
      value: Infinity,
      unit: 'min',
      formula: 't = (V_total - V_atual) / Q',
      calculation: 'Vazão zero - tempo infinito',
      description: 'Tempo estimado para encher completamente'
    };
  }
  
  const volumeRestante = volumeTotal - volumeAtual;
  const t = volumeRestante / Q;
  
  const horas = Math.floor(t / 60);
  const minutos = Math.floor(t % 60);
  const segundos = Math.floor((t % 1) * 60);
  
  return {
    value: t,
    unit: 'min',
    formula: 't = (V_total - V_atual) / Q',
    calculation: `t = (${volumeTotal.toFixed(1)} L - ${volumeAtual.toFixed(2)} L) / ${Q.toFixed(2)} L/min = ${t.toFixed(2)} min`,
    description: `Tempo restante: ${horas}h ${minutos}min ${segundos}s`,
    formatted: `${horas}h ${minutos}min ${segundos}s`
  };
};

/**
 * Equação de Bernoulli simplificada
 * P + (1/2)ρv² + ρgh = constante
 * @param {number} P - pressão (Pa)
 * @param {number} v - velocidade (m/s)
 * @param {number} h - altura (m)
 * @param {number} T - temperatura (°C)
 * @returns {object} - energia total
 */
export const calcBernoulli = (P, v, h, T = 20) => {
  const rho = getDensity(T);
  const energia = P + 0.5 * rho * Math.pow(v, 2) + rho * g * h;
  
  return {
    value: energia,
    unit: 'Pa',
    formula: 'E = P + ½ρv² + ρgh',
    calculation: `E = ${P.toFixed(2)} + ${(0.5 * rho * v * v).toFixed(2)} + ${(rho * g * h).toFixed(2)} = ${energia.toFixed(2)} Pa`,
    description: 'Energia total do fluido (Bernoulli)'
  };
};

/**
 * Perda de carga (fórmula de Darcy-Weisbach simplificada)
 * h_f = f * (L/D) * (v²/2g)
 * @param {number} Q - vazão (L/min)
 * @param {number} L - comprimento do tubo (m)
 * @param {number} D - diâmetro do tubo (m)
 * @param {number} f - fator de atrito (adimensional)
 * @returns {object} - perda de carga
 */
export const calcPerdaDeCarga = (Q, L = 10, D = 0.025, f = 0.02) => {
  // Converter vazão de L/min para m³/s
  const Q_m3s = Q / 60000;
  
  // Calcular velocidade
  const A = Math.PI * Math.pow(D / 2, 2);
  const v = Q_m3s / A;
  
  const h_f = f * (L / D) * (Math.pow(v, 2) / (2 * g));
  
  return {
    value: h_f,
    unit: 'm',
    formula: 'h_f = f × (L/D) × (v²/2g)',
    calculation: `h_f = ${f} × (${L}m / ${D}m) × (${v.toFixed(3)}² m²/s² / ${(2 * g).toFixed(2)}) = ${h_f.toFixed(4)} m`,
    description: 'Perda de carga por atrito no tubo'
  };
};

/**
 * Calcula porcentagem de enchimento
 * @param {number} volumeAtual - volume atual (L)
 * @param {number} volumeTotal - capacidade total (L)
 * @returns {number} - porcentagem (0-100)
 */
export const calcPorcentagemEnchimento = (volumeAtual, volumeTotal) => {
  return Math.min((volumeAtual / volumeTotal) * 100, 100);
};
