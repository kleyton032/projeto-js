//implementações de validação

/**
 * validações de valor válido ou inválido
 * validar se existe
 * validar espaços em brancos
 * pode-se implementar validação de password(carecteres especiais...)
 */

module.exports = app =>{
function existsOrError(valeu, msg){
    if(!valeu) throw msg
    if(Array.isArray(valeu) && valeu.length ===0) throw msg
    if(typeof valeu === 'string' && !valeu.trim()) throw msg
}

function notExistsError(valeu, msg){
    try {
        existsOrError(valeu, msg)
    } catch (msg) {
        return
    }
    throw msg

}

function equalsOrError(valeuA, valeuB, msg){
    if(valeuA !== valeuB) throw msg
}
//exportando as funções 
return {existsOrError, notExistsError, equalsOrError}
}