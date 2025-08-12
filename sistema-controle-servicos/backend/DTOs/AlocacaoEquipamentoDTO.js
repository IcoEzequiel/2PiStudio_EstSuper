class AlocacaoEquipamentoDTO {
    constructor(alocacaoEquipamento, servico, equipamento){
        this.id = alocacaoEquipamento.id
        this.servico = servico
        this.equipamento = equipamento
        this.data = alocacaoEquipamento.data
        this.hora = alocacaoEquipamento.hora
        this.valor_hora_alocada = alocacaoEquipamento.valor_hora_alocada
    }
}

module.exports = AlocacaoEquipamentoDTO