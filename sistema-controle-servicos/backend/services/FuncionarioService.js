const { sequelize } = require('../db'); 
const repo = require('../repositories/FuncionarioRepository')
const ParaFuncRepo = require('../repositories/ParametrizacaoFuncionarioRepository')
const UsuarioService = require('../services/UsuarioService')
const ModelUsuario = require('../models/ModelUsuario');

// Funcções auxiliares

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        { model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'}
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
// Comentado por não está sendo utilizado
// const validar = async (dados) => {
//     const Funcionario = await repo.getById(dados.id)
//     if(!Funcionario)
//         throw Error('Funcionario não encontrado')
// }

// Função para criar / editar um funcionario, junto com a criação da parametrização desse funcionario, se fornecido
const CriarEditar = async (dados, id = null) => {
    // essa função transaction asegura que apenas vai salvar no banco de dados se tudo ocorrer corretamente, caso
    // surga algum erro, ele disfaz as alterações. O reposytory tem que aceitar um options
    const t = await sequelize.transaction()
    try{
        const dadosFuncionario = {
            nome: dados.nome,
            // cpf: dados.cpf,
            // email: dados.email,
            // telefone: dados.telefone,
            // cargo: dados.cargo,
            status: dados.status || 'ativo'
        }
        let funcionarioSalvo
        let funcionarioId
        // Verifica se é um create
        if(!id){
            funcionarioSalvo = await repo.save(dadosFuncionario, {transaction: t})
            funcionarioId = funcionarioSalvo.id
            const primeiroNome = funcionarioSalvo.nome.split(' ')[0]
            const usuario = {
                id_funcionario: funcionarioSalvo.id,
                papel: "funcionario",
                login: primeiroNome,
                senha: "qwerty88"
            }
            await UsuarioService.create(usuario, {transaction: t})
        } 
        // Aqui é um update
        else{
            funcionarioId = id
            // Valida o funcionario
            const funcionario = await getComInclude(id)
            if (!funcionario) throw new Error('Funcionario não encontrado')
        
            const usuarioExistente = await ModelUsuario.findOne({ where: { id_funcionario: id } });

            await repo.update(id, dadosFuncionario, {transaction:t})
            if (dados.status === 'ativo'){
                const primeiroNome = dados.nome.split(' ')[0]

                if (usuarioExistente){
                    const usuarioUpdate = { login: primeiroNome}
                    await UsuarioService.update(usuarioExistente.id,usuarioUpdate, {transaction: t})
                } else {
                    const usuarioCreate = {
                        id_funcionario: id,
                        papel: "funcionario",
                        login: primeiroNome,
                        senha: "qwerty88"
                    }
                    await UsuarioService.create(usuarioCreate, {transaction: t})
                }
            }
            funcionarioSalvo = await getComInclude(id)
        }
        // Verifica se foi passado dados relacionados a parametrização do funcionario
        if (dados.valor_diaria){
            const dadosParametrizacao = {
                id_funcionario: funcionarioId,
                valor_diaria: dados.valor_diaria
            }
            // Verifica se funcionario já possui uma parametrização, se sim edita
            const parametrizacao = funcionarioSalvo.parametrizacao
            if(parametrizacao)
                await ParaFuncRepo.update(parametrizacao.id, dadosParametrizacao, {transaction: t})
            // Se não possuir uma parametrização salva uma nova.
            else
                await ParaFuncRepo.save(dadosParametrizacao, {transaction: t})
        } 
        // Se fou um update, o funcionario tem uma parametrização e não foi passado uma nos dados, deleta essa parametrização
        else if (id && funcionarioSalvo.parametrizacao){
            await ParaFuncRepo.delete(funcionarioSalvo.parametrizacao.id, {transaction: t})
        }
        // Se tudo der certo, salva no banco de dados.
        await t.commit()

        return getComInclude(funcionarioId)
    }catch (error){
        // Se alguma coisa der errado, desfaz todas as alterações
        await t.rollback()

        throw new Error('Erro ao criar ou editar Funcionario: ' + error.message)
    }
}

const FuncionarioService = {
    getAll: async () => {
        return await getComInclude()
    },

    getById: async (id) => {
        return await getComInclude(id)
    },

    create: async (dados) => {
        const NovoFuncionario = await CriarEditar(dados, null)
        return NovoFuncionario
    },

    update: async (id, dados) => {
        const editFuncionario = await CriarEditar(dados, id)
        return editFuncionario
    },

    // O delete não vai deletar de fato um funcionario, vai deixa-lo inativo e apagar seu usuario e sua parametrização do banco de dados
    delete: async (id) => {
        const t = await sequelize.transaction()

        try {
            // Pega o funcionario com suas parametrizações e suas alocações
            const funcionario = await repo.getById(id, {
                include: [
                    { model: require('../models/ModelParametrizacaoFuncionario'), as: 'parametrizacao'},
                    { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoes'}
                ]
            })

            // Se existir um usuario relacionado a esse funcionario, deleta.
            await ModelUsuario.destroy({ where: { id_funcionario: id }, transaction: t });
            // Se o Funcionario possuir alocações, troca seu status para inativo
            if(funcionario.alocacoes && funcionario.alocacoes.length > 0){
                await repo.update(id, { status: "inativo" }, { transaction: t });
            } 
            // Se ele não foi alocado para nenhum serviço, deleta ele do banco de dados
            else {
                await repo.delete(id, {transaction: t})
                // Se existir uma parametrização, deleta
                if(funcionario.parametrizacao){
                    await ParaFuncRepo.delete(funcionario.parametrizacao.id, {transaction: t})
                }
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