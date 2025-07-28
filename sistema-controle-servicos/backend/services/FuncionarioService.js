const repo = require('../repositories/FuncionarioRepository')

const FuncionarioService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = FuncionarioService