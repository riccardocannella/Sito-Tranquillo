var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');

// Carico i modelli del database
var modelloProdotto = require('./server/models/prodotto');
var modelloUtente = require('./server/models/utente');

var dbUrl = require('./server/config/db.js');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Istruisco il server su quale cartella usare come radice
var wwwRoot = __dirname + '/app/';
app.use(express.static(wwwRoot));

// Impostazioni per multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, wwwRoot + 'images/uploads/')
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        // qui sotto il codice per salvare correttamente il file
        // ci attacco un timestamp così non ci sono duplicati
        // lo split serve perché normalmente multer salverebbe senza estenzione
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
// istanza di multer con le opzioni appena specificate
var upload = multer({
    storage: storage
}).single('file');
// API per l'upload
app.post('/api/v1.0/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null, nomeFile: req.file.filename });
    });
});

// Creo una variabile per poter usare il db fuori dalla callback
var db;
// Se nell'ambiente c'è un URI specifico per mongo uso quello,
// altrimenti quello preso dal js in config
var MONGODB_URI = process.env.MONGODB_URI || dbUrl.urlRemoto;


//mongoose.Promise = Promise;

// Mi connetto al DB prima di iniziare a far girare l'app
mongoose.connect(MONGODB_URI, { useMongoClient: true }, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Salvo la variabile esterna db per usi fuori dalla callback
    db = database;
    console.log("Connessione al database riuscita");

    // importo le api per le operazioni nel db
    var routeProdotti = require('./server/routes/routeProdotti');
    routeProdotti(app, db);
    var routeUtenti = require('./server/routes/routeUtenti');
    routeUtenti(app, db);
    //app.use(app.router);
    app.use(function(req, res) {
        res.sendFile(__dirname + '/app/index.html');
    });

    // Inizializzo il server
    var server = app.listen(process.env.PORT || 8080, function() {
        var port = server.address().port;
        console.log('Server in ascolto sulla porta', port);
    });
});