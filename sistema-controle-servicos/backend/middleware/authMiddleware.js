const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário do token não encontrado.' });
        }

        req.user = usuario;

        next();

    } catch (error) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};


const checkRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Autenticação necessária.' });
        }

        const papelDoUsuario = req.user.papel; // 'papel' vem do objeto do banco

        // Verifica se o papel do usuário está na lista de papéis permitidos
        if (!rolesPermitidos.includes(papelDoUsuario)) {
            return res.status(403).json({ error: 'Acesso proibido. Permissões insuficientes.' });
        }

        // Se o usuário tem a permissão, continua
        next();
    };
};

module.exports = { verifyToken, checkRole };