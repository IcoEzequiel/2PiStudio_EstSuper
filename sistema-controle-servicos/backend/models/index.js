const sequelize = require('../db')

const Cliente = require('./ModelCliente')
const Servico = require('./ModelServico')
const Equipamento = require('./ModelEquipamento')
const ParametrizacaoEquipamento = require('./ModelParametrizacaoEquipamento')
const ParametrizacaoFuncionario = require('./ModelParametrizacaoFuncionario')
const AlocacaoEquipamento = require('./ModelAlocacaoEquipamento')
const AlocacaoFuncionario = require('./ModelAlocacaoFuncionario')
const Usuario = require('./ModelUsuario')
const Funcionario = require('./ModelFuncionario')
const Feedback = require('./ModelFeedback')


module.exports = {
    sequelize,
    Cliente,
    Servico,
    Equipamento,
    ParametrizacaoEquipamento,
    ParametrizacaoFuncionario,
    AlocacaoEquipamento,
    AlocacaoFuncionario,
    Usuario,
    Funcionario,
    Feedback
}
