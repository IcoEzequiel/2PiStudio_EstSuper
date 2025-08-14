import { request } from "../../shared/api.js"

const API_SERVICO = '/servico'
const API_FUNCIONARIOS = '/funcionario'
const API_ALOCACAOFUNC = '/AlocacaoFuncionario'

const form = document.getElementById('form-alocacaoFunc')
const servicoInput = document.getElementById('id_servico')
const funcionarioInput = document.getElementById('id_funcionario')
const dataInput = document.getElementById('data')
const horaInput = document.getElementById('horas')
const valorDiaAlocadoInput = document.getElementById('valor_dia_alocado')
const tabela = document.getElementById('tabela-alocacaoFunc')
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
    .map(a => `<option value="${a.id}">${a.nome}</option>"`)
}

document.addEventListener('DOMContentLoaded', async() => {
    await carregarServico()
    await carregarFuncionario()
    listarAlocacaoFunc()
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_servico: servicoInput.value,
        id_funcionario: funcionarioInput.value,
        hora: horaInput.value,
        data: dataInput.value,
        valor_dia_alocado: valorDiaAlocadoInput.value
        }
    try {
        if (editingId) {
            await request(`${API_ALOCACAOFUNC}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_ALOCACAOFUNC,'POST',dados)
        }
        form.reset()
        listarAlocacaoFunc()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

async function listarAlocacaoFunc() {
    try {
        const lista = await request(API_ALOCACAOFUNC)
        renderAlocacaoFunc(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario
function renderAlocacaoFunc(lista) {
    tabela.innerHTML = lista.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.servico.nome || ''}</td>
            <td>${a.funcionario.nome || ''}</td>
            <td>${a.data || ''}</td>
            <td>${a.hora || ''}</td>
            <td>${a.valor_dia_alocado || ''}</td>
            <td>
                <button class="edit" data-id="${a.id}">Editar</button>
                <button class="del" data-id="${a.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirAlocacaoFunc(btn.dataset.id))
    })
}
async function carregarParaEdicao(id) {
    try {
        const alocacaoFunc = await request(`${API_ALOCACAOFUNC}/${id}`)
        editingId = id

        servicoInput.value = alocacaoFunc.servico.id || ''
        funcionarioInput.value = alocacaoFunc.funcionario.id || ''
        dataInput.value = alocacaoFunc.data || ''
        horaInput.value = alocacaoFunc.hora || ''
        valorDiaAlocadoInput.value = alocacaoFunc.valor_dia_alocado || ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

async function excluirAlocacaoFunc(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_ALOCACAOFUNC}/${id}`, "DELETE")
        listarAlocacaoFunc()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
