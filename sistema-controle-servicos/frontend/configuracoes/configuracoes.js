// // import { request } from "../../shared/api.js"

// // const API = '/equipamento'

// // const form = document.getElementById('form-equipamento')
// // const nomeInput = document.getElementById('nome')
// // const tipoInput = document.getElementById('tipo')
// // const descricaoInput = document.getElementById('descricao')
// // const statusInput = document.getElementById('status')
// // const tabela = document.getElementById('tabela-equipamento')
// // const btnCancel = document.getElementById('btn-cancel')

// // let editingId = null

// // document.addEventListener('DOMContentLoaded', async() => {
// //     listarEquipamentos()
// // })

// // form.addEventListener('submit',async(e)=>{
// //     e.preventDefault();
// //     const dados = {
// //         nome: nomeInput.value,
// //         tipo: tipoInput.value,
// //         descricao: descricaoInput.value,
// //         status: statusInput.value,
// //         }
// //     try {
// //         if (editingId) {
// //             await request(`${API}/${editingId}`,'PUT',dados)
// //             editingId = null
// //             btnCancel.style.display = 'none'
// //         } else {
// //             await request(API,'POST',dados)
// //         }
// //         form.reset()
// //         listarEquipamentos()
// //     }catch (err) {
// //         alert('Erro: ' + err.message)
// //     }
// // })

// // btnCancel.addEventListener('click', ()=>{
// //     editingId = null
// //     form.reset()
// //     btnCancel.style.display = 'none'
// // })

// // async function listarEquipamentos() {
// //     try {
// //         const lista = await request(API)
// //         renderEquipamentos(lista || [])
// //     } catch (err) {
// //         alert('Erro ao listar: ' + err.message)
// //     }
// // }

// // // sujestão do chat para listar pelo js inves do html, mudar caso necessario
// // function renderEquipamentos(lista) {
// //     tabela.innerHTML = lista.map(e => `
// //         <tr>
// //             <td>${e.id}</td>
// //             <td>${e.nome}</td>
// //             <td>${e.tipo}</td>
// //             <td>${e.descricao || ''}</td>
// //             <td>${e.status || ''}</td>
// //             <td>
// //                 <button class="edit" data-id="${e.id}">Editar</button>
// //                 <button class="del" data-id="${e.id}">Excluir</button>
// //              </td>
// //         </tr>`).join('')

// //     tabela.querySelectorAll('.edit').forEach(btn => {
// //         btn.addEventListener('click', () => carregarParaEdicao(btn.dataset.id))
// //     })
// //     tabela.querySelectorAll('.del').forEach(btn => {
// //         btn.addEventListener('click',() => excluirEquipamento(btn.dataset.id))
// //     })
// // }
// // async function carregarParaEdicao(id) {
// //     try {
// //         const equipamento = await request(`${API}/${id}`)
// //         editingId = id

// //         nomeInput.value = equipamento.nome || ''
// //         tipoInput.value = equipamento.tipo || ''
// //         descricaoInput.value = equipamento.descricao || ''
// //         statusInput.value = equipamento.status || ''
// //         btnCancel.style.display = 'inline-block'
// //     } catch (err) {
// //         alert('Erro ao carregar: ' + err.message)
// //     }
// // }

// // async function excluirEquipamento(id) {
// //     if (!confirm('Confirma exclusão?')) return
// //     try {
// //         await request(`${API}/${id}`, "DELETE")
// //         listarEquipamentos()
// //     }catch (err){
// //         alert("Erro ao excluir: " + err.message)
// //     }
// // }

// // Importa a função de requisição da sua API
// import { request } from "../../shared/api.js";

// // Espera o documento HTML ser completamente carregado
// document.addEventListener('DOMContentLoaded', () => {

//     // --- LÓGICA PARA EQUIPAMENTOS ---
//     const API_EQUIPMENT = '/equipamento';
//     const equipmentNameInput = document.getElementById('equipment-name');
//     const equipmentCostInput = document.getElementById('equipment-cost');
//     const addEquipmentBtn = document.getElementById('add-equipment-btn');
//     const equipmentListContainer = document.getElementById('equipment-items');
//     let editingEquipmentId = null; // Variável para controlar a edição

//     // --- LÓGICA PARA MÃO DE OBRA ---
//     const API_LABOR = '/mao-de-obra'; 
//     const laborNameInput = document.getElementById('labor-name');
//     const laborCostInput = document.getElementById('labor-cost');
//     const addLaborBtn = document.getElementById('add-labor-btn');
//     const laborListContainer = document.getElementById('labor-items');
//     let editingLaborId = null; // Variável para controlar a edição

//     // Função para renderizar a lista de equipamentos na tela
//     function renderEquipment(lista) {
//         equipmentListContainer.innerHTML = ''; // Limpa a lista antes de renderizar
//         lista.forEach(item => {
//             const newItemDiv = document.createElement('div');
//             newItemDiv.classList.add('resource-item'); // Classe para estilização
//             // Adapte os campos (item.nome, item.custo) conforme o que sua API retorna
//             newItemDiv.innerHTML = `
//                 <span>${item.nome}</span>
//                 <span class="cost">R$ ${parseFloat(item.custo || 0).toFixed(2)}/h</span>
//                 <div class="actions">
//                     <button class="edit-btn" data-id="${item.id}">✏️</button>
//                     <button class="delete-btn" data-id="${item.id}">🗑️</button>
//                 </div>
//             `;
//             equipmentListContainer.appendChild(newItemDiv);
//         });

