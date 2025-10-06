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
        const results = await Promise.allSettled([
            request('/equipamento'),
            request('/funcionario'),
            request('/cliente')
        ]);
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

async function abrirModalGenerico(config) {
    document.body.classList.add('modal-open');
    modalBackdrop.classList.add('active');
    if (!document.getElementById(config.cssId)) {
        const linkCSS = document.createElement("link");
        linkCSS.rel = "stylesheet";
        linkCSS.href = config.cssPath;
        linkCSS.id = config.cssId;
        document.head.appendChild(linkCSS);
    }
    const resposta = await fetch(config.htmlPath);
    modalContainer.innerHTML = await resposta.text();
    document.getElementById(config.closeBtnId).addEventListener('click', config.closeFn);
}

function fecharModalGenerico(cssId) {
    document.body.classList.remove('modal-open');
    modalBackdrop.classList.remove('active');
    modalContainer.innerHTML = '';
    const linkCSS = document.getElementById(cssId);
    if (linkCSS) {
        linkCSS.remove();
    }
}

function fecharModalNovoProjeto() {
    fecharModalGenerico('novoprojeto-css');
}

async function abrirModalNovoProjeto() {
    await abrirModalGenerico({
        htmlPath: 'novoprojeto/novoprojeto.html',
        cssPath: 'novoprojeto/novoprojeto.css',
        cssId: 'novoprojeto-css',
        closeBtnId: 'close-modal-btn',
        closeFn: fecharModalNovoProjeto
    });
    configurarFormNovoProjeto();
}

async function abrirModalEdicao(projetoId) {
    try {
        const projetoParaEditar = await request(`/servico/${projetoId}`);
        await abrirModalGenerico({
            htmlPath: 'novoprojeto/novoprojeto.html',
            cssPath: 'novoprojeto/novoprojeto.css',
            cssId: 'novoprojeto-css',
            closeBtnId: 'close-modal-btn',
            closeFn: fecharModalNovoProjeto
        });
        configurarFormNovoProjeto(projetoParaEditar);
    } catch (error) {
        alert(`Não foi possível carregar os dados do projeto para edição: ${error.message}`);
    }
}

function fecharModalNovoRelatorio() {
    fecharModalGenerico('novorelatorio-css');
}

