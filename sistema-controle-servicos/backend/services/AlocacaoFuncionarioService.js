const repo = require('../repositories/AlocacaoFuncionarioRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')

const AlocacaoFuncionarioService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Servico){
            throw Error("Serviço Não Existe")
        }    
        if (!Funcionario){
            throw Error("Fucionario Não Existe")
        } 
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Servico){
            throw Error("Serviço Não Existe")
        }    
        if (!Funcionario){
            throw Error("Fucionario Não Existe")
        } 
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = AlocacaoFuncionarioService