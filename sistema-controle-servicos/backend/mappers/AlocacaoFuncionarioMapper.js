const AlocacaoFuncionarioDTO = require('../DTOs/AlocacaoFuncionarioDTO')

// Mapper para transformar em DTO os objetos do service
class AlocacaoFuncionarioMapper {
    static toDTO(alocFunc){
        const alocFuncData = alocFunc.get()
        return new AlocacaoFuncionarioDTO(alocFuncData,alocFuncData.servico,alocFuncData.funcionario)
    }
}
// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.

module.exports = AlocacaoFuncionarioMapper