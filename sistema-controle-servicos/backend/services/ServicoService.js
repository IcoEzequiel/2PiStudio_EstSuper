const repo = require('../repositories/ServicoRepository')
const ClienteRepo = require('../repositories/ClienteRepository')

const ServicoService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        const cliente = await ClienteRepo.getById(dados.id_cliente)
        if (!cliente) throw new Error('Cliente não existe');
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const cliente = await ClienteRepo.getById(dados.id_cliente)
        if (!cliente) throw new Error('Cliente não existe');
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ServicoService