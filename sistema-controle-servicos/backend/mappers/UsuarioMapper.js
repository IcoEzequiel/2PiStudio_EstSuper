const UsuarioDTO = require('../DTOs/UsuarioDTO')

// Mapper para transformar em DTO os objetos do service
class UsuarioMapper {
    static toDTO(usuario){
        const usuarioData = usuario.get()
        return new UsuarioDTO(usuarioData,usuarioData.funcionario)
    }
}
// Não vi necessidade de transformar de volta em objeto, já que o front retorna objetos e o server reconhece eles.
module.exports = UsuarioMapper