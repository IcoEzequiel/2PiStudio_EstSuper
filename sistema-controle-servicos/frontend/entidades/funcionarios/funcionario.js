import { request } from "../../shared/api.js"

const API = '/funcionario'

const form = document.getElementById('form-funcionario')
const nomeInput = document.getElementById('nome')
const cpfInput = document.getElementById('cpf')
const emailInput = document.getElementById('email')
const telefoneInput = document.getElementById('telefone')
const cargoInput = document.getElementById('cargo')
const statusInput = document.getElementById('status')
const tabela = document.getElementById('tabela-funcionario')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null

document.addEventListener('DOMContentLoaded', async() => {
    listarFuncionarios()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        nome: nomeInput.value,
        cpf: cpfInput.value,
        email: emailInput.value,
        telefone: telefoneInput.value,
        cargo: cargoInput.value,
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
        listarFuncionarios()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarFuncionarios() {
    try {
        const lista = await request(API)
        renderFuncionarios(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderFuncionarios(lista) {
    tabela.innerHTML = lista.map(f => `
        <tr>
            <td>${f.id}</td>
            <td>${f.nome}</td>
            <td>${f.cpf}</td>
            <td>${f.email || ''}</td>
            <td>${f.telefone || ''}</td>
            <td>${f.cargo || ''}</td>
            <td>${f.status || ''}</td>
            <td>
                <button class="edit" data-id="${f.id}">Editar</button>
                <button class="del" data-id="${f.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirFuncionario(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const funcionario= await request(`${API}/${id}`)
        editingId = id

        nomeInput.value = funcionario.nome || ''
        cpfInput.value = funcionario.cpf || ''
        emailInput.value = funcionario.email || ''
        telefoneInput.value = funcionario.telefone || ''
        cargoInput.value = funcionario.cargo || ''
        statusInput.value = funcionario.status || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirFuncionario(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API}/${id}`, "DELETE")
        listarFuncionarios()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
