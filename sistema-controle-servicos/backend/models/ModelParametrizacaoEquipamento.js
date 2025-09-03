const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Model da parametrizazão de equipamento, o valor base para referencia na hora de alocar um equipamento
// Para um serviço, mas o usuario pode mudar esse valor para serviços especificos a vontade dele, 
// que vai ser salvo na alocação de equipamento.
const ParametrizacaoEquipamento = sequelize.define('ParametrizacaoEquipamento',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    id_equipamento:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // O valor do equipamento é cobrado por hora.
    valor_hora: DataTypes.DECIMAL(10,2)
},
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
{
    tableName:'parametrizacao_equipamentos',
    timestamps:false
}
)

module.exports = ParametrizacaoEquipamento