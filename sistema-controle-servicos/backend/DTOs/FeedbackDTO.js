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