const AlocacaoEquipamentoDTO = require('../DTOs/AlocacaoEquipamentoDTO')

class AlocacaoEquipamentoMapper {
    static toDTO(alocEquip) {
        const alocEquipData = alocEquip.get()
        return new AlocacaoEquipamentoDTO(alocEquipData,alocEquipData.servico,alocEquipData.equipamento)
    }
}

module.exports = AlocacaoEquipamentoMapper