const ParametrizacaoFuncionarioDTO = require('../DTOs/ParametrizacaoFuncionarioDTO')

class ParametrizacaoFuncionarioMapper {
    static toDTO(parametrizacaoFuncionario){
        const parametrizacaoFuncionarioData = parametrizacaoFuncionario.get()
        return new ParametrizacaoFuncionarioDTO(parametrizacaoFuncionarioData, parametrizacaoFuncionarioData.funcionario)
    }
}

module.exports = ParametrizacaoFuncionarioMapper