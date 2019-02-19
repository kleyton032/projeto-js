//implementações de validação

/**
 * validações de valor válido ou inválido
 * validar se existe
 * validar espaços em brancos
 * pode-se implementar validação de password(carecteres especiais...)
 */

module.exports = app =>{

function existsOrError(value, msg){
    if(!value) throw msg
    if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
}

function notExistsError(value, msg){
    try {
        existsOrError(value, msg)
    } catch(msg) {
        return
    }
    throw msg
}

function equalsOrError(valueA, valueB, msg){
    if(valueA !== valueB) throw msg
}
//exportando as funções 
return {existsOrError, notExistsError, equalsOrError}
}