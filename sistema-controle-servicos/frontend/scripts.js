// No topo do arquivo scripts.js
import { request } from "./shared/api.js"; // Ajuste o caminho se necessário

// Variáveis globais que você já tem
let equipment = [];
let labor = []; // representa funcionario
let clientes = []

const modalBackdrop = document.getElementById('novo-projeto-modal-backdrop');
const modalContainer = document.getElementById('novo-projeto-modal-container');

async function carregarDadosIniciais() {
    console.log("Buscando dados iniciais da API...");
    try {
        // Promise.all faz as requisições em paralelo

        const results = await Promise.allSettled([
            request('/equipamento'),
            request('/funcionario'),
            request('/cliente')
        ]);
        // Agora verificamos cada resultado individualmente
        if (results[0].status === 'fulfilled') {
            equipment = results[0].value || [];
        } else {
            console.error("Erro ao buscar equipamentos:", results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
            labor = results[1].value || [];
        } else {
            console.error("Erro ao buscar funcionários:", results[1].reason);
        }

        if (results[2].status === 'fulfilled') {
            clientes = results[2].value || [];
        } else {
            console.error("Erro ao buscar clientes:", results[2].reason);
        }

        console.log("Dados carregados com sucesso!", { equipment, labor, clientes });

    } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        alert("Não foi possível carregar os recursos do servidor. Usando dados de exemplo.");
    }
}

async function abrirModalNovoProjeto() {
    if (!document.getElementById('novoprojeto-css')) {
        const linkCSS = document.createElement("link");
        linkCSS.rel = "stylesheet";
        linkCSS.href = "novoprojeto/novoprojeto.css";
        linkCSS.id = "novoprojeto-css";
        document.head.appendChild(linkCSS);
    }
    const modalContainer = document.getElementById('novo-projeto-modal-container');
    const resposta = await fetch('novoprojeto/novoprojeto.html');
    modalContainer.innerHTML = await resposta.text();
    
    modalBackdrop.classList.add('active');
    configurarFormNovoProjeto();
    document.getElementById('close-modal-btn').addEventListener('click', fecharModalNovoProjeto);
}


function fecharModalNovoProjeto() {
    modalBackdrop.classList.remove('active');
    modalContainer.innerHTML = '';
    const linkCSS = document.getElementById('novoprojeto-css');
    if (linkCSS) {
        linkCSS.remove();
    }
}

// Lógica para carregar páginas no "conteudo"
async function carregarPagina(pagina) {
    console.log("Carregando:", pagina);
    try {
        const resposta = await fetch(pagina);
        if (!resposta.ok) throw new Error("Erro ao carregar " + pagina);
        const html = await resposta.text();
        document.getElementById("conteudo").innerHTML = html;

        const linkCSS = document.querySelector("#extra-css");
        if (linkCSS) linkCSS.remove();

        if (pagina.includes("dashboard")) {
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "dashboard/dashboard.css";
            css.id = "extra-css";
            document.head.appendChild(css);
        }

        // if (pagina.includes("novoprojeto")) {
        //     let css = document.createElement("link");
        //     css.rel = "stylesheet";
        //     css.href = "novoprojeto/novoprojeto.css";
        //     css.id = "extra-css";
        //     document.head.appendChild(css);
        //     setTimeout(() => { configurarFormNovoProjeto(); }, 0);
        // }

        if (pagina.includes("configuracoes")) {
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "configuracoes/configuracoes.css";
            css.id = "extra-css";
            document.head.appendChild(css);
            setTimeout(() => { configurarPaginaConfiguracoes(); }, 0);
        }

    } catch (err) {
        document.getElementById("conteudo").innerHTML = "<p>Erro ao carregar página</p>";
        console.error(err);
    }
}

