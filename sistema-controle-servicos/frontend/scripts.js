// No topo do arquivo scripts.js
import { request } from "./shared/api.js"; // Ajuste o caminho se necessário

// Variáveis globais que você já tem
let equipment = [];
let labor = [];

async function carregarDadosIniciais() {
    console.log("Buscando dados iniciais da API...");
    try {
        // Busca os dados de equipamentos
        const responseEquip = await fetch('/equipamento'); // <-- Use o URL da sua API de equipamentos
        if (!responseEquip.ok) throw new Error('Falha ao buscar equipamentos');
        equipment = await responseEquip.json(); // Converte a resposta para JSON e armazena na variável global

        // Busca os dados de mão de obra
        const responseLabor = await fetch('/mao-de-obra'); // <-- Use o URL da sua API de mão de obra
        if (!responseLabor.ok) throw new Error('Falha ao buscar mão de obra');
        labor = await responseLabor.json(); // Converte e armazena na variável global

        console.log("Dados carregados com sucesso!", { equipment, labor });

    } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        alert("Não foi possível carregar os recursos do servidor. Usando dados de exemplo.");
        
        // **PLANO B:** Se a API falhar, você pode carregar dados de exemplo para não travar a aplicação
        equipment = [{ id: 1, name: 'Câmera (Exemplo)', cost: 150.00 }];
        labor = [{ id: 1, name: 'Editor (Exemplo)', cost: 120.00 }];
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

        if (pagina.includes("novoprojeto")) {
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "novoprojeto/novoprojeto.css";
            css.id = "extra-css";
            document.head.appendChild(css);
            setTimeout(() => { configurarFormNovoProjeto(); }, 0);
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
    const links = document.querySelectorAll(".nav-btn, .btn-novo-projeto");
    links.forEach(link => {
        link.addEventListener("click", () => {
            const pagina = link.getAttribute("data-page");
            carregarPagina(pagina);
        });
    });
}

// --- Lógica do formulário de Novo Projeto ---
function configurarFormNovoProjeto() {
    const TAX_RATE = 0.06;

    const equipmentSelect = document.getElementById("equipmentSelect");
    const laborSelect = document.getElementById("laborSelect");
    const hoursInput = document.getElementById("hours");
    const quoteInput = document.getElementById("quote");
    const invoiceCheckbox = document.getElementById("invoice");
    const totalCostsSpan = document.getElementById("totalCosts");
    const taxSpan = document.getElementById("tax");
    const profitSpan = document.getElementById("profit");

    function calculateCostFromSelection(selectedIds, dataSource) {
        return selectedIds.reduce((sum, id) => {
            const item = dataSource.find(data => data.id === id);
            return sum + (item ? item.cost : 0);
        }, 0);
    }

    function populateSelects() {
        equipmentSelect.innerHTML = '';
        laborSelect.innerHTML = '';
        equipment.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = `${e.name} - R$ ${e.cost}/h`;
            equipmentSelect.appendChild(opt);
        });
        labor.forEach(l => {
            const opt = document.createElement("option");
            opt.value = l.id;
            opt.textContent = `${l.name} - R$ ${l.cost}/h`;
            laborSelect.appendChild(opt);
        });
    }

    function updateSummary() {
        const hours = parseInt(hoursInput.value, 10) || 1;
        const quote = parseFloat(quoteInput.value) || 0;
        const invoice = invoiceCheckbox.checked;

        const selectedEquip = [...equipmentSelect.selectedOptions].map(o => parseInt(o.value));
        const selectedLabor = [...laborSelect.selectedOptions].map(o => parseInt(o.value));

        const equipmentCostPerHour = calculateCostFromSelection(selectedEquip, equipment);
        const laborCostPerHour = calculateCostFromSelection(selectedLabor, labor);

        const productionCosts = (equipmentCostPerHour + laborCostPerHour) * hours;
        const tax = invoice ? quote * TAX_RATE : 0;
        const totalCosts = productionCosts + tax;
        const profit = quote - totalCosts;

        totalCostsSpan.textContent = `R$ ${totalCosts.toFixed(2)}`;
        taxSpan.textContent = `R$ ${tax.toFixed(2)}`;
        profitSpan.textContent = `R$ ${profit.toFixed(2)}`;
        profitSpan.style.color = profit < 0 ? 'red' : '#388e3c';
    }

    populateSelects();
    equipmentSelect.addEventListener("change", updateSummary);
    laborSelect.addEventListener("change", updateSummary);
    hoursInput.addEventListener("input", updateSummary);
    quoteInput.addEventListener("input", updateSummary);
    invoiceCheckbox.addEventListener("change", updateSummary);

    document.getElementById("projectForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const clientName = document.getElementById("clientName").value.trim();
        const projectName = document.getElementById("projectName").value.trim();
        if (!clientName || !projectName) {
            alert("Nome do cliente e do projeto são obrigatórios!");
            return;
        }
        alert("Projeto salvo com sucesso!");
        document.getElementById("projectForm").reset();
        updateSummary();
    });

    updateSummary();
}

// --- Lógica da página de Configurações ---
// --- Lógica da página de Configurações (Versão Completa com CRUD) ---
function configurarPaginaConfiguracoes() {
    // --- URLs da API ---
    const API_EQUIPMENT = '/equipamento';
    const API_LABOR = '/mao-de-obra';

    // --- Seleção dos Elementos (Equipamentos) ---
    const equipmentContainer = document.getElementById('equipment-items');
    const addEquipmentBtn = document.getElementById('add-equipment-btn');
    const equipmentNameInput = document.getElementById('equipment-name');
    const equipmentCostInput = document.getElementById('equipment-cost');
    let editingEquipmentId = null; // Controla se estamos editando um equipamento

    // --- Seleção dos Elementos (Mão de Obra) ---
    const laborContainer = document.getElementById('labor-items');
    const addLaborBtn = document.getElementById('add-labor-btn');
    const laborNameInput = document.getElementById('labor-name');
    const laborCostInput = document.getElementById('labor-cost');
    let editingLaborId = null; // Controla se estamos editando mão de obra

    // 1. FUNÇÃO PARA DESENHAR OS ITENS NA TELA
    function renderList(type) {
        const data = type === 'equipment' ? equipment : labor;
        const container = type === 'equipment' ? equipmentContainer : laborContainer;
        
        container.innerHTML = ''; // Limpa a lista antes de redesenhar
        data.forEach(item => {
            const itemCost = item.cost || item.custo || 0;
            const itemName = item.name || item.nome || 'Nome não encontrado';

            const itemDiv = document.createElement('div');
            itemDiv.className = 'resource-item';
            itemDiv.innerHTML = `
                <div class="resource-item-info">
                    <p>${itemName}</p>
                    <p>R$ ${parseFloat(itemCost).toFixed(2)} / hora</p>
                </div>
                <div class="actions">
                    <button class="edit-btn" data-id="${item.id}" data-type="${type}">✏️</button>
                    <button class="delete-btn" data-id="${item.id}" data-type="${type}">🗑️</button>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    }

    // 2. FUNÇÃO PARA CARREGAR UM ITEM PARA EDIÇÃO
    async function loadItemForEdit(type, id) {
        const endpoint = type === 'equipment' ? `${API_EQUIPMENT}/${id}` : `${API_LABOR}/${id}`;
        try {
            const item = await request(endpoint);
            if (type === 'equipment') {
                equipmentNameInput.value = item.name || item.nome;
                equipmentCostInput.value = item.cost || item.custo;
                editingEquipmentId = id;
                addEquipmentBtn.innerHTML = 'Salvar'; // Muda o texto do botão para "Salvar"
            } else {
                laborNameInput.value = item.name || item.nome;
                laborCostInput.value = item.cost || item.custo;
                editingLaborId = id;
                addLaborBtn.innerHTML = 'Salvar';
            }
        } catch (err) {
            alert(`Erro ao carregar item para edição: ${err.message}`);
        }
    }

    // 3. FUNÇÃO PRINCIPAL PARA SALVAR (CRIAR E ATUALIZAR)
    async function handleItemSubmit(type) {
        const isEditing = type === 'equipment' ? !!editingEquipmentId : !!editingLaborId;
        const id = type === 'equipment' ? editingEquipmentId : editingLaborId;
        
        const nameInput = type === 'equipment' ? equipmentNameInput : laborNameInput;
        const costInput = type === 'equipment' ? equipmentCostInput : laborCostInput;
        const addButton = type === 'equipment' ? addEquipmentBtn : addLaborBtn;

        const dados = {
            name: nameInput.value.trim(),
            cost: parseFloat(costInput.value)
        };

        if (!dados.name || isNaN(dados.cost)) {
            alert("Por favor, preencha nome e custo válidos.");
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing 
            ? `${(type === 'equipment' ? API_EQUIPMENT : API_LABOR)}/${id}` 
            : (type === 'equipment' ? API_EQUIPMENT : API_LABOR);
        
        try {
            await request(endpoint, method, dados);

            // Limpa o formulário e o estado de edição
            nameInput.value = '';
            costInput.value = '';
            if (type === 'equipment') editingEquipmentId = null;
            else editingLaborId = null;
            
            // Volta o botão para o ícone de adicionar
            addButton.innerHTML = `<svg class="icon-sm" ...> </svg>`; // Cole seu SVG aqui novamente

            await carregarDadosIniciais(); // Busca os dados mais recentes do servidor
            renderList(type); // Atualiza a lista na tela

        } catch (err) {
            alert(`Erro ao salvar: ${err.message}`);
        }
    }

    // 4. FUNÇÃO PARA EXCLUIR UM ITEM
    async function deleteItem(type, id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;
        
        const endpoint = `${(type === 'equipment' ? API_EQUIPMENT : API_LABOR)}/${id}`;
        
        try {
            await request(endpoint, 'DELETE');
            await carregarDadosIniciais(); // Busca os dados mais recentes
            renderList(type); // Atualiza a lista na tela
        } catch (err) {
            alert(`Erro ao excluir: ${err.message}`);
        }
    }

    // --- CONFIGURAÇÃO DOS EVENTOS ---
    addEquipmentBtn.addEventListener('click', () => handleItemSubmit('equipment'));
    addLaborBtn.addEventListener('click', () => handleItemSubmit('labor'));

    // Delegação de eventos para os botões de editar e excluir
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const { id, type } = button.dataset;

            if (button.classList.contains('edit-btn')) {
                loadItemForEdit(type, id);
            } else if (button.classList.contains('delete-btn')) {
                deleteItem(type, id);
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    // Renderiza as listas com os dados que já foram carregados globalmente
    renderList('equipment');
    renderList('labor');
}

// --- Inicialização do Site ---

window.onload = async () => { // Transforme em uma função 'async'
    await carregarDadosIniciais(); // 1. Espera os dados serem carregados
    configurarNavegacao();         // 2. Configura a navegação
    carregarPagina("dashboard/dashboard.html"); // 3. Carrega a página inicial
};