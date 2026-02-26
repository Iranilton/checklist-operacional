const registros = carregarRegistros();

const div = document.getElementById("historico");

registros.forEach(r => {
  div.innerHTML += `
    <div class="card">
      <p><b>Equipamento:</b> ${r.equipamento}</p>
      <p><b>Operador:</b> ${r.operador}</p>
      <p><b>Status:</b> ${r.status}</p>
      <p><b>Data:</b> ${r.data}</p>
    </div>
  `;
});