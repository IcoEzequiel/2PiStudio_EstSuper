const { sequelize } = require('./models');

sequelize.sync({ alter: true })  // ou { force: true } para recriar as tabelas
  .then(() => {
    console.log('Banco sincronizado com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco:', err);
  });
