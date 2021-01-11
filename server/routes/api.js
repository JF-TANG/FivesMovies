const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'azerty',
  database: 'FivesMovies'
})

client.connect()

router.get('/me', (req,res)=> {
    if (typeof req.session.current_user === 'undefined') {
        res.status(200).json({ message: 'Pas connecté' })
    }
    else {
        res.status(200).json(req.session.current_user)
    }
}) 

router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  login(email, password)

  async function login (email, password){
    exist(email).then((result)=>{
      if(result.rowCount != 0){
        checkPassword(password, result.rows[0].password).then((validHash)=>{
          if (validHash===true) {
            if (req.session.id_user===result.rows[0].id_user){
              res.status(401).json({ message: "Vous êtes déjà connecté"})
            }
            else{
              req.session.current_user = {
                id_user : result.rows[0].id_user,
                username : result.rows[0].username,
                email : result.rows[0].email
              }
              res.status(200).json(req.session.current_user)
              //res.status(200).json({ message: "Vous êtes maintenant connecté"})
            }
          } else {
            res.json({ message: "Mot de passe incorrect"})
          }  
        })   
      }
      else{
        res.json({message : "L'email n'existe pas"})
      }
    });
  }

  async function exist (email) {
    var sql = "SELECT * FROM users WHERE email=$1"
    return await client.query({
      text: sql,
      values: [email]
    })
  }

  async function checkPassword(password, dbhash){
    return await bcrypt.compare(password, dbhash)
  }
})

router.post('/register', (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  
  exist(email).then((result)=>{
    if(result.rowCount != 0){
      res.status(400).json({ message: "Votre email est déjà utilisé"})
    }
    else{
      register(username, email, password).then(()=>{
        res.status(200).json({message : "Votre compte a bien été enregistré"})
      })
    }
  });

  async function exist (email) {
    var sql = "SELECT email FROM users WHERE email=$1"
    return await client.query({
      text: sql,
      values: [email]
    })
  }

  async function register(username, email, password){
    var hash = await bcrypt.hash(password, 10)

    //let options={year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', seconde:'numeric', timeZone:'UTC'  };
    //var currentDate=new Date().toLocaleString('en-US', options)

    var sqlInsert="INSERT INTO users (username, email, password) VALUES ($1, $2, $3)"

    await client.query({
      text: sqlInsert,
      values: [username, email, hash]
    })
  }
})

router.get('/recent_movies', (req, res) => {
  get_recent_movies().then((result)=>{
    res.status(200).json(result.rows)
  })

  async function get_recent_movies () {
    var sql = "select * from movies order by id_movie desc limit 5"
    return await client.query({
      text: sql,
    })
  }
})

router.get('/number_movies', (req, res)=>{
  get_number_movies().then((result)=>{
    res.status(200).json(result.rows[0].count)
  })

  async function get_number_movies() {
    var sql = "select count(*) from movies"
    return await client.query({
      text: sql,
    })
  }
})

router.get('/search_movies/:key_words', (req, res)=>{
  var key_words='%'+req.params.key_words+'%'

  get_search_movies(key_words).then((result)=>{
    res.status(200).json(result.rows)
  })

  async function get_search_movies(key_words) {
    var sql = "select * from movies where title ilike $1"
    return await client.query({
      text: sql,
      values: [key_words]
    })
  }
})

router.get('/get_movie_by_id/:movie_id', (req, res)=>{
  var movie_id=req.params.movie_id
  get_movies(movie_id).then((result)=>{
    res.status(200).json(result.rows)
  })

  async function get_movies(movie_id) {
    var sql = "select * from movies where id_movie = $1"
    return await client.query({
      text: sql,
      values: [movie_id]
    })
  }
})

