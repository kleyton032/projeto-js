const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const {existsOrError, notExistsError, equalsOrError} = app.api.validator

    //geração do hash para criação de senho no banco
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    //método para inserir um usuário no bando de dados(serve tbm para alteração - update)
    const save = async (req, res) =>{
        const user = { ...req.body }
        //verificando de o id veio na requisição para passar para user.id
        if(req.params.id) user.id = req.params.id

        try {
            //usando método do validator.js criado 
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,'Senhas não conferem')

            const userFromDB = await app.db('users')
            .where({ email: user.email }).first()
            //verificando se o id está sendo setado para confirmação da validação
        if(!user.id) {
            notExistsError(userFromDB, 'Usuário já cadastrado')
        }
    } catch(msg) {
        return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)  //encriptografando a senha
       
        delete user.confirmPassword  //deletando a confirmação de senha - só para inserir a senha com o hash

        //verificando para o caso de alteração de user
        if(user.id) {
            app.db('users')
            .update(user)
            .where({ id: user.id })
            .whereNull('deletedAt')
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    //listando todos users
    const get = (req, res) => {
        app.db.select('id', 'name', 'email', 'admin').from('users')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    return {save, get}

}