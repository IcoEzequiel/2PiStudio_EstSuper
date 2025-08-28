document.addEventListener('DOMContentLoaded', () => {

    // Dados de exemplo para simular a informação vinda do servidor
    const projects = [
        { nome: 'Website Loja Online', cliente: 'João Silva', status: 'em andamento', orcamento: 12000 },
        { nome: 'Aplicativo Mobile', cliente: 'Maria Souza', status: 'concluído', orcamento: 8000 },
        { nome: 'Painel Interno', cliente: 'Empresa ACME', status: 'em orçamento', orcamento: 5000 },
        { nome: 'E-commerce Moderno', cliente: 'Startup XYZ', status: 'cancelado', orcamento: 2500 },
        { nome: 'Sistema de Gestão', cliente: 'Corporação ABC', status: 'em andamento', orcamento: 15000 },
        { nome: 'Landing Page Marketing', cliente: 'Agência Digital', status: 'concluído', orcamento: 3000 },
        { nome: 'Identidade Visual', cliente: 'Designer Freelancer', status: 'concluído', orcamento: 2000 },
        { nome: 'Protótipo UX/UI', cliente: 'Cliente B', status: 'em andamento', orcamento: 7000 },
        { nome: 'Site Institucional', cliente: 'Empresa D', status: 'concluído', orcamento: 9500 },
        { nome: 'Portal de Notícias', cliente: 'Jornal Online', status: 'concluído', orcamento: 18000 },
    ];

    // Função para formatar o valor como moeda brasileira (Real)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount || 0);
    };

    // Função para calcular os dados do dashboard
    const calculateDashboardData = (projects) => {
        const completedProjects = projects.filter(p => p.status === 'concluído');

        const totalRevenue = completedProjects.reduce((sum, p) => sum + p.orcamento, 0);
        // O lucro não está nos dados, mas podemos simular um valor
        const totalProfit = totalRevenue * 0.6; // Exemplo: lucro de 60%

        return {
            activeProjects: projects.filter(p => p.status === 'em andamento').length,
            completedProjects: completedProjects.length,
            totalRevenue: totalRevenue,
            totalProfit: totalProfit
        };
    };

    // Extrair os dados calculados
    const dashboardData = calculateDashboardData(projects);

    // Mapeamento de status para as classes de cor do HTML
    const statusClasses = {
        'em andamento': 'azul',
        'concluído': 'verde',
        'em orçamento': 'amarelo',
        'cancelado': 'vermelho'
    };

    // --- Preencher os valores dos cards de resumo ---
    const activeProjectsEl = document.querySelector('.card:nth-child(1) .valor-card');
    activeProjectsEl.textContent = dashboardData.activeProjects;

    const totalRevenueEl = document.querySelector('.card:nth-child(2) .valor-card');
    totalRevenueEl.textContent = formatCurrency(dashboardData.totalRevenue);

    const totalProfitEl = document.querySelector('.card:nth-child(3) .valor-card');
    totalProfitEl.textContent = formatCurrency(dashboardData.totalProfit);

    const completedProjectsEl = document.querySelector('.card:nth-child(4) .valor-card');
    completedProjectsEl.textContent = dashboardData.completedProjects;


    // --- Gerar a lista de projetos recentes ---
    const recentProjectsContainer = document.querySelector('.projetos-recentes');
    // Limpar o conteúdo existente (os projetos estáticos do HTML)
    const staticProjects = recentProjectsContainer.querySelectorAll('.projeto');
    staticProjects.forEach(el => el.remove());

    // Criar e adicionar os novos elementos baseados nos dados
    projects.forEach(project => {
        const projetoDiv = document.createElement('div');
        projetoDiv.classList.add('projeto');

        projetoDiv.innerHTML = `
            <div>
                <p class="nome-projeto">${project.nome}</p>
                <p class="cliente-projeto">Cliente: ${project.cliente}</p>
            </div>
            <div class="status-projeto">
                <span class="etiqueta ${statusClasses[project.status]}">${project.status}</span>
                <p class="orcamento-projeto">${formatCurrency(project.orcamento)}</p>
            </div>
        `;
        recentProjectsContainer.appendChild(projetoDiv);
    });
});