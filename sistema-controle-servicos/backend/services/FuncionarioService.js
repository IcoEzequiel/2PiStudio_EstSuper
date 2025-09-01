const { sequelize } = require('../db'); 
const repo = require('../repositories/FuncionarioRepository')
const ParaFuncRepo = require('../repositories/ParametrizacaoFuncionarioRepository')

const getComInclude = async (id) => {
    const inclusao = {include:[
        { model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'}
    ]}
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

const validar = async (dados) => {
    const Funcionario = await repo.getById(dados.id)
    if(!Funcionario)
        throw Error('Funcionario não encontrado')
}

const CriarEditar = async (dados, id = null) => {
    const t = await sequelize.transaction()
    try{
        const dadosFuncionario = {
            nome: dados.nome,
            cpf: dados.cpf,
            email: dados.email,
            telefone: dados.telefone,
            cargo: dados.cargo,
            status: dados.status || 'ativo'
        }
        let funcionarioSalvo
        let funcionarioId
        if(!id){
            funcionarioSalvo = await repo.save(dadosFuncionario, {transaction: t})
            funcionarioId = funcionarioSalvo.id
        } else{
            funcionarioId = id
            const funcionario = await getComInclude(id)
            await repo.update(id, dadosFuncionario, {transaction:t})
            funcionarioSalvo = funcionario
        }
        if (dados.valor_diaria){
            const dadosParametrizacao = {
                id_funcionario: funcionarioId,
                valor_diaria: dados.valor_diaria
            }
            const parametrizacao = funcionarioSalvo.parametrizacao
            if(parametrizacao)
                await ParaFuncRepo.update(parametrizacao.id, dadosParametrizacao, {transaction: t})
            else
                await ParaFuncRepo.save(dadosParametrizacao, {transaction: t})
        } else if (id && funcionarioSalvo.parametrizacao){
            await ParaFuncRepo.delete(funcionarioSalvo.parametrizacao.id, {transaction: t})
        }
        await t.commit()

        return repo.getById(funcionarioId)
    }catch (error){
        await t.rollback()

        throw new Error('Erro ao criar ou editar Funcionario' + error.message)
    }
}

const FuncionarioService = {
    getAll: async () => {
        return await getComInclude()
    },

    getById: async (id) => {
        return await getComInclude(id)
    },

    //Utiliza transactions para poder, em uma requisição, criar um funcionario
    // e sua parametrização, se vier.
    create: async (dados) => {
        const NovoFuncionario = await CriarEditar(dados, null)
        return NovoFuncionario
    },

    // Usa transiction para poder editar dados do funcionario e sua parametrização ao memso tempo
    update: async (id, dados) => {
        const editFuncionario = await CriarEditar(dados, id)
        return editFuncionario
    },

    // O delete não vai deletar de foto um funcionario, vai deixa-lo inativo e apagar seu usuario e sua parametrização do banco de dados
    delete: async (id) => {
        const t = await sequelize.transaction()

        try {
            const funcionario = await repo.getById(id, {
                include: [
                    { model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'},
                    { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoes'}
                ]
            })

            await validar(funcionario)
            if(funcionario.parametrizacao){
                await ParaFuncRepo.delete(funcionario.parametrizacao.id, {transaction: t})
            }
            await require('../models/ModelUsuario').destroy({
                where: { id_funcionario: id}, transaction: t
            })
            if(funcionario.alocacoes && funcionario.alocacoes.length > 0){
                const dadosFuncionario = {
                nome: funcionario.nome,
                cpf: funcionario.cpf,
                email: funcionario.email,
                numero_telefone: funcionario.numero_telefone,
                cargo: funcionario.cargo,
                status: "inativo"
            }
                await repo.update(id,dadosFuncionario,{transaction: t})
            } else {
                await repo.delete(id, {transaction: t})
            }
            await t.commit()
            return true
        }catch (error) {
            await t.rollback()
            throw new Error('Erro ao inativar Funcionario: ' + error.message)
        }
    }
}

module.exports = FuncionarioService