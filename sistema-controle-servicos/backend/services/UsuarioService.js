const repo = require('../repositories/UsuarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')

const UsuarioService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Funcionario) throw new Error('Funcionario Não Existe');
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Funcionario) throw new Error('Funcionario Não Existe');
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = UsuarioService