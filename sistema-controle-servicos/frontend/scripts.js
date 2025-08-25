// function carregarTela(arquivo) {
//   fetch(arquivo)
//     .then(response => {
//       if (!response.ok) throw new Error("Erro ao carregar " + arquivo);
//       return response.text();
//     })
//     .then(html => {
//       document.addEventListener("DOMContentLoaded", () => {
//         const links = document.querySelectorAll(".nav button");

//         links.forEach(link => {
//           link.addEventListener("click", (e) => {
//             e.preventDefault();
//             const pagina = e.target.getAttribute("data-page");
//             carregarPagina(pagina);
//           });
//         });
//       });

//       async function carregarPagina(pagina) {
//         try {
//           const resposta = await fetch(pagina);
//           const html = await resposta.text();
//           document.getElementById("conteudo").innerHTML = html;

//           // remove CSS extra anterior (se existir)
//           const linkCSS = document.querySelector("#extra-css");
//           if (linkCSS) linkCSS.remove();

//           // adiciona CSS extra se necessário
//           if (pagina === "dashboard.html") {
//             let css = document.createElement("link");
//             css.rel = "stylesheet";
//             css.href = "dashboard.css";
//             css.id = "extra-css";
//             document.head.appendChild(css);
//           }
//         } catch (err) {
//           document.getElementById("conteudo").innerHTML = "<p>Erro ao carregar página</p>";
//         }
//       }

//     })
//     .catch(err => console.error(err));
// }

// // Ao abrir o site, carrega o dashboard por padrão
// window.onload = () => {
//   carregarTela('dashboard/dashboard.html');
// };


// Função para carregar uma página no <main>
async function carregarPagina(pagina) {
  try {
    const resposta = await fetch(pagina);
    if (!resposta.ok) throw new Error("Erro ao carregar " + pagina);

    const html = await resposta.text();
    document.getElementById("conteudo").innerHTML = html;

    // remove CSS extra anterior (se existir)
    const linkCSS = document.querySelector("#extra-css");
    if (linkCSS) linkCSS.remove();

    // adiciona CSS extra se necessário
    if (pagina.includes("dashboard")) {
      let css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "dashboard.css";
      css.id = "extra-css";
      document.head.appendChild(css);
    }

  } catch (err) {
    document.getElementById("conteudo").innerHTML = "<p>Erro ao carregar página</p>";
    console.error(err);
  }
}

// Configura os botões da navbar
function configurarNavegacao() {
  const links = document.querySelectorAll(".nav-btn");
  links.forEach(link => {
    link.addEventListener("click", () => {
      const pagina = link.getAttribute("data-page");
      carregarPagina(pagina);
    });
  });
}

// Quando o site abrir
window.onload = () => {
  configurarNavegacao();
  carregarPagina("dashboard/dashboard.html"); // caminho do dashboard inicial
};
