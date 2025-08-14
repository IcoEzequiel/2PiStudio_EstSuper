import { request } from "../../shared/api.js"

const API_FUNCIONARIOS = '/funcionario'
const API_PARAMFUNC = '/parametrizacaoFuncionario'

const form = document.getElementById('form-paramFunc')
const selectFunc = document.getElementById('id_funcionario')
const valor_diariaInput = document.getElementById('valor_diaria')
const tabela = document.getElementById('tabela-paramFunc')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null


async function carregarFuncionarios() {
    const resp = await request(API_FUNCIONARIOS)
    selectFunc.innerHTML = resp
    .map(c => `<option value="${c.id}">${c.nome}</option>`).join('')
}

// function getClienteNome(idCliente){
//     const cliente = clientep.find(c => c.id === idCliente)
//     return cliente ? cliente.nome : ''
// }

document.addEventListener('DOMContentLoaded', async() => {
    await carregarFuncionarios()
    listarParamFunc()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_funcionario: selectFunc.value,
        valor_diaria: valor_diariaInput.value,
        }
    try {
        if (editingId) {
            await request(`${API_PARAMFUNC}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_PARAMFUNC,'POST',dados)
        }
        form.reset()
        listarParamFunc()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarParamFunc() {
    try {
        const lista = await request(API_PARAMFUNC)
        RenderParamFunc(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function RenderParamFunc(lista) {
    tabela.innerHTML = lista.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.funcionario.nome || ''}</td>
            <td>${p.valor_diaria || ''}</td>
            <td>
                <button class="edit" data-id="${p.id}">Editar</button>
                <button class="del" data-id="${p.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => ExcluirParamFunc(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const paramFunc = await request(`${API_PARAMFUNC}/${id}`)
        editingId = id

        selectFunc.value = paramFunc.funcionario.id || ''
        valor_diariaInput.value = paramFunc.valor_diaria || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function ExcluirParamFunc(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_PARAMFUNC}/${id}`, "DELETE")
        listarParamFunc()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
