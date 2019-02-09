module.exports = app => {

    const save = (res, req) =>{
        app.send('user save')
    }
    return {save}

}