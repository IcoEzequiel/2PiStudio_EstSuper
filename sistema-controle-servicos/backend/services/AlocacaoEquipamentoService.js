const repo = require('../repositories/AlocacaoEquipamentoRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')

const AlocacaoEquipamentoService = {
    getAll: async () => {
        return await repo.getAll()
    },

    getById: async (id) => {
        return await repo.getById(id)
    },

    create: async (dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Servico){
            throw Error("Serviço Não Existe")
        }    
        if (!Equipamento){
            throw Error("Fucionario Não Existe")
        } 
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Servico){
            throw Error("Serviço Não Existe")
        }    
        if (!Equipamento){
            throw Error("Fucionario Não Existe")
        } 
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = AlocacaoEquipamentoService