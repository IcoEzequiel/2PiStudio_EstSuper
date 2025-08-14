import { request } from "../../shared/api.js"

const API_SERVICO = '/servico'
const API_EQUIPAMENTO = '/equipamento'
const API_ALOCACAOEQUIP = '/AlocacaoEquipamento'

const form = document.getElementById('form-alocacaoEquip')
const servicoInput = document.getElementById('id_servico')
const equipamentoInput = document.getElementById('id_equipamento')
const dataInput = document.getElementById('data')
const horaInput = document.getElementById('horas')
const valorHoraAlocadoInput = document.getElementById('valor_hora_alocado')
const tabela = document.getElementById('tabela-alocacaoEquip')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null


async function carregarServico() {
    const respS = await request(API_SERVICO)
    servicoInput.innerHTML = respS
    .map(s => `<option value="${s.id}">${s.nome}</option>`).join('')
}

async function carregarEquipamento() {
    const respF = await request(API_EQUIPAMENTO)
    equipamentoInput.innerHTML = respF
    .map(a => `<option value="${a.id}">${a.nome}</option>"`)
}

document.addEventListener('DOMContentLoaded', async() => {
    await carregarServico()
    await carregarEquipamento()
    listarAlocacaoEquip()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_servico: servicoInput.value,
        id_equipamento: equipamentoInput.value,
        hora: horaInput.value,
        data: dataInput.value,
        valor_hora_alocada: valorHoraAlocadoInput.value
        }
    try {
        if (editingId) {
            await request(`${API_ALOCACAOEQUIP}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_ALOCACAOEQUIP,'POST',dados)
        }
        form.reset()
        listarAlocacaoEquip()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarAlocacaoEquip() {
    try {
        const lista = await request(API_ALOCACAOEQUIP)
        renderAlocacaoEquip(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderAlocacaoEquip(lista) {
    tabela.innerHTML = lista.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.servico.nome || ''}</td>
            <td>${a.equipamento.nome || ''}</td>
            <td>${a.data || ''}</td>
            <td>${a.hora || ''}</td>
            <td>${a.valor_hora_alocada || ''}</td>
            <td>
                <button class="edit" data-id="${a.id}">Editar</button>
                <button class="del" data-id="${a.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirAlocacaoEquip(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const alocacaoFunc = await request(`${API_ALOCACAOEQUIP}/${id}`)
        editingId = id

        servicoInput.value = alocacaoFunc.servico.id || ''
        equipamentoInput.value = alocacaoFunc.equipamento.id || ''
        dataInput.value = alocacaoFunc.data || ''
        horaInput.value = alocacaoFunc.hora || ''
        valorHoraAlocadoInput.value = alocacaoFunc.valor_hora_alocada || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirAlocacaoEquip(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_ALOCACAOEQUIP}/${id}`, "DELETE")
        listarAlocacaoEquip()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
