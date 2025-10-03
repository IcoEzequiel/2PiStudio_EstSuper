const { sequelize } = require('../db');

const AlocacaoEquipamento = require('./ModelAlocacaoEquipamento');
const AlocacaoFuncionario = require('./ModelAlocacaoFuncionario');
const Cliente = require('./ModelCliente');
const Equipamento = require('./ModelEquipamento');
const Feedback = require('./ModelFeedback');
const Funcionario = require('./ModelFuncionario');
const ParametrizacaoEquipamento = require('./ModelParametrizacaoEquipamento');
const ParametrizacaoFuncionario = require('./ModelParametrizacaoFuncionario');
const Servico = require('./ModelServico');
const Usuario = require('./ModelUsuario');

// Todas as associações num único local
Cliente.hasMany(Servico, { foreignKey: 'id_cliente', as: 'servicos' });
Servico.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

Servico.hasMany(AlocacaoFuncionario, { foreignKey: 'id_servico', as: 'alocacoesFuncionario' });
AlocacaoFuncionario.belongsTo(Servico, { foreignKey: 'id_servico', as: 'servico' });

Servico.hasMany(AlocacaoEquipamento, { foreignKey: 'id_servico', as: 'alocacoesEquipamento' });
AlocacaoEquipamento.belongsTo(Servico, { foreignKey: 'id_servico', as: 'servico' });

Funcionario.hasMany(AlocacaoFuncionario, { foreignKey: 'id_funcionario', as: 'alocacoes' });
AlocacaoFuncionario.belongsTo(Funcionario, { foreignKey: 'id_funcionario', as: 'funcionario' });

Equipamento.hasMany(AlocacaoEquipamento, { foreignKey: 'id_equipamento', as: 'alocacoes' });
AlocacaoEquipamento.belongsTo(Equipamento, { foreignKey: 'id_equipamento', as: 'equipamento' });

Funcionario.hasOne(ParametrizacaoFuncionario, { foreignKey: 'id_funcionario', as: 'parametrizacao' });
ParametrizacaoFuncionario.belongsTo(Funcionario, { foreignKey: 'id_funcionario', as: 'funcionario' });

Equipamento.hasOne(ParametrizacaoEquipamento, { foreignKey: 'id_equipamento', as: 'parametrizacao' });
ParametrizacaoEquipamento.belongsTo(Equipamento, { foreignKey: 'id_equipamento', as: 'equipamento' });

Feedback.belongsTo(AlocacaoFuncionario, { foreignKey: 'id_alocacaoFuncionario', as: 'servicoPrestado' });
AlocacaoFuncionario.hasOne(Feedback,{ foreignKey: 'id_alocacaoFuncionario', as: 'feedback'});

Funcionario.hasOne(Usuario, { foreignKey: 'id_funcionario', as: 'usuario' });
Usuario.belongsTo(Funcionario, { foreignKey: 'id_funcionario', as: 'funcionario' });


// Exportar todos os modelos para serem usados noutros locais
module.exports = {
    sequelize,
    AlocacaoEquipamento,
    AlocacaoFuncionario,
    Cliente,
    Equipamento,
    Feedback,
    Funcionario,
    ParametrizacaoEquipamento,
    ParametrizacaoFuncionario,
    Servico,
    Usuario
};
