const AlocacaoEquipamentoDTO = require('../DTOs/AlocacaoEquipamentoDTO')

// Mapper para transformar em DTO os objetos do service
class AlocacaoEquipamentoMapper {
    static toDTO(alocEquip) {
        const alocEquipData = alocEquip.get()
        return new AlocacaoEquipamentoDTO(alocEquipData,alocEquipData.servico,alocEquipData.equipamento)
    }
}

// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.

module.exports = AlocacaoEquipamentoMapper