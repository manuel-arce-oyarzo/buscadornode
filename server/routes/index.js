const storage = require('../storage'),
      path = require('path')

const routes = (app) => {
    
    app.get('/search', (req, res) => {
        storage.getDataAll()
            .then((data) => {
                res.json({ "error": false, "datos": data })
            })
            .catch((err) => {
                res.json({ "error": true, "datos": err })
            })
    }) 
    app.get('/filteroptions', (req, res) => {
        storage.getDataAll()
            .then((data) => {
                let ciudades = []
                let tipos = []
                data.forEach((key, idx) => {
                    if (ciudades.indexOf(key.Ciudad) < 0) {
                        ciudades.push(key.Ciudad)
                    }
                    if (tipos.indexOf(key.Tipo) < 0) {
                        tipos.push(key.Tipo)
                    }
                })
                res.json({ "error": false, "ciudades": ciudades, "tipos": tipos })
            })
            .catch((err) => {
                res.json({ "error": true, "err": err })
            })
    })
    
    app.get('/:ciudadId/:tipoId/:desdeVal/:hastaVal', (req, res) => {
        let params = req.params
        let datos = []
        storage.getDataAll()
            .then(data => {
                var aux = []
                var arr2 = []
                var datos = []

                aux = data.slice()

                if (params.ciudadId != "todas") {
                    aux.forEach((key, idx) => {
                        if (key.Ciudad == params.ciudadId) {
                            arr2.push(key)
                        }
                    })
                } else {
                    arr2 = aux.slice()
                }

                aux = []
                aux = arr2.slice()
                arr2 = []

                if (params.tipoId != "todos") {
                    aux.forEach((key, idx) => {
                        if (key.Tipo == params.tipoId) { arr2.push(key) }
                    })
                } else {
                    arr2 = aux.slice()
                }

                arr2.forEach((key, idx) => {
                    let valor = parseInt(key.Precio.replace("$", "").replace(",", ""))
                    if (valor >= parseInt(params.desdeVal) && valor <= parseInt(params.hastaVal)) {
                        datos.push(key)
                    }
                })

                res.status(200).json({ datos, params })
            })
            .catch((err) => {
                res.json({ "error": true, "err": err })
            })
    })
}

module.exports = routes
