const bycrypt = require('bcrypt-nodejs')

module.exports = app => {
    const {existOrError, notExistsError, equalsOrError} = app.api.validator

    //geração do hash para criação de senho no banco
    const encryptPassword = password =>{
        const salt = bycrypt.genSaltSync(10)
        return bycrypt.hashSync(password, salt)
    }

    //método para inserir um usuário no bando de dados(serve tbm para alteração - update)
    const save = async (res, req) =>{
        const user = {...req.body}
        //verificando de o id veio na requisição para passar para user.id
        if(req.params.id) user.id = req.params.id

        try {
            //usando método do validator.js criado 
            existOrError(user.name, "Nome não informado")
            existOrError(user.email, "E-mail não informado")
            existOrError(user.password, "Senha não informada")
            existOrError(user.confirmPassword, "Confirmação de senha inválida")
            equalsOrError(user.password, user.confirmPassword, 'Senha não conferem')

            const userFromDB = await app.db('users').where({email: user.email}).first()

            //verificando se o id está sendo setado para confirmação da validação
            if(user.id){
                notExistsError(userFromDB, 'Usuário já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }
        
        user.password = encryptPassword(user.password)
        //deletando a confirmação de senha - só para inserir a senha com o hash
        delete user.confirmPassword

        //verificando para o caso de alteração de user
        if(user.id){
            app.db('users')
            .update(user)
            .where({id: user.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }else{
            app.db('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }

    }

    const getAll = (req, res) =>{
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }

    return {save, getAll}

}