class ParametrizacaoEquipamentoDTO {
    constructor(parametrizacaoEquipamento, equipamento){
        this.id = parametrizacaoEquipamento.id
        this.equipamento = equipamento
        this.valor_hora = parametrizacaoEquipamento.valor_hora
    }
}
module.exports = ParametrizacaoEquipamentoDTO