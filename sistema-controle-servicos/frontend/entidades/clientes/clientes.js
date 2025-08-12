import { request } from "../../shared/api.js"

const API = '/cliente'
const form = document.getElementById('form-cliente')
const nomeInput = document.getElementById('nome')
const tipoInput = document.getElementById('tipo')
const cpf_cnpjInput = document.getElementById('cpf_cnpj')
const emailInput = document.getElementById('email')
const telefoneInput = document.getElementById('telefone')
const tabela = document.getElementById('tabela-clientes')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null

document.addEventListener('DOMContentLoaded', () => {
    listarClientes()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        nome: nomeInput.value.trim(),
        tipo_cliente: tipoInput.value.trim(),
        cpf_cnpj: cpf_cnpjInput.value.trim(),
        email: emailInput.value.trim(),
        telefone: telefoneInput.value.trim()
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
        listarClientes()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarClientes() {
    try {
        const lista = await request(API)
        renderClientes(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderClientes(lista) {
    tabela.innerHTML = lista.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.nome || ''}</td>
            <td>${c.tipo_cliente || ''}</td>
            <td>${c.cpf_cnpj || ''}</td>
            <td>${c.email || ''}</td>
            <td>${c.telefone || ''}</td>
            <td>
                <button class="edit" data-id="${c.id}">Editar</button>
                <button class="del" data-id="${c.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirCliente(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const cliente = await request(`${API}/${id}`)
        editingId = id
        nomeInput.value = cliente.nome || ''
        tipoInput.value = cliente.tipo_cliente || ''
        cpf_cnpjInput.value = cliente.cpf_cnpj || ''
        emailInput.value = cliente.email || ''
        telefoneInput.value = cliente.telefone || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirCliente(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API}/${id}`, "DELETE")
        listarClientes()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
