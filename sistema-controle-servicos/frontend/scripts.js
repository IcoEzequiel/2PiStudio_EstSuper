import { request } from "./shared/api.js";
import { inicializarDashboard } from './dashboard/dashboard.js';

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

// async function abrirModalNovoProjeto() {
//     document.body.classList.add('modal-open');
//     if (!document.getElementById('novoprojeto-css')) {
//         const linkCSS = document.createElement("link");
//         linkCSS.rel = "stylesheet";
//         linkCSS.href = "novoprojeto/novoprojeto.css";
//         linkCSS.id = "novoprojeto-css";
//         document.head.appendChild(linkCSS);
//     }
//     const modalContainer = document.getElementById('novo-projeto-modal-container');
//     const resposta = await fetch('novoprojeto/novoprojeto.html');
//     modalContainer.innerHTML = await resposta.text();

//     modalBackdrop.classList.add('active');
//     configurarFormNovoProjeto();
//     document.getElementById('close-modal-btn').addEventListener('click', fecharModalNovoProjeto);
// }


// function fecharModalNovoProjeto() {
//     document.body.classList.remove('modal-open');
//     modalBackdrop.classList.remove('active');
//     modalContainer.innerHTML = '';
//     const linkCSS = document.getElementById('novoprojeto-css');
//     if (linkCSS) {
//         linkCSS.remove();
//     }
// }

// Função base para abrir o modal e carregar o HTML
async function abrirModalBase() {
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
    // Adiciona o evento de clique ao botão de fechar
    document.getElementById('close-modal-btn').addEventListener('click', fecharModalNovoProjeto);
}

// Função para fechar o modal (INCLUÍDA AQUI PARA CORRIGIR O ERRO)
function fecharModalNovoProjeto() {
    document.body.classList.remove('modal-open');
    modalBackdrop.classList.remove('active');
    modalContainer.innerHTML = '';
    const linkCSS = document.getElementById('novoprojeto-css');
    if (linkCSS) {
        linkCSS.remove();
    }
}

// Função para abrir o modal para um NOVO projeto
async function abrirModalNovoProjeto() {
    await abrirModalBase();
    configurarFormNovoProjeto(); // Configura o formulário para o modo 'criar'
}

// Função para abrir o modal para EDITAR um projeto
async function abrirModalEdicao(projetoId) {
    try {
        console.log(`Buscando dados do projeto ID: ${projetoId}`);
        const projetoParaEditar = await request(`/servico/${projetoId}`);

        await abrirModalBase();
        // Passa os dados do projeto para a função de configuração
        configurarFormNovoProjeto(projetoParaEditar);

    } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        alert(`Não foi possível carregar os dados do projeto para edição: ${error.message}`);
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
            inicializarDashboard();
        }

        if (pagina.includes("configuracoes")) {
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "configuracoes/configuracoes.css";
            css.id = "extra-css";
            document.head.appendChild(css);
            setTimeout(() => { configurarPaginaConfiguracoes(); }, 0);
        }

        if (pagina.includes("projetos")) {
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "projetos/projetos.css"; // Supondo que você tenha um CSS
            css.id = "extra-css";
            document.head.appendChild(css);
            await carregarExibirProjetos();
            configurarAcoesDosCards();
        }

        if (pagina.includes("alocacoes")) {
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "alocacoes/alocacoes.css";
            css.id = "extra-css";
            document.head.appendChild(css);

            carregarExibirAlocacoes();
        }

    } catch (err) {
        document.getElementById("conteudo").innerHTML = "<p>Erro ao carregar página</p>";
        console.error(err);
    }
}

// Navegação
function configurarNavegacao() {
    const btnNovoProjeto = document.getElementById('btn-abrir-modal-projeto');
    if (btnNovoProjeto) { // Verifica se o botão existe antes de adicionar o evento
        btnNovoProjeto.addEventListener('click', abrirModalNovoProjeto);
    }

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
            localStorage.removeItem('userProfile'); // Limpa também o perfil
            window.location.href = 'login/login.html';
        });
    }
}

// Em scripts.js, SUBSTITUA sua função antiga por esta completa

