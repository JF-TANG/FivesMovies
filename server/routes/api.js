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

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.articles = []
  }
}

/* router.get('/me', (req,res)=> {
    if (!req.session.current_user.id_user) {
        res.status(401).json({ message: 'Pas connecté' })
    } 
    else {
        res.json(!req.session.current_user.id_user)
    }
}) */

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
    /* req.session.recent_movies = {
      id_movie : result.rows[0].id_movie,
      title : result.rows[0].title,
      release_date : result.rows[0].release_date,
      plot : result.rows[0].plot,
      poster: result.rows[0].poster,
      id_user : result.rows[0].id_user
    }
    console.log(req.session.recent_movies) */
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

router.post


/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
  res.json(req.session.panier)
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (req, res) => {
  const id = parseInt(req.body.id)
  const qte = parseInt(req.body.qte)

  if (qte<=0 || id<=0) {
    res.status(400).json({ message: "Veuillez choisir un nombre d'article et un id valide (supérieur à 0)" })
    return
  }

  if (req.session.panier.articles.some(article => article.id === id)) {
    res.status(400).json({ message: "L'article existe déjà dans le panier" })
    return
  }

  const article = {
    id: id,
    qte: qte
  }
  req.session.panier.articles.push(article)

  //On renvoi le panier entier
  //res.json(req.session.panier)

  //On renvoi l'article à l'utilisateur
  res.json(req.session.panier.articles[req.session.panier.articles.length-1])
})

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay', (req, res) => {
  console.log(req.body.panier.articles)
  const panier =req.body.panier.articles
  if (!req.session.userId) {
    res.json({ connected : false, message: "Vous n'êtes pas connecté" })
  } 
  else{
    if(panier.length<1){
      res.json({ message: "Aucun article selectionné" })
    }
    else {
      //Elle deconnecte également l'utilisateur car "session" contient l'"userId" qui va être détruite
      req.session.destroy()
      res.status(200).json({ connected : true, message : "Merci pour votre achat"})
    }
  }
})

/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', (req, res) => {
  const id = parseInt(req.params.articleId)
  const qte = parseInt(req.body.qte)

  if (qte<=0) {
    res.status(400).json({ message: "Veuillez choisir un nombre d'article valide (supérieur à 0)" })
    return
  }

  if (!(req.session.panier.articles.some(article => article.id === id))) {
    res.status(400).json({ message: "L'article n'existe pas dans le panier" })
    return
  }
  
  req.session.panier.articles.find(article => article.id===id).qte=qte
  res.send()
})

/*
 * Cette route doit supprimer un article dans le panier
 */
router.delete('/panier/:articleId', (req, res) => {
  const id = parseInt(req.params.articleId)

  if (!(req.session.panier.articles.some(article => article.id === id))) {
    res.status(400).json({ message: "L'article n'existe pas dans le panier" })
    return
  }

  let index = req.session.panier.articles.findIndex(a => a.id === id)

  req.session.panier.articles.splice(index,1)
  res.send()
})

/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/articles', (req, res) => {
  res.json(articles)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const image = req.body.image
  const price = parseInt(req.body.price)

  // vérification de la validité des données d'entrée
  if (typeof name !== 'string' || name === '' ||
      typeof description !== 'string' || description === '' ||
      typeof image !== 'string' || image === '' ||
      isNaN(price) || price <= 0) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const article = {
    id: articles.length + 1,
    name: name,
    description: description,
    image: image,
    price: price
  }
  articles.push(article)
  // on envoie l'article ajouté à l'utilisateur
  res.json(article)
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
function parseArticle (req, res, next) {
  const articleId = parseInt(req.params.articleId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.articleId = articleId

  const article = articles.find(a => a.id === req.articleId)
  if (!article) {
    res.status(404).json({ message: 'article ' + articleId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.article = article
  next()
}

router.route('/article/:articleId')
  /**
   * Cette route envoie un article particulier
   */
  .get(parseArticle, (req, res) => {
    // req.article existe grâce au middleware parseArticle
    res.json(req.article)
  })

  /**
   * Cette route modifie un article.
   * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
   * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
   *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
   */
  .put(parseArticle, (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const price = parseInt(req.body.price)

    req.article.name = name
    req.article.description = description
    req.article.image = image
    req.article.price = price
    res.send()
  })

  .delete(parseArticle, (req, res) => {
    const index = articles.findIndex(a => a.id === req.articleId)

    articles.splice(index, 1) // remove the article from the array
    res.send()
  })

module.exports = router
