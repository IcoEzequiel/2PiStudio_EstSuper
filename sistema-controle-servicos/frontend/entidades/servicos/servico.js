import { request } from "../../shared/api.js"

const API_CLIENTES = '/cliente'
const API_SERVICOS = '/servico'

const form = document.getElementById('form-servico')
const selectCliente = document.getElementById('id_cliente')
const nomeInput = document.getElementById('nome')
const descricaoInput = document.getElementById('descricao')
const dataInicioInput = document.getElementById('data_inicio')
const dataFimInput = document.getElementById('data_fim')
const tempo_expedienteInput = document.getElementById('tempo_expediente')
const statusInput = document.getElementById('status')
const orcamentoInput = document.getElementById('orcamento')
const tabela = document.getElementById('tabela-servicos')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null

let clientes = []

async function carregarClientes() {
    const resp = await request(API_CLIENTES)
    clientes =  resp
    selectCliente.innerHTML = resp
    .map(c => `<option value="${c.id}">${c.nome}</option>`).join('')
}

function getClienteNome(idCliente){
    const cliente = clientes.find(c => c.id === idCliente)
    return cliente ? cliente.nome : ''
}

document.addEventListener('DOMContentLoaded', async() => {
    await carregarClientes()
    listarServicos()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_cliente: selectCliente.value,
        nome: nomeInput.value,
        descricao: descricaoInput.value,
        data_inicio: dataInicioInput.value,
        data_fim: dataFimInput.value,
        tempo_expediente: tempo_expedienteInput.value,
        status: statusInput.value,
        orcamento: orcamentoInput.value
        }
    try {
        if (editingId) {
            await request(`${API_SERVICOS}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_SERVICOS,'POST',dados)
        }
        form.reset()
        listarServicos()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarServicos() {
    try {
        const lista = await request(API_SERVICOS)
        renderServicos(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderServicos(lista) {
    tabela.innerHTML = lista.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${getClienteNome(s.id_cliente) || ''}</td>
            <td>${s.nome || ''}</td>
            <td>${s.descricao || ''}</td>
            <td>${s.data_inicio || ''}</td>
            <td>${s.data_fim || ''}</td>
            <td>${s.tempo_expediente || ''}</td>
            <td>${s.status || ''}</td>
            <td>${s.orcamento || ''}</td>
            <td>
                <button class="edit" data-id="${s.id}">Editar</button>
                <button class="del" data-id="${s.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirServico(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const servico = await request(`${API_SERVICOS}/${id}`)
        editingId = id

        selectCliente.value = servico.id_cliente || ''
        nomeInput = servico.nome || ''
        descricaoInput.value = servico.descricao || ''
        dataInicioInput.value = servico.data_inicio || ''
        dataFimInput.value = servico.data_fim || ''
        tempo_expedienteInput.value = servico.tempo_expediente || ''
        statusInput.value = servico.status || ''
        orcamentoInput.value = servico.orcamento || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirServico(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_SERVICOS}/${id}`, "DELETE")
        listarServicos()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
