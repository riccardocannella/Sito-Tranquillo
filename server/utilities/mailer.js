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
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // USO L'ACCOUNT ACCADEMICO
    //port: 587,
    port:465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'mail.sitotranquillo@gmail.com',
        pass: 'sitotranquillo2017andreacorradomichelericcardo'
    }
});
exports.inviaEmail = function(opzioniEmail) {
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
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
    }
    */
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