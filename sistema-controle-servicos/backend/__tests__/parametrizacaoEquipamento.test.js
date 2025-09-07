const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /parametrizacaoEquipamento', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver parametrizacao de Equipamentos no banco de dados', async () => {
        const response = await request(app).get('/parametrizacaoEquipamento')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe parametrizacao de Equipamento no banco', () => {
        beforeAll(async () => {

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera"})

            await request(app)
            .post("/parametrizacaoEquipamento")
            .send({id_equipamento: equipamento.body.id, valor_hora: 20.00})
        })

        it('Deve retornar uma lista com todos as alocacões de Equipamentos criados', async () => {
            const response = await request(app).get('/parametrizacaoEquipamento')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(1)
        })

        it('Deve retornar funcipnarios com as propriedades corretas', async () => {
            const response = await request(app).get('/parametrizacaoEquipamento')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('equipamento')
            expect(response.body[0]).toHaveProperty('valor_hora')

            expect(response.body[0].equipamento.nome).toBe('Camera')
            expect(parseFloat(response.body[0].valor_hora)).toBe(20.00)
        })
    })


    // Testes de Criação
    it('deve criar uma nova parametrizacao de Equipamento', async () => {

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera teste"})

            const novaparametrizacao = {
                id_equipamento: equipamento.body.id,
                valor_hora: 25.00
            }
            const response = await request(app)
            .post("/parametrizacaoEquipamento")
            .send(novaparametrizacao)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.equipamento.id).toBe(novaparametrizacao.id_equipamento)
        expect(parseFloat(response.body.valor_hora)).toBe(novaparametrizacao.valor_hora)
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let parametrizacaoEquipamentoTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera"})

            const response = await request(app)
            .post("/parametrizacaoEquipamento")
            .send({id_equipamento: equipamento.body.id,valor_hora:30.00})

            parametrizacaoEquipamentoTeste = response.body
        })

        it("Deve atualizar um parametrizacaoEquipamento com sucesso", async () => {
            const dadosAtt = {valor_hora: 50.00}

            const response = await request(app)
                .put('/parametrizacaoEquipamento/' + parametrizacaoEquipamentoTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(parseFloat(response.body.valor_hora)).toBe(dadosAtt.valor_hora)
        })

        it("Deve deletar permanentemente um Uma alocação", async ()=> {
            const response = await request(app)
                .delete('/parametrizacaoEquipamento/' + parametrizacaoEquipamentoTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/parametrizacaoEquipamento/" + parametrizacaoEquipamentoTeste.id)
            
            expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um parametrizacaoEquipamento sem dados', async () => {
        const parametrizacaoEquipamentoInvalido = {
        }

        const response = await request(app)
            .post('/parametrizacaoEquipamento')
            .send(parametrizacaoEquipamentoInvalido)

        expect(response.status).toBe(400)
    })

})