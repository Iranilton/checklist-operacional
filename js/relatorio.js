let dadosEquipamentos = null;

const nomeMeses = {
    '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
    '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
    '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

const listaPadrao = [
    { n: 1, item: "Pressão de ar principal", crit: "0,45 - 0,55MPa", met: "Visual", pad: "MED-MC-AC90-001-02" },
    { n: 2, item: "Pressão da Garra A", crit: "AC-90 A/D/E 0,35 - 0,45MPa", met: "Visual", pad: "MED-MC-AC90-002-03" },
    { n: 3, item: "Pressão da Garra B", crit: "AC-90 A/D/E 0,45 - 0,55MPa", met: "Visual", pad: "MED-MC-AC90-003-03" },
    { n: 4, item: "Força da pressão das correias de alimentação do cabo", crit: "AC-90 A/D/E 0,25 - 0,35MPa", met: "Visual", pad: "MED-MC-AC90-004-03" },
    { n: 5, item: "Força da pressão do rolo de medição", crit: "A marca de coincidência está alinhada.", met: "Visual", pad: "MED-MC-AC90-006-02" },
    { n: 6, item: "Verificação dos roletes de correção", crit: "Girar sem dificuldade", met: "Ao Toque", pad: "MED-MC-AC90-007-02" },
    { n: 7, item: "Checagem da rota do cabo", crit: "Sem rebarbas, desgaste, quebra ou danos", met: "Visual", pad: "MED-MC-AC90-008-03" },
    { n: 8, item: "Checagem do detetor de emendas", crit: "Uma emenda de cabo pode ser detectada", met: "Visual", pad: "MED-MC-AC90-009-02" },
    { n: 9, item: "Condição do detetor de emenda de cabo", crit: "A máquina deve parar quando a emenda é detectada", met: "Verificação", pad: "MED-MC-AC90-010-02" },
    { n: 10, item: "Condição detecção desponte lado A/B", crit: "Detectar falha na decapagem no menor cabo", met: "Verificação", pad: "MED-MC-AC90-011-03" },
    { n: 11, item: "Condição do contador de produto com defeito", crit: "Contar logo após erro de desponte ou cravação", met: "Visual", pad: "MED-MC-AC90-012-02" },
    { n: 12, item: "Condição do corte e desponte", crit: "Não ter rebarba, filamento cortado ou marcado", met: "Visual/Lupa", pad: "MED-MC-AC90-013-03" },
    { n: 13, item: "CFM (Verificação da forma de onda exibida)", crit: "Dentro da tolerância da forma da onda padrão", met: "Visual", pad: "MED-MC-AC90-014A-02" },
    { n: 14, item: "Checagem de detecção de CFM", crit: "CFM tem que detectar o defeito nos testes", met: "Operação", pad: "TCC-YM-AC90-014B-00" },
    { n: 15, item: "Resíduos de terminais e isolante", crit: "Tubos de saída não devem estar obstruídos", met: "Visual", pad: "MED-MC-AC90-015-02" },
    { n: 16, item: "Luzes do Andon", crit: "Checar se as luzes estão funcionando", met: "Visual", pad: "TCC-YM-AC90-019-00" },
    { n: 17, item: "Condição dos Bicos e Pintura", crit: "Estar sem danos e com pintura boa", met: "Visual", pad: "TCC-YM-AC90-020-00" },
    { n: 18, item: "Limpeza e organização da Máquina", crit: "Sem poeira, resíduo de cabo ou scrap", met: "Visual", pad: "MED-MC-AC90-021-00" },
    { n: 19, item: "Tubo guia do cabo", crit: "Livre de danos e sujeira", met: "Visual", pad: "TCC-YM-AC90-022-00" },
    { n: 20, item: "Verificar polia do encoder", crit: "Livre de sujeira", met: "Visual", pad: "TCC-YM-AC90-023-00" },
    { n: 21, item: "Equipamentos de medição", crit: "Zerando e dentro do prazo de calibração", met: "Visual", pad: "TCC-YM-AC90-024-00" },
    { n: 22, item: "Proteção principal / alimentação", crit: "Sem partes quebradas ou faltantes", met: "Visual", pad: "TCC-YM-AC90-025-00" },
    { n: 23, item: "Botoeira de emergência", crit: "Em boas condições / sem danos", met: "Visual", pad: "TCC-YM-AC90-026-00" },
    { n: 24, item: "Observações Gerais", crit: "Verificar integridade geral", met: "Visual", pad: "-" }
];

async function carregarDados() {
    try {
        const resp = await fetch('equipamentos.json');
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        dadosEquipamentos = await resp.json();
        preencherSelectEquipamentos();
        atualizarRelatorio();
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
        document.getElementById('infoBox').innerHTML = 'Erro ao carregar equipamentos.json';
        document.getElementById('infoBox').style.display = 'block';
    }
}

function preencherSelectEquipamentos() {
    const select = document.getElementById('selectEquipamento');
    select.innerHTML = '<option value="">-- Selecione --</option>';
    if (dadosEquipamentos && dadosEquipamentos.equipamentos) {
        dadosEquipamentos.equipamentos.forEach(eq => {
            const option = document.createElement('option');
            option.value = eq.codigo;
            option.textContent = `${eq.codigo} - ${eq.nome}`;
            select.appendChild(option);
        });
        // Seleciona o primeiro equipamento por padrão
        if (dadosEquipamentos.equipamentos.length > 0) {
            select.value = dadosEquipamentos.equipamentos[0].codigo;
        }
    }
}

function atualizarRelatorio() {
    const codigoEquipamento = document.getElementById('selectEquipamento').value;
    const mesValue = document.getElementById('selectMes').value;
    const anoValue = document.getElementById('selectAno').value;

    if (!codigoEquipamento) {
        document.getElementById('main-body').innerHTML = '<tr><td colspan="37">Selecione um equipamento</td></tr>';
        return;
    }

    // Encontra o equipamento
    const equipamento = dadosEquipamentos.equipamentos.find(e => e.codigo === codigoEquipamento);
    if (!equipamento) {
        document.getElementById('main-body').innerHTML = '<tr><td colspan="37">Equipamento não encontrado</td></tr>';
        return;
    }

    // Encontra o tipo e modelo pelo modelo do equipamento
    const tipo = dadosEquipamentos.tipos.find(t => t.modelos?.some(m => m.id === equipamento.modelo));
    if (!tipo) {
        document.getElementById('main-body').innerHTML = '<tr><td colspan="37">Tipo de equipamento não encontrado</td></tr>';
        return;
    }

    const modelo = tipo.modelos.find(m => m.id === equipamento.modelo);
    const itens = modelo?.itensRelatorio || listaPadrao;

    // Calcula número de dias no mês
    const diasNoMes = new Date(anoValue, parseInt(mesValue), 0).getDate();
    const mesNome = nomeMeses[mesValue];

    // Atualiza header
    document.getElementById('equipCodigo').textContent = equipamento.codigo;
    document.getElementById('equipTipo').textContent = tipo.descricao;
    const equipAtivoEl = document.getElementById('equipAtivo');
    if (equipAtivoEl) equipAtivoEl.textContent = equipamento.ativo || '-';
    document.getElementById('mesAnoHeader').textContent = `MÊS: ${mesNome.toUpperCase()} / ${anoValue}`;
    document.getElementById('mesAnoHeader').colSpan = 31; // 31 dias

    // Gera header de dias (sempre 31)
    let headerDias = '';
    for (let i = 1; i <= 31; i++) {
        headerDias += `<th class="col-dia">${i}</th>`;
    }
    const diasRow = document.getElementById('diasRow');
    diasRow.innerHTML = headerDias;

    // Preenche tabela com itens (sempre 31 dias)
    const tbody = document.getElementById('main-body');
    tbody.innerHTML = itens.map(i => `
        <tr>
            <td>${i.n}</td>
            <td class="left-align">${i.item}</td>
            <td class="left-align">${i.crit}</td>
            <td>${i.met}</td>
            <td>${i.pad}</td>
            ${'<td><input type="text" class="day-input" list="legenda" /></td>'.repeat(31)}
        </tr>`).join('');
}

// Event listeners para atualizar relatório quando controles mudarem
document.getElementById('selectEquipamento').addEventListener('change', atualizarRelatorio);
document.getElementById('selectMes').addEventListener('change', atualizarRelatorio);
document.getElementById('selectAno').addEventListener('change', atualizarRelatorio);

// Carrega dados ao abrir a página
window.addEventListener('load', carregarDados);
