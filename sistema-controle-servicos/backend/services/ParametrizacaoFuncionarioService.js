const repo = require('../repositories/ParametrizacaoFuncionarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')

const ParametrizacaoFuncionarioService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Funcionario) throw Error("Equipamento Não Existe")
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Funcionario) throw Error("Equipamento Não Existe")
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ParametrizacaoFuncionarioService