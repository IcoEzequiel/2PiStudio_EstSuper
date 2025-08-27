const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UsuarioRepo = require('../repositories/UsuarioRepository')

const AuthController = {
    login: async (req, res) => {
        const { login, senha } = req.body

        try {

            const Usuario = await UsuarioRepo.findByLogin(login);
            if (!Usuario){
                return res.status(401).json({ error: 'Credenciais Inválidas'})
            }

            const senhaCorreta = await bcrypt.compare(senha, Usuario.senha)
            if (!senhaCorreta){
                return res.status(401).json({ error: 'Credenciais Invalidas'})
            }

            const payload = {
                id: Usuario.id,
                papel: Usuario.papel
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