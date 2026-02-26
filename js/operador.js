let equipamentos = [];

async function carregarEquipamentos() {
  const res = await fetch("equipamentos.json");
  const dados = await res.json();

  equipamentos = dados.equipamentos;

  const select = document.getElementById("equipamento");

  equipamentos.forEach((e, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = e.nome;
    select.appendChild(opt);
  });

  select.onchange = montarChecklist;
  montarChecklist();
}

function montarChecklist() {
  const i = document.getElementById("equipamento").value;
  const lista = equipamentos[i].checklist;

  const div = document.getElementById("checklist");
  div.innerHTML = "";

  lista.forEach((item, idx) => {
    div.innerHTML += `
      <p>${item}
      <select id="item_${idx}">
        <option value="ok">OK</option>
        <option value="erro">Erro</option>
      </select></p>
    `;
  });
}

function enviarChecklist() {
  const registros = carregarRegistros();
  const operador = localStorage.getItem("operador");

  const i = document.getElementById("equipamento").value;
  const equip = equipamentos[i];

  const respostas = equip.checklist.map((_, idx) =>
    document.getElementById(`item_${idx}`).value
  );

  registros.push({
    operador,
    equipamento: equip.nome,
    respostas,
    observacao: document.getElementById("observacao").value,
    data: new Date().toLocaleString(),
    status: "pendente"
  });

  salvarRegistros(registros);

  alert("Checklist enviado!");
}

carregarEquipamentos();