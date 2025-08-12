const ServicoDTO = require('../DTOs/servicoDTO')

class ServicoMapper {
    static toDTO(servico) {
        const servicoData = servico.get()
        return new ServicoDTO(servicoData, servicoData.cliente)
    } 
}

module.exports = ServicoMapper