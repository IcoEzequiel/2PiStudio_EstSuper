const FeedbackDTO = require('../DTOs/FeedbackDTO')

// Mapper para transformar em DTO os objetos do service
class FeedbackMapper {
    static toDTO(feedback){
        const feedbackData = feedback.get()
        return new FeedbackDTO(feedbackData,feedbackData.alocacaoFuncionario)
    }
}
// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.

module.exports = FeedbackMapper