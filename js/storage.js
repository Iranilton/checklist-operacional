function carregarRegistros() {
  return JSON.parse(localStorage.getItem("registros")) || [];
}

function salvarRegistros(dados) {
  localStorage.setItem("registros", JSON.stringify(dados));
}