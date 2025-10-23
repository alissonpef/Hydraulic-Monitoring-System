import { useState, useEffect } from 'react';
import { database, ref, onValue } from './firebase';
import MetricCard from './components/MetricCard';
import TankVisualization from './components/TankVisualization';
import Chart from './components/Chart';
import FirebaseTest from './components/FirebaseTest';
import Modal from './components/Modal';
import {
  calcPressaoHidrostatica,
  calcEmpuxo,
  calcVolumeAcumulado,
  calcReynolds,
  calcTempoParaEncher,
  calcPerdaDeCarga,
  calcPorcentagemEnchimento
} from './utils/physics';
import {
  Droplet,
  Gauge,
  Wind,
  Thermometer,
  Clock,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import './App.css';

function App() {
  // Estados para dados dos sensores
  const [vazao, setVazao] = useState(0); // L/min
  const [altura, setAltura] = useState(0); // m
  const [temperatura, setTemperatura] = useState(20); // °C
  
  // Estados para dados calculados
  const [volumeAcumulado, setVolumeAcumulado] = useState(0);
  
  // Estado para o modal de tempo
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  // Histórico para gráficos (últimos 20 pontos)
  const [historicoVazao, setHistoricoVazao] = useState([]);
  const [historicoAltura, setHistoricoAltura] = useState([]);
  const [historicoTemperatura, setHistoricoTemperatura] = useState([]);
  
  // Configurações do recipiente
  const VOLUME_TOTAL = 100; // Litros
  const DIAMETRO_TUBO = 0.025; // metros (25mm)
  const COMPRIMENTO_TUBO = 10; // metros

  // Conectar ao Firebase Realtime Database
  useEffect(() => {
    console.log('🔄 Configurando listeners do Firebase...');
    
    // Referência ao marker_0 no Firebase
    const markerRef = ref(database, 'markers/marker_0');

    // Listener para atualização em tempo real
    const unsubscribe = onValue(markerRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 Dados recebidos do marker_0:', data);
      
      if (data !== null) {
        // Extrair dados dos sensores com validação
        const vazaoAtual = Number(data.waterFlow) || 0; // L/min
        const alturaAtual = Number(data.waterLevel) || 0; // m
        const temperaturaAtual = Number(data.temperature) || 20; // °C
        
        console.log('💧 Vazão (waterFlow):', vazaoAtual, 'tipo:', typeof data.waterFlow);
        console.log('📏 Altura (waterLevel):', alturaAtual, 'tipo:', typeof data.waterLevel, 'valor original:', data.waterLevel);
        console.log('🌡️ Temperatura:', temperaturaAtual);
        
        // Atualizar estados
        setVazao(vazaoAtual);
        setAltura(alturaAtual);
        setTemperatura(temperaturaAtual);
        
        // Atualizar históricos
        const timestamp = Date.now();
        setHistoricoVazao(prev => [...prev.slice(-19), { timestamp, value: vazaoAtual }]);
        setHistoricoAltura(prev => [...prev.slice(-19), { timestamp, value: alturaAtual }]);
        setHistoricoTemperatura(prev => [...prev.slice(-19), { timestamp, value: temperaturaAtual }]);
      } else {
        console.warn('⚠️ Nenhum dado encontrado em markers/marker_0');
      }
    }, (error) => {
      console.error('❌ Erro ao ler dados:', error);
    });

    console.log('✅ Listener configurado com sucesso para markers/marker_0!');

    // Cleanup
    return () => {
      console.log('🧹 Limpando listener...');
      unsubscribe();
    };
  }, []);

  // Atualizar volume acumulado
  useEffect(() => {
    const interval = setInterval(() => {
      setVolumeAcumulado(prev => {
        const novoVolume = calcVolumeAcumulado(vazao, prev, 1/60).value;
        return Math.min(novoVolume, VOLUME_TOTAL);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [vazao]);

  // Cálculos
  const pressao = calcPressaoHidrostatica(altura, temperatura);
  const empuxo = calcEmpuxo((altura * Math.PI * 0.25 * 0.25), temperatura); // Assumindo raio de 0.5m
  const reynolds = calcReynolds(vazao, DIAMETRO_TUBO, temperatura);
  const tempoRestante = calcTempoParaEncher(volumeAcumulado, VOLUME_TOTAL, vazao);
  const perdaCarga = calcPerdaDeCarga(vazao, COMPRIMENTO_TUBO, DIAMETRO_TUBO);
  const porcentagem = calcPorcentagemEnchimento(volumeAcumulado, VOLUME_TOTAL);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <Droplet size={32} />
            Sistema de Monitoramento Hidráulico
          </h1>
          <p className="header-subtitle">
            Análise em tempo real de sensores e cálculos de física aplicada
          </p>
        </div>
      </header>

      <main className="main-content">
        {/* Teste de Conexão Firebase */}
        <section className="section">
          <FirebaseTest />
        </section>

        {/* Visualização do Tanque */}
        <section className="tank-section">
          <TankVisualization
            percentage={porcentagem}
            volumeAtual={volumeAcumulado}
            volumeTotal={VOLUME_TOTAL}
            altura={altura}
          />
        </section>

        {/* Dados dos Sensores */}
        <section className="section">
          <h2 className="section-title">Leituras dos Sensores</h2>
          <div className="metrics-grid">
            <MetricCard
              title="Vazão"
              value={vazao}
              unit="L/min"
              formula="Q = volume / tempo"
              calculation={`Q = ${vazao.toFixed(2)} L/min (leitura direta do sensor)`}
              description="Taxa de fluxo de água medida pelo sensor"
              icon={Wind}
              color="#3b82f6"
            />
            <MetricCard
              title="Altura/Nível"
              value={altura}
              unit="m"
              formula="h = altura medida"
              calculation={`h = ${altura.toFixed(2)} m (leitura direta do sensor)`}
              description="Altura da coluna de água no recipiente"
              icon={TrendingUp}
              color="#22c55e"
            />
            <MetricCard
              title="Temperatura"
              value={temperatura}
              unit="°C"
              formula="T = temperatura"
              calculation={`T = ${temperatura.toFixed(2)} °C (leitura direta do sensor)`}
              description="Temperatura da água no sistema"
              icon={Thermometer}
              color="#f59e0b"
            />
          </div>
        </section>

        {/* Tempo para Encher */}
        <section className="section highlight-section">
          <div className="time-card">
            <Clock size={48} color="#8b5cf6" />
            <div className="time-info">
              <h2 className="time-title">Tempo para Encher</h2>
              <p className="time-value">{tempoRestante.formatted || 'Calculando...'}</p>
              <button
                className="time-button"
                onClick={() => setShowTimeModal(true)}
              >
                <span>+</span> Ver cálculo
              </button>
            </div>
          </div>
        </section>

        <Modal
          isOpen={showTimeModal}
          onClose={() => setShowTimeModal(false)}
          title="⏱️ Tempo para Encher"
        >
          <div className="formula-display">
            <h3>📐 Fórmula:</h3>
            <div className="formula-math">{tempoRestante.formula}</div>

            <h3>🧮 Cálculo:</h3>
            <div className="formula-calc">{tempoRestante.calculation}</div>

            <div className="formula-result" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              {tempoRestante.formatted || 'Calculando...'}
            </div>

            <h3>📝 Descrição:</h3>
            <div className="formula-desc">{tempoRestante.description}</div>
          </div>
        </Modal>

        {/* Cálculos Físicos */}
        <section className="section">
          <h2 className="section-title">Análises Físicas</h2>
          <div className="metrics-grid">
            <MetricCard
              title="Pressão Hidrostática"
              value={pressao.value}
              unit={pressao.unit}
              formula={pressao.formula}
              calculation={pressao.calculation}
              description={pressao.description}
              icon={Gauge}
              color="#06b6d4"
            />
            <MetricCard
              title="Empuxo"
              value={empuxo.value}
              unit={empuxo.unit}
              formula={empuxo.formula}
              calculation={empuxo.calculation}
              description={empuxo.description}
              icon={Activity}
              color="#8b5cf6"
            />
            <MetricCard
              title="Número de Reynolds"
              value={reynolds.value}
              unit={reynolds.unit}
              formula={reynolds.formula}
              calculation={reynolds.calculation}
              description={reynolds.description}
              icon={Zap}
              color="#ec4899"
            />
            <MetricCard
              title="Perda de Carga"
              value={perdaCarga.value}
              unit={perdaCarga.unit}
              formula={perdaCarga.formula}
              calculation={perdaCarga.calculation}
              description={perdaCarga.description}
              icon={TrendingUp}
              color="#ef4444"
            />
          </div>
        </section>

        {/* Gráficos de Histórico */}
        <section className="section">
          <h2 className="section-title">Histórico de Medições</h2>
          <div className="charts-grid">
            <Chart
              data={historicoVazao}
              title="Vazão ao Longo do Tempo"
              dataKey="value"
              color="#3b82f6"
              unit="L/min"
            />
            <Chart
              data={historicoAltura}
              title="Altura ao Longo do Tempo"
              dataKey="value"
              color="#22c55e"
              unit="m"
            />
            <Chart
              data={historicoTemperatura}
              title="Temperatura ao Longo do Tempo"
              dataKey="value"
              color="#f59e0b"
              unit="°C"
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Sistema de Monitoramento Hidráulico - Análise em Tempo Real</p>
        <p>Dados obtidos via Firebase Realtime Database</p>
      </footer>
    </div>
  );
}

export default App;
