document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const submitButton = form.querySelector('.submit-button');

    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile'); // Limpa o perfil antigo também

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';

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
            console.log('Dados da API recebidos:', data); // Log para depuração
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userProfile', data.user.profile); // Esta linha é essencial!

            window.location.href = '../index.html'; // Ou sua página principal de funcionário

        } catch (err) {
            alert('Falha no login: ' + err.message);
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
    });
});