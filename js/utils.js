function shareAnalysis() {
  const analysisDiv = document.getElementById('analysis');
  const pattern = analysisDiv.querySelector('h3')?.nextElementSibling?.innerText || "Tidak dikenali";
  const prediction = analysisDiv.querySelector('p:nth-child(3)')?.innerText || "Tidak tersedia";

  const text = `📈 ChartSniper Pro v3\nPola: ${pattern}\nPrediksi: ${prediction}`;
  if (navigator.share) {
    navigator.share({ text }).catch(console.error);
  } else {
    alert("📲 Browser tidak mendukung fitur share.");
  }
}

function exportToPDF() {
  html2canvas(document.body).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save(`analisis_chart_${new Date().toISOString().split('T')[0]}.pdf`);
  });
}