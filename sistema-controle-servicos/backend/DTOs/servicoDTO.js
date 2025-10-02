//DTO do servico, que junta o objeto do cliente com os dados do serviço.
// Se quiser adicionar no envio as alocações de funcionarios e equipamentos, vai ter que modificar esse arquivos:
// ServicoDTO, ServicoMapper
class servicoDTO {
    constructor(servico, cliente, alocacoesEquipamento, alocacoesFuncionario){
        this.id = servico.id
        this.cliente = cliente
        this.nome = servico.nome
        this.descricao = servico.descricao
        this.data_inicio = servico.data_inicio
        this.data_fim = servico.data_fim
        this.status = servico.status
        this.orcamento = servico.orcamento
        this.alocacoesEquipamento = alocacoesEquipamento
        this.alocacoesFuncionario = alocacoesFuncionario
    }
}

module.exports = servicoDTO