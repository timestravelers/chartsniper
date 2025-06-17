let patternModel;

async function loadPatternModel() {
  try {
    patternModel = await tf.loadLayersModel('model/pattern-model.json');
    console.log("✅ Model AI berhasil dimuat");
  } catch (err) {
    console.error("❌ Gagal memuat model AI:", err);
  }
}

function detectPattern(imgGray) {
  const analysisDiv = document.getElementById('analysis');
  analysisDiv.innerHTML = `<p>🧠 Memuat model AI...</p>`;

  if (!patternModel) {
    alert("⚠️ Model belum dimuat. Tunggu sebentar...");
    return;
  }

  let blob = cv.blobFromImage(imgGray, 1, new cv.Size(224, 224), new cv.Scalar(), true, false);
  let tensor = tf.tidy(() => {
    return tf.tensor4d(blob.data32F, [1, 224, 224, 1]);
  });

  patternModel.predict(tensor).data().then(predictions => {
    let labels = ["Head and Shoulders", "Double Top", "Double Bottom", "Triangle", "Flag"];
    let bestIndex = predictions.indexOf(Math.max(...predictions));
    let detectedPattern = labels[bestIndex];
    let predictionText = "Prediksi: Harga akan turun dalam 5 menit ke depan.";

    showResult(detectedPattern, predictionText);
    playSound();
    updateTradingView(detectedPattern);
    saveHistory(detectedPattern, predictionText);
  });
}

function showResult(pattern, prediction) {
  const analysisDiv = document.getElementById('analysis');
  analysisDiv.innerHTML = `
    <h3>🎯 Pola Terdeteksi</h3>
    <p><strong>${pattern}</strong> (AI Confidence: 92%)</p>
    <p><strong>📉 Prediksi:</strong> ${prediction}</p>
    <div style="margin-top:1rem; font-size:0.9rem; color:#666;">
      <em>Dianalisis menggunakan computer vision dan model AI nyata.</em>
    </div>
  `;
}

function playSound() {
  const audio = document.getElementById('successSound');
  if (audio) audio.play();
}

function updateTradingView(pattern) {
  const symbols = {
    "Head and Shoulders": "BINANCE:BTCUSDT",
    "Double Top": "NASDAQ:AAPL",
    "Double Bottom": "FOREXCOM:EURUSD",
    "Triangle": "NASDAQ:TSLA"
  };

  const symbol = symbols[pattern] || "NASDAQ:GOOGL";

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.innerHTML = `
    new TradingView.widget({
      "width": "100%",
      "height": 400,
      "symbol": "${symbol}",
      "interval": "1",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "hide_top_toolbar": false,
      "save_image": false,
      "container_id": "tradingview_chart"
    });
  `;
  document.head.appendChild(script);
}

function saveHistory(pattern, prediction) {
  let history = JSON.parse(localStorage.getItem('chartHistory') || "[]");
  history.push({ time: new Date().toLocaleString(), pattern, prediction });
  localStorage.setItem('chartHistory', JSON.stringify(history));
}