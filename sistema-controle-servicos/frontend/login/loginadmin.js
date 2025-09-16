document.addEventListener('DOMContentLoaded', () => {

    // Procura pelo formulário na página de admin com o ID correto
    const form = document.getElementById('login-form-admin');
    if (!form) return; // Se não encontrar o form, não faz nada.

    const submitButton = form.querySelector('.submit-button');

    // Garante que qualquer token antigo seja removido
    localStorage.removeItem('authToken');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Lê os campos com os IDs corretos do novo HTML
        const login = document.getElementById('login-admin').value;
        const password = document.getElementById('password-admin').value;

        submitButton.disabled = true;
        submitButton.textContent = 'Acessando...';

        try {
            // A rota do backend continua a mesma
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, senha: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Usuário ou senha inválidos.');
            }

            // SUCESSO!
            console.log('Login de admin bem-sucedido, token recebido:', data.token);
            localStorage.setItem('authToken', data.token);

            // Redireciona para a página principal
            window.location.href = '../index.html';

        } catch (err) {
            alert('Falha no login: ' + err.message);
            submitButton.disabled = false;
            // Atualiza o texto do botão para corresponder ao HTML
            submitButton.textContent = 'Acessar Painel';
        }
    });
});

