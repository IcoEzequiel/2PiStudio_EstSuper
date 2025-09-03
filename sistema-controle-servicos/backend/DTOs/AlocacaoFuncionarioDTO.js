// DTO da Alocação de funcionarios em um serviço, mescla o objeto serviço e funcionario junto com os 
//  dados do dia e as horas trabalhadas nesse dia e o valor cobrado em DIARIA para esse serviço,
//  que pode ser o valor da parametização ou não
class AlocacaoFuncionarioDTO {
    constructor(alocacaoFuncionario, servico, funcionario){
        this.id = alocacaoFuncionario.id
        this.servico = servico
        this.funcionario = funcionario
        this.data = alocacaoFuncionario.data
        this.hora = alocacaoFuncionario.hora
        this.valor_dia_alocado = alocacaoFuncionario.valor_dia_alocado
    }
}

module.exports = AlocacaoFuncionarioDTO