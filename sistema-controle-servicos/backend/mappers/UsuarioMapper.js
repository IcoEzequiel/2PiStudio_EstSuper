const UsuarioDTO = require('../DTOs/UsuarioDTO')

class UsuarioMapper {
    static toDTO(usuario){
        const usuarioData = usuario.get()
        return new UsuarioDTO(usuarioData,usuarioData.funcionario)
    }
}
module.exports = UsuarioMapper