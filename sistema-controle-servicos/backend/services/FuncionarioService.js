const { sequelize } = require('../db'); 
const repo = require('../repositories/FuncionarioRepository')
const ParaFuncRepo = require('../repositories/ParametrizacaoFuncionarioRepository')

const FuncionarioService = {
    getAll: async () => {
        return await repo.getAll({
            include: [{model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'}]
        })
    },

    getById: async (id) => {
        return await repo.getById(id, {
            include: [{model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'}]
        })
    },

    //Utiliza transactions para poder, em uma requisição, criar um funcionario
    // e sua parametrização, se vier.
    create: async (dados) => {
        const t = await sequelize.transaction()

        try{
            const dadosFuncionario = {
                nome: dados.nome,
                cpf: dados.cpf,
                email: dados.email,
                numero_telefone: dados.numero_telefone,
                cargo: dados.cargo,
                status: dados.status || 'operacional'
            }

            const novoFuncionario = await repo.save(dadosFuncionario, {transaction: t})
            
            if (dados.valor_diaria){
                const dadosParametrizacao = {
                    id_funcionario: novoFuncionario.id,
                    valor_diaria: dados.valor_diaria
                }
                await ParaFuncRepo.save(dadosParametrizacao, {transaction: t})
            }
                await t.commit()

                return novoFuncionario;

            } catch(error){
                await t.rollback()

                throw new Error(`Erro ao criar funcionario: ${error.message}`)
            }
            
    },

    // Usa transiction para poder editar dados do funcionario e sua parametrização ao memso tempo
    update: async (id, dados) => {
        const t = await sequelize.transaction()

        try {
            const funcionario = await repo.getById(id, {
                include: [{ model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'}],
                transaction: t
            })
            if (!funcionario) 
                throw new Error('Funcionario não encontrado')
            const dadosFuncionario = {
                nome: dados.nome,
                cpf: dados.cpf,
                email: dados.email,
                numero_telefone: dados.numero_telefone,
                cargo: dados.cargo,
                status: dados.status
            }
            await repo.update(id, dadosFuncionario, {transaction: t})

            if(dados.valor_diaria){
                const dadosParametrizacao = {
                    id_funcionario: id,
                    valor_diaria: dados.valor_diaria
                }
                if(funcionario.parametrizacao)
                    await ParaFuncRepo.update(funcionario.parametrizacao.id, dadosParametrizacao, {transaction: t})
                else
                    await ParaFuncRepo.save(dadosParametrizacao, {transaction: t})
            } else if (funcionario.parametrizacao)
                await ParaFuncRepo.delete(funcionario.parametrizacao.id,{transaction: t})
            await t.commit()
            return await repo.getById(id)
        }catch(error){
            await t.rollback()
            throw new Error(`Erro ao atualizar funcionario: ${error.message}`)
        }
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = FuncionarioService