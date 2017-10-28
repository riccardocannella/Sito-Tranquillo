// Definizione del modulo 'aggiuntaProdotti'
angular.module('settaggi', [
    'ui.router',
    'ngFileUpload'
]);

// Registra il componente 'aggiuntaProdotti' sul modulo 'aggiuntaProdotti'
angular.module('settaggi').component('settaggi', {
    templateUrl: 'layout/backend/settaggi/settaggi.template.html',
    controller: function(Upload, $http, $location, $window, $scope) {
        var settaggi = this;
        $scope.copertinaCaricata = -1;
        $scope.erroreCaricamento = 0;
        settaggi.caricaCopertina = function() {
            // validazione immagine da fare (come?)
            // intanto controllo se c'è
            if (settaggi.immagine) {
                Upload.imageDimensions(settaggi.immagine).then(function(dimensions) {
                    if (dimensions.width < 1280 || dimensions.width > 3840) {
                        $scope.copertinaCaricata = 0;
                        settaggi.immagine = null;
                    } else {
                        // l'immagine va bene, procedo
                        $http.delete('api/v1.0/copertina').then(function(res) {

                            Upload.upload({
                                url: 'api/v1.0/copertina',
                                data: { file: settaggi.immagine }
                            }).then(function(resp) {
                                $scope.copertinaCaricata = 1;
                                $scope.erroreCaricamento = 0;
                            }, function(error) {
                                $scope.erroreCaricamento = 1;
                                console.log('ERRORE: ' + error);
                            });
                        }, function(err) {
                            console.log('ERRORE: ' + err)
                        })
                    }
                });
            }
        };
    }
});