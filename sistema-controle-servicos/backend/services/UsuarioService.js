const repo = require('../repositories/UsuarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const UsuarioMapper = require('../mappers/UsuarioMapper')
const { sequelize } = require('../db'); 

const UsuarioService = {
    getAll: async () => {
            const Usuarios = await repo.getAll()
            const UsaurioDTO = Usuarios.map(U => UsuarioMapper.toDTO(U))
            return UsaurioDTO
    },

    getById: async (id) => {
            const Usuario = await repo.getById(id)
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
            const novo = await repo.save(dados)
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
        const edit = await repo.update(id, dados)

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