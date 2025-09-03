const { sequelize } = require('./db');

console.log('Registando modelos...');
require('./models/ModelCliente')
require('./models/ModelFuncionario')
require('./models/ModelEquipamento')
require('./models/ModelServico')
require('./models/ModelAlocacaoEquipamento')
require('./models/ModelAlocacaoFuncionario')
require('./models/ModelFeedback')
require('./models/ModelParametrizacaoEquipamento')
require('./models/ModelParametrizacaoFuncionario')
require('./models/ModelUsuario')
console.log('Inicioando Sincronização do banco de dados...')

//Funcção para sincronizar o banco de dados caso mude algo nos models

sequelize.sync({ alter: true })  // ou { force: true } para recriar as tabelas (isso vai deletar os dados)
  .then(() => {
    console.log('Banco sincronizado com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco:', err);
  })
  .finally(()=> {
    console.log('Fechando conexão...')
    sequelize.close()
  });
