let registros = carregarRegistros();

function atualizar() {
  mostrarPendentes();
  mostrarAgendados();
}

function mostrarPendentes() {
  const div = document.getElementById("pendentes");
  div.innerHTML = "";

  registros.forEach((r, i) => {
    if (r.status !== "pendente") return;

    div.innerHTML += `
      <div class="card">
        <h3>${r.equipamento}</h3>
        <p>Operador: ${r.operador}</p>
        <p>Observação: ${r.observacao || "Nenhuma"}</p>

        <label>Data validação:</label>
        <input type="date" id="val_${i}">
        <button onclick="validar(${i})">Validar</button>

        <br><br>

        <label>Agendar intervenção:</label>
        <input type="date" id="ag_${i}">
        <button onclick="agendar(${i})">Agendar</button>
      </div>
    `;
  });
}

function validar(i) {
  const data = document.getElementById(`val_${i}`).value;
  if (!data) {
    console.log("Escolha data");
    return;
  }

  registros[i].status = "validado";
  registros[i].dataValidacao = data;

  salvarRegistros(registros);
  atualizar();
}

function agendar(i) {
  const data = document.getElementById(`ag_${i}`).value;
  if (!data) {
    console.log("Escolha data");
    return;
  }

  registros[i].status = "agendado";
  registros[i].dataIntervencao = data;

  salvarRegistros(registros);
  atualizar();
}

function mostrarAgendados() {
  const div = document.getElementById("agendados");
  div.innerHTML = "";

  registros.forEach(r => {
    if (r.status !== "agendado") return;

    div.innerHTML += `
      <div class="card">
        <h3>${r.equipamento}</h3>
        <p>Intervenção: ${r.dataIntervencao}</p>
      </div>
    `;
  });
}

atualizar();