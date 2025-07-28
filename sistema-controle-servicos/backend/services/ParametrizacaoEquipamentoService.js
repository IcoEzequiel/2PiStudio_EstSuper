const repo = require('../repositories/ParametrizacaoEquipamentoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')

const ParametrizacaoEquipamentoService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Equipamento) throw Error("Equipamento Não Existe")
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Equipamento) throw Error("Equipamento Não Existe")
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ParametrizacaoEquipamentoService