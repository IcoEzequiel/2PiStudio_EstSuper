const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Modelo do funcionario e seus dados
const Funcionario = sequelize.define('Funcionario',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // cpf:{
    //     type: DataTypes.STRING(15),
    // },
    // email: DataTypes.STRING,
    // telefone: DataTypes.STRING,
    // cargo: DataTypes.STRING,
    // Inativo é utilizado para "deletar" um funcionario mas não apagar os dados dos serviços que ele prestou,
    // o tornado apenas inativo
    status: { // <-- A ÚNICA ALTERAÇÃO É AQUI
        // Adicione TODOS os valores que existem no seu banco de dados.
        // Abaixo está um exemplo se você tiver 'pendente' além de 'ativo' e 'inativo'.
        type: DataTypes.ENUM('ativo', 'inativo', 'pendente'), 
        
        // As duas linhas abaixo são boas práticas para evitar erros futuros:
        allowNull: false,      // Garante que o status nunca será nulo.
        defaultValue: 'ativo'  // Define 'ativo' como padrão para novos funcionários.
    }
},
    // Como estamos usando o sequelize para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
{
    tableName: "funcionarios",
    timestamps:false
}
)
// Necessario para quando o service chama uma parametrização junto com o funcionario

module.exports = Funcionario