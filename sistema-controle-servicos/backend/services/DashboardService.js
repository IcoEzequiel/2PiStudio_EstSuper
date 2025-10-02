const ServicoRepo = require('../repositories/ServicoRepository')
const { Op } = require('sequelize')

// Envia os dados requiridos no Dashboard
const getDashboardData = async () => {
    try {
        // Pega o dia de hoje e tira as horas
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)

        // Pega todos os servicos, ordenados pela data
        const todosServicos = await ServicoRepo.getAll({
            include: [
                { model: require ('../models/ModelCliente'), as: 'cliente'},
                { model: require ('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
                { model: require ('../models/ModelAlocacaoEquipamento'), as: "alocacoesEquipamento"}
            ],
            order: [['data_inicio', 'DESC']]
        })

        let receita_total_concluido = 0
        let lucro_total_concluido = 0
        let servicos_concluidos = 0
        let servicos_ativos = 0
        const projetosRecentes = []

        // Separas os servicos em conluidos e ativos
        for (const servico of todosServicos){
            const dataInicio = new Date(servico.data_inicio)
            const dataFim = new Date(servico.data_fim)
            let status

            // Logica para determinar o status
            if(servico.status === 'concluido'|| hoje > dataFim){
                status = 'concluido'
            }else if (hoje >= dataInicio && hoje <= dataFim){
                status = 'em execução'
            } else {
                status = 'agendado'
            }
            const servicoData = servico.get({ plain: true})
            servicoData.status = status

            // Calcula a receita e o lucro dos concluídos
            if (status === 'concluido') {
                servicos_concluidos++

                const orcamento = parseFloat(servicoData.orcamento) || 0
                receita_total_concluido += orcamento

                let custo_real = 0
                if (Array.isArray(servicoData.alocacoesFuncionario)){
                    (servicoData.alocacoesFuncionario || []).forEach(aloc => {
                        const custoFuncionario = (parseFloat(aloc.valor_dia_alocado)|| 0) * parseInt(aloc.hora) || 0
                        custo_real += custoFuncionario
                    })
                }

                if(Array.isArray(servicoData.alocacoesEquipamento)){
                    (servicoData.alocacoesEquipamento || []).forEach(aloc => {
                        const custoEquipamento = (parseFloat(aloc.valor_hora_alocada) || 0) * parseInt(aloc.hora) || 0
                        custo_real += custoEquipamento
                    })
                }

                lucro_total_concluido += (orcamento - custo_real)
            } else {
                servicos_ativos ++
                if (projetosRecentes.length < 5){
                    projetosRecentes.push(servicoData)
                }
            }
        
        }

        // Organiza os servicos mais recentes não concluidos

        return {
            concluidos: servicos_concluidos, // quantidade de servicos concluidos
            ativos: servicos_ativos, // qunatidade de servicos ativos
            receita: receita_total_concluido, // Lucro Bruto
            lucro: lucro_total_concluido,
            projetosRecentes: projetosRecentes
        };

    } catch (error) {
        throw new Error('Erro ao buscar dados do dashboard: ' + error.message)
    }
}

module.exports = { getDashboardData }



