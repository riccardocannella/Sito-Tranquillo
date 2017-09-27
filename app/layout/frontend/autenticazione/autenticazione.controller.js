var autenticazione = angular.module('autenticazione');

autenticazione.controller('autenticazioneCtrl',['$scope','$http','$window','$location',function($scope, $http, $window, $location){
    
    var autenticazioneCtrl = this;
    // Variabili per il login
    $scope.username = "";
    $scope.password = "";
    
    // Funzione per il login
    $scope.login = function(){
        if($scope.username == undefined || $scope.password == undefined 
            ||
           $scope.username == "" || $scope.password == "" 
        ){
            return; // Non fa niente se username e password sono vuoti.
        }

        $http({
            method: 'POST',
            url: 'http://localhost:8080/api/v1.0/utenti/login',
            data: {'username':$scope.username, 'password':$scope.password}
        }).then(function successCallback(response){ // Login con successo
                console.log(JSON.stringify(response.data));
                $window.localStorage.setItem("jwtToken", response.data.token);
                $window.localStorage.setItem("username", response.data.username);
                $location.path('/');
        }, function errorCallback(response){ // Login non avvenuto

                alert("Username o password errati");
                
                // Svuoto il campo password per facilitare i reinserimenti dovuti a typos nella password
                $scope.password = "";
        });

    };


    //Variabili per la registrazione
    $scope.inputNome = "";
    $scope.inputCognome = "";
    $scope.inputUsername = "";
    $scope.inputEmail = "";
    $scope.country = "Italy"; // Default a Italia
    $scope.province;
    $scope.comune;
    $scope.inputIndirizzo = "";
    $scope.inputTelefono = "";
    $scope.inputPassword = "";
    $scope.inputConfermaPassword = "";
    $scope.inputDomandaSegreta = "";
    $scope.inputRispostaSegreta = "";
    $scope.inputAccettoTermini = false;


    // Funzione per la registrazione
    $scope.logon = function(){
        // Se non c'è qualche campo necessario non esegue la registrazione
        if($scope.inputNome == ""|| $scope.inputNome == undefined
            || $scope.inputCognome == "" || $scope.inputCognome == undefined
            || $scope.inputUsername == "" || $scope.inputUsername == undefined
            || $scope.inputEmail == "" || $scope.inputEmail == undefined
            || $scope.country == "" || $scope.country == undefined
            || $scope.inputIndirizzo == "" || $scope.inputIndirizzo == undefined
            || $scope.inputTelefono == "" || $scope.inputTelefono == undefined
            || $scope.inputPassword == "" || $scope.inputPassword == undefined
            || $scope.inputConfermaPassword == "" || $scope.inputConfermaPassword == undefined
            || $scope.inputDomandaSegreta == "" || $scope.inputDomandaSegreta == undefined
            || $scope.inputRispostaSegreta == "" || $scope.inputRispostaSegreta == undefined
        ){
            return; // Non fa niente se quei campi sono vuoti.
        }
            
        
        // Se i termini non sono accettati non esegue la registrazione
        if($scope.inputAccettoTermini == false || $scope.inputAccettoTermini == undefined){
            alert("Eh volevi??? Accetta i termini");
            return; // Azione nulla
        }

        $http({
            method: 'POST',
            url: 'http://localhost:8080/api/v1.0/utenti/registrazione',
            data: {
                    'nome':$scope.inputNome,
                    'cognome':$scope.inputCognome,
                    'username':$scope.inputUsername,
                    'email':$scope.inputEmail,
                    'stato':$scope.country,
                    'provincia':$scope.province,
                    'comune':$scope.comune,
                    'indirizzo':$scope.inputIndirizzo,
                    'telefono':$scope.inputTelefono,
                    'password':$scope.inputPassword,
                    'domanda_segreta':$scope.inputDomandaSegreta,
                    'risposta_segreta':$scope.inputRispostaSegreta
                }
        }).then(function successCallback(response){ // Login con successo
                alert("Registrazione avvenuta con successo " + $scope.inputNome + " " + $scope.inputCognome + " \n Esegui il login!");
                $scope.username = $scope.inputUsername;

        }, function errorCallback(response){ // Login non avvenuto

                alert("Errore nella registrazione");
        });

    }









    /*
        In futuro diventa qualcosa simile a 

    $http.get('countries.json').success(function(data) {
        autenticazione.countries = data;
    });

    $http.get('provinces.json').success(function(data) {
        autenticazione.provinces = data;
    });
    */
    autenticazioneCtrl.countries = {
        "name": [
            "Afghanistan",
            "Albania",
            "Algeria",
            "American Samoa",
            "Andorra",
            "Angola",
            "Anguilla",
            "Antarctica",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia",
            "Aruba",
            "Australia",
            "Austria",
            "Azerbaijan",
            "Bahamas",
            "Bahrain",
            "Bangladesh",
            "Barbados",
            "Belarus",
            "Belgium",
            "Belize",
            "Benin",
            "Bermuda",
            "Bhutan",
            "Bolivia",
            "Bosnia and Herzegovina",
            "Botswana",
            "Bouvet Island",
            "Brazil",
            "British Indian Ocean Territory",
            "British Virgin Islands",
            "Brunei",
            "Bulgaria",
            "Burkina Faso",
            "Burundi",
            "Cambodia",
            "Cameroon",
            "Canada",
            "Cape Verde",
            "Cayman Islands",
            "Central African Republic",
            "Chad",
            "Chile",
            "China",
            "Christmas Island",
            "Cocos (Keeling) Islands",
            "Colombia",
            "Comoros",
            "Cook Islands",
            "Costa Rica",
            "Croatia",
            "Cuba",
            "Curaçao",
            "Cyprus",
            "Czechia",
            "DR Congo",
            "Denmark",
            "Djibouti",
            "Dominica",
            "Dominican Republic",
            "Ecuador",
            "Egypt",
            "El Salvador",
            "Equatorial Guinea",
            "Eritrea",
            "Estonia",
            "Ethiopia",
            "Falkland Islands",
            "Faroe Islands",
            "Fiji",
            "Finland",
            "France",
            "French Guiana",
            "French Polynesia",
            "French Southern and Antarctic Lands",
            "Gabon",
            "Gambia",
            "Georgia",
            "Germany",
            "Ghana",
            "Gibraltar",
            "Greece",
            "Greenland",
            "Grenada",
            "Guadeloupe",
            "Guam",
            "Guatemala",
            "Guernsey",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Heard Island and McDonald Islands",
            "Honduras",
            "Hong Kong",
            "Hungary",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Ireland",
            "Isle of Man",
            "Israel",
            "Italy",
            "Ivory Coast",
            "Jamaica",
            "Japan",
            "Jersey",
            "Jordan",
            "Kazakhstan",
            "Kenya",
            "Kiribati",
            "Kosovo",
            "Kuwait",
            "Kyrgyzstan",
            "Laos",
            "Latvia",
            "Lebanon",
            "Lesotho",
            "Liberia",
            "Libya",
            "Liechtenstein",
            "Lithuania",
            "Luxembourg",
            "Macau",
            "Macedonia",
            "Madagascar",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "Marshall Islands",
            "Martinique",
            "Mauritania",
            "Mauritius",
            "Mayotte",
            "Mexico",
            "Micronesia",
            "Moldova",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Montserrat",
            "Morocco",
            "Mozambique",
            "Myanmar",
            "Namibia",
            "Nauru",
            "Nepal",
            "Netherlands",
            "New Caledonia",
            "New Zealand",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "Niue",
            "Norfolk Island",
            "North Korea",
            "Northern Mariana Islands",
            "Norway",
            "Oman",
            "Pakistan",
            "Palau",
            "Palestine",
            "Panama",
            "Papua New Guinea",
            "Paraguay",
            "Peru",
            "Philippines",
            "Pitcairn Islands",
            "Poland",
            "Portugal",
            "Puerto Rico",
            "Qatar",
            "Republic of the Congo",
            "Romania",
            "Russia",
            "Rwanda",
            "Réunion",
            "Saint Barthélemy",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Martin",
            "Saint Pierre and Miquelon",
            "Saint Vincent and the Grenadines",
            "Samoa",
            "San Marino",
            "Saudi Arabia",
            "Senegal",
            "Serbia",
            "Seychelles",
            "Sierra Leone",
            "Singapore",
            "Sint Maarten",
            "Slovakia",
            "Slovenia",
            "Solomon Islands",
            "Somalia",
            "South Africa",
            "South Georgia",
            "South Korea",
            "South Sudan",
            "Spain",
            "Sri Lanka",
            "Sudan",
            "Suriname",
            "Svalbard and Jan Mayen",
            "Swaziland",
            "Sweden",
            "Switzerland",
            "Syria",
            "São Tomé and Príncipe",
            "Taiwan",
            "Tajikistan",
            "Tanzania",
            "Thailand",
            "Timor-Leste",
            "Togo",
            "Tokelau",
            "Tonga",
            "Trinidad and Tobago",
            "Tunisia",
            "Turkey",
            "Turkmenistan",
            "Turks and Caicos Islands",
            "Tuvalu",
            "Uganda",
            "Ukraine",
            "United Arab Emirates",
            "United Kingdom",
            "United States",
            "United States Minor Outlying Islands",
            "United States Virgin Islands",
            "Uruguay",
            "Uzbekistan",
            "Vanuatu",
            "Vatican City",
            "Venezuela",
            "Vietnam",
            "Wallis and Futuna",
            "Western Sahara",
            "Yemen",
            "Zambia",
            "Zimbabwe",
            "Åland Islands"
        ]
    };


    autenticazioneCtrl.provinces = {
        "name": [
            "Agrigento",
            "Alessandria",
            "Ancona",
            "Arezzo",
            "Ascoli Piceno",
            "Asti",
            "Avellino",
            "Bari",
            "Barletta-Andria-Trani",
            "Belluno",
            "Benevento",
            "Bergamo",
            "Biella",
            "Bologna",
            "Bolzano/Bozen",
            "Brescia",
            "Brindisi",
            "Cagliari",
            "Caltanissetta",
            "Campobasso",
            "Carbonia-Iglesias",
            "Caserta",
            "Catania",
            "Catanzaro",
            "Chieti",
            "Como",
            "Cosenza",
            "Cremona",
            "Crotone",
            "Cuneo",
            "Enna",
            "Fermo",
            "Ferrara",
            "Firenze",
            "Foggia",
            "Forlì-Cesena",
            "Frosinone",
            "Genova",
            "Gorizia",
            "Grosseto",
            "Imperia",
            "Isernia",
            "L'Aquila",
            "La Spezia",
            "Latina",
            "Lecce",
            "Lecco",
            "Livorno",
            "Lodi",
            "Lucca",
            "Macerata",
            "Mantova",
            "Massa-Carrara",
            "Matera",
            "Medio Campidano",
            "Messina",
            "Milano",
            "Modena",
            "Monza e della Brianza",
            "Napoli",
            "Novara",
            "Nuoro",
            "Ogliastra",
            "Olbia-Tempio",
            "Oristano",
            "Padova",
            "Palermo",
            "Parma",
            "Pavia",
            "Perugia",
            "Pesaro e Urbino",
            "Pescara",
            "Piacenza",
            "Pisa",
            "Pistoia",
            "Pordenone",
            "Potenza",
            "Prato",
            "Ragusa",
            "Ravenna",
            "Reggio di Calabria",
            "Reggio nell'Emilia",
            "Rieti",
            "Rimini",
            "Roma",
            "Rovigo",
            "Salerno",
            "Sassari",
            "Savona",
            "Siena",
            "Siracusa",
            "Sondrio",
            "Taranto",
            "Teramo",
            "Terni",
            "Torino",
            "Trapani",
            "Trento",
            "Treviso",
            "Trieste",
            "Udine",
            "Valle d'Aosta/Vallée d'Aoste",
            "Varese",
            "Venezia",
            "Verbano-Cusio-Ossola",
            "Vercelli",
            "Verona",
            "Vibo Valentia",
            "Vicenza",
            "Viterbo"
        ]
    };
}]);
