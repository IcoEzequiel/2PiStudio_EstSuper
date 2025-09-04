const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /funcionario', () => {
    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de Criação
    it('deve criar um novo funcionario com parametrização com sucesso', async () => {
        const novoFuncionario = {
            nome: "João Teste",
            cpf: "123.456.789-10",
            cargo: "testador",
            valor_diaria: 100.00
        }

        const response = await request(app)
        .post('/funcionario')
        .send(novoFuncionario)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.parametrizacao.valor_diaria).toBe(novoFuncionario.valor_diaria)
        expect(response.body.nome).toBe(novoFuncionario.nome)
    })
    
    it('deve criar um funcionario sem parametrização com sucesso', async () => {
        const novoFuncionario = {
            nome: "João Teste",
            cpf: "123.456.789-10",
            cargo: "testador",
        }
        const response = await request(app)
            .post('/funcionario')
            .send(novoFuncionario)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.parametrizacao).toBe(null)
        expect(response.body.nome).toBe(novoFuncionario.nome)
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um funcionario sem nome', async () => {
        const funcionarioInvalido = {
            cpf: "987.654.321-01",
            cargo: "inválido"
        }

        const response = await request(app)
            .post('/funcionario')
            .send(funcionarioInvalido)

        expect(response.status).toBe(400)
    })

})