router.get('/get_user_movies/:id_user', (req, res)=>{
  var id_user=req.params.id_user
  
  if (typeof req.session.current_user !== 'undefined'){
    if (req.session.current_user.id_user == id_user){
      get_user_movies(id_user).then((result)=>{
        res.status(200).json(result.rows)
      })
    }
    else {
      res.status(401).json({message : "Vous avez essayé de récuperer des films d'utilisateurs différent de celui connécté"})
    }
  }
  else{
    res.status(401).json({message : "Vous n'êtes pas connecté"})
  }

  async function get_user_movies(id_user) {
    var sql = "select * from movies where id_user=$1 order by id_movie desc"
    return await client.query({
      text: sql,
      values: [id_user]
    })
  }
})

router.post('/disconnect', (req, res)=>{
  req.session.destroy()
  res.status(200).json({message: "Vous êtes déconnecté"})
})

router.put('/movie/:id_movie', (req, res) => {
  const id_movie = req.params.id_movie
  const title = req.body.title
  const release_date = parseInt(req.body.release_date)
  const plot = req.body.plot
  const poster = req.body.poster
  const id_user = req.body.id_user

  if (typeof title !== 'string' || title === '' ||
      typeof release_date !=='number' || release_date <=999 ||
      typeof plot !== 'string' || plot === '' ||
      typeof poster !== 'string' || poster === '')
  {
    res.status(400).json({ message: 'Des champs sont vides ou incorrects' })
  }
  else{
    if (typeof req.session.current_user !== 'undefined'){
      if (req.session.current_user.id_user == id_user){
        edit_movie(title,release_date,plot,poster,id_movie).then((result)=>{
          res.status(200).json(result.rowCount)
        })
      }
      else {
        res.status(401).json({message : "Vous avez essayé de modifier un film avec un id d'utilisateur différent de celui connecté"})
      }
    }
    else{
      res.status(401).json({message : "Vous n'êtes pas connecté"})
    }
  }

  async function edit_movie(title,release_date,plot,poster,id_movie) {
    var sql = "UPDATE movies SET title = $1, release_date = $2, plot = $3, poster = $4 WHERE id_movie=$5"
    return await client.query({
      text: sql,
      values: [title, release_date, plot, poster, id_movie]
    })
  }
})
    
router.post('/notation', (req, res) => {
  const avis = req.body.Avis
  const note = req.body.Note
  const Id_film = req.body.Id_film
  const id_user = req.body.id_user
  exist(id_user,Id_film).then((result)=>{
    if(result.rowCount != 0){
      updateReview(id_user,Id_film,note,avis).then(()=>{
        res.status(200).json({ message: "Votre avis a bien été modifié"})
      })
    }
    else{
      newReview(id_user,Id_film,note,avis).then(()=>{
        res.status(200).json({message : "Votre avis a bien été enregistré"})
      })
    }
  })

  async function exist(idu,idm) {
    var sql = "SELECT * FROM reviews WHERE id_user=$1 AND id_movie=$2"
    return await client.query({
      text: sql,
      values: [idu,idm]
    })
  }

  async function newReview(idu, idm, note, avis) {
    var sqlInsert="INSERT INTO reviews (id_user, id_movie, rating, comment) VALUES ($1, $2, $3, $4)"
    await client.query({
      text: sqlInsert,
      values: [idu, idm, note, avis]
    })
  }

async function updateReview(idu, idm, note, avis){
  var sqlInsert="UPDATE reviews SET rating = $1, comment = $2 WHERE id_user = $3 AND id_movie = $4"
  await client.query({
    text: sqlInsert,
    values: [note, avis, idu, idm]
  })
}
})

router.post('/get_avis', (req, res) => {
  const Id_film = req.body.id_film
  getAvis(Id_film).then((result)=>{
        res.status(200).json(result.rows)
      })
  
  async function getAvis(idm) {
    var sql = "SELECT rating, comment, users.username FROM reviews JOIN users ON reviews.id_user=users.id_user WHERE reviews.id_movie=$1"
    return await client.query({
      text: sql,
      values: [idm]
    })
  }

})

router.post('/get_moyenne', (req, res) => {
  const id_film = req.body.id_film
  getMoyenne(id_film).then((result)=>{
        res.status(200).json(result.rows)
      })
  
  async function getMoyenne(idm) {
    var sql = "SELECT AVG(rating) FROM reviews WHERE id_movie=$1"
    return await client.query({
      text: sql,
      values: [idm]
    })
  }

})