//         // Adiciona os eventos de clique aos botões de editar e excluir
//         equipmentListContainer.querySelectorAll('.edit-btn').forEach(btn => {
//             btn.addEventListener('click', () => loadEquipmentForEdit(btn.dataset.id));
//         });
//         equipmentListContainer.querySelectorAll('.delete-btn').forEach(btn => {
//             btn.addEventListener('click', () => deleteEquipment(btn.dataset.id));
//         });
//     }

//     // Função para renderizar a lista de Mão de Obra
//     function renderLabor(lista) {
//         laborListContainer.innerHTML = ''; // Limpa a lista
//         lista.forEach(item => {
//             const newItemDiv = document.createElement('div');
//             newItemDiv.classList.add('resource-item');
//             newItemDiv.innerHTML = `
//                 <span>${item.nome}</span>
//                 <span class="cost">R$ ${parseFloat(item.custo || 0).toFixed(2)}/h</span>
//                 <div class="actions">
//                     <button class="edit-btn" data-id="${item.id}">✏️</button>
//                     <button class="delete-btn" data-id="${item.id}">🗑️</button>
//                 </div>
//             `;
//             laborListContainer.appendChild(newItemDiv);
//         });

//         laborListContainer.querySelectorAll('.edit-btn').forEach(btn => {
//             btn.addEventListener('click', () => loadLaborForEdit(btn.dataset.id));
//         });
//         laborListContainer.querySelectorAll('.delete-btn').forEach(btn => {
//             btn.addEventListener('click', () => deleteLabor(btn.dataset.id));
//         });
//     }

//     // Carrega a lista da API e manda renderizar
//     async function listResources() {
//         try {
//             const equipmentList = await request(API_EQUIPMENT);
//             renderEquipment(equipmentList || []);
            
//             const laborList = await request(API_LABOR);
//             renderLabor(laborList || []);
//         } catch (err) {
//             console.error("Erro ao listar recursos:", err);
//             alert("Não foi possível carregar os recursos.");
//         }
//     }

//     // --- Funções CRUD para Equipamentos ---
//     async function handleEquipmentSubmit() {
//         const dados = {
//             nome: equipmentNameInput.value.trim(),
//             custo: parseFloat(equipmentCostInput.value)
//         };

//         if (!dados.nome || isNaN(dados.custo)) {
//             alert("Por favor, preencha o nome e o custo do equipamento.");
//             return;
//         }

//         try {
//             if (editingEquipmentId) {
//                 // Atualizar (PUT)
//                 await request(`${API_EQUIPMENT}/${editingEquipmentId}`, 'PUT', dados);
//                 editingEquipmentId = null;
//             } else {
//                 // Criar (POST)
//                 await request(API_EQUIPMENT, 'POST', dados);
//             }
//             equipmentNameInput.value = '';
//             equipmentCostInput.value = '';
//             listResources(); // Atualiza a lista
//         } catch (err) {
//             alert("Erro ao salvar equipamento: " + err.message);
//         }
//     }

//     async function loadEquipmentForEdit(id) {
//         try {
//             const item = await request(`${API_EQUIPMENT}/${id}`);
//             equipmentNameInput.value = item.nome;
//             equipmentCostInput.value = item.custo;
//             editingEquipmentId = id;
//         } catch (err) {
//             alert("Erro ao carregar equipamento para edição: " + err.message);
//         }
//     }

//     async function deleteEquipment(id) {
//         if (!confirm("Tem certeza que deseja excluir este equipamento?")) return;
//         try {
//             await request(`${API_EQUIPMENT}/${id}`, 'DELETE');
//             listResources(); // Atualiza a lista
//         } catch (err) {
//             alert("Erro ao excluir equipamento: " + err.message);
//         }
//     }

//     // --- Funções CRUD para Mão de Obra (similares às de equipamento) ---
//     async function handleLaborSubmit() {
//         const dados = {
//             nome: laborNameInput.value.trim(),
//             custo: parseFloat(laborCostInput.value)
//         };

//         if (!dados.nome || isNaN(dados.custo)) {
//             alert("Por favor, preencha o nome e o custo do profissional.");
//             return;
//         }

//         try {
//             if (editingLaborId) {
//                 await request(`${API_LABOR}/${editingLaborId}`, 'PUT', dados);
//                 editingLaborId = null;
//             } else {
//                 await request(API_LABOR, 'POST', dados);
//             }
//             laborNameInput.value = '';
//             laborCostInput.value = '';
//             listResources();
//         } catch (err) {
//             alert("Erro ao salvar mão de obra: " + err.message);
//         }
//     }

//     async function loadLaborForEdit(id) {
//         try {
//             const item = await request(`${API_LABOR}/${id}`);
//             laborNameInput.value = item.nome;
//             laborCostInput.value = item.custo;
//             editingLaborId = id;
//         } catch (err) {
//             alert("Erro ao carregar mão de obra para edição: " + err.message);
//         }
//     }

//     async function deleteLabor(id) {
//         if (!confirm("Tem certeza que deseja excluir este profissional?")) return;
//         try {
//             await request(`${API_LABOR}/${id}`, 'DELETE');
//             listResources();
//         } catch (err) {
//             alert("Erro ao excluir mão de obra: " + err.message);
//         }
//     }


//     // Adiciona os eventos de clique aos botões de adicionar
//     addEquipmentBtn.addEventListener('click', handleEquipmentSubmit);
//     addLaborBtn.addEventListener('click', handleLaborSubmit);

//     // Carrega os dados iniciais ao abrir a página
//     listResources();
// });