const db = require('../model/queries')
const subscribe = require('../controller/subscription')

module.exports = function(app){

    app.get('/', (request, response) => {
        response.json({ info: 'HMS API' })
      }) 
      // app.get('/users', db.getUsers)
      // app.get('/users/:id', db.getUserById)
      // app.post('/users', db.createUser)
      // app.put('/users/:id', db.updateUser)
      // app.delete('/users/:id', db.deleteUser)
     // app.get('/subscription', db.episodeData)
      // app.post('/logincheck', db.checklogin)

}