// Navegação
function configurarNavegacao() {
    document.getElementById('btn-abrir-modal-projeto').addEventListener('click', abrirModalNovoProjeto);
    const links = document.querySelectorAll(".nav-btn");
    links.forEach(link => {
        link.addEventListener("click", () => {
            const pagina = link.getAttribute("data-page");
            if (pagina) {
                carregarPagina(pagina);
            }
        });
    });
}

// --- Lógica do formulário de Novo Projeto ---
function configurarFormNovoProjeto() {
    console.log("Configurando o formulário de novo projeto com UI melhorada...");

    // 1. PEGAR OS ELEMENTOS DO FORMULÁRIO (sem alterações aqui)
    const form = document.getElementById('form-novo-servico');
    const clienteSelect = document.getElementById('servico-cliente');
    const dataInicioInput = document.getElementById('servico-data-inicio');
    const dataFimInput = document.getElementById('servico-data-fim');
    const orcamentoInput = document.getElementById('servico-orcamento');
    const invoiceCheckbox = document.getElementById('invoice');

    const alocacoesContainer = document.getElementById('alocacoes-diarias-container');
    const placeholder = document.getElementById('alocacao-placeholder');

    const totalCostsSpan = document.getElementById("totalCosts");
    const taxSpan = document.getElementById("tax");
    const profitSpan = document.getElementById("profit");

    // 2. FUNÇÃO PARA POPULAR O DROPDOWN DE CLIENTES (sem alterações aqui)
    function popularClientes() {
        if (!clientes || clientes.length === 0) {
            clienteSelect.innerHTML = '<option value="">Nenhum cliente cadastrado</option>';
            return;
        }
        clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            clienteSelect.appendChild(option);
        });
    }

    // 3. FUNÇÃO PARA GERAR OS CAMPOS DE ALOCAÇÃO (GRANDES MUDANÇAS AQUI)
    function gerarCamposDeAlocacao() {
        console.log("Iniciando gerarCamposDeAlocacao (com novo layout)...");

        const dataInicioStr = dataInicioInput.value;
        const dataFimStr = dataFimInput.value;

        alocacoesContainer.innerHTML = '';

        if (!dataInicioStr || !dataFimStr || new Date(dataFimStr) < new Date(dataInicioStr)) {
            placeholder.style.display = 'block';
            atualizarResumoFinanceiro();
            return;
        }

        placeholder.style.display = 'none';

        try {
            const diaAtual = new Date(`${dataInicioStr}T00:00:00`);
            const dataFinal = new Date(`${dataFimStr}T00:00:00`);

            while (diaAtual <= dataFinal) {
                const dataISO = diaAtual.toISOString().split('T')[0];
                const dataFormatada = diaAtual.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

                const cardHTML = `
                <div class="allocation-day-card" data-date="${dataISO}">
                    <h4>Dia: ${dataFormatada}</h4>
                    <div class="form-group">
                        <label for="horas-${dataISO}">Horas Trabalhadas</label>
                        <input type="number" id="horas-${dataISO}" class="horas-trabalhadas" min="1" value="8">
                    </div>
                    
                    <div class="resource-columns">
                        <div class="column">
                            <div class="form-group resource-group">
                                <label>Funcionários</label>
                                <div class="resource-list">
                                    ${labor.map(f => `
                                        <div class="resource-item">
                                            <div class="resource-name-group">
                                                <input type="checkbox" id="func-${f.id}-${dataISO}" value="${f.id}" class="resource-checkbox" data-target-cost="cost-func-${f.id}-${dataISO}">
                                                <label for="func-${f.id}-${dataISO}">${f.nome}</label>
                                            </div>
                                            <div class="resource-cost-group">
                                                <input type="number" step="0.01" id="cost-func-${f.id}-${dataISO}" class="cost-input" value="${(parseFloat(f.parametrizacao?.valor_diaria ?? 0)).toFixed(2)}" disabled>
                                                <span>/dia</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="column">
                            <div class="form-group resource-group">
                                <label>Equipamentos</label>
                                <div class="resource-list">
                                    ${equipment.map(e => `
                                        <div class="resource-item">
                                            <div class="resource-name-group">
                                                <input type="checkbox" id="equip-${e.id}-${dataISO}" value="${e.id}" class="resource-checkbox" data-target-cost="cost-equip-${e.id}-${dataISO}">
                                                <label for="equip-${e.id}-${dataISO}">${e.nome}</label>
                                            </div>
                                            <div class="resource-cost-group">
                                                <input type="number" step="0.01" id="cost-equip-${e.id}-${dataISO}" class="cost-input" value="${(parseFloat(e.parametrizacao?.valor_hora ?? 0)).toFixed(2)}" disabled>
                                                <span>/hora</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
                alocacoesContainer.insertAdjacentHTML('beforeend', cardHTML);
                diaAtual.setUTCDate(diaAtual.getUTCDate() + 1);
            }
        } catch (error) {
            console.error("ERRO CRÍTICO ao gerar os cards de alocação:", error);
            alocacoesContainer.innerHTML = '<p style="color: red;">Ocorreu um erro ao gerar os campos. Verifique o console (F12) para mais detalhes.</p>';
        }

        atualizarResumoFinanceiro();
    }

    // 4. FUNÇÃO PARA ATUALIZAR O RESUMO FINANCEIRO (ATUALIZADA)
    function atualizarResumoFinanceiro() {
        let custoTotalProducao = 0;
        const orcamento = parseFloat(orcamentoInput.value) || 0;

        document.querySelectorAll('.allocation-day-card').forEach(card => {
            const horas = parseFloat(card.querySelector('.horas-trabalhadas').value) || 0;

            // Itera sobre todos os checkboxes de recursos no card
            card.querySelectorAll('.resource-checkbox:checked').forEach(checkbox => {
                const costInput = document.getElementById(checkbox.dataset.targetCost);
                const custo = parseFloat(costInput.value) || 0;

                if (costInput.id.startsWith('cost-func-')) {
                    // Custo de funcionário é diário
                    custoTotalProducao += custo;
                } else if (costInput.id.startsWith('cost-equip-')) {
                    // Custo de equipamento é por hora
                    custoTotalProducao += custo * horas;
                }
            });
        });

        const imposto = invoiceCheckbox.checked ? orcamento * 0.06 : 0;
        const custosTotais = custoTotalProducao + imposto;
        const lucro = orcamento - custosTotais;

        totalCostsSpan.textContent = `R$ ${custosTotais.toFixed(2)}`;
        taxSpan.textContent = `R$ ${imposto.toFixed(2)}`;
        profitSpan.textContent = `R$ ${lucro.toFixed(2)}`;
        profitSpan.style.color = lucro < 0 ? '#d32f2f' : '#388e3c';
    }

    // 5. ADICIONAR OS EVENT LISTENERS (COM UMA NOVA LÓGICA)
    dataInicioInput.addEventListener('change', gerarCamposDeAlocacao);
    dataFimInput.addEventListener('change', gerarCamposDeAlocacao);
    orcamentoInput.addEventListener('input', atualizarResumoFinanceiro);
    invoiceCheckbox.addEventListener('change', atualizarResumoFinanceiro);

    alocacoesContainer.addEventListener('change', (e) => {
        // Habilita/desabilita input de custo e recalcula o resumo
        if (e.target.matches('.resource-checkbox')) {
            const costInput = document.getElementById(e.target.dataset.targetCost);
            costInput.disabled = !e.target.checked;
            atualizarResumoFinanceiro();
        }
        // Recalcula se as horas ou o custo de um item habilitado mudar
        if (e.target.matches('.horas-trabalhadas') || e.target.matches('.cost-input')) {
            atualizarResumoFinanceiro();
        }
    });

    // 6. MANIPULAR O ENVIO DO FORMULÁRIO (ATUALIZADO)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            id_cliente: clienteSelect.value,
            nome: document.getElementById('servico-nome').value,
            descricao: document.getElementById('servico-descricao').value,
            data_inicio: dataInicioInput.value,
            data_fim: dataFimInput.value,
            orcamento: orcamentoInput.value,
            alocacoes_diarias: {}
        };

        document.querySelectorAll('.allocation-day-card').forEach(card => {
            const data = card.dataset.date;
            const alocacaoDoDia = {
                horas_trabalhadas: parseFloat(card.querySelector('.horas-trabalhadas').value) || 0,
                funcionarios: [],
                equipamentos: []
            };

            card.querySelectorAll('.resource-checkbox:checked').forEach(checkbox => {
                const costInput = document.getElementById(checkbox.dataset.targetCost);
                const custo = parseFloat(costInput.value);
                const id = parseInt(checkbox.value);

                if (costInput.id.startsWith('cost-func-')) {
                    alocacaoDoDia.funcionarios.push({ id_funcionario: id, valor_dia_alocado: custo });
                } else if (costInput.id.startsWith('cost-equip-')) {
                    alocacaoDoDia.equipamentos.push({ id_equipamento: id, valor_hora_alocada: custo });
                }
            });
            payload.alocacoes_diarias[data] = alocacaoDoDia;
        });

        console.log("JSON a ser enviado para a API:");
        console.log(JSON.stringify(payload, null, 2));

        try {
            // 1. Descomente a linha abaixo para ATIVAR a chamada à API
            const novoServico = await request('/servico', 'POST', payload);

            console.log('Serviço criado com sucesso no backend:', novoServico);
            alert('Projeto criado com sucesso!');

            // 2. Limpa o formulário e redireciona para o dashboard
            form.reset();
            gerarCamposDeAlocacao(); // Limpa os cards de alocação
            carregarPagina('dashboard/dashboard.html'); // Volta para a página inicial

        } catch (err) {
            // Se o backend retornar um erro (ex: validação), ele será exibido
            alert(`Erro ao salvar projeto: ${err.message}`);
            console.error("Detalhes do erro:", err);
        }
    });

    // --- INICIALIZAÇÃO ---
    popularClientes();
}

// --- Lógica da página de Configurações ---
// --- Lógica da página de Configurações (Versão Completa com CRUD) ---
// Em scripts.js

// --- Lógica da página de Configurações ---
function configurarPaginaConfiguracoes() {

    // As variáveis agora são declaradas no escopo principal da função
    let editingState = { id: null, type: null };

    // Mapeamento de configurações para cada tipo de recurso
    const configs = {
        equipment: {
            api: '/equipamento',
            data: () => equipment,
            inputs: { nome: 'equipment-name', valor: 'equipment-cost' },
            list: 'equipment-items'
        },
        labor: {
            api: '/funcionario',
            data: () => labor,
            inputs: { nome: 'labor-name', valor: 'labor-cost' },
            list: 'labor-items'
        },
        client: {
            api: '/cliente',
            data: () => clientes,
            inputs: { nome: 'client-name', tipo: 'client-type', cpf: 'client-cpf-cnpj' },
            list: 'client-items'
        }
    };

    // FUNÇÃO PARA RENDERIZAR UMA LISTA
    function render(type) {
        const config = configs[type];
        const container = document.getElementById(config.list);
        const data = config.data();
        container.innerHTML = '';
        (data || []).forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'resource-item';
            let detailsHtml = '';

            if (type === 'client') {
                detailsHtml = `<span>${item.tipo_cliente || ''}: ${item.cpf_cnpj || ''}</span>`;
            } else {
                const isEquipment = type === 'equipment';
                const cost = item.parametrizacao ? (isEquipment ? item.parametrizacao.valor_hora : item.parametrizacao.valor_diaria / 8) : 0;
                detailsHtml = `<span class="cost">R$ ${parseFloat(cost).toFixed(2)}/h</span>`;
            }

            itemDiv.innerHTML = `
                <div class="resource-item-info">
                    <span>${item.nome}</span>
                    ${detailsHtml}
                </div>
                <div class="actions">
                    <button class="edit-btn" data-id="${item.id}" data-type="${type}">✏️</button>
                    <button class="delete-btn" data-id="${item.id}" data-type="${type}">🗑️</button>
                </div>`;
            container.appendChild(itemDiv);
        });
    }

    // FUNÇÕES DE AÇÃO (salvar, carregar para editar, deletar)
    async function handleSave(type) {
        const config = configs[type];
        const method = editingState.id ? 'PUT' : 'POST';
        const endpoint = editingState.id ? `${config.api}/${editingState.id}` : config.api;

        const nome = document.getElementById(config.inputs.nome).value.trim();
        if (!nome) return alert('O nome é obrigatório.');

        const dados = { nome };

        if (type === 'client') {
            dados.tipo_cliente = document.getElementById(config.inputs.tipo).value;
            dados.cpf_cnpj = document.getElementById(config.inputs.cpf).value.trim();
            if (!dados.cpf_cnpj) return alert('O CPF/CNPJ é obrigatório.');
        } else {
            const cost = parseFloat(document.getElementById(config.inputs.valor).value) || 0;
            if (type === 'equipment') dados.valor_hora = cost;
            else dados.valor_diaria = cost * 8;
        }

        try {
            await request(endpoint, method, dados);
            await carregarDadosIniciais();
            render('equipment'); render('labor'); render('client'); // Re-renderiza tudo

            // Limpa o formulário específico e o estado de edição
            document.getElementById(config.inputs.nome).value = '';
            if (type === 'client') document.getElementById(config.inputs.cpf).value = '';
            else document.getElementById(config.inputs.valor).value = '';
            editingState.id = null;
            editingState.type = null;

        } catch (err) { alert(`Erro ao salvar: ${err.message}`); }
    }

    async function loadForEdit(type, id) {
        const config = configs[type];
        try {
            const item = await request(`${config.api}/${id}`);
            document.getElementById(config.inputs.nome).value = item.nome;
            editingState = { id: id, type: type };
            if (type === 'client') {
                document.getElementById(config.inputs.tipo).value = item.tipo_cliente;
                document.getElementById(config.inputs.cpf).value = item.cpf_cnpj;
            } else {
                const costInput = document.getElementById(config.inputs.valor);
                const isEquipment = type === 'equipment';
                costInput.value = item.parametrizacao ? (isEquipment ? item.parametrizacao.valor_hora : item.parametrizacao.valor_diaria / 8) : '';
            }
        } catch (err) { alert(`Erro ao carregar item para edição: ${err.message}`); }
    }

    async function handleDelete(type, id) {
        if (!confirm('Tem certeza que deseja excluir/inativar este item?')) return;
        const config = configs[type];
        try {
            await request(`${config.api}/${id}`, 'DELETE');
            await carregarDadosIniciais();
            render(type);
        } catch (err) { alert(`Erro ao excluir: ${err.message}`); }
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    render('equipment');
    render('labor');
    render('client');

    document.getElementById('add-equipment-btn').addEventListener('click', () => handleSave('equipment'));
    document.getElementById('add-labor-btn').addEventListener('click', () => handleSave('labor'));
    document.getElementById('add-client-btn').addEventListener('click', () => handleSave('client'));

    document.querySelector('.grid-container').addEventListener('click', (event) => {
        const button = event.target.closest('button.edit-btn, button.delete-btn');
        if (!button) return;
        const { id, type } = button.dataset;
        if (button.classList.contains('edit-btn')) loadForEdit(type, id);
        else if (button.classList.contains('delete-btn')) handleDelete(type, id);
    });
}

// --- Inicialização do Site ---
window.onload = async () => {
    await carregarDadosIniciais();
    configurarNavegacao();
    carregarPagina("dashboard/dashboard.html");

    modalBackdrop.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) {
            fecharModalNovoProjeto();
        }
    });
};