const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /parametrizacaoFuncionario', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver parametrizacao de Funcionarios no banco de dados', async () => {
        const response = await request(app).get('/parametrizacaoFuncionario')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe parametrizacao de Funcionario no banco', () => {
        beforeAll(async () => {

            const Funcionario = await request(app)
            .post('/Funcionario')
            .send({nome: "Claudio", cpf: "159.456.025.42"})

            await request(app)
            .post("/parametrizacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id, valor_diaria: 20.00})
        })

        it('Deve retornar uma lista com todos as alocacões de Funcionarios criados', async () => {
            const response = await request(app).get('/parametrizacaoFuncionario')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(1)
        })

        it('Deve retornar funcipnarios com as propriedades corretas', async () => {
            const response = await request(app).get('/parametrizacaoFuncionario')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('funcionario')
            expect(response.body[0]).toHaveProperty('valor_diaria')

            expect(response.body[0].funcionario.nome).toBe('Claudio')
            expect(parseFloat(response.body[0].valor_diaria)).toBe(20.00)
        })
    })


    // Testes de Criação
    it('deve criar uma nova parametrizacao de Funcionario', async () => {

            const Funcionario = await request(app)
            .post('/Funcionario')
            .send({nome: "Jubirildo", cpf: "456.864.846-42"})

            const novaparametrizacao = {
                id_funcionario: Funcionario.body.id,
                valor_diaria: 25.00
            }
            const response = await request(app)
            .post("/parametrizacaoFuncionario")
            .send(novaparametrizacao)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.funcionario.id).toBe(novaparametrizacao.id_funcionario)
        expect(parseFloat(response.body.valor_diaria)).toBe(novaparametrizacao.valor_diaria)
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let parametrizacaoFuncionarioTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const Funcionario = await request(app)
            .post('/Funcionario')
            .send({nome: "Gilberto", cpf:"97.542.013-65"})

            const response = await request(app)
            .post("/parametrizacaoFuncionario")
            .send({id_funcionario: Funcionario.body.id,valor_diaria:30.00})

            parametrizacaoFuncionarioTeste = response.body
        })

        it("Deve atualizar um parametrizacaoFuncionario com sucesso", async () => {
            const dadosAtt = {valor_diaria: 50.00}

            const response = await request(app)
                .put('/parametrizacaoFuncionario/' + parametrizacaoFuncionarioTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(parseFloat(response.body.valor_diaria)).toBe(dadosAtt.valor_diaria)
        })

        it("Deve deletar permanentemente um Uma alocação", async ()=> {
            const response = await request(app)
                .delete('/parametrizacaoFuncionario/' + parametrizacaoFuncionarioTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/parametrizacaoFuncionario/" + parametrizacaoFuncionarioTeste.id)
            
            expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um parametrizacaoFuncionario sem dados', async () => {
        const parametrizacaoFuncionarioInvalido = {
        }

        const response = await request(app)
            .post('/parametrizacaoFuncionario')
            .send(parametrizacaoFuncionarioInvalido)

        expect(response.status).toBe(400)
    })

})