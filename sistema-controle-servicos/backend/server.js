require('dotenv').config()

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
const authRoutes = require('./routes/AuthRoutes')

app.use(cors());
app.use(express.json());

// Servir o HTML e arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Relação Cliente <-> Servico (Um cliente tem Muitos Serviços)
Cliente.hasMany(Servico, {
    foreignKey: 'id_cliente', as: 'servicos'
})

Servico.belongsTo(Cliente,{
    foreignKey: 'id_cliente', as:'cliente'
})

// Relação Servico <-> AlocaçãoFuncionario (Um servico tem muitas Alocações de Funcionarios)

Servico.hasMany(AlocFunc,{
    foreignKey: 'id_servico', as: 'alocacoesFuncionario'
})

AlocFunc.belongsTo(Servico, {
    foreignKey:'id_servico', as: "servico"
})

// Relação Servico <-> AlocaçãoEquipamento (Um servico tem muitas alocações de Equipamento)

Servico.hasMany(AlocEquip,{
    foreignKey: 'id_servico', as: 'alocacoesEquipamento'
})

AlocEquip.belongsTo(Servico,{
    foreignKey:"id_servico", as: "servico"
})

// Relação Funcionario <-> AlocacaoFuncionario (Um Funcionario pode estar em muitas Alocações)

Funcionario.hasMany(AlocFunc, {
    foreignKey: 'id_funcionario', as: 'alocacoes'
})

AlocFunc.belongsTo(Funcionario,{
    foreignKey:'id_funcionario', as: "funcionario"
})

// Relação Equipamento <-> alocacaoEquipamento (Um equipamento pode estar em Muitas Alocacoes)

Equipamento.hasMany(AlocEquip, {
    foreignKey: 'id_equipamento', as: 'alocacoes'
})

AlocEquip.belongsTo(Equipamento,{
    foreignKey:"id_equipamento", as: 'equipamento'
})

// Relação Funcionario <-> ParametrizacaoFuncionario (Um funcionario tem Uma Parametrização)

Funcionario.hasOne(ParaFunc, {
    foreignKey: 'id_funcionario', as: 'parametrizacao'
})

ParaFunc.belongsTo(Funcionario, {
    foreignKey: 'id_funcionario', as: 'funcionario'
})

// Relação Equipamento <-> ParametrizacaoEquipamento (Um equipamento tem uma Parametrização)

Equipamento.hasOne(ParaEquip,{
    foreignKey: 'id_equipamento',
    as: 'parametrizacao'
})

ParaEquip.belongsTo(Equipamento, {
    foreignKey:'id_equipamento',
    as: 'equipamento'
})

// Relação Feedback <-> Alocação Funcionario (Uma alocação tem um Feedback).

Feedback.belongsTo(AlocFunc,{
    foreignKey:'id_alocacaoFuncionario',
    as: 'servico'
})

AlocFunc.hasOne(Feedback,{
    foreignKey:'id_alocacaoFuncionario',
    as: 'feedback'
})
 
// Relação Usuario <-> Funcionario (Um funcionario tem Um Usuario)

Funcionario.hasOne(Usuario, {
    foreignKey: 'id_funcionario',
    as: 'funcionario'
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
app.use('/auth', authRoutes)

if (process.env.NODE_ENV !== 'test'){
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;