router.delete('/movie/:id_movie/:id_user', (req, res) => {
  const id_user = req.params.id_user
  const id_movie = req.params.id_movie

  if (typeof req.session.current_user !== 'undefined'){
    if (req.session.current_user.id_user == id_user){
      delete_movie(id_movie).then((result)=>{
        res.status(200).json(result.rowCount)
      })
    }
    else {
      res.status(401).json({message : "Vous avez essayé de supprimer un film d'utilisateur différent de celui connecté"})
    }
  }
  else{
    res.status(401).json({message : "Vous n'êtes pas connecté"})
  }

  async function delete_movie(id_movie) {
    var sql = "delete from movies where id_movie = $1"
    return await client.query({
      text: sql,
      values: [id_movie]
    })
  }
})

router.post('/add_movie', (req, res) => {
  const title = req.body.title
  const release_date = parseInt(req.body.release_date)
  const plot = req.body.plot
  const poster = req.body.poster
  const id_user = req.body.id_user
  
  if (typeof title !== 'string' || title === '' ||
      typeof release_date !=='number' || release_date <=999 ||
      typeof plot !== 'string' || plot === '' ||
      typeof poster !== 'string' || poster === '')
  {
    res.status(400).json({ message: 'Des champs sont vides ou incorrectes' })
  }
  else{
    if (typeof req.session.current_user !== 'undefined'){
      if (req.session.current_user.id_user == id_user){
        add_movie(title,release_date,plot,poster,id_user).then((result)=>{
          res.status(200).json(result.rowCount)
        })
      }
      else {
        res.status(401).json({message : "Vous avez essayé d'ajouter un film avec un id d'utilisateur différent de celui connecté"})
      }
    }
    else{
      res.status(401).json({message : "Vous n'êtes pas connecté"})
    }
  }
  
  async function add_movie(title,release_date,plot,poster,id_user) {
    var sql = "INSERT INTO movies (title, release_date, plot, poster, id_user) VALUES ($1, $2, $3, $4, $5);"
    return await client.query({
      text: sql,
      values: [title, release_date, plot, poster, id_user]
    })
  } 
})
router.get('/get_user_reviews/:id_user', (req, res)=>{
  var id_user=req.params.id_user
  
  if (typeof req.session.current_user !== 'undefined'){
    if (req.session.current_user.id_user == id_user){
      get_user_reviews(id_user).then((result)=>{
        res.status(200).json(result.rows)
      })
    }
    else {
      res.status(401).json({message : "Vous avez essayé de récuperer des avis d'utilisateurs différent de celui connécté"})
    }
  }
  else{
    res.status(401).json({message : "Vous n'êtes pas connecté"})
  }

  async function get_user_reviews(id_user) {
    var sql = "select r.id_movie, r.rating, r.comment, m.title, m.release_date, m.plot, m.poster from reviews r inner join movies m on r.id_movie=m.id_movie where r.id_user=$1"
    return await client.query({
      text: sql,
      values: [id_user]
    })
  }
})

router.delete('/review/:id_movie/:id_user', (req, res) => {
  const id_user = req.params.id_user
  const id_movie = req.params.id_movie

  if (typeof req.session.current_user !== 'undefined'){
    if (req.session.current_user.id_user == id_user){
      delete_review(id_movie, id_user).then((result)=>{
        res.status(200).json(result.rowCount)
      })
    }
    else {
      res.status(401).json({message : "Vous avez essayé de supprimer un avis d'utilisateur différent de celui connecté"})
    }
  }
  else{
    res.status(401).json({message : "Vous n'êtes pas connecté"})
  }

  async function delete_review(id_movie, id_user) {
    var sql = "delete from reviews where id_movie = $1 and id_user=$2"
    return await client.query({
      text: sql,
      values: [id_movie, id_user]
    })
  }
})
module.exports = router