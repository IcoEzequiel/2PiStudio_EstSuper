// Este script verifica se o usuário já tem um token.
// Se tiver, e tentar acessar a página de login, ele é redirecionado para o dashboard.
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    
    // Se o token existe, não faz sentido ficar na página de login.
    if (authToken) {
        // O '../' é para voltar uma pasta (de 'login/' para a raiz)
        window.location.href = '../index.html'; 
    }
});