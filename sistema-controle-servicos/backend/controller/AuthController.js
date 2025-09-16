const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UsuarioRepo = require('../repositories/UsuarioRepository')

// Controler da autenticação
const AuthController = {
    login: async (req, res) => {
        const { login, senha } = req.body

        try {

            // Procura se o login está certo
            const Usuario = await UsuarioRepo.findByLogin(login);
            if (!Usuario){
                return res.status(401).json({ error: 'Credenciais Inválidas'})
            }

            // Procura se a senha do usuario está certa
            const senhaCorreta = await bcrypt.compare(senha, Usuario.senha)
            if (!senhaCorreta){
                return res.status(401).json({ error: 'Credenciais Inválidas'})
            }

            // Se a senha e o usuario estiver corretos, gera o token
            const payload = {
                id: Usuario.id,
                papel: Usuario.papel
            }

            // Adiciona o id do funcionario se o usuario for um funcionario, isso é util para outras funcçoes do sistema
            if (Usuario.papel === 'funcionario' && Usuario.id_funcionario){
                payload.id_funcionario = Usuario.id_funcionario
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '8h'
            })

            res.json({ token })
        } catch (error) {
            res.status(500).json({ error: "Erro interno no servidor ao logar: " + error.message})
        }
    }
}

module.exports = AuthController