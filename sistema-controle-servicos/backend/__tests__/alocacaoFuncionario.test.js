const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /alocacaoFuncionario', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver alocacao de Funcionarios no banco de dados', async () => {
        const response = await request(app).get('/alocacaoFuncionario')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe alocacao de Funcionario no banco', () => {
        beforeAll(async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Cleber"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            await request(app)
            .post("/alocacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, id_servico: servico.body.id, data: "2025-02-01"})

            await request(app)
            .post("/alocacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, id_servico: servico.body.id, data: "2025-02-02"})
        })

        it('Deve retornar uma lista com todos as alocacões de Funcionarios criados', async () => {
            const response = await request(app).get('/alocacaoFuncionario')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar funcipnarios com as propriedades corretas', async () => {
            const response = await request(app).get('/alocacaoFuncionario')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('funcionario')
            expect(response.body[0]).toHaveProperty('servico')

            expect(response.body[0].data).toBe('2025-02-01')
            expect(response.body[1].data).toBe('2025-02-02')
        })
    })


    // Testes de Criação
    it('deve criar uma nova alocacao de Funcionario', async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Cliente teste",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Claudio"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const novaAlocacao = {
                id_funcionario: Funcionario.body.id,
                id_servico: servico.body.id,
                data: "2025-02-03"
            }
            const response = await request(app)
            .post("/alocacaoFuncionario")
            .send(novaAlocacao)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.funcionario.id).toBe(novaAlocacao.id_funcionario)
        expect(response.body.servico.id).toBe(novaAlocacao.id_servico)
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let alocacaoFuncionarioTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Joaquim"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const response = await request(app)
            .post("/alocacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, id_servico: servico.body.id, data: "2025-02-01"})

            alocacaoFuncionarioTeste = response.body
        })

        it("Deve atualizar um alocacaoFuncionario com sucesso", async () => {
            const dadosAtt = {data: "2025-02-05"}

            const response = await request(app)
                .put('/alocacaoFuncionario/' + alocacaoFuncionarioTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.data).toBe(dadosAtt.data)
        })
            it("Deve deletar permanentemente um Uma alocação", async ()=> {
                const response = await request(app)
                    .delete('/alocacaoFuncionario/' + alocacaoFuncionarioTeste.id)
                
                expect(response.status).toBe(204)

                const getresponse = await request(app)
                    .get("/alocacaoFuncionario/" + alocacaoFuncionarioTeste.id)
                
                expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um alocacaoFuncionario sem dados', async () => {
        const alocacaoFuncionarioInvalido = {
        }

        const response = await request(app)
            .post('/alocacaoFuncionario')
            .send(alocacaoFuncionarioInvalido)

        expect(response.status).toBe(400)
    })

})