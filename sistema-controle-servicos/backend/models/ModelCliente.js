const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Model do cliente, informa os dados dele
const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo_cliente:{
        type: DataTypes.ENUM('fisico','juridico'),
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull:false
    },
    // coloquei os dois juntos, mas e necessario ter uma validação no service tanto para validar o CPF e o CNPJ
    // Quanto para do criar um CPF se o tipo for fisico ou CNPJ se o tipo for Juridico
    cpf_cnpj: {
        type: DataTypes.STRING(30),
        allowNull:false
    },
    email: {
        type: DataTypes.STRING
    },
    telefone: {
        type: DataTypes.STRING(15)
    }
},
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
    {
        tableName: 'Clientes',
        timestamps: false
});

module.exports = Cliente;