const ParametrizacaoFuncionarioDTO = require('../DTOs/ParametrizacaoFuncionarioDTO')

class ParametrizacaoFuncionarioMapper {
    static toDTO(ParaFunc){
        const ParaFuncData = ParaFunc.get()
        return new ParametrizacaoFuncionarioDTO(ParaFuncData, ParaFuncData.funcionario)
    }
}

module.exports = ParametrizacaoFuncionarioMapper