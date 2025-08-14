import { request } from "../../shared/api.js"

const API_SERVICO = '/servico'
const API_FUNCIONARIOS = '/funcionario'
const API_FEEDBACK = '/feedback'

const form = document.getElementById('form-feedback')
const servicoInput = document.getElementById('id_servico')
const funcionarioInput = document.getElementById('id_funcionario')
const comentarioInput = document.getElementById('comentario')
const dataInput = document.getElementById('data')
const tabela = document.getElementById('tabela-feedback')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null


async function carregarServico() {
    const respS = await request(API_SERVICO)
    servicoInput.innerHTML = respS
    .map(s => `<option value="${s.id}">${s.nome}</option>`).join('')
}

async function carregarFuncionario() {
    const respF = await request(API_FUNCIONARIOS)
    funcionarioInput.innerHTML = respF
    .map(f => `<option value="${f.id}">${f.nome}</option>"`)
}

document.addEventListener('DOMContentLoaded', async() => {
    await carregarServico()
    await carregarFuncionario()
    listarFeedback()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_servico: servicoInput.value,
        id_funcionario: funcionarioInput.value,
        comentario: comentarioInput.value,
        data: dataInput.value
        }
    try {
        if (editingId) {
            await request(`${API_FEEDBACK}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_FEEDBACK,'POST',dados)
        }
        form.reset()
        listarFeedback()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarFeedback() {
    try {
        const lista = await request(API_FEEDBACK)
        renderFeedback(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderFeedback(lista) {
    tabela.innerHTML = lista.map(f => `
        <tr>
            <td>${f.id}</td>
            <td>${f.servico.nome || ''}</td>
            <td>${f.funcionario.nome || ''}</td>
            <td>${f.comentario || ''}</td>
            <td>${f.data || ''}</td>
            <td>
                <button class="edit" data-id="${f.id}">Editar</button>
                <button class="del" data-id="${f.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirFeedback(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const feedback = await request(`${API_FEEDBACK}/${id}`)
        editingId = id

        servicoInput.value = feedback.servico.id || ''
        funcionarioInput.value = feedback.funcionario.id || ''
        comentarioInput.value = feedback.comentario || ''
        dataInput.value = feedback.data || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirFeedback(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_FEEDBACK}/${id}`, "DELETE")
        listarFeedback()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
