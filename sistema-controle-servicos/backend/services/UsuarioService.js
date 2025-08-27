const bcrypt = require('bcrypt')

const repo = require('../repositories/UsuarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const UsuarioMapper = require('../mappers/UsuarioMapper')


const UsuarioService = {
    getAll: async () => {
            const Usuarios = await repo.getAll({
                include: [{model: require('../models/ModelFuncionario'), as: 'funcionario'}]
            })
            const UsaurioDTO = Usuarios.map(U => UsuarioMapper.toDTO(U))
            return UsaurioDTO
    },

    getById: async (id) => {
            const Usuario = await repo.getById(id, {
                include: [{model: require('../models/ModelFuncionario'), as: 'funcionario'}]
            })
            if(!Usuario){
                return null
            }
            const UsuarioDTO = UsuarioMapper.toDTO(Usuario)
            return UsuarioDTO  
    },

    create: async (dados) => {
        if (dados.id_funcionario){
            const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
            if (!funcionario){
                throw new Error('O Funcionario Não Existe')
            }
        }
        const salt = await bcrypt.genSalt(10)
        const senhaHash = await bcrypt.hash(dados.senha, salt)

        const dadosCrip = {
            id_funcionario: dados.id_funcionario,
            papel: dados.papel,
            login: dados.login,
            senha: senhaHash
        }
        const novo = await repo.save(dadosCrip)
        const novoDTO = UsuarioMapper.toDTO(novo)
        return novoDTO
        
    },

    update: async (id, dados) => {
        if (dados.id_funcionario){
            const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
            if (!funcionario){
                throw new Error('O Funcionario Não Existe')
            }
        }
        const dadosCrip = {
            id_funcionario: dados.id_funcionario,
            papel: dados.papel,
            login: dados.login,
            senha: dados.senha || null
        }
        if (dados.senha){
            const salt = await bcrypt.genSalt(10)
            const senhaHash = await bcrypt.hash(dados.senha, salt)
            dadosCrip.senha = senhaHash
        }
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