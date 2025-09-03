// DTO da Alocação de equipamentos em um serviço, mescla o objeto serviço e equipamento junto com os 
//  dados do dia e as horas trabalhadas nesse dia e o valor em HORAS cobrado para esse serviço,
//  que pode ser o valor da parametização ou não
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