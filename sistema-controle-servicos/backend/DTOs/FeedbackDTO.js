class FeedbackDTO {
    constructor(feedback, servico, funcionario){
        this.id = feedback.id
        this.servico = servico
        this.funcionario = funcionario
        this.comentario = feedback.comentario
        this.data = feedback.data
    }
}

module.exports = FeedbackDTO