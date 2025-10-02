const ServicoDTO = require('../DTOs/servicoDTO')
// Mapper para transformar em DTO os objetos do service
class ServicoMapper {
    static toDTO(servico) {
        const servicoData = servico.get()
        // Se quiser adicionar as alocações de funcionarios e equipamentos, adicione eles em ServicoDTO
        return new ServicoDTO(servicoData, servicoData.cliente, servicoData.alocacoesEquipamento, servicoData.alocacoesFuncionario)
    } 
}
// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.

module.exports = ServicoMapper