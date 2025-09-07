// DTO do feedback, que inclui o objeto serviço e funcinario, junto com o feedback do funcionario e a data de envio
class FeedbackDTO {
    constructor(feedback, servicoPrestado){
        this.id = feedback.id
        this.servico = servicoPrestado.servico
        this.funcionario = servicoPrestado.funcionario
        this.comentario = feedback.comentario
        this.data = feedback.data
    }
}

module.exports = FeedbackDTO