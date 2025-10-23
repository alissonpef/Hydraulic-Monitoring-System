# 🌊 Sistema de Monitoramento Hidráulico

Uma aplicação web desenvolvida em React para monitoramento em tempo real de sensores hidráulicos e cálculos de física aplicada.

## 🚀 Características

- **Monitoramento em Tempo Real**: Conectado ao Firebase Realtime Database para atualização instantânea dos dados
- **Visualização Interativa**: Tanque animado mostrando o nível de água
- **Cálculos Físicos**: Implementação de fórmulas de mecânica dos fluidos
- **Gráficos de Histórico**: Visualização temporal dos dados dos sensores
- **Interface Moderna**: Design responsivo e intuitivo

## 📊 Sensores Monitorados

- **Sensor de Vazão (Q)**: Mede o fluxo de água em L/min
- **Sensor de Nível (h)**: Mede a altura da coluna de água em metros
- **Sensor de Temperatura (T)**: Mede a temperatura da água em °C

## 🧮 Cálculos Implementados

### 1. Pressão Hidrostática
```
P = ρ × g × h
```
Calcula a pressão na base do recipiente considerando a densidade da água ajustada pela temperatura.

### 2. Empuxo
```
E = ρ × g × V_submerso
```
Calcula a força de empuxo exercida pela água.

### 3. Volume Acumulado
```
V = ∫ Q dt
```
Integração numérica da vazão para calcular o volume total.

### 4. Número de Reynolds
```
Re = (ρ × v × D) / μ
```
Determina o tipo de escoamento (laminar, transição ou turbulento).

### 5. Tempo para Encher
```
t = (V_total - V_atual) / Q
```
Estima o tempo restante para encher completamente o recipiente.

### 6. Perda de Carga
```
h_f = f × (L/D) × (v²/2g)
```
Calcula a perda de energia por atrito no tubo.

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd Fetrans
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
   - O arquivo `src/firebase.js` já está configurado
   - Certifique-se de que o Realtime Database está ativo no Firebase Console

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
Fetrans/
├── src/
│   ├── components/
│   │   ├── MetricCard.jsx          # Card para exibir métricas
│   │   ├── MetricCard.css
│   │   ├── TankVisualization.jsx   # Visualização do tanque
│   │   ├── TankVisualization.css
│   │   ├── Chart.jsx               # Gráficos de histórico
│   │   └── Chart.css
│   ├── utils/
│   │   └── physics.js              # Fórmulas e cálculos físicos
│   ├── App.jsx                     # Componente principal
│   ├── App.css
│   ├── firebase.js                 # Configuração Firebase
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

## 🔥 Estrutura do Firebase

No Firebase Realtime Database, organize os dados assim:

```json
{
  "sensores": {
    "vazao": 15.5,      // L/min
    "altura": 0.85,     // metros
    "temperatura": 22.3 // °C
  }
}
```

## 🎨 Recursos Visuais

- **Cards Interativos**: Clique no botão "+" para ver as fórmulas e cálculos detalhados
- **Tanque Animado**: Visualização em tempo real do nível de água com animação de ondas
- **Gráficos Dinâmicos**: Histórico dos últimos 20 pontos de cada sensor
- **Código de Cores**: Indicação visual do nível de enchimento do tanque

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework frontend
- **Vite**: Build tool e dev server
- **Firebase**: Backend e banco de dados em tempo real
- **Recharts**: Biblioteca de gráficos
- **Lucide React**: Ícones modernos
- **CSS3**: Estilização e animações

## 📚 Constantes Físicas

- **g** = 9.81 m/s² (aceleração da gravidade)
- **ρ** = 1000 kg/m³ a 20°C (ajustável pela temperatura)
- **μ** = viscosidade dinâmica calculada em função da temperatura

## 👨‍💻 Autor

Desenvolvido com ❤️ para monitoramento hidráulico inteligente.

