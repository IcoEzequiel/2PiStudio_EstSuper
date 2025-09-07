const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /cliente', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver clientes no banco de dados', async () => {
        const response = await request(app).get('/cliente')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe cliente no banco', () => {
        beforeAll(async () => {
            await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            await request(app)
            .post('/cliente')
            .send({ nome: "Maria bonita", tipo_cliente: "juridico", cpf_cnpj: "123.456.789-10"})
        })

        it('Deve retornar uma lista com todos os clientes criados', async () => {
            const response = await request(app).get('/cliente')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar clientes com as propriedades corretas', async () => {
            const response = await request(app).get('/cliente')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('nome')

            expect(response.body[0].nome).toBe('Jõao augusto')
            expect(response.body[1].nome).toBe('Maria bonita')
        })
    })


    // Testes de Criação
    it('deve criar um novo cliente com sucesso', async () => {
        const novocliente = {
            nome: "João augusto",
            tipo_cliente: "fisico",
            cpf_cnpj: "741.852.963-00"
        }

        const response = await request(app)
        .post('/cliente')
        .send(novocliente)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.nome).toBe(novocliente.nome)
        expect(response.body.tipo_cliente).toBe(novocliente.tipo_cliente)
        expect(response.body.cpf_cnpj).toBe(novocliente.cpf_cnpj)
    })

    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let clienteTeste

        beforeEach(async () => {
            const response = await request(app)
                .post('/cliente')
                .send({ nome: "cliente Padão",tipo_cliente:"fisico", cpf_cnpj:"159.753.248-60"})

            clienteTeste = response.body
        })

        it("Deve atualizar um cliente com sucesso", async () => {
            const dadosAtt = {nome: "cliente Atualizado"}

            const response = await request(app)
                .put('/cliente/' + clienteTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.nome).toBe(dadosAtt.nome)
            expect(response.body).toHaveProperty("cpf_cnpj")
        })

        it("Deve deletar permanentemente um cliente", async ()=> {
            const response = await request(app)
                .delete('/cliente/' + clienteTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/cliente/" + clienteTeste.id)
            
            expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um cliente sem dados', async () => {
        const clienteInvalido = {
        }

        const response = await request(app)
            .post('/cliente')
            .send(clienteInvalido)

        expect(response.status).toBe(400)
    })

})