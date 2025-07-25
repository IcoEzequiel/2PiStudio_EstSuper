const { sequelize } = require('./models');
const Equipamaneto = require('./models/ModelEquipamento');

// sequelize.sync({ alter: false})
//   .then(() => {
//     console.log('Banco sincronizado com sucesso!');
//   })
//   .catch(err => {
//     console.error('Erro ao sincronizar banco:', err);
//   });