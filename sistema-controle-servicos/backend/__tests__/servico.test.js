const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /servico', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver servicos no banco de dados', async () => {
        const response = await request(app).get('/servico')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe serviços no banco', () => {
        beforeAll(async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})
        })

        it('Deve retornar uma lista com todos as alocacões de Equipamentos criados', async () => {
            const response = await request(app).get('/servico')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar serviços com as propriedades corretas', async () => {
            const response = await request(app).get('/servico')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('cliente')

            expect(response.body[0].cliente.nome).toBe('Jõao augusto')
        })
    })


    // Testes de Criação
    it('deve criar uma nova serviços', async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Cliente teste",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const novaServico = {
                id_cliente: cliente.body.id,
            }
            const response = await request(app)
            .post("/servico")
            .send(novaServico)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.cliente.id).toBe(novaServico.id_cliente)
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let servicoTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const response = await request(app)
            .post("/servico")
            .send({id_cliente: cliente.body.id})

            servicoTeste = response.body
        })

        it("Deve atualizar um servico com sucesso", async () => {
            const dadosAtt = {data_inicio: "2025-02-05", data_fim: "2025-03-06"}

            const response = await request(app)
                .put('/servico/' + servicoTeste.id)
                .send(dadosAtt)
            expect(response.status).toBe(200)
            expect(response.body.data_inicio).toBe(dadosAtt.data_inicio)
            expect(response.body.data_fim).toBe(dadosAtt.data_fim)
        })
        it("Deve deletar permanentemente um Serviço", async ()=> {
            const response = await request(app)
                .delete('/servico/' + servicoTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/servico/" + servicoTeste.id)
            
            expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um servico sem dados', async () => {
        const servicoInvalido = {
        }

        const response = await request(app)
            .post('/servico')
            .send(servicoInvalido)

        expect(response.status).toBe(400)
    })

})