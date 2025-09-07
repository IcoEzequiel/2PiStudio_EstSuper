const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /feedback', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver feedbacks no banco de dados', async () => {
        const response = await request(app).get('/feedback')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe feedback no banco', () => {
        beforeAll(async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Cleber",cpf:"159.456.753-99"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const alocFunc = await request(app)
            .post("/alocacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, id_servico: servico.body.id, data: "2025-02-01"})

            await request(app)
            .post("/feedback")
            .send({id_alocacaoFuncionario: alocFunc.body.id})

            await request(app)
            .post("/feedback")
            .send({id_alocacaoFuncionario: alocFunc.body.id})
        })

        it('Deve retornar uma lista com todos os feedbacks criados', async () => {
            const response = await request(app).get('/feedback')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar feedbacks com as propriedades corretas', async () => {
            const response = await request(app).get('/feedback')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('funcionario')
            expect(response.body[0]).toHaveProperty('servico')
        })
    })


    // Testes de Criação
    it('deve criar uma novo feedback', async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Cliente teste",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Claudio",cpf: "456.147.369-45"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const alocFunc = await request(app)
            .post("/alocacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, id_servico: servico.body.id, data: "2025-02-01"})


            const novoFeedback = {
                id_alocacaoFuncionario: alocFunc.body.id
            }

            const response = await request(app)
            .post("/feedback")
            .send(novoFeedback)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.funcionario.id).toBe(Funcionario.body.id)
        expect(response.body.servico.id).toBe(servico.body.id)
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let feedbackTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Joaquim", cpf: "451.875.648-98"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const alocFunc = await request(app)
            .post("/alocacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, id_servico: servico.body.id, data: "2025-02-01"})

            const response = await request(app)
            .post("/feedback")
            .send({id_alocacaoFuncionario: alocFunc.body.id})

            feedbackTeste = response.body
        })

        it("Deve atualizar um feedback com sucesso", async () => {
            const dadosAtt = {data: "2025-02-05"}

            const response = await request(app)
                .put('/feedback/' + feedbackTeste.id)
                .send(dadosAtt)
            console.log(response.error.message)
            expect(response.status).toBe(200)
            expect(response.body.data).toBe(dadosAtt.data)
        })

            it("Deve deletar permanentemente um FeedBack", async ()=> {
                const response = await request(app)
                    .delete('/feedback/' + feedbackTeste.id)
                
                expect(response.status).toBe(204)

                const getresponse = await request(app)
                    .get("/feedback/" + feedbackTeste.id)
                
                expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um feedback sem dados', async () => {
        const feedbackInvalido = {
        }

        const response = await request(app)
            .post('/feedback')
            .send(feedbackInvalido)

        expect(response.status).toBe(400)
    })

})