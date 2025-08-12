const ParametrizacaoEquipamentoDTO = require('../DTOs/ParametrizacaoEquipamentoDTO')

class ParametrizacaoEquipamentoMapper {
    static toDTO(paraEquip) {
        const paraEquipData = paraEquip.get()
        return new ParametrizacaoEquipamentoDTO(paraEquipData, paraEquipData.equipamento)
    }
}

module.exports = ParametrizacaoEquipamentoMapper