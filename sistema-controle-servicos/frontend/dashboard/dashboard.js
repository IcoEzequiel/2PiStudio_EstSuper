// Salve este código como: dashboard/dashboard.js (VERSÃO CORRIGIDA)

import { request } from '../shared/api.js';

// Função para formatar valores em moeda brasileira (Real)
const formatarMoeda = (valor) => {
    return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Função principal que é chamada para inicializar o dashboard
async function inicializarDashboard() {
    try {
        console.log("Buscando dados do dashboard...");
        const data = await request('/dashboard'); // Faz a chamada para a nossa rota no backend

        // Atualiza os cards com os dados recebidos
        document.getElementById('projetos-ativos').textContent = data.ativos;
        document.getElementById('projetos-concluidos').textContent = data.concluidos;
        document.getElementById('receita-total').textContent = formatarMoeda(data.receita);
        document.getElementById('lucro-total').textContent = formatarMoeda(data.lucro);

        // Mapeamento de status para classes de cor e texto
        const statusMap = {
            'agendado': { text: 'Agendado', class: 'amarelo' },
            'em execução': { text: 'Em Execução', class: 'azul' },
            'concluido': { text: 'Concluído', class: 'verde' },
            'quoting': { text: 'Orçamento', class: 'laranja' }, // Adicionado
            'cancelado': { text: 'Cancelado', class: 'vermelho' }
        };

        // Cria e insere a lista de projetos recentes
        const listaProjetosRecentesEl = document.getElementById('lista-projetos-recentes');
        if (data.projetosRecentes && data.projetosRecentes.length > 0) {
            listaProjetosRecentesEl.innerHTML = data.projetosRecentes.map(projeto => {
                const statusInfo = statusMap[projeto.status?.toLowerCase()] || { text: projeto.status, class: 'azul' };

                // --- HTML CORRIGIDO PARA CORRESPONDER AO LAYOUT DA IMAGEM ---
                return `
                    <div class="projeto">
                        <div>
                            <div class="nome-projeto">${projeto.nome}</div>
                            <div class="cliente-projeto">${projeto.cliente?.nome || 'Cliente não definido'}</div>
                        </div>
                        <div class="status-projeto">
                            <span class="etiqueta ${statusInfo.class}">${statusInfo.text}</span>
                            <div class="orcamento-projeto">${formatarMoeda(projeto.orcamento)}</div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            listaProjetosRecentesEl.innerHTML = '<p class="placeholder-projetos">Nenhum projeto recente encontrado.</p>';
        }

    } catch (error) {
        console.error('Falha ao carregar dados do dashboard:', error);
        document.querySelector('.dashboard-container').innerHTML = `<p class="erro-dashboard">Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.</p>`;
    }
}

// Exporta a função para que o scripts.js possa chamá-la
export { inicializarDashboard };