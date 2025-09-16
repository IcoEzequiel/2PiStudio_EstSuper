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

        // Cria e insere a lista de projetos recentes
        const listaProjetosRecentesEl = document.getElementById('lista-projetos-recentes');
        if (data.projetosRecentes && data.projetosRecentes.length > 0) {
            listaProjetosRecentesEl.innerHTML = data.projetosRecentes.map(projeto => {
                // Define a classe de cor com base no status do projeto
                const statusClass = projeto.status === 'concluido' ? 'verde' : 'azul';
                
                return `
                    <div class="projeto-item">
                        <div class="info-projeto">
                            <span class="nome-projeto">${projeto.nome}</span>
                            <span class="nome-cliente">${projeto.cliente?.nome || 'Cliente não definido'}</span>
                        </div>
                        <div class="status-projeto">
                            <span class="etiqueta ${statusClass}">${projeto.status}</span>
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

