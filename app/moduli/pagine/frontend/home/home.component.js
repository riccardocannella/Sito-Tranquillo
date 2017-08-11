// Registra il componente 'home' sul modulo 'home
angular.module('home').component('home', {
    templateUrl: 'moduli/pagine/frontend/home/home.template.html',
    controller: function() {
        var listaProva = this;
        listaProva.lista = [{
                nome: 'Prodotto 1',
                descrizione: 'Un primo prodotto',
                prezzo: '1000'
            },
            {
                nome: 'Prodotto 2',
                descrizione: 'Un secondo prodotto',
                prezzo: '100'
            }
        ];
    }
});