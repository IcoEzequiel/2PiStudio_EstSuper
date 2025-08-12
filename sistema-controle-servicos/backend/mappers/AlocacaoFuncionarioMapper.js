const AlocacaoFuncionarioDTO = require('../DTOs/AlocacaoFuncionarioDTO')

class AlocacaoFuncionarioMapper {
    static toDTO(alocFunc){
        const alocFuncData = alocFunc.get()
        return new AlocacaoFuncionarioDTO(alocFuncData,alocFuncData.servico,alocFuncData.funcionario)
    }
}

module.exports = AlocacaoFuncionarioMapper