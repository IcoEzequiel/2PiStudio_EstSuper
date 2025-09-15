const bcrypt = require('bcrypt')

const repo = require('../repositories/UsuarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const UsuarioMapper = require('../mappers/UsuarioMapper')

// Funcões auxiliares

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        {model: require('../models/ModelFuncionario'), as: 'funcionario'}  
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados, create = false, options = {}) => {
    // Valida se o funcionario existe se ele vinher nos dados, pos pode ter um usuario que não é um funcionario, como o admin
    if(dados.id_funcionario){
        const funcionario = await FuncionarioRepo.getById(dados.id_funcionario, options)
        if(!funcionario)
            throw new Error('O funcionario não Existe')
    }
    // Se for uma criação e não passou a senha, pos o update pode mandar ou não a alteração da senha
    if(create && !dados.senha){
        throw new Error('Nenhuma Senha foi fornecida')
    }
    return true
}

// Criptografia da senha
const cripSenha = async (dados) => {
    const dadosCrip = {
        id_funcionario: dados.id_funcionario,
        papel: dados.papel,
        login: dados.login
    }
    if(dados.senha){
            const salt = await bcrypt.genSalt(10)
            const senhaHash = await bcrypt.hash(dados.senha, salt)
            dadosCrip.senha = senhaHash
        }
        return dadosCrip
    }

const UsuarioService = {
    getAll: async () => {
            const Usuarios = await getComInclude()
            const UsaurioDTO = Usuarios.map(U => UsuarioMapper.toDTO(U))
            return UsaurioDTO
    },

    getById: async (id) => {
            const Usuario = await getComInclude(id)
            if(!Usuario){
                return null
            }
            const UsuarioDTO = UsuarioMapper.toDTO(Usuario)
            return UsuarioDTO  
    },

    create: async (dados, options = {}) => {
        // Passa true para saber que é um create
        await validar(dados,true, options)

        // Manda criptografar a senha antes de salvar no banco de dados
        const dadosCrip = await cripSenha(dados)
        const novo = await repo.save(dadosCrip)
        const novo2 = await getComInclude(novo.id)
        const novoDTO = UsuarioMapper.toDTO(novo2)
        return novoDTO
        
    },

    update: async (id, dados, options = {}) => {
        await validar(dados)
        const dadosCrip = await cripSenha(dados)
        const edit = await repo.update(id, dadosCrip, options)

        if (!edit){
            return null
        }
        const edit2 = await getComInclude(id)
        const editDTO = UsuarioMapper.toDTO(edit2)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = UsuarioService 