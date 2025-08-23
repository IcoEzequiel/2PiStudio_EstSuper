const { sequelize } = require('../db'); 
const repo = require('../repositories/EquipamentoRepository')
const ParaEquipRepo = require('../repositories/ParametrizacaoEquipamentoRepository')

const EquipamentoService = {
    getAll: async () => {
        return await repo.getAll({
            include: [{ model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'}]
        })
    },

    getById: async (id) => {
        return await repo.getById(id, {
            include: [{ model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'}]
        })
    },

    create: async (dados) => {
        const t = await sequelize.transaction()

        try{
            const dadosEquipamento = {
                nome: dados.nome,
                tipo: dados.tipo,
                descricao: dados.descricao,
                status: dados.status || 'operacional'
            }

            const novoEquipamento = await repo.save(dadosEquipamento, {transaction: t})
            
            if (dados.valor_hora){
                const dadosParametrizacao = {
                    id_equipamento: novoEquipamento.id,
                    valor_hora: dados.valor_hora
                }
                await ParaEquipRepo.save(dadosParametrizacao, {transaction: t})
            }
            await t.commit()

            return novoEquipamento
        } catch(error){
            await t.rollback()

            throw new Error('Erro ao criar Equipamento: ' + error.message)
        }
    },

    update: async (id, dados) => {
        const t = await sequelize.transaction()

        try {
            const Equipamento = await repo.getById(id, {
                include: [{ model: require('../models/ModelParametrizacaoEquipamento'), as: 'parametrizacao'}],
                transaction: t
            })
            if (!Equipamento)
                throw new Error('Equipamento não encontrado')
            const dadosEquipamento = {
                nome: dados.nome,
                tipo: dados.tipo,
                descricao: dados.descricao,
                status: dados.status || 'operacional'
            }
            await repo.update(id, dadosEquipamento, {transaction: t})

            if(dados.valor_hora){
                const dadosParametrizacao = {
                    id_equipamento: id,
                    valor_hora: dados.valor_hora
                }
                if(Equipamento.parametrizacao)
                    await ParaEquipRepo.update(Equipamento.parametrizacao.id, dadosParametrizacao, {transaction: t})
                else
                    await ParaEquipRepo.save(dadosParametrizacao, {transaction: t})
            } else if (Equipamento.parametrizacao)
                await ParaEquipRepo.delete(Equipamento.parametrizacao.id, {transaction: t})
            await t.commit()
            return await repo.getById(id)
        }catch(error){
            await t.rollback()
            throw new Error('Erro ao atualizar Equipamento: ' + error.message)
        }
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = EquipamentoService