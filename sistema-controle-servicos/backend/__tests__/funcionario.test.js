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

    // Testes de GET
    it('deve retornar um array vazio quando não houver funcionários no banco', async () => {
        const response = await request(app).get('/funcionario')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe funcionarios no banco', () => {
        beforeAll(async () => {
            await request(app)
            .post('/funcionario')
            .send({ nome: "Ana teste"})

            await request(app)
            .post('/funcionario')
            .send({ nome: "Beto teste"})
        })

        it('Deve retornar uma lista com todos os funcionarios criados', async () => {
            const response = await request(app).get('/funcionario')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar funcipnarios com as propriedades corretas', async () => {
            const response = await request(app).get('/funcionario')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('nome')
            expect(response.body[0]).toHaveProperty('status')

            expect(response.body[0].nome).toBe('Ana teste')
            expect(response.body[1].nome).toBe('Beto teste')
        })
    })


    // Testes de Criação
    it('deve criar um novo funcionario com parametrização com sucesso', async () => {
        const novoFuncionario = {
            nome: "João Teste",
            valor_diaria: 100.00
        }

        const response = await request(app)
        .post('/funcionario')
        .send(novoFuncionario)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(parseFloat(response.body.parametrizacao.valor_diaria)).toBe(novoFuncionario.valor_diaria)
        expect(response.body.nome).toBe(novoFuncionario.nome)
    })
    
    it('deve criar um funcionario sem parametrização com sucesso', async () => {
        const novoFuncionario = {
            nome: "João Teste"
        }
        const response = await request(app)
            .post('/funcionario')
            .send(novoFuncionario)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.parametrizacao).toBe(null)
        expect(response.body.nome).toBe(novoFuncionario.nome)
    })

    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let funcionarioTeste

        beforeEach(async () => {
            const response = await request(app)
                .post('/funcionario')
                .send({ nome: "Funcionario Padão",valor_diaria: 100.00})

            funcionarioTeste = response.body
        })

        it("Deve atualizar um funcionario com sucesso", async () => {
            const dadosAtt = {nome: "Funcionario Atualizado", valor_diaria: 120.00}

            const response = await request(app)
                .put('/funcionario/' + funcionarioTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.nome).toBe(dadosAtt.nome)
            expect(parseFloat(response.body.parametrizacao.valor_diaria)).toBe(dadosAtt.valor_diaria)
        })

        it("Deve retirar uma parametrização se não for fornecida", async () => {
            const dadosAtt = {nome: "segundo funcionario atualiado"}

            const response = await request(app)
                .put('/funcionario/' + funcionarioTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.nome).toBe(dadosAtt.nome)
            expect(response.body.parametrizacao).toBe(null)
        })

        it("Deve deletar permanentemente um funcionario e sua parametrização", async ()=> {
            const response = await request(app)
                .delete('/funcionario/' + funcionarioTeste.id)
            console.log(response.body.error)
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/funcionario/" + funcionarioTeste.id)
            
            expect(getresponse.status).toBe(404)
        })

        it("Deve mudar o status para Inativo ao deletar um funcionario que esteja alocado em um serviço", async () => {
            const cliente = await request(app).post('/cliente')
            .send({nome:"Cliente", tipo_cliente:"fisico",cpf_cnpj:"123.123.123-45"})
            await request(app).post('/servico').send({
                id_cliente: cliente.body.id,
                alocacoes_diarias: { "2025-01-01": { funcionarios: [{ id_funcionario: funcionarioTeste.id}]}}
            })

            const response = await request(app).delete('/funcionario/' + funcionarioTeste.id)
            console.log(response.body)
            expect(response.status).toBe(204)

            const getresponse = await request(app).get('/funcionario/' + funcionarioTeste.id)

            expect(getresponse.status).toBe(200)
            expect(getresponse.body.status).toBe('inativo')
        })
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