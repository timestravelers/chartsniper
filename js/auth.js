function saveHistory(pattern, prediction) {
  let history = JSON.parse(localStorage.getItem('chartHistory') || "[]");
  history.push({ time: new Date().toLocaleString(), pattern, prediction });
  localStorage.setItem('chartHistory', JSON.stringify(history));
}

function getHistory() {
  return JSON.parse(localStorage.getItem('chartHistory') || "[]");
}