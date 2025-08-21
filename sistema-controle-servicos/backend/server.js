const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Consts dos Models
const AlocEquip = require('./models/ModelAlocacaoEquipamento')
const AlocFunc = require('./models/ModelAlocacaoFuncionario')
const Cliente = require('./models/ModelCliente')
const Equipamento = require('./models/ModelEquipamento')
const Feedback = require('./models/ModelFeedback')
const Funcionario = require('./models/ModelFuncionario')
const ParaEquip = require('./models/ModelParametrizacaoEquipamento')
const ParaFunc = require('./models/ModelParametrizacaoFuncionario')
const Servico = require('./models/ModelServico')
const Usuario = require('./models/ModelUsuario')

//Const das Rotas
const AlocacaoEquipamentoRoutes = require('./routes/AlocacaoEquipamentoRoutes')
const AlocacaoFuncionarioRoutes = require('./routes/AlocacaoFuncionarioRoutes')
const ClienteRoutes = require('./routes/ClienteRoutes')
const EquipamentoRoutes = require('./routes/EquipamentoRoutes')
const FeedbackRoutes = require('./routes/FeedbackRoutes')
const FuncionarioRoutes = require('./routes/FuncionarioRoutes')
const ParametrizacaoEquipamentoRoutes = require('./routes/ParametrizacaoEquipamentoRoutes')
const ParametrizacaoFuncionariosRoutes = require('./routes/ParametrizacaoFuncionariosRoutes')
const ServicoRoutes = require('./routes/ServicoRoutes')
const UsuarioRoutes = require('./routes/UsuarioRoutes')

app.use(cors());
app.use(express.json());

// Servir o HTML e arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

AlocEquip.belongsTo(Equipamento,{
    foreignKey:"id_equipamento",
    as: 'equipamento'
})
AlocEquip.belongsTo(Servico,{
    foreignKey:"id_servico",
    as: "servico"
})
AlocFunc.belongsTo(Funcionario,{
    foreignKey:'id_funcionario',
    as: "funcionario"
})
AlocFunc.belongsTo(Servico, {
    foreignKey:'id_servico',
    as: "servico"
})

Feedback.belongsTo(Servico,{
    foreignKey:'id_servico',
    as: 'servico'
})
Feedback.belongsTo(Funcionario,{
    foreignKey:'id_funcionario',
    as: 'funcionario'
})
Funcionario.hasOne(ParaFunc, {
    foreignKey: 'id_funcionario',
    as: 'parametrizacao'
})

ParaEquip.belongsTo(Equipamento, {
    foreignKey:'id_equipamento',
    as: 'equipamento'
})
ParaFunc.belongsTo(Funcionario, {
    foreignKey: 'id_funcionario',
    as: 'funcionario'
})

Servico.belongsTo(Cliente,{
    foreignKey: 'id_cliente',
    as:'cliente'
})

Usuario.belongsTo(Funcionario, {
    foreignKey: 'id_funcionario',
    as: 'funcionario'
})

// Rotas

app.use('/AlocacaoEquipamento',AlocacaoEquipamentoRoutes)
app.use('/AlocacaoFuncionario',AlocacaoFuncionarioRoutes)
app.use('/Cliente', ClienteRoutes)
app.use('/Equipamento',EquipamentoRoutes)
app.use('/Feedback',FeedbackRoutes)
app.use('/Funcionario',FuncionarioRoutes)
app.use('/ParametrizacaoEquipamento',ParametrizacaoEquipamentoRoutes)
app.use('/ParametrizacaoFuncionario',ParametrizacaoFuncionariosRoutes)
app.use('/Servico',ServicoRoutes)
app.use('/Usuario',UsuarioRoutes)


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});