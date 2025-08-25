const Equipamento = require('../models/ModelEquipamento')
const ParametrizacaoEquipamento = require('../models/ModelParametrizacaoEquipamento')

const ParametrizacaoEquipamentoRepository = {
    getAll: async () => {
        return await ParametrizacaoEquipamento.findAll({
            include: [{model: Equipamento, as: 'equipamento'}]
        })
    },

    getById: async (id) => {
        return await ParametrizacaoEquipamento.findByPk(id,{
            include:[{model: Equipamento, as: 'equipamento'}]
        })
    },

    save: async (dados, options = {}) => {
        return await ParametrizacaoEquipamento.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await ParametrizacaoEquipamento.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados,options)
    },

    delete: async (id, options = {}) => {
        const arqui = await ParametrizacaoEquipamento.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = ParametrizacaoEquipamentoRepository