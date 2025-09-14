const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../db')

describe('Testes para as rotas de /dashboard', () => {

    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async () => {
        await sequelize.close()
    })

    // Testes de GET
    it('deve retornar dados vazios quando não houver servicos no banco de dados', async () => {
        const response = await request(app).get('/dashboard/')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('dados')
        expect(response.body.dados).toHaveProperty('servicos_concluidos')
        expect(response.body.dados).toHaveProperty('servicos_ativos')
        expect(response.body.dados).toHaveProperty('receita_total')
        expect(response.body.dados).toHaveProperty('lucro_total')
        expect(response.body).toHaveProperty('servicos_recentes')
    })

    describe('quando existe serviços no banco', () => {
        beforeAll(async () => {
            const cliente = await request(app)
            .post('/cliente')
            .send({ nome: "Jõao augusto",tipo_cliente: "fisico", cpf_cnpj: "123.456.789-10"})

            const equipamento = await request(app)
            .post('/equipamento')
            .send({nome: "Camera teste"})

            const Funcionario = await request(app)
            .post('/funcionario')
            .send({nome: "Cleber"})
            
            const servico = await request(app)
             .post('/servico')
            .send({id_cliente: cliente.body.id, orcamento: 5000})

            const novaAlocacaoEquipamento = {
                id_equipamento: equipamento.body.id,
                id_servico: servico.body.id,
                hora: 8,
                valor_hora_alocada: 30,
                data: "2025-02-03"
            }
            await request(app)
            .post("/alocacaoEquipamento")
            .send(novaAlocacaoEquipamento)

            const novaAlocacaoFUncionario = {
                id_funcionario: Funcionario.body.id,
                id_servico: servico.body.id,
                hora: 8,
                valor_dia_alocado: 120,
                data: "2025-02-03"
            }
            await request(app)
            .post("/alocacaoFuncionario")
            .send(novaAlocacaoFUncionario)

        })

        it('Deve retornar os dados do dashboard', async () => {
            const response = await request(app).get('/dashboard/')

            expect(response.status).toBe(200)
            expect(response.body.dados.servicos_concluidos).toBe(1)
            expect(response.body.dados.servicos_ativos).toBe(0)
            expect(parseFloat(response.body.dados.receita_total)).toBe(5000)
            expect(parseFloat(response.body.dados.lucro_total)).toBe(3800)
        })
    })
})