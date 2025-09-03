const AlocacaoEquipamento = require('../models/ModelAlocacaoEquipamento')

// Ligação com o repository,se precisar criar uma consulta diferente, adicione ela abaixo.

const AlocacaoEquipamentoRepository = {
    getAll: async (options = {}) => {
        return await AlocacaoEquipamento.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await AlocacaoEquipamento.findByPk(id, options)
    },

    findByEquipamentoData: async (id_equipamento, data, options = {}) => {
        return await AlocacaoEquipamento.findOne({
            where: {
                id_equipamento: id_equipamento,
                data: data
            }
        }, options)
    },

    save: async (dados, options = {}) => {
        return await AlocacaoEquipamento.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await AlocacaoEquipamento.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options = {}) => {
        const arqui = await AlocacaoEquipamento.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = AlocacaoEquipamentoRepository