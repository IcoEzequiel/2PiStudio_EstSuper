const { Cliente } = require('../models')
const Servico = require('../models/ModelServico')

const ServicoRepository = {
    getAll: async () => {
        return await Servico.findAll({
            include: [{ model: Cliente, as: 'cliente'}]
        })
    },

    getById: async (id) => {
        return await Servico.findByPk(id,{
            include: [{ model: Cliente, as: 'cliente'}]
        })
    },

    save: async (dados) => {
        return await Servico.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await Servico.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await Servico.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = ServicoRepository