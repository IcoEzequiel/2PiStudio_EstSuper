const repo = require('../repositories/AlocacaoEquipamentoRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const AlocEquipMapper = require('../mappers/AlocacaoEquipamentoMapper')
const { sequelize } = require('../db'); 

const AlocacaoEquipamentoService = {
    getAll: async () => {
        const AlocEquips = await repo.getAll()
        const AlocEquipsDTO = AlocEquips.map(A=> AlocEquipMapper.toDTO(A))
        return AlocEquipsDTO
    },

    getById: async (id) => {
        const AlocEquip = await repo.getById(id)
        if(!AlocEquip) {
            return null
        }
        const AlocEquipDTO = AlocEquipMapper.toDTO(AlocEquip)
        return AlocEquipDTO
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
        const novo = await repo.save(dados)
        const novoDTO = AlocEquipMapper.toDTO(novo)
        return novoDTO
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
        const edit = await repo.update(id,dados)
        if(!edit){
            return null
        }
        const editDTO = AlocEquipMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = AlocacaoEquipamentoService