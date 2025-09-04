let equipment = [
    { id: 1, name: 'Câmera 4K', cost: 50 },
    { id: 2, name: 'Kit de Iluminação', cost: 100 }
];
let labor = [
    { id: 1, name: 'Diretor de Fotografia', cost: 30 },
    { id: 2, name: 'Editor de Video', cost: 40 }
];

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

 // function updateSummary() {
  //   const hours = parseInt(hoursInput.value, 10) || 1;
  //   const quote = parseFloat(quoteInput.value) || 0;
  //   const invoice = invoiceCheckbox.checked;

  //   const selectedEquip = [...equipmentSelect.selectedOptions].map(o => parseInt(o.value));
  //   const selectedLabor = [...laborSelect.selectedOptions].map(o => parseInt(o.value));

  //   const equipmentCostPerHour = selectedEquip.reduce((sum, id) => {
  //     const item = equipment.find(e => e.id === id);
  //     return sum + (item ? item.cost : 0);
  //   }, 0);

  //   const laborCostPerHour = selectedLabor.reduce((sum, id) => {
  //     const item = labor.find(l => l.id === id);
  //     return sum + (item ? item.cost : 0);
  //   }, 0);

  //   const totalCosts = (equipmentCostPerHour + laborCostPerHour) * hours;
  //   const tax = invoice ? quote * TAX_RATE : 0;
  //   const profit = quote - totalCosts - tax;

  //   totalCostsSpan.textContent = `R$ ${totalCosts.toFixed(2)}`;
  //   taxSpan.textContent = `R$ ${tax.toFixed(2)}`;
  //   profitSpan.textContent = `R$ ${profit.toFixed(2)}`;
  //   profitSpan.style.color = profit < 0 ? 'red' : '#388e3c';
  // }

// --- Lógica da página de Configurações ---
function configurarPaginaConfiguracoes() {
    const equipmentContainer = document.getElementById('equipment-items');
    const laborContainer = document.getElementById('labor-items');
    const addEquipmentBtn = document.getElementById('add-equipment-btn');
    const addLaborBtn = document.getElementById('add-labor-btn');

    function renderList(type) {
        const data = type === 'equipment' ? equipment : labor;
        const container = type === 'equipment' ? equipmentContainer : laborContainer;
        container.innerHTML = '';
        data.forEach(item => {
            container.innerHTML += `
                <div class="resource-item">
                    <div class="resource-item-info">
                        <p>${item.name}</p>
                        <p>R$ ${item.cost.toFixed(2)} / hora</p>
                    </div>
                    <button class="delete-btn" data-id="${item.id}" data-type="${type}">X</button>
                </div>
            `;
        });
    }

    function addItem(type) {
        const nameInput = document.getElementById(`${type}-name`);
        const costInput = document.getElementById(`${type}-cost`);
        const name = nameInput.value.trim();
        const cost = parseFloat(costInput.value);

        if (!name || isNaN(cost) || cost <= 0) {
            alert('Por favor, preencha o nome e um custo válido.');
            return;
        }

        const newItem = { id: Date.now(), name, cost };
        if (type === 'equipment') equipment.push(newItem);
        else labor.push(newItem);

        nameInput.value = '';
        costInput.value = '';
        renderList(type);
    }

    function deleteItem(type, id) {
        if (type === 'equipment') {
            equipment = equipment.filter(item => item.id !== id);
        } else {
            labor = labor.filter(item => item.id !== id);
        }
        renderList(type);
    }

    addEquipmentBtn.addEventListener('click', () => addItem('equipment'));
    addLaborBtn.addEventListener('click', () => addItem('labor'));

    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const id = parseInt(event.target.dataset.id, 10);
                const type = event.target.dataset.type;
                deleteItem(type, id);
            }
        });
    }

    renderList('equipment');
    renderList('labor');
}

// --- Inicialização do Site ---
window.onload = () => {
    configurarNavegacao();
    carregarPagina("dashboard/dashboard.html"); // Página inicial
};