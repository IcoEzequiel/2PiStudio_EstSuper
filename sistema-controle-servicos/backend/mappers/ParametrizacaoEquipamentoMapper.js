const ParametrizacaoEquipamentoDTO = require('../DTOs/ParametrizacaoEquipamentoDTO')
// Mapper para transformar em DTO os objetos do service
class ParametrizacaoEquipamentoMapper {
    static toDTO(paraEquip) {
        const paraEquipData = paraEquip.get()
        return new ParametrizacaoEquipamentoDTO(paraEquipData, paraEquipData.equipamento)
    }
}
// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.

module.exports = ParametrizacaoEquipamentoMapper