const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /alocacaoEquipamento', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver alocacao de Equipamentos no banco de dados', async () => {
        const response = await request(app).get('/AlocacaoEquipamento')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe alocacao de Equipamento no banco', () => {
        beforeAll(async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            await request(app)
            .post("/AlocacaoEquipamento")
            .send({id_equipamento: equipamento.body.id, id_servico: servico.body.id, data: "2025-02-01"})

            await request(app)
            .post("/AlocacaoEquipamento")
            .send({id_equipamento: equipamento.body.id, id_servico: servico.body.id, data: "2025-02-02"})
        })

        it('Deve retornar uma lista com todos as alocacões de Equipamentos criados', async () => {
            const response = await request(app).get('/alocacaoEquipamento')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar funcipnarios com as propriedades corretas', async () => {
            const response = await request(app).get('/alocacaoEquipamento')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('equipamento')
            expect(response.body[0]).toHaveProperty('servico')

            expect(response.body[0].data).toBe('2025-02-01')
            expect(response.body[1].data).toBe('2025-02-02')
        })
    })


    // Testes de Criação
    it('deve criar uma nova alocacao de Equipamento', async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Cliente teste",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera teste"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const novaAlocacao = {
                id_equipamento: equipamento.body.id,
                id_servico: servico.body.id,
                data: "2025-02-03"
            }
            const response = await request(app)
            .post("/alocacaoEquipamento")
            .send(novaAlocacao)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.equipamento.id).toBe(novaAlocacao.id_equipamento)
        expect(response.body.servico.id).toBe(novaAlocacao.id_servico)
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let alocacaoEquipamentoTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera"})

            const servico = await request(app)
            .post('/servico')
            .send({id_cliente: cliente.body.id})

            const response = await request(app)
            .post("/AlocacaoEquipamento")
            .send({id_equipamento: equipamento.body.id, id_servico: servico.body.id, data: "2025-02-01"})

            alocacaoEquipamentoTeste = response.body
        })

        it("Deve atualizar um alocacaoEquipamento com sucesso", async () => {
            const dadosAtt = {data: "2025-02-05"}

            const response = await request(app)
                .put('/alocacaoEquipamento/' + alocacaoEquipamentoTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.data).toBe(dadosAtt.data)
        })
        it("Deve deletar permanentemente um Uma alocação", async ()=> {
            const response = await request(app)
                .delete('/alocacaoEquipamento/' + alocacaoEquipamentoTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/alocacaoEquipamento/" + alocacaoEquipamentoTeste.id)
            
            expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um alocacaoEquipamento sem dados', async () => {
        const alocacaoEquipamentoInvalido = {
        }

        const response = await request(app)
            .post('/alocacaoEquipamento')
            .send(alocacaoEquipamentoInvalido)

        expect(response.status).toBe(400)
    })

})