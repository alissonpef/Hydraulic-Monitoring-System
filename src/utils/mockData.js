export const generateMockData = () => {
  return {
    vazao: Math.random() * 20 + 5, // 5-25 L/min
    altura: Math.random() * 1.5 + 0.2, // 0.2-1.7 m
    temperatura: Math.random() * 10 + 15 // 15-25 °C
  };
};

// Simula atualizações em tempo real
export const startMockDataStream = (callback, interval = 2000) => {
  const intervalId = setInterval(() => {
    callback(generateMockData());
  }, interval);

  return () => clearInterval(intervalId);
};

