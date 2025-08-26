document.addEventListener('DOMContentLoaded', () => {
    // Constants and state
    const TAX_RATE = 0.06;
    let formData = {
        clientName: '',
        projectName: '',
        deadline: '',
        equipmentIds: [],
        laborIds: [],
        invoice: false,
        quote: '',
        hours: 1
    };

    let equipmentData = [];
    let laborData = [];

    // DOM Elements
    const form = document.getElementById('project-form');
    const clientNameInput = document.getElementById('clientName');
    const projectNameInput = document.getElementById('projectName');
    const hoursInput = document.getElementById('hours');
    const deadlineInput = document.getElementById('deadline');
    const invoiceSwitch = document.getElementById('invoice');
    const quoteInput = document.getElementById('quote');
    const totalCostsSpan = document.getElementById('totalCosts');
    const taxCostSpan = document.getElementById('taxCost');
    const profitSpan = document.getElementById('profit');
    const equipmentTrigger = document.getElementById('equipment-trigger-text');
    const equipmentContent = document.getElementById('equipment-popover-content');
    const laborTrigger = document.getElementById('labor-trigger-text');
    const laborContent = document.getElementById('labor-popover-content');
    const messageBox = document.getElementById('message-box');

    // --- API Calls ---
    async function fetchData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            equipmentData = data.equipment;
            laborData = data.labor;
            renderMultiSelects();
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    // --- UI Functions ---
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message-box show ${type}`;
        setTimeout(() => {
            messageBox.className = `message-box ${type}`;
        }, 3000);
    }

    function updateSummary() {
        const equipmentCost = formData.equipmentIds.reduce((sum, id) => {
            const item = equipmentData.find(e => e.id === id);
            return sum + (item ? item.cost : 0);
        }, 0);

        const laborCost = formData.laborIds.reduce((sum, id) => {
            const item = laborData.find(l => l.id === id);
            return sum + (item ? item.cost : 0);
        }, 0);

        const totalHours = formData.hours > 0 ? formData.hours : 1;
        const totalCosts = (equipmentCost + laborCost) * totalHours;
        const quote = parseFloat(formData.quote) || 0;
        const tax = formData.invoice ? quote * TAX_RATE : 0;
        const profit = quote - totalCosts - tax;

        totalCostsSpan.textContent = `R$ ${totalCosts.toFixed(2)}`;
        taxCostSpan.textContent = `R$ ${tax.toFixed(2)}`;
        profitSpan.textContent = `R$ ${profit.toFixed(2)}`;

        if (profit < 0) {
            profitSpan.classList.remove('text-green');
            profitSpan.classList.add('text-red');
        } else {
            profitSpan.classList.remove('text-red');
            profitSpan.classList.add('text-green');
        }
    }

    function renderMultiSelects() {
        renderSelect(equipmentContent, equipmentData, formData.equipmentIds, 'equipmentIds');
        renderSelect(laborContent, laborData, formData.laborIds, 'laborIds');
        updateMultiSelectTriggers();
    }

    function renderSelect(container, options, selected, field) {
        container.innerHTML = '';
        options.forEach(option => {
            const item = document.createElement('label');
            item.className = 'popover-item';
            item.innerHTML = `
                <input type="checkbox" class="popover-checkbox" data-id="${option.id}" ${selected.includes(option.id) ? 'checked' : ''}>
                <span>${option.name} - R$ ${option.cost}/h</span>
            `;
            item.querySelector('input').addEventListener('change', (e) => handleMultiSelect(e, field));
            container.appendChild(item);
        });
    }

    function updateMultiSelectTriggers() {
        const equipmentSelectedCount = formData.equipmentIds.length;
        equipmentTrigger.textContent = equipmentSelectedCount > 0
            ? `${equipmentSelectedCount} selecionado(s)`
            : 'Selecionar Equipamentos';

        const laborSelectedCount = formData.laborIds.length;
        laborTrigger.textContent = laborSelectedCount > 0
            ? `${laborSelectedCount} selecionado(s)`
            : 'Selecionar Mão de Obra';
    }

    function togglePopover(popoverId) {
        const content = document.getElementById(popoverId);
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }

    // --- Event Handlers ---
    function handleMultiSelect(e, field) {
        const { id } = e.target.dataset;
        const isChecked = e.target.checked;
        const currentIds = [...formData[field]];
        if (isChecked && !currentIds.includes(id)) {
            currentIds.push(id);
        } else if (!isChecked) {
            const index = currentIds.indexOf(id);
            if (index > -1) {
                currentIds.splice(index, 1);
            }
        }
        formData[field] = currentIds;
        updateMultiSelectTriggers();
        updateSummary();
    }

    function handleInputChange(e) {
        const { id, value, type, checked } = e.target;
        if (type === 'number') {
            formData[id] = parseFloat(value);
        } else if (type === 'checkbox') {
            formData[id] = checked;
        } else {
            formData[id] = value;
        }
        updateSummary();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!formData.clientName || !formData.projectName) {
            showMessage("Nome do cliente e do projeto são obrigatórios.", "error");
            return;
        }

        try {
            const projectData = {
                ...formData,
                quote: parseFloat(formData.quote) || 0,
            };
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });
            const result = await response.json();
            if (response.ok) {
                showMessage(result.message, "success");
                form.reset();
                formData = {
                    clientName: '',
                    projectName: '',
                    deadline: '',
                    equipmentIds: [],
                    laborIds: [],
                    invoice: false,
                    quote: '',
                    hours: 1
                };
                updateSummary();
                renderMultiSelects();
            } else {
                showMessage(result.error, "error");
            }
        } catch (error) {
            showMessage("Erro ao salvar o projeto. Tente novamente.", "error");
            console.error('Submission error:', error);
        }
    }

    // Bind events
    form.addEventListener('submit', handleSubmit);
    clientNameInput.addEventListener('input', handleInputChange);
    projectNameInput.addEventListener('input', handleInputChange);
    hoursInput.addEventListener('input', handleInputChange);
    deadlineInput.addEventListener('input', handleInputChange);
    invoiceSwitch.addEventListener('change', handleInputChange);
    quoteInput.addEventListener('input', handleInputChange);

    document.getElementById('equipment-popover-container').querySelector('.popover-trigger').addEventListener('click', () => togglePopover('equipment-popover-content'));
    document.getElementById('labor-popover-container').querySelector('.popover-trigger').addEventListener('click', () => togglePopover('labor-popover-content'));

    // Initial setup
    fetchData();
});
