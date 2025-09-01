const bcrypt = require('bcrypt')

const repo = require('../repositories/UsuarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const UsuarioMapper = require('../mappers/UsuarioMapper')

const getComInclude = async (id) => {
    const inclusao = {include:[
        {model: require('../models/ModelFuncionario'), as: 'funcionario'}  
    ]}
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

const validar = async (dados, iscreate = false) => {
    if(dados.id_funcionario){
        const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if(!funcionario)
            throw new Error('O funcionario não Existe')
    }
    if(iscreate && !dados.senha){
        throw new Error('Nenhuma Senha foi fornecida')
    }
    return true
}

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
            const Usuario = await getComInclude()
            if(!Usuario){
                return null
            }
            const UsuarioDTO = UsuarioMapper.toDTO(Usuario)
            return UsuarioDTO  
    },

    create: async (dados) => {
        await validar(dados,true)

        const dadosCrip = await cripSenha(dados)
        const novo = await repo.save(dadosCrip)
        const novoDTO = UsuarioMapper.toDTO(novo)
        return novoDTO
        
    },

    update: async (id, dados) => {
        await validar(dados)
        const dadosCrip = await cripSenha(dados)
        const edit = await repo.update(id, dadosCrip)

        if (!edit){
            return null
        }

        const editDTO = UsuarioMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = UsuarioService 