const AlocacaoEquipamento = require('../models/ModelAlocacaoEquipamento')
const Servico = require('../models/ModelServico')
const Equipamento = require('../models/ModelEquipamento')

const AlocacaoEquipamentoRepository = {
    getAll: async () => {
        return await AlocacaoEquipamento.findAll({
            include:[{model: Servico, as:'servico'},
                {model: Equipamento, as:'equipamento'}
            ]
        })
    },

    getById: async (id) => {
        return await AlocacaoEquipamento.findByPk(id,{
            include:[{model: Servico, as:'servico'},
                {model: Equipamento, as:'equipamento'}
            ]
        })
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