class UsuarioDTO {
    constructor(usuario, funcionario){
        this.id = usuario.id
        this.funcionario = funcionario
        this.papel = usuario.papel
        this.login = usuario.login
    }
}
module.exports = UsuarioDTO