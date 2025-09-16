document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('login-form');
    const submitButton = form.querySelector('.submit-button');

    localStorage.removeItem('authToken');

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

            // SUCESSO!
            console.log('Login bem-sucedido, token recebido:', data.token);
            localStorage.setItem('authToken', data.token);

            // Redireciona para a página do funcionário
            window.location.href = '../indexfunc.html';

        } catch (err) {
            alert('Falha no login: ' + err.message);
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
    });
});

