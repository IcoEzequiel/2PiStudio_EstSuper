// exportar funçoes comuns nas entidades, nesse caso envio e erros do json

// Define a URL base do seu backend para não precisar repeti-la.
const BASE_URL = 'http://localhost:3000';

export async function request(path, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    // if (body) headers.body = JSON.stringify(body)

    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const opts = { method, headers };
    if (body) {
        opts.body = JSON.stringify(body);
    }

    // const res = await fetch(path, opts);

    // if (!res.ok) {
    //     // devolve o erro apontado pelo backend
    //     throw new Error(text || res.statusText)
    // }
    // // tenta parsear JSON, se não devolve string
    // try { return text ? JSON.parse(text) : null }
    // catch { return text }

    try {
        const res = await fetch(`${BASE_URL}${path}`, opts);
        
        // 4. Se a sessão expirou ou o token é inválido (erros 401 ou 403),
        // força o utilizador a fazer login novamente.
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('authToken');
            window.location.href = '/login/login.html';
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        const text = await res.text();

        if (!res.ok) {
            // Tenta extrair uma mensagem de erro mais clara do backend.
            const errorData = text ? JSON.parse(text) : {};
            throw new Error(errorData.message || errorData.error || res.statusText);
        }

        // Se a resposta for vazia (ex: um DELETE bem-sucedido), retorna um objeto de sucesso.
        if (!text) {
            return { success: true };
        }
        
        // Retorna os dados da API em formato JSON.
        return JSON.parse(text);

    } catch (err) {
        console.error('Erro na chamada da API:', err);
        throw err; // Re-lança o erro para que a função que chamou o possa tratar.
    }
}