const { sequelize } = require('../db'); 
const repo = require('../repositories/EquipamentoRepository')
const ParaEquipRepo = require('../repositories/ParametrizacaoEquipamentoRepository')

const getComInclude = async (id) => {
    const inclusao = {include:[
        { model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'}
    ]}
    if(!id)
        return repo.getAll(inclusao) 
    else
        return repo.getById(id,inclusao)
}

const validar = async (dados) => {
    const Equipamento = await repo.getById(dados.id)
    if(!Equipamento)
        throw Error('Equipamento não encontrado')
}

const CriarEditar = async (dados, id = null) => {
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
            if(!id){
                equipamentoSalvo = await repo.save(dadosEquipamento, {transaction: t})
                equipamentoId = equipamentoSalvo.id
            } else{
                equipamentoId = id
                const equipamento = await getComInclude(id)
                await validar(equipamento)
                await repo.update(id,dadosEquipamento, {transaction: t})
                equipamentoSalvo = equipamento
            }
            if (dados.valor_hora){
                const dadosParametrizacao = {
                    id_equipamento: equipamentoId,
                    valor_hora: dados.valor_hora
                }
                const parametrizacao = equipamentoSalvo.parametrizacao
                if(parametrizacao)
                    await ParaEquipRepo.update(parametrizacao.id, dadosParametrizacao, {transaction: t})
                else
                    await ParaEquipRepo.save(dadosParametrizacao, {transaction: t})
            } else if (id && equipamentoSalvo.parametrizacao){
                await ParaEquipRepo.delete(equipamentoSalvo.parametrizacao.id, {transaction: t})
            }
            await t.commit()

            return repo.getById(equipamentoId)
        } catch(error){
            await t.rollback()

            throw new Error('Erro ao criar Equipamento: ' + error.message)
        }
}


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

    delete: async (id) => {
        const t = await sequelize.transaction()

        try {
            const equipamento = await repo.getById(id, {
                include: [
                    {model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'},
                    {model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoes'}
                ],
                transaction: t
            })

            await validar(equipamento)

            if (equipamento.parametrizacao){
                await ParaEquipRepo.delete(equipamento.parametrizacao.id, {transaction: t})
            }

            if(equipamento.alocacoes && equipamento.alocacoes.length > 0){
                const dadosEquipamento = {
                nome: equipamento.nome,
                tipo: equipamento.tipo,
                descricao: equipamento.descricao,
                status: "inativo"
            }
                await repo.update(id, dadosEquipamento, {transaction: t})
            } else {
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