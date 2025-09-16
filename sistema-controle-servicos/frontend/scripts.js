import { request } from "./shared/api.js";

// Variáveis globais
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
    document.body.classList.add('modal-open');
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
    document.body.classList.remove('modal-open');
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

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = 'login/login.html';
        });
    }
}

function configurarFormNovoProjeto() {
    console.log("Configurando formulário com switch de datas e alocação diária...");

    // 1. SELECIONAR OS ELEMENTOS
    const form = document.getElementById('form-novo-projeto');
    const clienteSelect = document.getElementById('servico-cliente');
    const dataInicioInput = document.getElementById('servico-data-inicio');
    const dataFimInput = document.getElementById('servico-data-fim');
    const orcamentoInput = document.getElementById('quote');
    const invoiceCheckbox = document.getElementById('invoice');
    const multiDaySwitch = document.getElementById('multi-day-switch');
    const alocacoesContainer = document.getElementById('alocacoes-diarias-container');
    const placeholder = document.getElementById('alocacao-placeholder');
    const totalCostsSpan = document.getElementById("totalCosts");
    const taxSpan = document.getElementById("tax");
    const profitSpan = document.getElementById("profit");

    // 2. LÓGICA DO SWITCH DE DURAÇÃO
    function handleMultiDayToggle() {
        const isMultiDay = multiDaySwitch.checked;
        dataFimInput.disabled = !isMultiDay;
        if (isMultiDay && dataInicioInput.value) {
            dataFimInput.value = dataInicioInput.value;
            dataFimInput.focus();
        }
        dataFimInput.dispatchEvent(new Event('change'));
    }

    // 3. FUNÇÃO PARA POPULAR O DROPDOWN DE CLIENTES
    function popularClientes() {
        clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
        (clientes || []).forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            clienteSelect.appendChild(option);
        });
    }

    // 4. FUNÇÃO PARA GERAR OS CARDS DE ALOCAÇÃO
    function gerarCamposDeAlocacao() {
        let dataInicioStr = dataInicioInput.value;
        let dataFimStr = dataFimInput.value;

        if (!multiDaySwitch.checked && dataInicioStr) {
            dataFimStr = dataInicioStr;
        }

        alocacoesContainer.innerHTML = '';

        if (!dataInicioStr || !dataFimStr || new Date(dataFimStr) < new Date(dataInicioStr)) {
            placeholder.style.display = 'block';
            atualizarResumoFinanceiro();
            return;
        }
        
        placeholder.style.display = 'none';
        const diaAtual = new Date(`${dataInicioStr}T12:00:00Z`);
        const dataFinal = new Date(`${dataFimStr}T12:00:00Z`);

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
                            <label class="column-title">Funcionários</label>
                            <div class="custom-multiselect">
                                <div class="select-trigger"><span>Selecionar</span><span class="arrow"></span></div>
                                <div class="options-list">
                                    ${labor.map(f => `
                                        <div class="resource-item">
                                            <input type="checkbox" id="func-${f.id}-${dataISO}" value="${f.id}" class="resource-checkbox" data-cost="${(f.parametrizacao?.valor_diaria ?? 0)}" data-cost-type="daily">
                                            <label for="func-${f.id}-${dataISO}">${f.nome}</label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <label class="column-title">Equipamentos</label>
                            <div class="custom-multiselect">
                                <div class="select-trigger"><span>Selecionar</span><span class="arrow"></span></div>
                                <div class="options-list">
                                    ${equipment.map(e => `
                                        <div class="resource-item">
                                            <input type="checkbox" id="equip-${e.id}-${dataISO}" value="${e.id}" class="resource-checkbox" data-cost="${(e.parametrizacao?.valor_hora ?? 0)}" data-cost-type="hourly">
                                            <label for="equip-${e.id}-${dataISO}">${e.nome}</label>
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
        atualizarResumoFinanceiro();
    }

    // 5. FUNÇÃO PARA ATUALIZAR O RESUMO FINANCEIRO
    function atualizarResumoFinanceiro() {
        let custoTotalProducao = 0;
        const orcamento = parseFloat(orcamentoInput.value) || 0;

        document.querySelectorAll('.allocation-day-card').forEach(card => {
            const horas = parseFloat(card.querySelector('.horas-trabalhadas').value) || 0;
            card.querySelectorAll('.resource-checkbox:checked').forEach(checkbox => {
                const custo = parseFloat(checkbox.dataset.cost) || 0;
                const tipoCusto = checkbox.dataset.costType;
                if (tipoCusto === 'daily') custoTotalProducao += custo;
                else if (tipoCusto === 'hourly') custoTotalProducao += custo * horas;
            });
        });

        const imposto = invoiceCheckbox.checked ? orcamento * 0.06 : 0;
        const custosTotais = custoTotalProducao + imposto;
        const lucro = orcamento - custosTotais;
        
        totalCostsSpan.textContent = `R$ ${custosTotais.toFixed(2).replace('.', ',')}`;
        taxSpan.textContent = `R$ ${imposto.toFixed(2).replace('.', ',')}`;
        profitSpan.textContent = `R$ ${lucro.toFixed(2).replace('.', ',')}`;
        profitSpan.style.color = lucro < 0 ? '#ef4444' : '#22c55e';
    }

    // 6. ADICIONAR OS EVENT LISTENERS
    multiDaySwitch.addEventListener('change', handleMultiDayToggle);
    dataInicioInput.addEventListener('change', gerarCamposDeAlocacao);
    dataFimInput.addEventListener('change', gerarCamposDeAlocacao);
    orcamentoInput.addEventListener('input', atualizarResumoFinanceiro);
    invoiceCheckbox.addEventListener('change', atualizarResumoFinanceiro);
    
    alocacoesContainer.addEventListener('click', (e) => {
        const trigger = e.target.closest('.select-trigger');
        if (trigger) {
            const currentMultiSelect = trigger.closest('.custom-multiselect');
            document.querySelectorAll('.custom-multiselect.open').forEach(select => {
                if (select !== currentMultiSelect) select.classList.remove('open');
            });
            currentMultiSelect.classList.toggle('open');
        }
    });
    
    alocacoesContainer.addEventListener('change', (e) => {
        if (e.target.matches('.resource-checkbox, .horas-trabalhadas')) {
            atualizarResumoFinanceiro();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-multiselect')) {
            document.querySelectorAll('.custom-multiselect.open').forEach(select => {
                select.classList.remove('open');
            });
        }
    });

    // 7. ENVIO DO FORMULÁRIO
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Sua lógica para coletar os dados e enviar para a API vai aqui
        console.log("Formulário enviado!");
    });

    // 8. INICIALIZAÇÃO
    popularClientes();
    atualizarResumoFinanceiro();
}


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
    await carregarDadosIniciais(); // Descomente quando a API estiver pronta
    configurarNavegacao();
    carregarPagina("dashboard/dashboard.html");

    modalBackdrop.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) {
            fecharModalNovoProjeto();
        }
    });
};
