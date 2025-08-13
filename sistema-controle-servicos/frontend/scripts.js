function carregarTela(arquivo) {
  fetch(arquivo)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar " + arquivo);
      return response.text();
    })
    .then(html => {
      document.getElementById("conteudo").innerHTML = html;

      // Mostra botão "+ Novo Projeto" apenas na aba de projetos
      //document.getElementById('novoProjetoBtn').classList.toggle(
      //  'hidden', 
      //  !arquivo.includes('projetos')
      //);
    })
    .catch(err => console.error(err));
}

// Ao abrir o site, carrega o dashboard por padrão
window.onload = () => {
  carregarTela('dashboard/dashboard.html');
};
