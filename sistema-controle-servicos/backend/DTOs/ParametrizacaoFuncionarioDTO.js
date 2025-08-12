class ParametrizacaoFuncionarioDTO {
    constructor(parametrizacaoFuncionario, funcionario){
        this.id = parametrizacaoFuncionario.id
        this.funcionario = funcionario
        this.valor_diaria = parametrizacaoFuncionario.valor_diaria
    }
}

module.exports = ParametrizacaoFuncionarioDTO