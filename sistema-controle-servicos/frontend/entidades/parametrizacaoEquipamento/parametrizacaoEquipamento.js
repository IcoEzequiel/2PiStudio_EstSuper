import { request } from "../../shared/api.js"

const API_EQUIPAMENTOS = '/equipamento'
const API_PARAMEQUIP = '/parametrizacaoEquipamento'

const form = document.getElementById('form-paramEquip')
const selectEquip = document.getElementById('id_equipamento')
const valor_horaInput = document.getElementById('valor_hora')
const tabela = document.getElementById('tabela-paramEquip')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null


async function carregarEquipamento() {
    const resp = await request(API_EQUIPAMENTOS)
    selectEquip.innerHTML = resp
    .map(c => `<option value="${c.id}">${c.nome}</option>`).join('')
}

// function getClienteNome(idCliente){
//     const cliente = clientep.find(c => c.id === idCliente)
//     return cliente ? cliente.nome : ''
// }

document.addEventListener('DOMContentLoaded', async() => {
    await carregarEquipamento()
    listarParamEquip()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_equipamento: selectEquip.value,
        valor_hora: valor_horaInput.value,
        }
    try {
        if (editingId) {
            await request(`${API_PARAMEQUIP}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_PARAMEQUIP,'POST',dados)
        }
        form.reset()
        listarParamEquip()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarParamEquip() {
    try {
        const lista = await request(API_PARAMEQUIP)
        renderParamEquip(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderParamEquip(lista) {
    tabela.innerHTML = lista.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.equipamento.nome || ''}</td>
            <td>${p.valor_hora || ''}</td>
            <td>
                <button class="edit" data-id="${p.id}">Editar</button>
                <button class="del" data-id="${p.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirParamEquip(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const paramEquip = await request(`${API_PARAMEQUIP}/${id}`)
        editingId = id

        selectEquip.value = paramEquip.equipamento.id || ''
        valor_horaInput.value = paramEquip.valor_hora || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirParamEquip(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_PARAMEQUIP}/${id}`, "DELETE")
        listarParamEquip()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
