// DTO de Usuario, usado para não enviar a senha para o frontEnd, junto com o objeto Funcionario
class UsuarioDTO {
    constructor(usuario, funcionario){
        this.id = usuario.id
        this.funcionario = funcionario
        this.papel = usuario.papel
        this.login = usuario.login
    }
}
module.exports = UsuarioDTO