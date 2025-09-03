const ParametrizacaoFuncionarioDTO = require('../DTOs/ParametrizacaoFuncionarioDTO')
// Mapper para transformar em DTO os objetos do service
class ParametrizacaoFuncionarioMapper {
    static toDTO(ParaFunc){
        const ParaFuncData = ParaFunc.get()
        return new ParametrizacaoFuncionarioDTO(ParaFuncData, ParaFuncData.funcionario)
    }
}
// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.

module.exports = ParametrizacaoFuncionarioMapper