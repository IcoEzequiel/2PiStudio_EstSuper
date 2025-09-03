// DTO do feedback, que inclui o objeto serviço e funcinario, junto com o feedback do funcionario e a data de envio
class FeedbackDTO {
    constructor(feedback, alocacaoFuncionario){
        this.id = feedback.id
        this.servico = alocacaoFuncionario.servico
        this.funcionario = alocacaoFuncionario.funcionario
        this.comentario = feedback.comentario
        this.data = feedback.data
    }
}

module.exports = FeedbackDTO