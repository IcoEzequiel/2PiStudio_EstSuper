const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioRepo = require('../repositories/UsuarioRepository');

const AuthController = {
    login: async (req, res) => {
        const { login, senha } = req.body;

        try {
            const Usuario = await UsuarioRepo.findByLogin(login);

            console.log('Objeto de Usuário retornado pelo Repositório:', Usuario);

            if (!Usuario) {
                return res.status(401).json({ error: 'Credenciais Inválidas' });
            }

            const senhaCorreta = await bcrypt.compare(senha, Usuario.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ error: 'Credenciais Inválidas' });
            }

            const payload = {
                id: Usuario.id,
                papel: Usuario.papel
            };

            if (Usuario.papel === 'funcionario' && Usuario.id_funcionario) {
                payload.id_funcionario = Usuario.id_funcionario;
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '8h'
            });

            // --- GARANTA QUE ESTA PARTE ESTEJA EXATAMENTE ASSIM ---
            const userResponse = {
                id: Usuario.id,
                nome: Usuario.login,
                profile: Usuario.papel, // VERIFIQUE: A chave é 'profile' e o valor é 'Usuario.papel'
                id_funcionario: Usuario.id_funcionario
            };

            // Envia a resposta ÚNICA e COMPLETA
            res.json({
                token: token,
                user: userResponse
            });

        } catch (error) {
            res.status(500).json({ error: "Erro interno no servidor ao logar: " + error.message });
        }
    }
};

module.exports = AuthController;