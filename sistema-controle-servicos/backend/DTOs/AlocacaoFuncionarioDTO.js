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