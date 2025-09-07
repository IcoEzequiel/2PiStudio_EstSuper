const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /usuario', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar um array vazio quando não houver usuarios no banco de dados', async () => {
        const response = await request(app).get('/usuario')

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body).toHaveLength(0)
    })

    describe('quando existe usuario no banco', () => {
        beforeAll(async () => {

            const Funcionario = await request(app)
            .post('/Funcionario')
            .send({nome: "Claudio", cpf: "159.456.025.42"})

            await request(app)
            .post("/usuario")
            .send({id_funcionario: Funcionario.body.id, login:"claudio",senha:"senha",papel:"funcionario"})

            await request(app)
            .post("/usuario")
            .send({login:"admin",senha:"admin", papel:"administrador"})
        })

        it('Deve retornar uma lista com todos os usuarios criados', async () => {
            const response = await request(app).get('/usuario')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body).toHaveLength(2)
        })

        it('Deve retornar funcipnarios com as propriedades corretas', async () => {
            const response = await request(app).get('/usuario')

            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('login')
            expect(response.body[0]).toHaveProperty('papel')
            expect(response.body[0]).not.toHaveProperty('senha')

            expect(response.body[0].funcionario.nome).toBe('Claudio')
        })
    })


    // Testes de Criação
    it('deve criar um novo usuario', async () => {

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Jubirildo", cpf: "456.864.846-42"})

            const novoUsuario = {
                id_funcionario: Funcionario.body.id,
                login: "ju",
                senha:"1234",
                papel:"funcionario"
            }
            const response = await request(app)
            .post("/usuario")
            .send(novoUsuario)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.funcionario.id).toBe(novoUsuario.id_funcionario)
        expect(response.body.login).toBe(novoUsuario.login)
        expect(response.body).not.toHaveProperty('senha')
    })
    
    // Teste de Atualização
    describe('Teste de Update e Delete',() => {
        let usuarioTeste

        beforeEach(async () => {
            await sequelize.sync({force: true})

            const Funcionario = await request(app)
            .post('/Funcionario')
            .send({nome: "Gilberto", cpf:"97.542.013-65"})

            const response = await request(app)
            .post("/usuario")
            .send({id_funcionario: Funcionario.body.id,login:"gilber", senha:"bolsonaro"})

            usuarioTeste = response.body
        })

        it("Deve atualizar um usuario com sucesso", async () => {
            const dadosAtt = {login:"usuario"}

            const response = await request(app)
                .put('/usuario/' + usuarioTeste.id)
                .send(dadosAtt)
            
            expect(response.status).toBe(200)
            expect(response.body.login).toBe(dadosAtt.login)
            expect(response.body).not.toHaveProperty('senha')
        })

        it("Deve deletar permanentemente um Usuario", async ()=> {
            const response = await request(app)
                .delete('/usuario/' + usuarioTeste.id)
            
            expect(response.status).toBe(204)

            const getresponse = await request(app)
                .get("/usuario/" + usuarioTeste.id)
            
            expect(getresponse.status).toBe(404)
        })
    })

    // Testes de validação
    it('deve retornar um erro 400 ao tentar criar um usuario sem dados', async () => {
        const usuarioInvalido = {
        }

        const response = await request(app)
            .post('/usuario')
            .send(usuarioInvalido)

        expect(response.status).toBe(400)
    })

})