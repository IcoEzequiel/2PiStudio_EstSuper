// DTO da parametrização do equipamento, junta o objeto equipamento com os dados de seu valor cobrado por hora.
class ParametrizacaoEquipamentoDTO {
    constructor(parametrizacaoEquipamento, equipamento){
        this.id = parametrizacaoEquipamento.id
        this.equipamento = equipamento
        this.valor_hora = parametrizacaoEquipamento.valor_hora
    }
}
module.exports = ParametrizacaoEquipamentoDTO