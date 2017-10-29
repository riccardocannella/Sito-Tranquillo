/*
UTILIZZO DEL MODULO:
var mailer = require('percorso/per/questoFile.js');
mailer.inviaEmail(nome, cognome, emailDestinatario, oggetto, corpoInHtml);

OPPURE

mailer.inviaEmail(opzioniEmail);

dove opzioniEmail è un oggetto JSON formato così:
{
    from: '"Nome Visualizzato" <mail@example.com>', // mail del mittente
    to: 'info@contoso.com', // email destinatario, eventualmente può essere una lista con elementi separati da virgole
    subject: 'Oggetto', // l'oggetto dell'email
    text: 'Ciao', // email solo testo
    html: '<h3>Ciao</h3>' // email HTML
    }

L'indirizzo email usato per l'invio nel primo caso è quello del gruppo dei developer (creato ad hoc per il progetto) , ovvero
mail.sitotranquillo@gmail.com
Eventualmente basta cambiare i settaggi nel transporter

Un futuro lavoro potrebbe essere quello di fare in modo che anche il
transporter sia settabile a piacimento dall'applicazione stessa

*/
'use strict';
const nodemailer = require('nodemailer');
var jsonfile = require('jsonfile')
var file = './server/utilities/mailSettings.json';

var username, password, hostname, emailPort, isSecure, transporter;

//var passwords = require('../config/passwords');

exports.leggiSettaggi = function() {
    var settaggi = jsonfile.readFileSync(file);
    if (settaggi === null) return null;
    // svuoto il vecchio transporter e lo ricreo
    transporter = null;
    transporter = nodemailer.createTransport({
        host: settaggi.host,
        port: settaggi.port,
        secure: settaggi.secure,
        auth: {
            user: settaggi.user,
            pass: settaggi.pass
        }
    });
    return settaggi;
}
exports.scriviSettaggi = function(obj) {
    // do per scontato che obj sia correttamente formato

    jsonfile.writeFileSync(file, obj);
}
exports.inviaEmail = function(opzioniEmail) {
    if (transporter === null || transporter === undefined) return console.log('Devi prima impostare i parametri email');
    transporter.sendMail(opzioniEmail, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    })
}
exports.inviaEmail = function(nome, cognome, emailDestinatario, oggetto, corpoInHtml) {
    /*
    FORMA JSON DELLE OPZIONI:
    {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // indirizzo mittente
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // lista riceventi
    subject: 'Hello ✔', // Intestazione
    text: 'Hello world ?', // email con testo normale
    html: '<b>Hello world ?</b>' // email con testo in html
    }
    */
    if (transporter === null || transporter === undefined) return console.log('Devi prima impostare i parametri email');
    var opzioniEmail = {
        from: '"Sito Tranquillo" <mail.sitotranquillo@gmail.com>',
        to: emailDestinatario,
        subject: oggetto,
        html: corpoInHtml
    }
    transporter.sendMail(opzioniEmail, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    })
}