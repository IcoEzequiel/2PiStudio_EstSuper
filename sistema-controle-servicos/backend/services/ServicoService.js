const repo = require('../repositories/ServicoRepository')
const ClienteRepo = require('../repositories/ClienteRepository')
const ServicoMapper = require('../mappers/servicoMapper')

const ServicoService = {
    getAll: async () => {
        const Servicos = await repo.getAll()
        const ServicosDTO = Servicos.map(S => ServicoMapper.toDTO(S))
        return ServicosDTO
    },

    getById: async (id) => {
        const Servico = await repo.getById(id)
        if (!Servico){
            return null
        }
        const ServicoDTO = ServicoMapper.toDTO(Servico)
        return ServicoDTO
    },

    create: async (dados) => {
        const cliente = await ClienteRepo.getById(dados.id_cliente)
        if (!cliente) throw new Error('Cliente não existe');
        const novo = await repo.save(dados)
        const novoDTO = ServicoMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        const cliente = await ClienteRepo.getById(dados.id_cliente)
        if (!cliente) throw new Error('Cliente não existe');

        const edit = await repo.update(id, dados)

        if (!edit){
            null
        }
        
        const editDTO = ServicoMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ServicoService