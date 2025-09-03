const { sequelize } = require('../db'); 
const repo = require('../repositories/EquipamentoRepository')
const ParaEquipRepo = require('../repositories/ParametrizacaoEquipamentoRepository')

// Funcões auxiliares

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        { model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'}
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao) 
    else
        return repo.getById(id,inclusao)
}

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados) => {
    const Equipamento = await repo.getById(dados.id)
    if(!Equipamento)
        throw Error('Equipamento não encontrado')
}

// Função para criar / editar um equipamento, junto com a criação da parametrização desse equipamento, se fornecido
const CriarEditar = async (dados, id = null) => {
        // essa função transaction asegura que apenas vai salvar no banco de dados se tudo ocorrer corretamente, caso
        // surga algum erro, ele disfaz as alterações. O reposytory tem que aceitar um options
        const t = await sequelize.transaction()
        try{
            const dadosEquipamento = {
                nome: dados.nome,
                tipo: dados.tipo,
                descricao: dados.descricao,
                status: dados.status || 'ativo'
            }
            let equipamentoSalvo
            let equipamentoId
            // Verifica se é um create
            if(!id){
                equipamentoSalvo = await repo.save(dadosEquipamento, {transaction: t})
                equipamentoId = equipamentoSalvo.id
            } 
            // Aqui é um update
            else{
                equipamentoId = id
                const equipamento = await getComInclude(id)
                await validar(equipamento)
                await repo.update(id,dadosEquipamento, {transaction: t})
                equipamentoSalvo = equipamento
            }
            // Verifica se foi passado dados relacionado a parametrização do equipamento
            if (dados.valor_hora){
                const dadosParametrizacao = {
                    id_equipamento: equipamentoId,
                    valor_hora: dados.valor_hora
                }
                // Verifica se o equipamento já possui uma parametrização, atualizando ela.
                const parametrizacao = equipamentoSalvo.parametrizacao
                if(parametrizacao)
                    await ParaEquipRepo.update(parametrizacao.id, dadosParametrizacao, {transaction: t})
                // Se ele não tiver uma parametrização, cria uma nova.
                else
                    await ParaEquipRepo.save(dadosParametrizacao, {transaction: t})
                // Aqui é: se for um update, o equipamento tiver uma parametrização, mas não foi passado os dados da parametrização
                // no corpo da requisição, deleta a parametrização desse equipamento
            } else if (id && equipamentoSalvo.parametrizacao){
                await ParaEquipRepo.delete(equipamentoSalvo.parametrizacao.id, {transaction: t})
            }
            // Se tudo ocorrer certo, salva as alterações no banco de dados
            await t.commit()

            return getComInclude(equipamentoId)
        } catch(error){
            // se der errado, desfaz todas as alterações
            await t.rollback()

            throw new Error('Erro ao criar Equipamento: ' + error.message)
        }
}

// Funções principais do Equipamento
const EquipamentoService = {
    getAll: async () => {
        return await getComInclude()
    },

    getById: async (id) => {
        return await getComInclude(id)
    },

    create: async (dados) => {
        const NovoEquipamento = await CriarEditar(dados, null)
        return NovoEquipamento
    },

    update: async (id, dados) => {
        await validar(dados)
        const editEquipamento = await CriarEditar(dados, id)
        return editEquipamento
    },

    // Delete decidi não fatorar, pos ia dar ficar mais confuso ainda
    delete: async (id) => {
        // já explicado como funciona na função criarEditar()
        const t = await sequelize.transaction()

        try {
            // Pega o equipamento para ser deletado com sua parametrização e suas alocações
            const equipamento = await repo.getById(id, {
                include: [
                    {model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'},
                    {model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoes'}
                ],
                transaction: t
            })

            // Se existir uma parametrização, deleta ela
            if (equipamento.parametrizacao){
                await ParaEquipRepo.delete(equipamento.parametrizacao.id, {transaction: t})
            }

            // se existir alocações e seu tamanho for maior que 0, transforma o status do equipamento em inativo,
            // Necessario para não perder os dados dos serviços. (o tamanho maior que zero e necesario, sem isso não funciona)
            if(equipamento.alocacoes && equipamento.alocacoes.length > 0){
                const dadosEquipamento = {
                nome: equipamento.nome,
                tipo: equipamento.tipo,
                descricao: equipamento.descricao,
                status: "inativo"
            }
                await repo.update(id, dadosEquipamento, {transaction: t})
            } 
            // Se não tiver nenhuma alocação para esse equipamento no sistema, ele é deletado
            else {
                await repo.delete(id, {transaction: t})
            }

            await t.commit()
            return true;
        }catch (error){
            await t.rollback()
            throw new Error('Erro ao inativar equipamento: ' + error.message)
        }
    }
}

module.exports = EquipamentoService