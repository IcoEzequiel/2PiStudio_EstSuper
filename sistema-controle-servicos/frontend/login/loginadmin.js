document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form-admin');
    if (!form) return;
    const submitButton = form.querySelector('.submit-button');

    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile'); // Limpa o perfil antigo também

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login-admin').value;
        const password = document.getElementById('password-admin').value;
        submitButton.disabled = true;
        submitButton.textContent = 'Acessando...';

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, senha: password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Usuário ou senha inválidos.');
            }
            
            // --- A CORREÇÃO CRÍTICA ESTÁ AQUI ---
            console.log('Dados da API recebidos (Admin):', data); // Log para depuração
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userProfile', data.user.profile); // Esta linha é essencial!

            window.location.href = '../index.html';

        } catch (err) {
            alert('Falha no login: ' + err.message);
            submitButton.disabled = false;
            submitButton.textContent = 'Acessar Painel';
        }
    });
});