function configurarFormNovoProjeto(projetoParaEditar = null) {
    console.log("Configurando formulário...");

    // --- 1. SELEÇÃO DOS ELEMENTOS ---
    const form = document.getElementById('form-novo-projeto');
    const tituloModal = document.getElementById('modal-title');
    const submitButton = form.querySelector('button[type="submit"]');
    const clienteSelect = document.getElementById('servico-cliente');
    const nomeInput = document.getElementById('servico-nome');
    const dataInicioInput = document.getElementById('servico-data-inicio');
    const dataFimInput = document.getElementById('servico-data-fim');
    const orcamentoInput = document.getElementById('quote');
    const invoiceCheckbox = document.getElementById('invoice');
    const descricaoInput = document.getElementById('servico-descricao');
    const multiDaySwitch = document.getElementById('multi-day-switch');
    const alocacoesContainer = document.getElementById('alocacoes-diarias-container');
    const placeholder = document.getElementById('alocacao-placeholder');
    const totalCostsSpan = document.getElementById("totalCosts");
    const taxSpan = document.getElementById("tax");
    const profitSpan = document.getElementById("profit");

    const modo = projetoParaEditar ? 'editar' : 'criar';

    // --- 2. LÓGICA DE EDIÇÃO vs CRIAÇÃO ---
    if (modo === 'editar') {
        tituloModal.textContent = 'Editar Projeto';
        submitButton.textContent = 'Atualizar Projeto';
        form.dataset.id = projetoParaEditar.id;

        // Popula os campos do formulário
        nomeInput.value = projetoParaEditar.nome;
        // Espera um momento para garantir que o 'popularClientes' tenha rodado
        setTimeout(() => {
            clienteSelect.value = projetoParaEditar.id_cliente;
        }, 0);
        dataInicioInput.value = projetoParaEditar.data_inicio;
        dataFimInput.value = projetoParaEditar.data_fim;
        orcamentoInput.value = parseFloat(projetoParaEditar.orcamento);
        if (descricaoInput) descricaoInput.value = projetoParaEditar.descricao;

    } else {
        tituloModal.textContent = 'Criar Novo Projeto';
        submitButton.textContent = 'Salvar Projeto';
    }

    // --- 3. FUNÇÕES AUXILIARES (SUA LÓGICA ORIGINAL) ---
    function handleMultiDayToggle() {
        const isMultiDay = multiDaySwitch.checked;
        dataFimInput.disabled = !isMultiDay;
        if (isMultiDay && dataInicioInput.value) {
            dataFimInput.value = dataInicioInput.value;
            dataFimInput.focus();
        }
        dataFimInput.dispatchEvent(new Event('change'));
    }

    function popularClientes() {
        clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
        (clientes || []).forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            clienteSelect.appendChild(option);
        });
    }

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

    // --- 4. ENVIO DO FORMULÁRIO (INTELIGENTE) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = modo === 'editar' ? 'Atualizando...' : 'Salvando...';

        const id_cliente = clienteSelect.value;
        if (!id_cliente) {
            alert('Por favor, selecione um cliente antes de salvar.');
            submitButton.disabled = false;
            submitButton.textContent = modo === 'editar' ? 'Atualizar Projeto' : 'Salvar Projeto';
            return;
        }

        const alocacoes = [];
        document.querySelectorAll('.allocation-day-card').forEach(card => {
            const data = card.dataset.date;
            const funcionarios = Array.from(card.querySelectorAll('.resource-checkbox[id^="func-"]:checked')).map(cb => cb.value);
            const equipamentos = Array.from(card.querySelectorAll('.resource-checkbox[id^="equip-"]:checked')).map(cb => cb.value);

            if (funcionarios.length > 0 || equipamentos.length > 0) {
                alocacoes.push({ data, funcionarios, equipamentos });
            }
        });

        const dadosDoProjeto = {
            id_cliente,
            nome: nomeInput.value,
            descricao: descricaoInput ? descricaoInput.value : '',
            data_inicio: dataInicioInput.value,
            data_fim: dataFimInput.value,
            orcamento: parseFloat(orcamentoInput.value),
            emite_nota: invoiceCheckbox.checked,
            alocacoes // Esta é a estrutura simplificada que o backend pode preferir
        };

        try {
            if (modo === 'editar') {
                const projetoId = form.dataset.id;
                await request(`/servico/${projetoId}`, 'PUT', dadosDoProjeto);
                alert('Projeto atualizado com sucesso!');
            } else {
                await request('/servico', 'POST', dadosDoProjeto);
                alert('Projeto criado com sucesso!');
            }

            fecharModalNovoProjeto();
            await carregarPagina('projetos/projetos.html');

        } catch (err) {
            console.error("Erro ao salvar projeto:", err);
            alert(`Não foi possível salvar o projeto: ${err.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = modo === 'editar' ? 'Atualizar Projeto' : 'Salvar Projeto';
        }
    });

    // --- 5. INICIALIZAÇÃO DO FORMULÁRIO E EVENTOS ---
    popularClientes();

    if (modo === 'editar') {
        gerarCamposDeAlocacao();

        (projetoParaEditar.alocacoesFuncionario || []).forEach(aloc => {
            const checkbox = document.querySelector(`input[id="func-${aloc.funcionario_id}-${aloc.data_alocacao}"]`);
            if (checkbox) checkbox.checked = true;
        });
        (projetoParaEditar.alocacoesEquipamento || []).forEach(aloc => {
            const checkbox = document.querySelector(`input[id="equip-${aloc.equipamento_id}-${aloc.data_alocacao}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    atualizarResumoFinanceiro();

    // Adiciona os event listeners que você já tinha
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
}

// Adicione esta nova função ao seu scripts.js

async function carregarExibirAlocacoes() {
    const container = document.getElementById('allocations-list');
    if (!container) return;

    container.innerHTML = '<p>Carregando alocações...</p>';

    try {
        // Esta rota precisa ser criada no seu back-end.
        // Ela deve retornar as alocações do funcionário logado.
        const alocacoes = await request('/alocacoes/minhas');

        if (!alocacoes || alocacoes.length === 0) {
            container.innerHTML = '<p>Nenhuma alocação encontrada para você.</p>';
            return;
        }

        container.innerHTML = '';

        alocacoes.forEach(aloc => {
            const dataFormatada = new Date(aloc.data_alocacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

            // Lógica condicional para o botão/badge
            const actionHtml = aloc.relatorio_feito // Supondo que a API envie este campo booleano
                ? `<span class="badge badge-green">Relatório Feito</span>`
                : `<button class="btn-action btn-report" data-id="${aloc.id}">
                       <svg></svg>
                       Realizar Relatório
                   </button>`;

            const itemHtml = `
                <div class="allocation-item">
                    <div class="allocation-details">
                        <span class="allocation-project-name">${aloc.servico.nome}</span>
                        <span class="allocation-date">Data: ${dataFormatada}</span>
                    </div>
                    <div class="allocation-actions">
                        ${actionHtml}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHtml);
        });

    } catch (err) {
        console.error("Erro ao carregar alocações:", err);
        container.innerHTML = '<p>Erro ao carregar suas alocações.</p>';
    }
}


async function carregarExibirProjetos() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '<p style="text-align: center;">Carregando projetos...</p>';

    try {
        const projetos = await request('/servico');

        if (!projetos || projetos.length === 0) {
            // Usa a classe .no-projects-message que você já tem no CSS
            container.innerHTML = `
                <div class="no-projects-message">
                    <h2>Nenhum projeto encontrado.</h2>
                    <p>Clique em "+ Novo Projeto" para começar.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = ''; // Limpa a mensagem de "Carregando..."

        // Mapeamento de status para classes de cor e texto
        const statusMap = {
            'agendado': { text: 'Agendado', class: 'badge-yellow' },
            'em execução': { text: 'Em Execução', class: 'badge-blue' },
            'concluido': { text: 'Concluído', class: 'badge-green' },
            'cancelado': { text: 'Cancelado', class: 'badge-red' }
        };

        projetos.forEach(projeto => {
            const prazoFinal = new Date(projeto.data_fim).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

            // Pega as informações de status do mapa, com um valor padrão caso não encontre
            const statusInfo = statusMap[projeto.status?.toLowerCase()] || { text: projeto.status || 'N/A', class: '' };

            // O nome do cliente agora vem corretamente do objeto aninhado
            const nomeCliente = projeto.cliente ? projeto.cliente.nome : 'Cliente não informado';

            const cardHTML = `
                <div class="project-card glass-effect" data-id="${projeto.id}">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${projeto.nome}</h3>
                            <p class="card-subtitle">${nomeCliente}</p>
                        </div>
                        <div class="dropdown-menu">
                            <button class="card-menu-btn" aria-label="Opções do projeto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                                </svg>
                            </button>
                            <div class="dropdown-content">
                                <a class="dropdown-item">Editar</a>
                                <a class="dropdown-item text-red">Excluir</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-item">
                            <span>Status</span>
                            <span class="badge ${statusInfo.class}">${statusInfo.text}</span>
                        </div>
                        <div class="card-item">
                            <span>Orçamento</span>
                            <span class="value">R$ ${parseFloat(projeto.orcamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div class="card-item">
                            <span>Lucro</span>
                            <span class="value text-green">R$ ${parseFloat(projeto.lucro_estimado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div class="card-item">
                            <span>Prazo</span>
                            <span class="value">${prazoFinal}</span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (err) {
        console.error("Erro ao carregar projetos:", err);
        container.innerHTML = `
            <div class="no-projects-message">
                <h2>Erro ao carregar os projetos.</h2>
                <p>Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

function configurarAcoesDosCards() {
    const todosOsMenus = document.querySelectorAll('.dropdown-menu');

    todosOsMenus.forEach(menu => {
        const btn = menu.querySelector('.card-menu-btn');
        if (btn) {
            btn.addEventListener('click', (event) => {
                // Impede que o clique no botão feche o menu imediatamente
                event.stopPropagation();

                // Fecha todos os outros menus que possam estar abertos
                todosOsMenus.forEach(outroMenu => {
                    if (outroMenu !== menu) {
                        outroMenu.classList.remove('active');
                    }
                });

                // Alterna (abre/fecha) o menu atual
                menu.classList.toggle('active');
            });
        }
    });

    const todosOsBotoesEditar = document.querySelectorAll('.dropdown-item:not(.text-red)');
    todosOsBotoesEditar.forEach(btn => {
        btn.addEventListener('click', (event) => {
            // Pega o card pai para encontrar o ID do projeto
            const card = event.target.closest('.project-card');
            const projetoId = card.dataset.id;
            if (projetoId) {
                abrirModalEdicao(projetoId);
            }
        });
    });

    // Adiciona um evento para fechar os menus se clicar em qualquer outro lugar da página
    window.addEventListener('click', () => {
        todosOsMenus.forEach(menu => {
            menu.classList.remove('active');
        });
    });
}

function configurarAcessoPorPerfil() {
    const perfil = localStorage.getItem('userProfile');

    if (!perfil) {
        window.location.href = 'login/login.html';
        return;
    }

    const todosOsItensControlados = document.querySelectorAll('[data-roles]');

    todosOsItensControlados.forEach(item => {
        const rolesPermitidas = item.dataset.roles.split(',');
        if (!rolesPermitidas.includes(perfil)) {
            item.style.display = 'none';
        }
    });
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
// window.onload = async () => {
//     await carregarDadosIniciais(); // Descomente quando a API estiver pronta
//     configurarNavegacao();
//     carregarPagina("dashboard/dashboard.html");

//     modalBackdrop.addEventListener('click', (event) => {
//         if (event.target === modalBackdrop) {
//             fecharModalNovoProjeto();
//         }
//     });
// };

// --- INICIALIZAÇÃO DO SITE ---
window.onload = async () => {
    // 1. PRIMEIRO, configura o que o usuário pode ver na interface
    configurarAcessoPorPerfil();

    // 2. DEPOIS, carrega os dados iniciais que a aplicação precisa
    await carregarDadosIniciais();
    configurarNavegacao();

    // 3. FINALMENTE, carrega a página inicial correta para o perfil
    const perfil = localStorage.getItem('userProfile');

    if (perfil === 'administrador') {
        carregarPagina("dashboard/dashboard.html");
    } else if (perfil === 'funcionario') {
        carregarPagina("alocacoes/alocacoes.html");
    }
};