import React, { useState, useEffect } from 'react';
import { database, ref, onValue } from '../firebase';
import './FirebaseTest.css';

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    console.log('🔍 Iniciando teste de conexão Firebase...');
    
    try {
      // Referência ao marker_0
      const markerRef = ref(database, 'markers/marker_0');
      
      // Listener para mudanças
      const unsubscribe = onValue(
        markerRef,
        (snapshot) => {
          const data = snapshot.val();
          console.log('✅ Dados recebidos do Firebase (marker_0):', data);
          
          if (data) {
            setRawData(data);
            setConnectionStatus('✅ Conectado');
            setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
            setError(null);
          } else {
            setConnectionStatus('⚠️ Conectado, mas sem dados');
            setError('Nenhum dado encontrado em /markers/marker_0. Verifique se os sensores estão enviando dados.');
          }
        },
        (error) => {
          console.error('❌ Erro ao conectar:', error);
          setConnectionStatus('❌ Erro na conexão');
          setError(error.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Erro ao inicializar:', err);
      setConnectionStatus('❌ Erro na inicialização');
      setError(err.message);
    }
  }, []);

  return (
    <div className="firebase-test">
      <h2>🔥 Teste de Conexão Firebase</h2>
      
      <div className={`status-badge ${connectionStatus.includes('✅') ? 'success' : connectionStatus.includes('⚠️') ? 'warning' : 'error'}`}>
        {connectionStatus}
      </div>

      {lastUpdate && (
        <p className="last-update">Última atualização: {lastUpdate}</p>
      )}

      {error && (
        <div className="error-box">
          <strong>❌ Erro:</strong>
          <p>{error}</p>
          <div className="error-help">
            <strong>💡 Como resolver:</strong>
            <ol>
              <li>Abra o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Vá para <strong>Realtime Database</strong></li>
              <li>Adicione os dados de teste (veja FIREBASE_SETUP.md)</li>
              <li>Configure as regras de segurança para permitir leitura</li>
            </ol>
          </div>
        </div>
      )}

      {rawData && (
        <div className="data-display">
          <h3>📊 Dados Recebidos (marker_0):</h3>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Vazão (waterFlow):</span>
              <span className="data-value">{rawData.waterFlow || 'N/A'} L/min</span>
            </div>
            <div className="data-item">
              <span className="data-label">Altura (waterLevel):</span>
              <span className="data-value">{rawData.waterLevel || 'N/A'} m</span>
            </div>
            <div className="data-item">
              <span className="data-label">Temperatura:</span>
              <span className="data-value">{rawData.temperature || 'N/A'} °C</span>
            </div>
            <div className="data-item">
              <span className="data-label">Umidade:</span>
              <span className="data-value">{rawData.humidity || 'N/A'} %</span>
            </div>
            <div className="data-item">
              <span className="data-label">Status Portão:</span>
              <span className="data-value">{rawData.isGateOpen ? '🟢 Aberto' : '🔴 Fechado'}</span>
            </div>
          </div>

          <details className="raw-data">
            <summary>Ver JSON Bruto</summary>
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </details>
        </div>
      )}

      <div className="instructions">
        <h3>📝 Estrutura Atual no Firebase:</h3>
        <pre>{`{
  "markers": {
    "marker_0": {
      "humidity": 10,
      "isGateOpen": false,
      "latitude": -28.8077026605529,
      "longitude": -49.338491857051,
      "temperature": 10,
      "waterFlow": 2,
      "waterLevel": 2
    }
  }
}`}</pre>
      </div>
    </div>
  );
};

export default FirebaseTest;
