const FeedbackDTO = require('../DTOs/FeedbackDTO')

class FeedbackMapper {
    static toDTO(feedback){
        const feedbackData = feedback.get()
        return new FeedbackDTO(feedbackData,feedbackData.servico,feedbackData.funcionario)
    }
}

module.exports = FeedbackMapper