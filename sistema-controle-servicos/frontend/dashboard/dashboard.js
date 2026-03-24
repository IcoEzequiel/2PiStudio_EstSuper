// import { request } from '../shared/api.js';

// // Função para formatar valores em moeda brasileira (Real)
// const formatarMoeda = (valor) => {
//     return (parseFloat(valor) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// };

// // Função principal que é chamada para inicializar o dashboard
// async function inicializarDashboard() {
//     try {
//         console.log("Buscando dados para o dashboard...");
//         const data = await request('/dashboard'); // Faz a chamada para a nossa rota no backend

//         // Atualiza os cards com os dados recebidos
//         document.getElementById('projetos-ativos').textContent = data.ativos;
//         document.getElementById('projetos-concluidos').textContent = data.concluidos;
//         document.getElementById('receita-total').textContent = formatarMoeda(data.receita);
//         document.getElementById('lucro-total').textContent = formatarMoeda(data.lucro);

//         // Mapeamento de status para classes de cor e texto
//         const statusMap = {
//             'agendado': { text: 'Agendado', class: 'amarelo' },
//             'em execução': { text: 'Em Execução', class: 'azul' },
//             'concluido': { text: 'Concluído', class: 'verde' },
//             'quoting': { text: 'Orçamento', class: 'laranja' },
//             'cancelado': { text: 'Cancelado', class: 'vermelho' }
//         };

//         // Cria e insere a lista de projetos recentes
//         const listaProjetosRecentesEl = document.getElementById('lista-projetos-recentes');
//         if (data.projetosRecentes && data.projetosRecentes.length > 0) {
//             listaProjetosRecentesEl.innerHTML = data.projetosRecentes.map(projeto => {
//                 const statusInfo = statusMap[projeto.status?.toLowerCase()] || { text: projeto.status, class: 'azul' };

//                 return `
//                     <div class="projeto">
//                         <div>
//                             <div class="nome-projeto">${projeto.nome}</div>
//                             <div class="cliente-projeto">${projeto.cliente?.nome || 'Cliente não definido'}</div>
//                         </div>
//                         <div class="status-projeto">
//                             <span class="etiqueta ${statusInfo.class}">${statusInfo.text}</span>
//                             <div class="orcamento-projeto">${formatarMoeda(projeto.orcamento)}</div>
//                         </div>
//                     </div>
//                 `;
//             }).join('');
//         } else {
//             listaProjetosRecentesEl.innerHTML = '<p class="placeholder-projetos">Nenhum projeto recente encontrado.</p>';
//         }

//     } catch (error) {
//         console.error('Falha ao carregar dados do dashboard:', error);
//         document.querySelector('.dashboard-container').innerHTML = `<p class="erro-dashboard">Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.</p>`;
//     }
// }

// // Exporta a função para que o scripts.js possa chamá-la
// export { inicializarDashboard };

import { request } from '../shared/api.js';

// Função para formatar valores em moeda brasileira (Real)
const formatarMoeda = (valor) => {
    return (parseFloat(valor) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Função principal que é chamada para inicializar o dashboard
async function inicializarDashboard() {
    try {
        console.log("Buscando dados para o dashboard...");
        
        // Faz a chamada para /servico para pegarmos TODOS os projetos e calcularmos no front-end
        const projetos = await request('/servico'); // Faz a chamada para a nossa rota no backend

        let receitaTotal = 0;
        let lucroTotal = 0;
        let qtdConcluidos = 0;
        let qtdAgendados = 0;
        let qtdEmExecucao = 0;

        // Calcula os totais com base no status de cada projeto
        projetos.forEach(projeto => {
            const status = projeto.status ? projeto.status.toLowerCase() : '';
            const orcamento = parseFloat(projeto.orcamento) || 0;
            const lucro = parseFloat(projeto.lucro_estimado || projeto.lucro) || 0;

            if (status === 'concluido') {
                qtdConcluidos++;
                receitaTotal += orcamento;
                lucroTotal += lucro;
            } else if (status === 'agendado') {
                qtdAgendados++;
            } else if (status === 'em execução') {
                qtdEmExecucao++;
            }
        });

        // Projetos ativos são a soma dos agendados e em execução
        const qtdAtivos = qtdAgendados + qtdEmExecucao;
        
        // Atualiza os cards com os dados calculados
        document.getElementById('receita-total').textContent = formatarMoeda(receitaTotal);
        document.getElementById('lucro-total').textContent = formatarMoeda(lucroTotal);
        document.getElementById('projetos-concluidos').textContent = qtdConcluidos;
        document.getElementById('projetos-ativos').textContent = qtdAtivos;
        document.getElementById('projetos-agendados').textContent = qtdAgendados;
        document.getElementById('projetos-execucao').textContent = qtdEmExecucao;
        // document.getElementById('projetos-ativos').textContent = data.ativos;
        // document.getElementById('projetos-concluidos').textContent = data.concluidos;
        // document.getElementById('receita-total').textContent = formatarMoeda(data.receita);
        // document.getElementById('lucro-total').textContent = formatarMoeda(data.lucro);

        // Mapeamento de status para classes de cor e texto das etiquetas
        const statusMap = {
            'agendado': { text: 'Agendado', class: 'amarelo' },
            'em execução': { text: 'Em Execução', class: 'azul' },
            'concluido': { text: 'Concluído', class: 'verde' },
            'quoting': { text: 'Orçamento', class: 'laranja' },
            'cancelado': { text: 'Cancelado', class: 'vermelho' }
        };

        // Cria e insere a lista de projetos recentes
        const listaProjetosRecentesEl = document.getElementById('lista-projetos-recentes');

        // Filtra para remover os cancelados e ordena dos mais novos para os mais antigos
        const projetosMostrar = projetos
            .filter(p => p.status?.toLowerCase() !== 'cancelado')
            .sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio));

        if (projetosMostrar.length > 0) {
            listaProjetosRecentesEl.innerHTML = projetosMostrar.map(projeto => {
                const statusInfo = statusMap[projeto.status?.toLowerCase()] || { text: projeto.status || 'N/A', class: 'azul' };

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
            listaProjetosRecentesEl.innerHTML = '<p class="placeholder-projetos" style="text-align:center; color: rgba(255,255,255,0.6); padding: 20px;">Nenhum projeto recente encontrado</p>';
        }
    } catch (error) {
        console.error('Falha ao carregar dados do dashboard:', error);
        document.querySelector('.dashboard-container').innerHTML = `<p class="erro-dashboard">Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.</p>`;
    }
}

// Exporta a função para que o scripts.js possa chamá-la
export { inicializarDashboard };