async function abrirModalNovoRelatorio() {
    await abrirModalGenerico({
        htmlPath: 'novorelatorio/novorelatorio.html',
        cssPath: 'novorelatorio/novorelatorio.css',
        cssId: 'novorelatorio-css',
        closeBtnId: 'close-report-modal-btn',
        closeFn: fecharModalNovoRelatorio
    });
    const selectAlocacao = document.getElementById('relatorio-alocacao');
    try {
        const alocacoes = await request('/alocacoes/minhas');
        const alocacoesPendentes = alocacoes ? alocacoes.filter(a => !a.relatorio_feito) : [];
        if (alocacoesPendentes.length > 0) {
            selectAlocacao.innerHTML = '<option value="">Selecione uma tarefa/data...</option>';
            alocacoesPendentes.forEach(aloc => {
                const dataFormatada = new Date(aloc.data_alocacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const option = document.createElement('option');
                option.value = aloc.id;
                option.textContent = `${aloc.servico.nome} - ${dataFormatada}`;
                selectAlocacao.appendChild(option);
            });
        } else {
            selectAlocacao.innerHTML = '<option value="">Nenhuma alocação com relatório pendente</option>';
        }
    } catch (error) {
        console.error("Erro ao carregar alocações para o modal:", error);
    }
    configurarFormNovoRelatorio();
}

async function carregarPagina(pagina) {
    console.log("Carregando:", pagina);
    try {
        const links = document.querySelectorAll('.nav-btn');
        links.forEach(link => {
            if (link.getAttribute('data-page') === pagina) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        const resposta = await fetch(pagina);
        if (!resposta.ok) throw new Error("Erro ao carregar " + pagina);
        const html = await resposta.text();
        document.getElementById("conteudo").innerHTML = html;
        const linkCSS = document.querySelector("#extra-css");
        if (linkCSS) linkCSS.remove();
        let css = document.createElement("link");
        css.rel = "stylesheet";
        css.id = "extra-css";
        if (pagina.includes("dashboard")) {
            css.href = "dashboard/dashboard.css";
            document.head.appendChild(css);
            inicializarDashboard();
        } else if (pagina.includes("configuracoes")) {
            css.href = "configuracoes/configuracoes.css";
            document.head.appendChild(css);
            configurarPaginaConfiguracoes();
        } else if (pagina.includes("projetos")) {
            css.href = "projetos/projetos.css";
            document.head.appendChild(css);
            await carregarExibirProjetos();
            // configurarAcoesDosCards();
            configurarPaginaProjetos();
        } else if (pagina.includes("alocacoes")) {
            css.href = "alocacoes/alocacoes.css";
            document.head.appendChild(css);
            await carregarExibirAlocacoes();
            configurarAcoesAlocacoes();
        } else if (pagina.includes("relatorios")) {
            css.href = "relatorios/relatorios.css";
            document.head.appendChild(css);
            await carregarExibirRelatorios();
            configurarAcoesRelatorios();
        } else if (pagina.includes("feedbacks")) {
            css.href = "feedbacks/feedbacks.css";
            document.head.appendChild(css);
            await carregarExibirFeedbacks();
            configurarAcoesFeedbacks();
        }

    } catch (err) {
        document.getElementById("conteudo").innerHTML = "<p>Erro ao carregar página</p>";
        console.error(err);
    }
}

async function carregarExibirRelatorios() {
    const container = document.getElementById('reports-list-body');
    if (!container) return;

    container.innerHTML = '<tr><td colspan="4" style="text-align: center;">Carregando relatórios...</td></tr>';

    try {
        const relatorios = await request('/feedback');

        if (!relatorios || relatorios.length === 0) {
            container.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum relatório encontrado.</td></tr>';
            return;
        }

        container.innerHTML = '';

        // Adiciona o status 'rejeitado' ao mapa
        const statusMap = {
            'respondido': { text: 'Pendente', class: 'badge-yellow' },
            'aprovado': { text: 'Aprovado', class: 'badge-green' },
            'rejeitado': { text: 'Ajuste Solicitado', class: 'badge-red' } // Novo status
        };

        relatorios.forEach(rel => {
            const dataFormatada = new Date(rel.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const statusInfo = statusMap[rel.status] || { text: rel.status, class: '' };

            // O botão de edição agora aparece para 'respondido' E 'rejeitado'
            const actionButton = (rel.status === 'respondido' || rel.status === 'rejeitado')
                ? `<button class="btn-action edit-report-btn" data-feedback-id="${rel.id}">Editar</button>`
                : `<button class="btn-action view-report-btn" data-feedback-id="${rel.id}">Visualizar</button>`;

            // Cria um elemento para mostrar a resposta do admin, se houver
            const respostaAdminHtml = rel.resposta 
                ? `<div class="admin-response"><strong>Admin:</strong> ${rel.resposta}</div>` 
                : '';

            const rowHtml = `
                <tr>
                    <td>
                        <div class="project-name">${rel.servico.nome}</div>
                        ${respostaAdminHtml}
                    </td>
                    <td>
                        <div class="date-cell">${dataFormatada}</div>
                    </td>
                    <td>
                        <span class="badge ${statusInfo.class}">${statusInfo.text}</span>
                    </td>
                    <td>
                        ${actionButton}
                    </td>
                </tr>
            `;
            container.insertAdjacentHTML('beforeend', rowHtml);
        });

    } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
        container.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--red-text);">Erro ao carregar seus relatórios.</td></tr>';
    }
}

function configurarAcoesRelatorios() {
    const container = document.getElementById('reports-list-body');
    if (!container) return;

    container.addEventListener('click', async (event) => {
        const editButton = event.target.closest('.edit-report-btn');
        const viewButton = event.target.closest('.view-report-btn');

        if (editButton) {
            const feedbackId = editButton.dataset.feedbackId;
            try {
                const feedback = await request(`/feedback/${feedbackId}`);
                
                const reportRow = editButton.closest('tr');
                const alocacaoInfo = reportRow.querySelector('.project-name').textContent;

                abrirModalRelatorioEspecifico(feedbackId, alocacaoInfo, feedback.comentario);

            } catch (err) {
                alert(`Erro ao carregar dados para edição: ${err.message}`);
            }
        }

        if (viewButton) {
            alert("A funcionalidade de visualização de relatórios aprovados será implementada no futuro.");
        }
    });
}

// Navegação
function configurarNavegacao() {
    const btnNovoProjeto = document.getElementById('btn-abrir-modal-projeto');
    if (btnNovoProjeto) {
        btnNovoProjeto.addEventListener('click', abrirModalNovoProjeto);
    }
    // Adicione aqui a lógica para o botão "Novo Relatório" se necessário
    const btnNovoRelatorio = document.getElementById('btn-novo-relatorio');
    if (btnNovoRelatorio) {
        // Garanta que ele chama a função correta
        btnNovoRelatorio.addEventListener('click', abrirModalNovoRelatorio);
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
            localStorage.removeItem('userProfile');
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
        nomeInput.value = projetoParaEditar.nome;
        setTimeout(() => { clienteSelect.value = projetoParaEditar.cliente.id; }, 100);
        dataInicioInput.value = projetoParaEditar.data_inicio;
        dataFimInput.value = projetoParaEditar.data_fim;
        orcamentoInput.value = parseFloat(projetoParaEditar.orcamento);
        if (descricaoInput) descricaoInput.value = projetoParaEditar.descricao;
        invoiceCheckbox.checked = projetoParaEditar.imposto
        if (projetoParaEditar.data_inicio !== projetoParaEditar.data_fim) {
            multiDaySwitch.checked = true;
        }
    } else {
        tituloModal.textContent = 'Criar Novo Projeto';
        submitButton.textContent = 'Salvar Projeto';
    }

    function atualizarResumoSelecao() {
        const summaryContainer = document.getElementById('selection-summary');
        const laborContainer = document.getElementById('selected-labor-summary');
        const equipmentContainer = document.getElementById('selected-equipment-summary');

        const selectedLabor = new Set();
        const selectedEquipment = new Set();

        // Encontra todos os checkboxes de recursos selecionados
        const checkedBoxes = document.querySelectorAll('.resource-checkbox:checked');

        checkedBoxes.forEach(checkbox => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label) {
                const name = label.textContent;
                const cost = parseFloat(checkbox.dataset.cost || 0);
                const costType = checkbox.dataset.costType;

                // Formata o custo como moeda
                const formattedCost = cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                // Determina a unidade (por dia ou por hora)
                const unit = costType === 'daily' ? '/h' : '/h';

                // Cria o texto completo com nome e valor
                const fullText = `${name} (${formattedCost}${unit})`;

                if (checkbox.id.startsWith('func-')) {
                    selectedLabor.add(fullText);
                } else if (checkbox.id.startsWith('equip-')) {
                    selectedEquipment.add(fullText);
                }
            }
        });

        // Limpa os resumos anteriores
        laborContainer.innerHTML = '';
        equipmentContainer.innerHTML = '';

        // Se houver algum recurso selecionado, mostra o resumo
        if (selectedLabor.size > 0 || selectedEquipment.size > 0) {
            summaryContainer.style.display = 'block';

            if (selectedLabor.size > 0) {
                const laborItems = Array.from(selectedLabor).map(name => `<li>${name}</li>`).join('');
                laborContainer.innerHTML = `<h4>Mão de Obra</h4><ul>${laborItems}</ul>`;
            }

            if (selectedEquipment.size > 0) {
                const equipmentItems = Array.from(selectedEquipment).map(name => `<li>${name}</li>`).join('');
                equipmentContainer.innerHTML = `<h4>Equipamentos</h4><ul>${equipmentItems}</ul>`;
            }
        } else {
            summaryContainer.style.display = 'none'; // Esconde se nada estiver selecionado
        }
    }

    // --- 3. FUNÇÕES AUXILIARES ---
    function preencherAlocacoesSalvas() {
        (projetoParaEditar.alocacoesFuncionario || []).forEach(aloc => {
            const checkbox = document.querySelector(`#func-${aloc.id_funcionario}-${aloc.data}`);
            if (checkbox) checkbox.checked = true;
        });
        (projetoParaEditar.alocacoesEquipamento || []).forEach(aloc => {
            const checkbox = document.querySelector(`#equip-${aloc.id_equipamento}-${aloc.data}`);
            if (checkbox) checkbox.checked = true;
        });
        document.querySelectorAll('.custom-multiselect').forEach(atualizarTextoSeletor);
    }

    function atualizarTextoSeletor(multiselect) {
        const trigger = multiselect.querySelector('.select-trigger span:first-child');
        const count = multiselect.querySelectorAll('.resource-checkbox:checked').length;
        trigger.textContent = count > 0 ? `${count} selecionado(s)` : 'Selecionar';
    }

    // **INÍCIO DA CORREÇÃO 1: Lógica do "switch" de datas**
    function handleMultiDayToggle() {
        const isMultiDay = multiDaySwitch.checked;
        dataFimInput.disabled = !isMultiDay;
        if (!isMultiDay) {
            dataFimInput.value = dataInicioInput.value;
        }
        // Ao ativar, não alteramos a data final, permitindo que o utilizador escolha.
        gerarCamposDeAlocacao();
    }
    // **FIM DA CORREÇÃO 1**

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
        if (!multiDaySwitch.checked && dataInicioStr) dataFimStr = dataInicioStr;
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
                                    ${labor.map(f => `<div class="resource-item"><input type="checkbox" id="func-${f.id}-${dataISO}" value="${f.id}" class="resource-checkbox" data-cost="${(f.parametrizacao?.valor_diaria || 0)}" data-cost-type="daily"><label for="func-${f.id}-${dataISO}">${f.nome}</label></div>`).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <label class="column-title">Equipamentos</label>
                            <div class="custom-multiselect">
                                <div class="select-trigger"><span>Selecionar</span><span class="arrow"></span></div>
                                <div class="options-list">
                                    ${equipment.map(e => `<div class="resource-item"><input type="checkbox" id="equip-${e.id}-${dataISO}" value="${e.id}" class="resource-checkbox" data-cost="${(e.parametrizacao?.valor_hora || 0)}" data-cost-type="hourly"><label for="equip-${e.id}-${dataISO}">${e.nome}</label></div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            alocacoesContainer.insertAdjacentHTML('beforeend', cardHTML);
            diaAtual.setUTCDate(diaAtual.getUTCDate() + 1);
        }

        if (modo === 'editar' && projetoParaEditar) preencherAlocacoesSalvas();

        atualizarResumoFinanceiro();
        atualizarResumoSelecao();
    }

    function atualizarResumoFinanceiro() {
        let custoTotalProducao = 0;
        const orcamento = parseFloat(orcamentoInput.value) || 0;
        document.querySelectorAll('.allocation-day-card').forEach(card => {
            const horas = parseFloat(card.querySelector('.horas-trabalhadas').value) || 0;
            card.querySelectorAll('.resource-checkbox:checked').forEach(checkbox => {
                const custo = parseFloat(checkbox.dataset.cost) || 0;
                const tipoCusto = checkbox.dataset.costType;
                if (tipoCusto === 'daily') custoTotalProducao += custo * horas;
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

    // --- 4. ENVIO DO FORMULÁRIO ---
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
        const alocacoes_diarias = {};
        document.querySelectorAll('.allocation-day-card').forEach(card => {
            const data = card.dataset.date;
            const horas_trabalhadas = parseInt(card.querySelector('.horas-trabalhadas').value, 10) || 0;
            const funcionarios = Array.from(card.querySelectorAll('.resource-checkbox[id^="func-"]:checked')).map(cb => ({
                id_funcionario: parseInt(cb.value, 10),
                valor_dia_alocado: parseFloat(cb.dataset.cost) || 0
            }));
            const equipamentos = Array.from(card.querySelectorAll('.resource-checkbox[id^="equip-"]:checked')).map(cb => ({
                id_equipamento: parseInt(cb.value, 10),
                valor_hora_alocada: parseFloat(cb.dataset.cost) || 0
            }));
            if (funcionarios.length > 0 || equipamentos.length > 0) {
                alocacoes_diarias[data] = { horas_trabalhadas, funcionarios, equipamentos };
            }
        });
        const dadosDoProjeto = {
            id_cliente: parseInt(id_cliente, 10),
            nome: nomeInput.value,
            descricao: descricaoInput ? descricaoInput.value : '',
            data_inicio: dataInicioInput.value,
            data_fim: multiDaySwitch.checked ? dataFimInput.value : dataInicioInput.value,
            orcamento: parseFloat(orcamentoInput.value),
            imposto: invoiceCheckbox.checked,
            alocacoes_diarias
        };
        try {
            if (modo === 'editar') {
                await request(`/servico/${form.dataset.id}`, 'PUT', dadosDoProjeto);
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

    // --- 5. INICIALIZAÇÃO E EVENTOS ---
    popularClientes();
    handleMultiDayToggle(); // Chama para configurar o estado inicial

    // **INÍCIO DA CORREÇÃO 2: Remover o bloco 'if (modo === 'editar')' daqui**
    // O código que estava aqui era redundante e incorreto, pois a lógica já é tratada
    // dentro de `gerarCamposDeAlocacao` através da chamada a `preencherAlocacoesSalvas`.
    // **FIM DA CORREÇÃO 2**

    // Adiciona os event listeners
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
            atualizarResumoSelecao();
        }
        if (e.target.matches('.resource-checkbox')) {
            const multiselect = e.target.closest('.custom-multiselect');
            if (multiselect) atualizarTextoSeletor(multiselect);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-multiselect')) {
            document.querySelectorAll('.custom-multiselect.open').forEach(select => select.classList.remove('open'));
        }
    });
}

async function carregarExibirAlocacoes() {
    const container = document.getElementById('allocations-grid');
    if (!container) return;
    container.innerHTML = '<p style="color: var(--text-secondary);">Carregando alocações...</p>';

    try {
        const servicos = await request('/servico');

        if (!servicos || servicos.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Nenhuma alocação encontrada para você.</p>';
            return;
        }

        container.innerHTML = ''; 

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        servicos.sort((a, b) => {
            const relatorioAFeito = (a.alocacoesFuncionario || []).some(aloc => aloc.feedback && ['respondido', 'aprovado'].includes(aloc.feedback.status));
            const relatorioBFeito = (b.alocacoesFuncionario || []).some(aloc => aloc.feedback && ['respondido', 'aprovado'].includes(aloc.feedback.status));
            if (relatorioAFeito && !relatorioBFeito) return 1;
            if (!relatorioAFeito && relatorioBFeito) return -1;
            const dataA = new Date(a.data_inicio);
            const dataB = new Date(b.data_inicio);
            const diffA = Math.abs(dataA.getTime() - hoje.getTime());
            const diffB = Math.abs(dataB.getTime() - hoje.getTime());
            return diffA - diffB;
        });

        const statusMap = {
            'agendado': { text: 'Agendado', class: 'badge-yellow' },
            'em execução': { text: 'Em Execução', class: 'badge-blue' },
            'concluido': { text: 'Concluído', class: 'badge-green' },
        };

        servicos.forEach(servico => {
            const primeiraAlocacaoComFeedback = (servico.alocacoesFuncionario || []).find(aloc => aloc.feedback);
            const feedback = primeiraAlocacaoComFeedback ? primeiraAlocacaoComFeedback.feedback : null;
            
            const dataInicioFormatada = new Date(servico.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const dataFimFormatada = new Date(servico.data_fim).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const periodo = dataInicioFormatada === dataFimFormatada ? dataInicioFormatada : `${dataInicioFormatada} a ${dataFimFormatada}`;

            let footerHtml = '';
            const relatorioRejeitado = feedback && feedback.status === 'rejeitado';
            const relatorioEnviado = feedback && ['respondido', 'aprovado'].includes(feedback.status);

            if (relatorioRejeitado) {
                footerHtml = `<span class="report-rejected-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Ajuste Necessário
                </span>`;
            } else if (relatorioEnviado) {
                footerHtml = `<span class="report-done-badge"><svg width="16" height="16" ...></svg>Relatório Feito</span>`;
            } else if (servico.status === 'agendado') {
                footerHtml = `<span class="report-pending-badge">Aguardando Início</span>`;
            } else if (feedback && feedback.id) {
                footerHtml = `<button class="btn-action btn-report" data-feedback-id="${feedback.id}" data-alocacao-info="${servico.nome} - Período: ${periodo}">Realizar Relatório</button>`;
            } else {
                footerHtml = `<span class="report-pending-badge">Relatório Indisponível</span>`;
            }

            const statusInfo = statusMap[servico.status] || { text: servico.status, class: '' };
            const statusBadgeHtml = `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;

            const cardHtml = `
                <div class="allocation-card">
                    <div class="card-header">
                        <h3 class="card-title">${servico.nome}</h3>
                        ${statusBadgeHtml}
                    </div>
                    <div class="card-content">
                        <span class="card-date">Período: ${periodo}</span>
                        <p class="card-description">${servico.descricao || 'Nenhuma descrição para este projeto.'}</p>
                    </div>
                    <div class="card-footer">
                        ${footerHtml}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });

    } catch (err) {
        console.error("Erro ao carregar alocações:", err);
        container.innerHTML = '<div class="no-projects-message"><h2>Erro ao carregar suas alocações.</h2></div>';
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

async function abrirModalRelatorioEspecifico(feedbackId, alocacaoInfo, comentarioExistente = '') {
    if (!feedbackId) {
        alert("Erro: ID do feedback não encontrado. Não é possível abrir o relatório.");
        return;
    }

    await abrirModalGenerico({
        htmlPath: 'novorelatorio/novorelatorio.html',
        cssPath: 'novorelatorio/novorelatorio.css',
        cssId: 'novorelatorio-css',
        closeBtnId: 'close-report-modal-btn',
        closeFn: fecharModalNovoRelatorio
    });

    // Esconde o dropdown e desativa-o
    const selectAlocacao = document.getElementById('relatorio-alocacao');
    selectAlocacao.parentElement.style.display = 'none';
    selectAlocacao.disabled = true;

    // Configura o título e o texto do comentário
    document.getElementById('modal-title').textContent = `Relatório de: ${alocacaoInfo}`;
    document.getElementById('relatorio-texto').value = comentarioExistente; // <-- Preenche com o texto existente

    configurarFormNovoRelatorio(feedbackId);
}

function configurarFormNovoRelatorio(feedbackId = null) {
    const form = document.getElementById('form-novo-relatorio');
    const submitButton = form.querySelector('button[type="submit"]');

    // **INÍCIO DA CORREÇÃO 1: Usar 'onsubmit' para garantir um único manipulador**
    // Isto substitui qualquer listener de 'submit' anterior, eliminando o "efeito fantasma".
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        // A lógica de envio permanece a mesma, mas agora é a única a ser executada.
        const idParaAtualizar = feedbackId;

        if (!idParaAtualizar) {
            alert('Erro: ID do Feedback não encontrado. Não foi possível enviar o relatório.');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const comentario = document.getElementById('relatorio-texto').value;

        try {
            await request(`/feedback/${idParaAtualizar}`, 'PUT', { comentario });
            alert('Relatório enviado com sucesso!');
            fecharModalNovoRelatorio();
            carregarPagina('alocacoes/alocacoes.html');
        } catch (err) {
            alert(`Erro ao enviar relatório: ${err.message}`);
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Relatório';
        }
    };
    // **FIM DA CORREÇÃO 1**
}

// document.addEventListener('click', (event) => {
//     // Procura se o clique foi num botão "Realizar Relatório"
//     const reportButton = event.target.closest('.btn-report');

//     if (reportButton) {
//         // Pega o ID do feedback guardado no botão
//         const feedbackId = reportButton.dataset.feedbackId;

//         // Pega as informações do card para mostrar um título informativo no modal
//         const alocItem = reportButton.closest('.allocation-item');
//         const nomeProjeto = alocItem.querySelector('.allocation-project-name').textContent;
//         const dataProjeto = alocItem.querySelector('.allocation-date').textContent;
//         const infoCabecalho = `${nomeProjeto} (${dataProjeto.replace('Data: ', '')})`;

//         // Chama a função para abrir o modal, passando o ID e as informações
//         abrirModalRelatorioEspecifico(feedbackId, infoCabecalho);
//     }
// });

async function carregarExibirFeedbacks() {
    const container = document.getElementById('feedbacks-list-body');
    if (!container) return;

    container.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">A carregar feedbacks...</td></tr>';

    try {
        const feedbacks = await request('/feedback');

        if (!feedbacks || feedbacks.length === 0) {
            container.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">Nenhum feedback encontrado.</td></tr>';
            return;
        }

        container.innerHTML = ''; // Limpa a mensagem

        const statusMap = {
            'pendente': { text: 'Pendente', class: 'badge-yellow' },
            'respondido': { text: 'Respondido', class: 'badge-blue' },
            'aprovado': { text: 'Aprovado', class: 'badge-green' },
            'recusado': { text: 'Recusado', class: 'badge-red' }
        };

        feedbacks.forEach(feedback => {
            const dataFormatada = new Date(feedback.data || new Date()).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const statusInfo = statusMap[feedback.status] || { text: feedback.status, class: '' };

            const nomeFuncionario = feedback.funcionario?.nome || 'Funcionário não encontrado';
            const nomeProjeto = feedback.servico?.nome || 'Projeto não encontrado'

            const rowHtml = `
                <tr>
                    <td>
                        <div class="item-primary-text">${nomeFuncionario}</div>
                    </td>
                    <td>
                        <div class="item-secondary-text">${nomeProjeto}</div>
                    </td>
                    <td>
                        <div class="item-secondary-text">${dataFormatada}</div>
                    </td>
                    <td>
                        <span class="badge ${statusInfo.class}">${statusInfo.text}</span>
                    </td>
                    <td>
                        <button class="btn-action review-feedback-btn" data-feedback-id="${feedback.id}">Revisar</button>
                    </td>
                </tr>
            `;
            container.insertAdjacentHTML('beforeend', rowHtml);
        });

    } catch (err) {
        console.error("Erro ao carregar feedbacks:", err);
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--red-text);">Erro ao carregar os feedbacks.</td></tr>';
    }
}

function configurarAcoesFeedbacks() {
    const container = document.getElementById('feedbacks-list-body');
    if (!container) return;

    container.addEventListener('click', async (event) => {
        const reviewButton = event.target.closest('.review-feedback-btn');
        if (reviewButton) {
            const feedbackId = reviewButton.dataset.feedbackId;
            // Aqui, futuramente, você abrirá um modal para revisar o feedback
            abrirModalRevisao(feedbackId);
        }
    });
}

function fecharModalRevisao() {
    fecharModalGenerico('revisar-feedback-css');
}

async function abrirModalRevisao(feedbackId) {
    await abrirModalGenerico({
        htmlPath: 'feedbacks/revisar-feedback.html',
        cssPath: 'feedbacks/revisar-feedback.css',
        cssId: 'revisar-feedback-css',
        closeBtnId: 'close-review-modal-btn',
        closeFn: fecharModalRevisao
    });

    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
        const responseText = document.getElementById('admin-response-text');
        const btnAprovar = document.getElementById('btn-aprovar');
        const btnRejeitar = document.getElementById('btn-rejeitar');
        
        const feedback = await request(`/feedback/${feedbackId}`);
        
        document.getElementById('review-funcionario-nome').textContent = feedback.funcionario?.nome || 'N/A';
        document.getElementById('review-projeto-nome').textContent = feedback.servico?.nome || 'N/A';
        document.getElementById('review-data-envio').textContent = new Date(feedback.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        document.getElementById('review-comentario').textContent = feedback.comentario;

        // Preenche a caixa de texto com a resposta anterior do admin, se houver
        responseText.value = feedback.resposta || '';

        // **CORREÇÃO DA LÓGICA DOS BOTÕES**
        // Agora, ambos os botões lêem o valor da caixa de texto no momento do clique.
        btnAprovar.onclick = () => handleFeedbackAction(feedbackId, 'aprovado', responseText.value);
        btnRejeitar.onclick = () => handleFeedbackAction(feedbackId, 'rejeitado', responseText.value);

    } catch (error) {
        alert(`Erro ao carregar detalhes do feedback: ${error.message}`);
        fecharModalRevisao();
    }
}

async function handleFeedbackAction(feedbackId, novoStatus, resposta = null) {
    // Monta o corpo da requisição com o status e a resposta
    const body = { 
        status: novoStatus,
        resposta: resposta 
    };

    try {
        await request(`/feedback/${feedbackId}`, 'PUT', body);
        alert(`Feedback ${novoStatus === 'aprovado' ? 'aprovado' : 'marcado para ajuste'} com sucesso!`);
        fecharModalRevisao();
        carregarPagina('feedbacks/feedbacks.html'); // Recarrega a lista
    } catch (error) {
        alert(`Erro ao atualizar o status do feedback: ${error.message}`);
    }
}

function configurarAcoesAlocacoes() {
    const container = document.getElementById('allocations-grid');
    if (!container) return;

    // Adiciona um único 'escutador' de eventos ao contêiner pai
    container.addEventListener('click', (event) => {
        const target = event.target;

        // Verifica se o elemento clicado (ou um parente próximo) é o botão de relatório
        const reportButton = target.closest('.btn-report');

        if (reportButton) {
            // Se for o botão, pega os dados que guardamos nele
            const { feedbackId, alocacaoInfo } = reportButton.dataset;

            // Chama a função para abrir o modal, passando os dados corretos
            // Usaremos a função mais inteligente que já pre-seleciona a alocação
            abrirModalRelatorioEspecifico(feedbackId, alocacaoInfo);
        }
    });
}

function configurarAcessoPorPerfil() {
    const perfil = localStorage.getItem('userProfile');

    if (!perfil) {
        console.warn("Nenhum perfil encontrado, redirecionando para login.");
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
                const cost = item.parametrizacao ? (isEquipment ? item.parametrizacao.valor_hora : item.parametrizacao.valor_diaria) : 0;
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
            else dados.valor_diaria = cost;
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
                costInput.value = item.parametrizacao ? (isEquipment ? item.parametrizacao.valor_hora : item.parametrizacao.valor_diaria) : '';
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

async function configurarPaginaProjetos() {
    const container = document.getElementById('projects-container');
    const filtersContainer = document.getElementById('project-filters');
    if (!container || !filtersContainer) return;

    let todosOsProjetos = []; // Guarda os projetos para filtrar sem chamar a API de novo

    // Função interna que desenha os cards na tela com base no filtro
    const renderizarProjetos = (filtro = 'all') => {

        // Limpa o container de projetos antes de adicionar os novos cards.
        // Esta linha é essencial para que o filtro funcione corretamente.
        container.innerHTML = '';

        const projetosFiltrados = filtro === 'all'
            ? todosOsProjetos
            : todosOsProjetos.filter(p => p.status === filtro);

        if (projetosFiltrados.length === 0) {
            container.innerHTML = `<div class="no-projects-message"><h2>Nenhum projeto encontrado para este filtro.</h2></div>`;
            return;
        }

        const statusMap = {
            'agendado': { text: 'Agendado', class: 'badge-yellow' },
            'em execução': { text: 'Em Execução', class: 'badge-blue' },
            'concluido': { text: 'Concluído', class: 'badge-green' },
            'cancelado': { text: 'Cancelado', class: 'badge-red' }
        };

        projetosFiltrados.forEach(projeto => {
            const prazoFinal = new Date(projeto.data_fim).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const statusInfo = statusMap[projeto.status?.toLowerCase()] || { text: projeto.status || 'N/A', class: '' };
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </button>
                            <div class="dropdown-content">
                                <a class="dropdown-item btn-editar text-yellow">Editar</a>
                                <a class="dropdown-item text-red btn-excluir">Excluir</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-item"><span>Status</span><span class="badge ${statusInfo.class}">${statusInfo.text}</span></div>
                        <div class="card-item"><span>Orçamento</span><span class="value">R$ ${parseFloat(projeto.orcamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                        <div class="card-item"><span>Lucro</span><span class="value text-green">R$ ${parseFloat(projeto.lucro_estimado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                        <div class="card-item"><span>Prazo</span><span class="value">${prazoFinal}</span></div>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    };

    // Adiciona o listener para os botões de filtro (lógica da nova função)
    filtersContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('filter-btn')) {
            filtersContainer.querySelector('.filter-btn.active')?.classList.remove('active');
            target.classList.add('active');
            renderizarProjetos(target.dataset.filter);
        }
    });

    // Adiciona um único listener para todas as ações nos cards (usando a sua lógica robusta)
    container.addEventListener('click', async (event) => {
        const target = event.target;

        // Lógica para abrir/fechar o menu dropdown (da sua função)
        const menuBtn = target.closest('.card-menu-btn');
        if (menuBtn) {
            event.stopPropagation();
            const menu = menuBtn.closest('.dropdown-menu');
            const estavaAtivo = menu.classList.contains('active');

            // Fecha todos os outros menus antes de abrir o novo
            document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));

            if (!estavaAtivo) {
                menu.classList.add('active');
            }
            return;
        }

        const card = target.closest('.project-card');
        if (!card) return;
        const projetoId = card.dataset.id;

        // Lógica para o botão de Editar (adaptada da sua função)
        if (target.closest('.btn-editar')) {
            abrirModalEdicao(projetoId);
            return;
        }

        // Lógica para o botão de Excluir (da sua função, com animação)
        if (target.closest('.btn-excluir')) {
            const confirmar = confirm('Tem a certeza de que deseja excluir este projeto? Esta ação não pode ser desfeita.');
            if (confirmar) {
                try {
                    await request(`/servico/${projetoId}`, 'DELETE');

                    // Animação de remoção
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => card.remove(), 300);

                } catch (err) {
                    alert(`Não foi possível excluir o projeto: ${err.message}`);
                }
            }
            return;
        }
    });

    // Evento global para fechar os menus dropdown (da sua função)
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown-menu')) {
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });

    // Busca os dados iniciais da API e renderiza pela primeira vez
    try {
        container.innerHTML = '<p style="text-align: center;">A carregar projetos...</p>';
        todosOsProjetos = await request('/servico');
        renderizarProjetos('all'); // Mostra 'todos' por defeito
    } catch (err) {
        console.error("Erro ao carregar projetos:", err);
        container.innerHTML = `<div class="no-projects-message"><h2>Erro ao carregar os projetos.</h2></div>`;
    }
}



// --- INICIALIZAÇÃO DO SITE ---
window.onload = async () => {
    configurarAcessoPorPerfil();
    await carregarDadosIniciais();
    configurarNavegacao();

    const perfil = localStorage.getItem('userProfile');

    if (perfil === 'administrador') {
        carregarPagina("dashboard/dashboard.html");
    } else if (perfil === 'funcionario') {
        carregarPagina("alocacoes/alocacoes.html");
    } else {
        console.error("Perfil de usuário inválido:", perfil);
        document.getElementById("conteudo").innerHTML = "<p>Erro: Perfil de usuário inválido. Faça login novamente.</p>";
    }
};