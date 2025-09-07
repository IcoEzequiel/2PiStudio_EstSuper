const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /equipamento', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver equipamentos no banco de dados', async () => {
        const response = await request(app).get('/equipamento')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe equipamento no banco', () => {
        beforeAll(async () => {
            await request(app)
            .post('/equipamento')
            .send({ nome: "Camera"})

            await request(app)
            .post('/equipamento')
            .send({ nome: "Tripe"})
        })

        it('Deve retornar uma lista com todos os equipamentos criados', async () => {
            const response = await request(app).get('/equipamento')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar equipamentos com as propriedades corretas', async () => {
            const response = await request(app).get('/equipamento')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('nome')
            expect(response.body[0]).toHaveProperty('status')

            expect(response.body[0].nome).toBe('Camera')
            expect(response.body[1].nome).toBe('Tripe')
        })
    })


    // Testes de Criação
    it('deve criar um novo equipamento com parametrização com sucesso', async () => {
        const novoEquipamento = {
            nome: "João Teste",
            valor_hora: 100.00
        }

        const response = await request(app)
        .post('/equipamento')
        .send(novoEquipamento)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(parseFloat(response.body.parametrizacao.valor_hora)).toBe(novoEquipamento.valor_hora)
        expect(response.body.nome).toBe(novoEquipamento.nome)
    })
    
    it('deve criar um equipamento sem parametrização com sucesso', async () => {
        const novoEquipamento = {
            nome: "filmadora"
        }
        const response = await request(app)
            .post('/equipamento')
            .send(novoEquipamento)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.parametrizacao).toBe(null)
        expect(response.body.nome).toBe(novoEquipamento.nome)
    })

    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let equipamentoTeste

        beforeEach(async () => {
            const response = await request(app)
                .post('/equipamento')
                .send({ nome: "Equipamento Padão",valor_hora: 50.00})

            equipamentoTeste = response.body
        })

        it("Deve atualizar um equipamento com sucesso", async () => {
            const dadosAtt = {nome: "Equipamento Atualizado",valor_hora: 60.00}

            const response = await request(app)
                .put('/equipamento/' + equipamentoTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.nome).toBe(dadosAtt.nome)
            expect(parseFloat(response.body.parametrizacao.valor_hora)).toBe(dadosAtt.valor_hora)
        })

        it("Deve retirar uma parametrização se não for fornecida", async () => {
            const dadosAtt = {nome: "segundo equipamento atualiado"}

            const response = await request(app)
                .put('/equipamento/' + equipamentoTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.nome).toBe(dadosAtt.nome)
            expect(response.body.parametrizacao).toBe(null)
        })

        it("Deve deletar permanentemente um equipamento e sua parametrização", async ()=> {
            const response = await request(app)
                .delete('/equipamento/' + equipamentoTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/equipamento/" + equipamentoTeste.id)
            
            expect(getresponse.status).toBe(404)
        })

        it("Deve mudar o status para Inativo ao deletar um equipamento e deletar sua parametrização que esteja alocado em um serviço", async () => {
            const cliente = await request(app).post('/cliente')
            .send({nome:"Cliente", tipo_cliente:"fisico",cpf_cnpj:"123.123.123-45"})
            await request(app).post('/servico').send({
                id_cliente: cliente.body.id,
                alocacoes_diarias: { "2025-01-01": { equipamentos: [{ id_equipamento: equipamentoTeste.id}]}}
            })

            const response = await request(app).delete('/equipamento/' + equipamentoTeste.id)

            expect(response.status).toBe(204)

            const getresponse = await request(app).get('/equipamento/' + equipamentoTeste.id)

            expect(getresponse.status).toBe(200)
            expect(getresponse.body.status).toBe('inativo')
            expect(getresponse.body.parametrizacao).toBe(null)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um equipamento sem dados', async () => {
        const equipamentoInvalido = {
        }

        const response = await request(app)
            .post('/equipamento')
            .send(equipamentoInvalido)

        expect(response.status).toBe(400)
    })

})