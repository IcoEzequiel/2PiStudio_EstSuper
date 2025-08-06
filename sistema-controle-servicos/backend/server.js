const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

// Servir o HTML e arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

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
