// exportar funçoes comuns nas entidades, nesse caso envio e erros do json

export async function request(path, method = 'GET', body = null) {
    const opts = {method, headers: {'Content-Type': 'application/json'}}
    if (body) opts.body = JSON.stringify(body)

    const res = await fetch(path, opts)
    const text = await res.text()

    if (!res.ok) {
        // devolve o erro apontado pelo backend
        throw new Error(text || res.statusText)
    }
    // tenta parsear JSON, se não devolve string
    try { return text ? JSON.parse(text) : null}
    catch {return text}
}