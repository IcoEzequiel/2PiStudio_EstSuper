const jwt = require('jsonwebtoken')

// Codigo de altenticação, o de verificar o token e o de checar a permição

// Verifica o token, se existe, se é valido
const verifyToken = (req, res, next) => {
    // Verifica se a segurança está ligada
    if (process.env.AUTH_ENABLED !== 'true') {
        return next()
    }

    // Busca o token no cabeçalho da requisição
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // verifica a existencia de um token
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado'})
    }

    // Verifica a validade do token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado'})
        }

        // Se o token for válido, anexa os dados do usuario à requisição
        req.user = decoded
        next() // Deixa a requisição continuar para a rota principal
    })
}

// Verifica a permição do usuario, se ele é adiministrador ou funcionario,
// As rotas que cada um pode acesar estão na pasta routes.
const checkRole = (role) => {
    return (req, res, next) => {
        // O 'verifytoken' deve ter executado antes, então o 'req.user' deve existir
        if(!req.user){
            return res.status(401).json({ error: 'Autenticação necessária'})
        }
        // Verifica se o papel do usuárioo no tokem corresponde ao papel exigido
        if (req.user.papel !== role) {
            return res.status(403).json({ error: 'Acesso proibido. Permissões insuficientes.'})
        }

        next()
    }
}

module.exports = {verifyToken, checkRole}