// const ServicoRepo = require('../repositories/ServicoRepository')
// const { Op } = require('sequelize')

// // Envia os dados requiridos no Dashboard
// const getDashboardData = async () => {
//     try {
//         // Pega o dia de hoje e tira as horas
//         const hoje = new Date()
//         hoje.setHours(0,0,0,0)

//         // Pega todos os servicos, ordenados pela data
//         const todosServicos = await ServicoRepo.getAll({
//             include: [
//                 { model: require ('../models/ModelCliente'), as: 'cliente'},
//                 { model: require ('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
//                 { model: require('../models/ModelAlocacaoEquipamento'), as: "alocacoesEquipamento"}
//             ],
//             order: [['data_inicio', 'ASC']]
//         })

//         let receita_total_concluido = 0
//         let lucro_total_concluido = 0
//         const servicos_concluidos = []
//         const servicos_ativos = []

//         // Separas os servicos em conluidos e ativos
//         for (const servico of todosServicos){
//             const dataFim = new Date(servico.data_fim)
//             if (dataFim < hoje){
//                 servicos_concluidos.push(servico)
//             } else {
//                 servicos_ativos.push(servico)
//             }
//         }

//         // Calcula a receita e o lucro dos concluídos
//         for (const servico of servicos_concluidos){
//             receita_total_concluido += (parseFloat(servico.orcamento))

//             let custo_real = 0;
//             servico.alocacoesFuncionario.forEach(aloc => {
//                 custo_real += parseFloat(parseFloat(aloc.valor_dia_alocado)) * aloc.hora
//             })
//             servico.alocacoesEquipamento.forEach(aloc => {
//                 custo_real += parseFloat(parseFloat(aloc.valor_hora_alocada)) * aloc.hora
//             })

//             lucro_total_concluido += (parseFloat(servico.orcamento) - custo_real)
//         }

//         // Organiza os servicos mais recentes não concluidos
//         const servicos_recentes = servicos_ativos.slice(0, 5).map(servico => {
//             const servicoSimples = servico.get({plain: true})
//             const dataInicio = new Date(servicoSimples.data_inicio)
//             let status = 'agendado'
//             if (dataInicio <= hoje){
//                 status = 'em execução'
//             }

//             servicoSimples.status = status
//             return servicoSimples
//         })

//         // Monta o objeto a ser enviado
//         const dashboardData = {
//             dados: {
//                 servicos_concluidos: servicos_concluidos.length, // quantidade de servicos concluidos
//                 servicos_ativos: servicos_ativos.length, // qunatidade de servicos ativos
//                 receita_total: receita_total_concluido.toFixed(2), // Lucro Bruto
//                 lucro_total: lucro_total_concluido.toFixed(2)
//             },
//             servicos_recentes: servicos_recentes
//         }

//         return dashboardData;

//     } catch (error) {
//         throw new Error('Erro ao buscar dados do dashboard: ' + error.message)
//     }
// }

// module.exports = { getDashboardData }

const { Servico, Cliente, AlocacaoFuncionario, AlocacaoEquipamento } = require('../models');
const { Op } = require('sequelize');

const DashboardService = {
    
    getDashboardData: async () => {
        try {
            // 1. FAZEMOS CONSULTAS EFICIENTES E PARALELAS AO BANCO DE DADOS
            const [
                totalAtivos,
                servicosConcluidos,
                projetosRecentes
            ] = await Promise.all([
                // Conta apenas os serviços ativos diretamente no banco
                Servico.count({ where: { status: { [Op.ne]: 'concluido' } } }),

                // Busca SOMENTE os serviços concluídos com suas alocações para o cálculo
                Servico.findAll({
                    where: { status: 'concluido' },
                    include: [
                        { model: AlocacaoFuncionario, as: 'alocacoesFuncionario' },
                        { model: AlocacaoEquipamento, as: 'alocacoesEquipamento' }
                    ]
                }),

                // Busca os 5 projetos mais recentes
                Servico.findAll({
                    limit: 5,
                    order: [['data_inicio', 'DESC']],
                    include: [{ model: Cliente, as: 'cliente', attributes: ['nome'] }]
                })
            ]);

            // 2. CALCULAMOS A RECEITA E O LUCRO APENAS SOBRE OS DADOS RELEVANTES
            let receitaTotal = 0;
            let lucroTotal = 0;

            for (const servico of servicosConcluidos) {
                const orcamento = parseFloat(servico.orcamento) || 0;
                receitaTotal += orcamento;

                let custoReal = 0;
                // Calcula o custo real com base nas alocações, como na sua lógica original
                servico.alocacoesFuncionario.forEach(aloc => {
                    custoReal += parseFloat(aloc.valor_dia_alocado || 0) * (aloc.horas_trabalhadas / 8 || 1);
                });
                servico.alocacoesEquipamento.forEach(aloc => {
                    custoReal += parseFloat(aloc.valor_hora_alocada || 0) * (aloc.horas_trabalhadas || 0);
                });

                lucroTotal += (orcamento - custoReal);
            }

            // 3. MONTAMOS O OBJETO FINAL NO FORMATO QUE O FRONTEND ESPERA
            return {
                ativos: totalAtivos,
                concluidos: servicosConcluidos.length,
                receita: receitaTotal,
                lucro: lucroTotal,
                projetosRecentes: projetosRecentes
            };

        } catch (error) {
            console.error("Erro no serviço de dashboard:", error);
            throw new Error("Não foi possível buscar os dados do dashboard.");
        }
    }
};

module.exports = DashboardService;

