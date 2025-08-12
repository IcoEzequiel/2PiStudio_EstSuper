import { request } from "../../shared/api.js"

const API = '/equipamento'

const form = document.getElementById('form-equipamento')
const nomeInput = document.getElementById('nome')
const tipoInput = document.getElementById('tipo')
const descricaoInput = document.getElementById('descricao')
const statusInput = document.getElementById('status')
const tabela = document.getElementById('tabela-equipamento')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null

document.addEventListener('DOMContentLoaded', async() => {
    listarEquipamentos()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        nome: nomeInput.value,
        tipo: tipoInput.value,
        descricao: descricaoInput.value,
        status: statusInput.value,
        }
    try {
        if (editingId) {
            await request(`${API}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API,'POST',dados)
        }
        form.reset()
        listarEquipamentos()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarEquipamentos() {
    try {
        const lista = await request(API)
        renderEquipamentos(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderEquipamentos(lista) {
    tabela.innerHTML = lista.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${e.nome}</td>
            <td>${e.tipo}</td>
            <td>${e.descricao || ''}</td>
            <td>${e.status || ''}</td>
            <td>
                <button class="edit" data-id="${e.id}">Editar</button>
                <button class="del" data-id="${e.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirEquipamento(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const equipamento = await request(`${API}/${id}`)
        editingId = id

        nomeInput.value = equipamento.nome || ''
        tipoInput.value = equipamento.tipo || ''
        descricaoInput.value = equipamento.descricao || ''
        statusInput.value = equipamento.status || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirEquipamento(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API}/${id}`, "DELETE")
        listarEquipamentos()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
