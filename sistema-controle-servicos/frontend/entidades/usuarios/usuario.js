import { request } from "../../shared/api.js"

const API_FUNCIONARIOS = '/funcionario'
const API_USUARIOS = '/usuario'

const form = document.getElementById('form-usuario')
const selectFunc = document.getElementById('id_funcionario')
const selectPapel = document.getElementById('papel')
const loginInput = document.getElementById('login')
const senhaInput = document.getElementById('senha')
const tabela = document.getElementById('tabela-usuarios')
const btnCancel = document.getElementById('btn-cancel')

let editingId = null

async function carregarFuncionarios() {
    const resp = await request(API_FUNCIONARIOS)

    // Opção dele selecionar nenhum funcionario para o usuario, enviando como Null, e um select no começo

    selectFunc.innerHTML = `<option value="" disabled hidden selected>Selecione...</option>` + resp
    .map(r => `<option value="${r.id}">${r.nome || ''}</option>`).join('') + `<option value = null>Nenhum</option>`
}

// function getClienteNome(idCliente){
//     const cliente = clienteU.find(c => c.id === idCliente)
//     return cliente ? cliente.nome : ''
// }

//Carregar os funcionarios no select
document.addEventListener('DOMContentLoaded', async() => {
    await carregarFuncionarios()
    listarUsuarios()
})

// Comando para submeter um POST ou PUT
form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dados = {
        id_funcionario: selectFunc.value || null,
        papel: selectPapel.value,
        login: loginInput.value,
        senha: senhaInput.value
        }
        // para transformar o valor "null" em null
        dados.id_funcionario = selectFunc.value === "null" ? null : parseInt(selectFunc.value);

    try {
        if (editingId) {
            await request(`${API_USUARIOS}/${editingId}`,'PUT',dados)
            editingId = null
            btnCancel.style.display = 'none'
        } else {
            await request(API_USUARIOS,'POST',dados)
        }
        form.reset()
        listarUsuarios()
    }catch (err) {
        alert('Erro: ' + err.message)
    }
})

// Para o botão Cancelar o formulario
btnCancel.addEventListener('click', ()=>{
    editingId = null
    form.reset()
    btnCancel.style.display = 'none'
})

// Carregar a tabela de Usuarios 
async function listarUsuarios() {
    try {
        const lista = await request(API_USUARIOS)
        renderUsuarios(lista || [])
    } catch (err) {
        alert('Erro ao listar: ' + err.message)
    }
}

// sujestão do chat para listar pelo js inves do html, mudar caso necessario

// Renderizar as tabelas com os dados pegados pelo backend
function renderUsuarios(lista) {
    tabela.innerHTML = lista.map(U => `
        <tr>
            <td>${U.id}</td>
            <td>${U.funcionario?.nome || ''}</td>
            <td>${U.papel || ''}</td>
            <td>${U.login || ''}</td>
            <td>
                <button class="edit" data-id="${U.id}">Editar</button>
                <button class="del" data-id="${U.id}">Excluir</button>
             </td>
        </tr>`).join('')

    tabela.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
    })
    tabela.querySelectorAll('.del').forEach(btn => {
        btn.addEventListener('click',() => excluirUsuario(btn.dataset.id))
    })
}

// Pega os dados do backend para editar, talves seja melhor pegar da propria tabela depois
async function carregarParaEdicao(id) {
    try {
        const usuario = await request(`${API_USUARIOS}/${id}`)
        editingId = id

        selectFunc.value = usuario.funcionario?.id || null
        selectPapel.value = usuario.papel || ''
        loginInput.value = usuario.login || ''
        senhaInput.value = ''
        btnCancel.style.display = 'inline-block'
    } catch (err) {
        alert('Erro ao carregar: ' + err.message)
    }
}

// Excluir o usuario
async function excluirUsuario(id) {
    if (!confirm('Confirma exclusão?')) return
    try {
        await request(`${API_USUARIOS}/${id}`, "DELETE")
        listarServicos()
    }catch (err){
        alert("Erro ao excluir: " + err.message)
    }
}
