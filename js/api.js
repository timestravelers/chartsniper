const API_KEY = "YOUR_TWELVEDATA_API_KEY"; // Ganti dengan API key kamu

async function getHistoricalData(symbol = "BTC.USD") {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=50&apikey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.values || data.values.length === 0) return null;
    return data.values.reverse();
  } catch (err) {
    console.error("🌐 Gagal mengambil data:", err);
    return null;
  }
}

async function fetchAndPredictPrice(dataPoints) {
  const prices = dataPoints.map(d => parseFloat(d.close));
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const volatility = Math.max(...prices) - Math.min(...prices);
  const predictedPrice = avg + (Math.random() * volatility * (Math.random() < 0.5 ? -1 : 1));
  return predictedPrice.toFixed(4);
}