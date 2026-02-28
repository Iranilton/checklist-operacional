let dadosEquipamentos = null;

const nomeMeses = {
    '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
    '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
    '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

const carregarDados = async () => {
    try {
        const resp = await fetch('equipamentos.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        dadosEquipamentos = await resp.json();

        preencherSelectEquipamentos();

        const inputData = document.getElementById('inputData');
        if (inputData) inputData.value = new Date().toISOString().slice(0, 10);

    } catch (e) {
        console.error('Erro ao carregar dados:', e);
        const info = document.getElementById('infoBox');
        if (info) {
            info.textContent = 'Erro ao carregar equipamentos.json';
            info.style.display = 'block';
        }
    }
};

const preencherSelectEquipamentos = () => {
    const select = document.getElementById('selectEquipamento');
    select.innerHTML = '<option value="">-- Selecione --</option>';

    dadosEquipamentos?.equipamentos?.forEach(eq => {
        const option = document.createElement('option');
        option.value = eq.codigo;
        option.textContent = `${eq.codigo} - ${eq.nome}`;
        select.appendChild(option);
    });

    if (dadosEquipamentos?.equipamentos?.length) {
        select.value = dadosEquipamentos.equipamentos[0].codigo;
        atualizarRelatorio();
    }
};

function escaparHTML(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const atualizarRelatorio = () => {
    const codigo = document.getElementById('selectEquipamento').value;
    const dataStr = document.getElementById('inputData').value;
    const mainBody = document.getElementById('main-body');

    fecharDialogoProblema();
    fecharDialogoPadrao();

    if (!codigo || !dataStr) {
        mainBody.innerHTML = '<tr><td colspan="7">Selecione equipamento e dia</td></tr>';
        return;
    }

    const equipamento = dadosEquipamentos.equipamentos.find(e => e.codigo === codigo);
    if (!equipamento) return;

    const tipo = dadosEquipamentos.tipos.find(t => t.modelos?.some(m => m.id === equipamento.modelo));
    const modelo = tipo?.modelos.find(m => m.id === equipamento.modelo);
    const itens = modelo?.itensRelatorio;

    if (!itens || !itens.length) {
        mainBody.innerHTML = '<tr><td colspan="7">Nenhum item disponível</td></tr>';
        return;
    }

    const [ano, mes, dia] = dataStr.split('-');

    document.getElementById('equipCodigo').textContent = equipamento.codigo;
    document.getElementById('equipTipo').textContent = tipo?.descricao || '-';
    document.getElementById('periodoData').textContent = `${dia}/${mes}/${ano}`;
    document.getElementById('diaHeader').textContent = `DIA ${dia}`;

    mainBody.innerHTML = itens.map(i => {
        const padrao = escaparHTML(i.pad);
        const docUrl = escaparHTML(i.docUrl || i.link || '');

        return `
        <tr>
            <td>${i.n}</td>
            <td class="left-align">${i.item}</td>
            <td class="left-align">${i.crit}</td>
            <td>${i.met}</td>
            <td>
              <a href="#" class="padrao-link" data-padrao="${padrao}" data-doc-url="${docUrl}">${padrao}</a>
            </td>
            <td class="day-cell"></td>
        </tr>
    `;
    }).join('');
};

window.addEventListener('load', carregarDados);
document.getElementById('selectEquipamento')?.addEventListener('change', atualizarRelatorio);
document.getElementById('inputData')?.addEventListener('change', atualizarRelatorio);

///////////////////////////////////////////////////////////
//////////////////// MENU CIRCULAR ////////////////////////
///////////////////////////////////////////////////////////

const menuCircular = document.getElementById('menuCircular');

const legendaOptions = Array.from(
  document.querySelectorAll('#legenda option')
).map(opt => opt.value).filter(v => v !== '');

let itensCriados = [];
let celulaAtiva = null;
let dialogProblema = null;
let inputProblema = null;
let erroProblema = null;
let celulaDialogoAtiva = null;
let dialogPadrao = null;
let tituloPadrao = null;
let conteudoPadrao = null;

function criarDialogoProblema() {
  if (dialogProblema) return;

  dialogProblema = document.createElement('div');
  dialogProblema.className = 'problema-dialog';
  dialogProblema.style.display = 'none';
  dialogProblema.innerHTML = `
    <div class="problema-dialog-title">Descricao do problema</div>
    <textarea id="problemaInput" class="problema-dialog-input" placeholder="Descreva o problema..."></textarea>
    <div id="problemaErro" class="problema-dialog-error" style="display:none;">Descricao obrigatoria para resposta X.</div>
    <div class="problema-dialog-actions">
      <button type="button" id="problemaCancelar" class="problema-btn problema-btn-cancelar">Cancelar</button>
      <button type="button" id="problemaSalvar" class="problema-btn problema-btn-salvar">Salvar</button>
    </div>
  `;

  document.body.appendChild(dialogProblema);

  inputProblema = document.getElementById('problemaInput');
  erroProblema = document.getElementById('problemaErro');
  const btnCancelar = document.getElementById('problemaCancelar');
  const btnSalvar = document.getElementById('problemaSalvar');

  dialogProblema.addEventListener('click', e => e.stopPropagation());
  btnCancelar.addEventListener('click', fecharDialogoProblema);
  btnSalvar.addEventListener('click', salvarDescricaoProblema);
  inputProblema.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') salvarDescricaoProblema();
  });
}

function abrirDialogoProblema(td) {
  if (!td) return;

  criarDialogoProblema();
  celulaDialogoAtiva = td;

  const rect = td.getBoundingClientRect();
  dialogProblema.style.left = `${rect.left + rect.width / 2}px`;
  dialogProblema.style.top = `${rect.top + rect.height / 2}px`;
  dialogProblema.style.display = 'block';

  inputProblema.value = td.dataset.problema || '';
  erroProblema.style.display = 'none';

  setTimeout(() => inputProblema.focus(), 0);
}

function fecharDialogoProblema() {
  if (!dialogProblema) return;
  dialogProblema.style.display = 'none';
  celulaDialogoAtiva = null;
}

function salvarDescricaoProblema() {
  if (!celulaDialogoAtiva) return;

  const descricao = inputProblema.value.trim();
  if (!descricao) {
    erroProblema.style.display = 'block';
    inputProblema.focus();
    return;
  }

  celulaDialogoAtiva.textContent = 'X';
  celulaDialogoAtiva.dataset.problema = descricao;
  celulaDialogoAtiva.title = `Problema: ${descricao}`;
  fecharDialogoProblema();
}

function criarDialogoPadrao() {
  if (dialogPadrao) return;

  dialogPadrao = document.createElement('div');
  dialogPadrao.className = 'padrao-dialog';
  dialogPadrao.style.display = 'none';
  dialogPadrao.innerHTML = `
    <div class="padrao-dialog-title" id="padraoDialogTitle"></div>
    <div class="padrao-dialog-content" id="padraoDialogContent"></div>
  `;

  document.body.appendChild(dialogPadrao);
  tituloPadrao = document.getElementById('padraoDialogTitle');
  conteudoPadrao = document.getElementById('padraoDialogContent');

  dialogPadrao.addEventListener('click', e => e.stopPropagation());
}

function abrirDialogoPadrao(linkEl) {
  if (!linkEl) return;

  criarDialogoPadrao();
  const codigoPadrao = linkEl.dataset.padrao || linkEl.textContent || '-';
  const urlDocumento = linkEl.dataset.docUrl || '';

  tituloPadrao.textContent = `Padrao ${codigoPadrao}`;
  if (urlDocumento) {
    conteudoPadrao.innerHTML = `
      <a class="padrao-doc-btn" href="${escaparHTML(urlDocumento)}" target="_blank" rel="noopener noreferrer">
        Abrir documento/foto
      </a>
    `;
  } else {
    conteudoPadrao.textContent = 'Link do documento/foto ainda nao configurado para este item.';
  }

  const rect = linkEl.getBoundingClientRect();
  dialogPadrao.style.left = `${rect.left + rect.width / 2}px`;
  dialogPadrao.style.top = `${rect.top + rect.height / 2}px`;
  dialogPadrao.style.display = 'block';
}

function fecharDialogoPadrao() {
  if (!dialogPadrao) return;
  dialogPadrao.style.display = 'none';
}

legendaOptions.forEach(valor => {
  const el = document.createElement('div');
  el.className = 'menu-item';
  el.textContent = valor;

  el.addEventListener('click', e => {
    e.stopPropagation();
    if (!celulaAtiva) {
      fecharMenu();
      return;
    }

    if (valor === 'X') {
      const td = celulaAtiva;
      fecharMenu();
      abrirDialogoProblema(td);
      return;
    }

    celulaAtiva.textContent = valor;
    delete celulaAtiva.dataset.problema;
    celulaAtiva.removeAttribute('title');
    fecharMenu();
  });

  menuCircular.appendChild(el);
  itensCriados.push(el);
});

function abrirMenu(td) {
  fecharDialogoPadrao();
  fecharDialogoProblema();
  celulaAtiva = td;

  const rect = td.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  menuCircular.style.display = 'block';

  const raio = 65;
  const total = itensCriados.length;

  itensCriados.forEach((el, index) => {
    const angulo = (index / total) * 2 * Math.PI - Math.PI / 2;

    const x = centerX + Math.cos(angulo) * raio;
    const y = centerY + Math.sin(angulo) * raio;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

function fecharMenu() {
  itensCriados.forEach(el => {
    el.style.transform = 'translate(-50%, -50%) scale(0)';
  });

  menuCircular.style.display = 'none';
  celulaAtiva = null;
}

document.body.addEventListener('click', () => {
  fecharMenu();
  fecharDialogoProblema();
  fecharDialogoPadrao();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    fecharMenu();
    fecharDialogoProblema();
    fecharDialogoPadrao();
  }
});

menuCircular.addEventListener('click', e => e.stopPropagation());

document.addEventListener('click', e => {
  const linkPadrao = e.target.closest('.padrao-link');
  if (linkPadrao) {
    e.preventDefault();
    e.stopPropagation();
    fecharMenu();
    fecharDialogoProblema();
    abrirDialogoPadrao(linkPadrao);
    return;
  }

  const td = e.target.closest('#main-body .day-cell');
  if (td) {
    e.stopPropagation();
    abrirMenu(td);
  }
});
