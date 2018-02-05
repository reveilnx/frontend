webpackJsonp([5],{

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComptePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_rest_rest__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(33);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*import { Storage } from '@ionic/storage';*/



var ComptePage = (function () {
    // data upload documents
    /*private documentsUploaded;*/
    /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    /* //////////////////////////////////////////// CONSTRUCTOR ///////////////////////////////////////////////////// */
    /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    function ComptePage(navCtrl, rest, formBuilder, navParams /*,
        private storage       : Storage*/) {
        this.navCtrl = navCtrl;
        this.rest = rest;
        this.formBuilder = formBuilder;
        this.navParams = navParams; /*,
        private storage       : Storage*/
        this.submitAttempt = false;
        // check if user is already connected
        if (this.rest.dataClient == undefined)
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
        else
            this.dataClientLocal = this.rest.dataClient;
        // init Compte Form validation
        this.compteForm = this.formBuilder.group({
            //RIBfrance: 	    ['', Validators.required],
            IBANfrance: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(15), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(34), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9]*$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            BICfrance: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(8), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(11), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9]*$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
        });
    }
    ComptePage.prototype.ionViewDidLoad = function () {
    };
    /* ///////////////////////////////////////////////////////////////////////////////////////*/
    /* /////////////////////////////////////////////////////////////////////////////////////// IMAGE UPLOAD AND TRANSFER */
    /* ///////////////////////////////////////////////////////////////////////////////////////*/
    // verify iban
    ComptePage.prototype.validIBAN = function (input) {
        var CODE_LENGTHS = {
            AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
            CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
            FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
            HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
            LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
            MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
            RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
        };
        var iban = input.toUpperCase().replace(/[^A-Z0-9]/g, ''), code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), digits;
        if (!code || iban.length !== CODE_LENGTHS[code[1]])
            return false;
        digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
            return letter.charCodeAt(0) - 55;
        });
        return this.mod97(digits);
    };
    ComptePage.prototype.mod97 = function (string) {
        var checksum = string.slice(0, 2), fragment;
        for (var offset = 2; offset < string.length; offset += 7) {
            fragment = checksum + string.substring(offset, offset + 7);
            checksum = parseInt(fragment, 10) % 97;
        }
        return checksum;
    };
    /* ///////////////////////////////////////////////////////////////////////////////////////*/
    /* ///////////////////////////////////////////////////////////////////////////////////////// SUBMIT MODIFICATIONS */
    /* ///////////////////////////////////////////////////////////////////////////////////////*/
    ComptePage.prototype.uploadUser = function () {
        var _this = this;
        this.submitAttempt = true;
        if (!this.compteForm.valid) {
            this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incomplets ou incorrects");
        }
        else {
            var isValidIBAN = this.validIBAN(this.compteForm.controls.IBANfrance.value);
            if (isValidIBAN == 1) {
                // first upload the documents
                //this.transferDoc();
                // then transfer updated client 
                var url = this.rest.urlServer + "/updateUser.php";
                var urlSearchParams = new URLSearchParams();
                urlSearchParams.append('id', this.dataClientLocal.id);
                urlSearchParams.append('wallet', this.dataClientLocal.telephone);
                urlSearchParams.append('nom', this.dataClientLocal.nom);
                urlSearchParams.append('prenom', this.dataClientLocal.prenom);
                urlSearchParams.append('IBANfrance', this.compteForm.controls.IBANfrance.value);
                urlSearchParams.append('BICfrance', this.compteForm.controls.BICfrance.value);
                var body = urlSearchParams.toString();
                // send data
                this.rest.post(url, body, true)
                    .then(function (value) {
                    if (value['success'] != undefined) {
                        _this.dataClientLocal.IBANfrance = _this.compteForm.controls.IBANfrance.value;
                        _this.dataClientLocal.BICfrance = _this.compteForm.controls.BICfrance.value;
                        _this.rest.dataClient.IBANfrance = _this.compteForm.controls.IBANfrance.value;
                        _this.rest.dataClient.BICfrance = _this.compteForm.controls.BICfrance.value;
                        _this.rest.presentToast("Modification effectuées");
                    }
                })
                    .catch(function (err) {
                    _this.rest.showAlert("Erreur Serveur : ", err);
                });
            }
            else
                this.rest.showAlert("Erreur Saisie", "Le RIB renseigné est invalide");
        }
    };
    ComptePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-compte',template:/*ion-inline-start:"/home/nico/Bureau/ionic/NXVision/src/pages/compte/compte.html"*/'<ion-header>\n  <ion-navbar color="secondary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Gérer mon compte</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content id="compteBody" >\n\n	<section class="contentApp">\n\n		<form [formGroup]="compteForm" >\n\n			<!-- INOFS PERSO -->\n			<article>\n				<ion-card class="headCard">\n					<ion-card-header>Informations Personnelles</ion-card-header>\n				</ion-card>\n\n				<ion-card class="standartCard">\n					<ion-card-content><span>{{ dataClientLocal.nom }}</span>Nom :</ion-card-content>\n				</ion-card>\n				<ion-card class="standartCard">\n					<ion-card-header><span>{{ dataClientLocal.prenom }}</span>Prénom :</ion-card-header>\n				</ion-card>\n				<ion-card class="standartCard">\n					<ion-card-header><span>+ {{ dataClientLocal.telephone }}</span>Téléphone :</ion-card-header>\n				</ion-card>\n				<ion-card class="standartCard">\n					<ion-card-header><span>{{ dataClientLocal.email }}</span>Email :</ion-card-header>\n				</ion-card>\n			</article>\n\n\n\n			<!-- DOCUMENTS D\'IDENTITE -->\n			<!--<article>\n				<ion-card class="headCard">\n					<ion-card-header>Documents d\'identité</ion-card-header>\n				</ion-card>\n\n				<ion-card showWhen="core" [class.invalid]="!compteForm.controls.photocopieID.valid && (compteForm.controls.photocopieID.dirty || submitAttempt)">\n					<ion-item >\n					<ion-label>Carte d\'identité : </ion-label>\n					<ion-input type="file" name="photocopieID" formControlName="photocopieID"  ></ion-input>\n					</ion-item>\n				</ion-card>\n				<button showWhen="android, ios, windows" ion-button icon-left color="secondary" outline (click)="chargeImg(photocopieID)" class="uploadBtn" [class.invalid]="!compteForm.controls.photocopieID.valid && (compteForm.controls.photocopieID.dirty || submitAttempt)"><ion-icon name="camera"></ion-icon>Carte d\'identité</button>-\n				<ion-card id="dateExpi" [class.invalid]="!compteForm.controls.expirationID.valid && (compteForm.controls.expirationID.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>Date d\'expiration ID : </ion-label>\n					<ion-input type="text" name="expirationID" placeholder="DD/MM/AAAA" formControlName="expirationID" ></ion-input>\n					</ion-item>\n				</ion-card>\n				<ion-card [class.invalid]="!compteForm.controls.justifDomicile.valid && (compteForm.controls.justifDomicile.dirty || submitAttempt)" >\n					<ion-item showWhen="core">\n					<ion-label>Justif domicile : </ion-label>\n					<ion-input type="file" name="justifDomicile" formControlName="justifDomicile" ></ion-input>\n					</ion-item>\n				</ion-card>\n				<button showWhen="android, ios, windows" ion-button icon-left color="secondary" outline (click)="chargeImg(justifDomicile)" class="uploadBtn" [class.invalid]="!compteForm.controls.justifDomicile.valid && (compteForm.controls.justifDomicile.dirty || submitAttempt)"><ion-icon name="camera"></ion-icon>Justif. Domicile</button>\n\n			</article>-->\n			\n\n\n			<!-- INOFS PERSO -->\n			<article>\n				<ion-card class="headCard">\n					<ion-card-header>Coordonnées Bancaires</ion-card-header>\n				</ion-card>\n\n				<!-- compte FR -->\n				<ion-card class="titleCard">\n						<ion-card-header><img class="imgCmpt" src="assets/images/frenchFlag.png" />Compte français</ion-card-header>\n				</ion-card>\n \n				<!--<ion-card showWhen="core" [class.invalid]="!compteForm.controls.RIBfrance.valid && (compteForm.controls.RIBfrance.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>RIB : </ion-label>\n					<ion-input type="file" name="RIBfrance" formControlName="RIBfrance" ></ion-input>\n					</ion-item>\n				</ion-card>\n				<button ion-button showWhen="android, ios, windows" icon-left color="secondary" outline (click)="chargeImg(RIBfrance)" class="uploadBtn" [class.invalid]="!compteForm.controls.RIBfrance.valid && (compteForm.controls.RIBfrance.dirty || submitAttempt)"><ion-icon name="camera"></ion-icon>RIB</button>-->\n				<ion-card formControlName="IBANfrance" [class.invalid]="!compteForm.controls.IBANfrance.valid && (compteForm.controls.IBANfrance.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>IBAN : </ion-label>\n					<ion-input type="text" name="IBANfrance" value="{{ dataClientLocal.IBANfrance }}" ></ion-input>\n					</ion-item>\n				</ion-card>\n				<ion-card  [class.invalid]="!compteForm.controls.BICfrance.valid && (compteForm.controls.BICfrance.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>BIC : </ion-label>\n					<ion-input type="text" name="BICfrance" value="{{ dataClientLocal.BICfrance }}" formControlName="BICfrance"></ion-input>\n					</ion-item>\n				</ion-card>\n				\n				<!-- compte AFR -->\n				<!--<ion-card class="titleCard">\n					<ion-card-header><img class="imgCmpt" src="assets/images/africanFlag.png" /> Compte africain</ion-card-header>\n				</ion-card>\n\n				<ion-card showWhen="core" [class.invalid]="!compteForm.controls.RIBafrique.valid && (compteForm.controls.RIBafrique.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>RIB : </ion-label>\n					<ion-input type="file" name="RIBafrique" formControlName="RIBafrique" ></ion-input>\n					</ion-item>\n				</ion-card>\n				<button ion-button showWhen="android, ios, windows" icon-left color="secondary" outline (click)="chargeImg(RIBafrique)" class="uploadBtn" [class.invalid]="!compteForm.controls.RIBafrique.valid && (compteForm.controls.RIBafrique.dirty || submitAttempt)"><ion-icon name="camera"></ion-icon>RIB</button>\n				<ion-card [class.invalid]="!compteForm.controls.IBANafrique.valid && (compteForm.controls.IBANafrique.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>IBAN : </ion-label>\n					<ion-input type="text" name="IBANafrique" value="FR76 7865 4548 5656 6564 098" formControlName="IBANafrique" ></ion-input>\n					</ion-item>\n				</ion-card>\n				<ion-card [class.invalid]="!compteForm.controls.BICafrique.valid && (compteForm.controls.BICafrique.dirty || submitAttempt)">\n					<ion-item>\n					<ion-label>BIC : </ion-label>\n					<ion-input type="text" name="BICafrique" value="BNPAFRPP751" formControlName="BICafrique" ></ion-input>\n					</ion-item>\n				</ion-card>-->\n			</article>\n		\n\n		<button ion-button block color="secondary" id="submitProfil" (click)="uploadUser()">Modifier</button>	\n		</form>\n		\n		\n\n	</section> \n\n\n\n</ion-content>\n\n\n\n<ion-footer class="footer">\n	<ion-toolbar >\n		<div class="foot"><img src="assets/images/walletPNG.png" /><h2>Solde actuel : {{ dataClientLocal.solde }} €</h2></div>\n	</ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/home/nico/Bureau/ionic/NXVision/src/pages/compte/compte.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1__providers_rest_rest__["a" /* RestProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavParams */] /*,
            private storage       : Storage*/])
    ], ComptePage);
    return ComptePage;
}());

//# sourceMappingURL=compte.js.map

/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__validators_mdp__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_rest_rest__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jquery__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_tel_input__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_tel_input___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_intl_tel_input__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var RegisterPage = (function () {
    function RegisterPage(navCtrl, rest, formBuilder, navParams) {
        this.navCtrl = navCtrl;
        this.rest = rest;
        this.formBuilder = formBuilder;
        this.navParams = navParams;
        this.submitAttempt = false;
        this.displayInfoAsso = "N";
        this.assoMember = "N";
        this.getStateISO();
        this.getAssoNumbers();
        // REGISTER FORM BUILDER
        this.registerForm = this.formBuilder.group({
            nom: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(2), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z- ]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            prenom: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(2), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z- ]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__validators_mdp__["a" /* MdpValidator */].missmatchNames])],
            civilite: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            mdp1: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(8), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            mdp2: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(8), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__validators_mdp__["a" /* MdpValidator */].passwordsMatch])],
            typeClient: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            telephone: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(12), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[0-9]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            email: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(6), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9-.]+[.]+[a-zA-Z]{2,4}$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            dateNaissance: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            lieuNaissance: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9 -]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            nationalite: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(3), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            pays: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(3), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[A-Z]{3}$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            rue: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9 -]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            CP: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(5), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            ville: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z -]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            codeAssoClient: [''],
            dateAdhesionAsso: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')])],
            nomAsso: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9 -_]+$')])],
            SIREN: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(14), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9]+$')])],
            site: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50)])],
            assoDescription: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50)])],
            rueAsso: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9 -]+$')])],
            CPAsso: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9]+$')])],
            villeAsso: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(40), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z -_]+$')])],
            paysAsso: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(3), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[A-Z]{3}$')])]
        });
    }
    RegisterPage.prototype.ionViewDidLoad = function () {
        __WEBPACK_IMPORTED_MODULE_5_jquery__("#telephone2").intlTelInput({
            // allowDropdown: false,
            // autoHideDialCode: false,
            // autoPlaceholder: "aggressive",
            dropdownContainer: "body",
            // excludeCountries: ["us"],
            // formatOnDisplay: true,
            // geoIpLookup: function(callback) {
            //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
            //     var countryCode = (resp && resp.country) ? resp.country : "";
            //     callback(countryCode);
            //   });
            // },
            // hiddenInput: "full_number",
            initialCountry: 'fr',
            // nationalMode: false,
            // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
            // placeholderNumberType: "MOBILE",
            preferredCountries: 'fr',
            // separateDialCode: true,
            utilsScript: "../../assets/js/utils.js"
        });
    };
    /*/////////////////////////////////////////////////////////////  */
    /*////////////////////// GET DATA//////////////////////////////  */
    /*/////////////////////////////////////////////////////////////  */
    RegisterPage.prototype.getStateISO = function () {
        var _this = this;
        // charge State file text
        this.rest.get('countries.json', false)
            .then(function (value) {
            _this.stateISO = value;
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur", err);
        });
    };
    RegisterPage.prototype.getAssoNumbers = function () {
        var _this = this;
        // charge Asso numbers
        this.rest.get(this.rest.urlServer + "/getAssoNumbers.php", false)
            .then(function (value) {
            _this.assoNumbers = value;
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur", err);
        });
    };
    /*/////////////////////////////////////////////////////////////  */
    /*////////////////////// CHANGE DISPLAY//////////////////////////////  */
    /*/////////////////////////////////////////////////////////////  */
    RegisterPage.prototype.changeDisplayAsso = function () {
        if ((this.registerForm.controls.typeClient.value == "E") || (this.registerForm.controls.typeClient.value == "A"))
            this.displayInfoAsso = "O";
        else
            this.displayInfoAsso = "N";
    };
    RegisterPage.prototype.displayMembreAsso = function (i) {
        if (i == "O")
            this.assoMember = "O";
        if (i == "N")
            this.assoMember = "N";
    };
    /* ///////////////////////////////////////////////////////////////////////////////////////*/
    /* /////////////////////////////////////////////////////////////////////////////////////// SUBMIT */
    /* ///////////////////////////////////////////////////////////////////////////////////////*/
    /////////////////////////////////////////////
    // --------- VALID, PRE POST ---------------
    /////////////////////////////////////////////
    // méthode pour ajouter le dial code international et minuscule email
    RegisterPage.prototype.formatVal = function () {
        // on rajoute l'identifiant international au téléphone
        var dialCode = __WEBPACK_IMPORTED_MODULE_5_jquery__("#telephone2").intlTelInput("getSelectedCountryData").dialCode;
        this.registerForm.controls.telephone.setValue(dialCode + this.registerForm.controls.telephone.value);
        // on transfoprme l'email, minuscule
        this.registerForm.controls.email.setValue(this.registerForm.controls.email.value.toLowerCase());
    };
    RegisterPage.prototype.validAsso = function () {
        var nomAsso = this.registerForm.controls.nomAsso.value;
        var SIREN = this.registerForm.controls.SIREN.value;
        var site = this.registerForm.controls.site.value;
        var description = this.registerForm.controls.assoDescription.value;
        var paysAsso = this.registerForm.controls.paysAsso.value;
        var villeAsso = this.registerForm.controls.villeAsso.value;
        var rueAsso = this.registerForm.controls.rueAsso.value;
        var CPAsso = this.registerForm.controls.CPAsso.value;
        var typeClient = this.registerForm.controls.typeClient.value;
        // INVALIDE
        if (!this.registerForm.valid || ((typeClient == "A" || typeClient == "E") && (nomAsso == "" || SIREN == "" || site == "" || description == "" || paysAsso == "" || villeAsso == "" || rueAsso == "" || CPAsso == ""))) {
            this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incomplets ou incorrects");
            return false;
        }
        else {
            return true;
        }
    };
    /////////////////////////////////////////////
    // ----------- VALID register ---------------
    /////////////////////////////////////////////
    RegisterPage.prototype.validRegister = function () {
        var _this = this;
        this.submitAttempt = true;
        if (!this.registerForm.valid) {
            this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incomplets ou incorrects");
        }
        else {
            if (this.validAsso()) {
                // vérifie si l'utilisateur existe déjà
                // 1. téléphone
                var dialCode = __WEBPACK_IMPORTED_MODULE_5_jquery__("#telephone2").intlTelInput("getSelectedCountryData").dialCode;
                var telephone = dialCode + this.registerForm.controls.telephone.value;
                this.rest.get(this.rest.urlServer + "/checkUser.php?key=telephone&data=" + telephone, false)
                    .then(function (value) {
                    if (value[0] != undefined) {
                        _this.rest.showAlert("L'utilisateur existe déjà", "Un utilisateur est déjà inscris avec ce téléphone");
                    }
                    else {
                        // 2. email
                        _this.rest.get(_this.rest.urlServer + "/checkUser.php?key=email&data=" + _this.registerForm.controls.email.value.toLowerCase(), false)
                            .then(function (value) {
                            if (value[0] != undefined) {
                                _this.rest.showAlert("L'utilisateur existe déjà", "Un utilisateur est déjà inscris avec cet email");
                            }
                            else {
                                // VALIDE
                                _this.formatVal();
                                _this.registerUser();
                            }
                        })
                            .catch(function (err) {
                            _this.rest.showAlert("Erreur Serveur", err);
                        });
                    }
                })
                    .catch(function (err) {
                    _this.rest.showAlert("Erreur Serveur", err);
                });
            }
        }
    };
    /////////////////////////////////////////////
    // ----------- REGISTER USER ---------------
    /////////////////////////////////////////////
    RegisterPage.prototype.registerUser = function () {
        var _this = this;
        var url = this.rest.urlServer + "/RegisterWallet.php";
        /*let	passwd = md5(this.registerForm.controls.mdp1.value);*/
        var params = new Array();
        //let urlSearchParams = new URLSearchParams();
        params.push('nom', this.registerForm.controls.nom.value);
        params.push('prenom', this.registerForm.controls.prenom.value);
        params.push('mdp', this.registerForm.controls.mdp1.value);
        params.push('telephone', this.registerForm.controls.telephone.value);
        params.push('civilite', this.registerForm.controls.civilite.value);
        params.push('email', this.registerForm.controls.email.value);
        params.push('dateNaissance', this.registerForm.controls.dateNaissance.value);
        params.push('lieuNaissance', this.registerForm.controls.lieuNaissance.value);
        params.push('nationalite', this.registerForm.controls.nationalite.value);
        params.push('typeClient', this.registerForm.controls.typeClient.value);
        params.push('pays', this.registerForm.controls.pays.value);
        params.push('rue', this.registerForm.controls.rue.value);
        params.push('CP', this.registerForm.controls.CP.value);
        params.push('ville', this.registerForm.controls.ville.value);
        params.push('codeAssoClient', this.registerForm.controls.codeAssoClient.value);
        params.push('dateAdhesionAsso', this.registerForm.controls.dateAdhesionAsso.value);
        params.push('nomAsso', this.registerForm.controls.nomAsso.value);
        params.push('SIREN', this.registerForm.controls.SIREN.value);
        params.push('rueAsso', this.registerForm.controls.rueAsso.value);
        params.push('siteAsso', this.registerForm.controls.site.value);
        params.push('assoDescription', this.registerForm.controls.assoDescription.value);
        params.push('CPAsso', this.registerForm.controls.CPAsso.value);
        params.push('villeAsso', this.registerForm.controls.villeAsso.value);
        //let body = urlSearchParams.toString();
        // send data
        this.rest.post(url, params, true)
            .then(function (value) {
            console.log("value");
            console.log(value);
            /*if(value['success'] != undefined)
            {
                this.rest.presentToast("Inscription réussie");
                this.navCtrl.pop();
            }*/
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur : ", err);
        });
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"/home/nico/Bureau/ionic/NXVision/src/pages/register/register.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>Inscription</ion-title>\n  </ion-navbar>\n\n</ion-header>\n \n<ion-content id="registerBody">\n\n	<!-- FORM REGISTER-->\n	<!--<button ion-button (click)="displayWantOpenAfricanCmpt()"></button>-->\n<form [formGroup]="registerForm" >\n		<!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////INFORMATIONS PERSO -->\n		<fieldset>\n		<legend ><ion-icon name="person"></ion-icon>Informations Personnelles <span class="requiredInput">* requis</span></legend>\n			<div class="registerFieldsetContent">\n \n				<div radio-group name="civilite" formControlName="civilite" [class.invalid]="!registerForm.controls.civilite.valid && (registerForm.controls.civilite.dirty || submitAttempt)">\n					<ion-item class="radioRegister">\n					    <ion-label>M.</ion-label>\n					    <ion-radio value="M"></ion-radio>\n					</ion-item>\n					<ion-item class="radioRegister">\n					    <ion-label>Mme.</ion-label>\n					    <ion-radio value="F"></ion-radio>\n					</ion-item>\n					<!--<ion-item class="radioRegister">\n					    <ion-label>Compte joint</ion-label>\n					    <ion-radio value="J"></ion-radio>\n					</ion-item>\n					<ion-item class="radioRegister">\n					    <ion-label>Autre</ion-label>\n					    <ion-radio value="U"></ion-radio>\n					</ion-item>-->\n				</div>\n \n				<ion-item [class.invalid]="!registerForm.controls.nom.valid && (registerForm.controls.nom.dirty || submitAttempt)">\n				   <ion-input type="text" name="nom" formControlName="nom" placeholder="Nom" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.prenom.valid && (registerForm.controls.prenom.dirty || submitAttempt)">\n				   <ion-input type="text" name="prenom" formControlName="prenom" placeholder="Prénom" ></ion-input>\n				</ion-item>\n \n				<ion-item [class.invalid]="!registerForm.controls.typeClient.valid && (registerForm.controls.typeClient.dirty || submitAttempt)">\n					<ion-label>Identité client</ion-label>\n				    <ion-select (ionChange)="changeDisplayAsso()" name="typeClient" formControlName="typeClient" >\n				    	<ion-option value="C">Particulier</ion-option>\n				    	<ion-option value="A">Association</ion-option>\n				    	<ion-option value="E">Entreprise</ion-option>\n					</ion-select>\n				</ion-item>\n		 \n				<ion-item [class.invalid]="!registerForm.controls.mdp1.valid && (registerForm.controls.mdp1.dirty || submitAttempt)">\n				    <ion-input type="password" name="mdp1" placeholder="Mot de passe" formControlName="mdp1" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.mdp2.valid && (registerForm.controls.mdp2.dirty || submitAttempt)">\n				    <ion-input type="password" name="mdp2" placeholder="Confirmer mdp" formControlName="mdp2" ></ion-input>\n				</ion-item>\n  \n				<ion-item [class.invalid]="!registerForm.controls.telephone.valid && (registerForm.controls.telephone.dirty || submitAttempt)">\n				    <ion-input type="tel" id="telephone2" name="telephone" placeholder="Téléphone Mobile" formControlName="telephone" ></ion-input>\n				</ion-item>\n    \n				<ion-item [class.invalid]="!registerForm.controls.email.valid && (registerForm.controls.email.dirty || submitAttempt)">\n				    <ion-input type="email" name="email" placeholder="Email" formControlName="email" ></ion-input>\n				</ion-item>\n\n				<!--<ion-item> \n				    <ion-datetime displayFormat="DD MMM, YYYY" name="dateNaissance" placeholder="Date de naissance" formControlName="dateNaissance" [class.invalid]="!registerForm.controls.dateNaissance.valid && (registerForm.controls.dateNaissance.dirty || submitAttempt)"></ion-datetime>\n				</ion-item>-->\n  \n				<!--<ion-item>\n					<ion-input ion-datepicker\n						  id="dateNaissanceP"\n						  formControlName="dateNaissance"\n						  name ="dateNaissance"\n						  [class.invalid]="!registerForm.controls.dateNaissance.valid && (registerForm.controls.dateNaissance.dirty || submitAttempt)"\n						  placeholder="Date de naissance"\n						  cancelText="Annuler" \n						  locale="fr-FR" \n						  (ionChanged)="dateBornChanged($event)"  \n						  class="ScheduleDate" \n						></ion-input>\n				</ion-item>-->\n\n				<ion-item [class.invalid]="!registerForm.controls.dateNaissance.valid && (registerForm.controls.dateNaissance.dirty || submitAttempt)">\n					<ion-label>Date de Naissance</ion-label>\n				    <ion-input type="text" name="dateNaissance" placeholder="JJ/MM/AAAA" formControlName="dateNaissance" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.lieuNaissance.valid && (registerForm.controls.lieuNaissance.dirty || submitAttempt)">\n				    <ion-input type="text" name="lieuNaissance" placeholder="Commune de naissance" formControlName="lieuNaissance" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.nationalite.valid && (registerForm.controls.nationalite.dirty || submitAttempt)">\n					<ion-label>Nationalité</ion-label>\n					<ion-select name="nationalite" formControlName="nationalite" >\n						<ion-option *ngFor="let item of stateISO" value="{{item.code}}" >{{item.name}}</ion-option>\n					</ion-select>\n				</ion-item>\n\n				<h3>Adresse postale</h3>\n				<ion-item showWhen="core">\n					<ion-label>Pays</ion-label>\n					<ion-select  name="pays" formControlName="pays" [class.invalid]="!registerForm.controls.pays.valid && (registerForm.controls.pays.dirty || submitAttempt)">\n						<ion-option *ngFor="let item of stateISO" value="{{item.code}}" >{{item.name}}</ion-option>\n					</ion-select>\n				    <ion-input type="text" name="rue" placeholder="N°, rue" formControlName="rue" [class.invalid]="!registerForm.controls.rue.valid && (registerForm.controls.rue.dirty || submitAttempt)"></ion-input>\n				    <ion-input type="text" name="CP" placeholder="CP" formControlName="CP" [class.invalid]="!registerForm.controls.CP.valid && (registerForm.controls.CP.dirty || submitAttempt)"></ion-input>\n				    <ion-input type="text" name="ville" placeholder="Ville" formControlName="ville" [class.invalid]="!registerForm.controls.ville.valid && (registerForm.controls.ville.dirty || submitAttempt)"></ion-input>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.pays.valid && (registerForm.controls.pays.dirty || submitAttempt)">\n					<ion-label>Pays</ion-label>\n					<ion-select  name="pays" formControlName="pays" >\n						<ion-option *ngFor="let item of stateISO" value="{{item.code}}" >{{item.name}}</ion-option>\n					</ion-select>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.rue.valid && (registerForm.controls.rue.dirty || submitAttempt)">\n				    <ion-input type="text" name="rue" placeholder="N°, rue" formControlName="rue" ></ion-input>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.CP.valid && (registerForm.controls.CP.dirty || submitAttempt)">\n				    <ion-input type="text" name="CP" placeholder="CP" formControlName="CP" ></ion-input>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.ville.valid && (registerForm.controls.ville.dirty || submitAttempt)">\n				    <ion-input type="text" name="ville" placeholder="Ville" formControlName="ville" ></ion-input>\n				</ion-item>\n			\n				<h3 *ngIf="displayInfoAsso === \'N\'">Etes vous membre d\'une association ?</h3>\n				<div radio-group name="assoMember" *ngIf="displayInfoAsso === \'N\'">\n					<ion-item class="radioRegister">\n					    <ion-label>Oui</ion-label> \n					    <ion-radio (ionSelect)="displayMembreAsso(\'O\')" value="O"></ion-radio>\n					</ion-item>\n					<ion-item class="radioRegister">\n					    <ion-label>Non</ion-label>\n					    <ion-radio (ionSelect)="displayMembreAsso(\'N\')" value="N" checked="True"></ion-radio>\n					</ion-item>\n				</div>\n				<div *ngIf="assoMember === \'O\' && displayInfoAsso === \'N\'" [class.invalid]="!registerForm.controls.codeAssoClient.valid && (registerForm.controls.codeAssoClient.dirty || submitAttempt)">\n					<ion-item>\n						<ion-label>Code Association </ion-label>\n					    <ion-select name="codeAssoClient" formControlName="codeAssoClient" >\n					    	<ion-option *ngFor="let item of assoNumbers" value="{{item.id}}" >{{item.nom}}</ion-option>\n						</ion-select>\n					</ion-item>\n					<ion-item [class.invalid]="!registerForm.controls.dateAdhesionAsso.valid && (registerForm.controls.dateAdhesionAsso.dirty || submitAttempt)">\n						<ion-label>Date d\'adhésion</ion-label>\n					    <ion-input type="text" name="dateAdhesionAsso" placeholder="JJ/MM/AAAA" formControlName="dateAdhesionAsso" ></ion-input>\n					</ion-item>\n				</div>\n			</div>\n		</fieldset>\n\n\n\n\n\n		<!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////INFORMATIONS ASSO -->\n		<fieldset *ngIf="displayInfoAsso === \'O\'">\n		<legend ><ion-icon name="cube"></ion-icon>Association / Entreprise <span class="requiredInput">*requis</span></legend>\n\n			<div  class="registerFieldsetContent">\n				<ion-item [class.invalid]="!registerForm.controls.nomAsso.valid && (registerForm.controls.nomAsso.dirty || submitAttempt)">\n				    <ion-input type="text" name="nomAsso" placeholder="Nom Association/Entreprise" formControlName="nomAsso" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.SIREN.valid && (registerForm.controls.SIREN.dirty || submitAttempt)">\n				    <ion-input type="text" name="SIRET" placeholder="Identifiant (SIREN, RNA, RCS/RN )" formControlName="SIREN" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.site.valid && (registerForm.controls.site.dirty || submitAttempt)">\n				    <ion-input type="text" name="site" placeholder="Site Internet" formControlName="site" ></ion-input>\n				</ion-item>\n\n				<ion-item [class.invalid]="!registerForm.controls.assoDescription.valid && (registerForm.controls.assoDescription.dirty || submitAttempt)">\n					 <ion-input type="text" name="assoDescription" placeholder="Description" formControlName="assoDescription" ></ion-input>\n				</ion-item>\n\n				<h3>Adresse Siège</h3>\n				<ion-item showWhen="core">\n					<ion-label>Pays</ion-label>\n					<ion-select  name="paysAsso" formControlName="paysAsso" [class.invalid]="!registerForm.controls.paysAsso.valid && (registerForm.controls.paysAsso.dirty || submitAttempt)">\n						<ion-option *ngFor="let item of stateISO" value="{{item.code}}" >{{item.pays}}</ion-option>\n					</ion-select>\n				    <ion-input type="text" name="rueAsso" placeholder="Numéro et rue" formControlName="rueAsso" [class.invalid]="!registerForm.controls.rueAsso.valid && (registerForm.controls.rueAsso.dirty || submitAttempt)"></ion-input>\n				    <ion-input type="text" name="CPAsso" placeholder="Code postal" formControlName="CPAsso" [class.invalid]="!registerForm.controls.CPAsso.valid && (registerForm.controls.CPAsso.dirty || submitAttempt)"></ion-input>\n				    <ion-input type="text" name="villeAsso" placeholder="Ville" formControlName="villeAsso" [class.invalid]="!registerForm.controls.villeAsso.valid && (registerForm.controls.villeAsso.dirty || submitAttempt)"></ion-input>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.paysAsso.valid && (registerForm.controls.paysAsso.dirty || submitAttempt)">\n					<ion-label>Pays</ion-label>\n					<ion-select  name="paysAsso" formControlName="paysAsso" >\n						<ion-option *ngFor="let item of stateISO" value="{{item.code}}" >{{item.pays}}</ion-option>\n					</ion-select>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.rueAsso.valid && (registerForm.controls.rueAsso.dirty || submitAttempt)">\n					<ion-input type="text" name="rueAsso" placeholder="Numéro et rue" formControlName="rueAsso" ></ion-input>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.CPAsso.valid && (registerForm.controls.CPAsso.dirty || submitAttempt)">\n					<ion-input type="text" name="CPAsso" placeholder="Code postal" formControlName="CPAsso" ></ion-input>\n				</ion-item>\n				<ion-item showWhen="android, ios, windows" [class.invalid]="!registerForm.controls.villeAsso.valid && (registerForm.controls.villeAsso.dirty || submitAttempt)">\n					 <ion-input type="text" name="villeAsso" placeholder="Ville" formControlName="villeAsso" ></ion-input>\n				</ion-item>\n			</div>		\n		</fieldset>\n\n\n<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////// SUBMIT -->\n		<button ion-button block color="secondary"  id="submitRegister" (click)="validRegister()" >Valider</button>\n\n\n	</form>\n\n</ion-content>\n'/*ion-inline-end:"/home/nico/Bureau/ionic/NXVision/src/pages/register/register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_rest_rest__["a" /* RestProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 117:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 117;

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/compte/compte.module": [
		287,
		4
	],
	"../pages/login/login.module": [
		288,
		3
	],
	"../pages/operations/operations.module": [
		289,
		2
	],
	"../pages/register/register.module": [
		290,
		1
	],
	"../pages/wallet/wallet.module": [
		291,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 159;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OperationsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_rest_rest__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(33);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the OperationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var OperationsPage = (function () {
    /*private displayOperation: string = "PAY";*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*/////////////////////////////////// CONSTRUCTEUR /////////////////////////////////////////////*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    function OperationsPage(navCtrl, navparams, rest, formBuilder) {
        this.navCtrl = navCtrl;
        this.navparams = navparams;
        this.rest = rest;
        this.formBuilder = formBuilder;
        this.submitAttempt = false;
        // check if user is already connected
        if (this.rest.dataClient == undefined)
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
        else
            this.dataClientLocal = this.rest.dataClient;
        // retrieve operations history data 
        this.getOperationsHistory();
        // init Wallet Form validation
        this.operationsForm = this.formBuilder.group({
            destinataire: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(12), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[0-9]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            montant: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(1), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[0-9 ,.]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            commentaire: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(1), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(100), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9 ,.-_]+$')])]
        });
    }
    OperationsPage.prototype.ionViewDidLoad = function () {
        __WEBPACK_IMPORTED_MODULE_4_jquery__("#telephone3").intlTelInput({
            // allowDropdown: false,
            // autoHideDialCode: false,
            // autoPlaceholder: "aggressive",
            dropdownContainer: "body",
            // excludeCountries: ["us"],
            // formatOnDisplay: true,
            // geoIpLookup: function(callback) {
            //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
            //     var countryCode = (resp && resp.country) ? resp.country : "";
            //     callback(countryCode);
            //   });
            // },
            // hiddenInput: "full_number",
            initialCountry: 'fr',
            // nationalMode: false,
            // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
            // placeholderNumberType: "MOBILE",
            preferredCountries: 'fr',
            // separateDialCode: true,
            utilsScript: "../../assets/js/utils.js"
        });
    };
    OperationsPage.prototype.getOperationsHistory = function () {
        var _this = this;
        this.rest.get(this.rest.urlServer + "/getOperationHistory.php" + "?client=" + this.dataClientLocal.telephone, true)
            .then(function (value) {
            var res = JSON.parse(value['_body']);
            _this.operationHistory = res;
            console.log(_this.operationHistory);
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur", err);
        });
    };
    OperationsPage.prototype.validPayment = function (mode) {
        this.submitAttempt = true;
        if (!this.operationsForm.valid) {
            this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incorrects");
        }
        else {
            // transforme le montant en float
            this.operationsForm.controls.montant.setValue(parseFloat(this.operationsForm.controls.montant.value).toFixed(2));
            // on rajoute l'identifiant international au téléphone
            var dialCode = __WEBPACK_IMPORTED_MODULE_4_jquery__("#telephone3").intlTelInput("getSelectedCountryData").dialCode;
            this.operationsForm.controls.destinataire.setValue(dialCode + this.operationsForm.controls.destinataire.value);
            if (mode == "pay")
                this.validPay();
            //if(mode == "ask")  this.validAsk();
        }
    };
    OperationsPage.prototype.validPay = function () {
        var _this = this;
        var url = this.rest.urlServer + "/addOperation.php";
        var urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', this.dataClientLocal.id);
        urlSearchParams.append('montant', this.operationsForm.controls.montant.value);
        urlSearchParams.append('commentaire', this.operationsForm.controls.commentaire.value);
        urlSearchParams.append('type', "P2P");
        urlSearchParams.append('source', this.dataClientLocal.telephone);
        urlSearchParams.append('target', this.operationsForm.controls.destinataire.value);
        var body = urlSearchParams.toString();
        // send data
        this.rest.post(url, body, true)
            .then(function (value) {
            console.log(value);
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur : ", err);
        });
    };
    OperationsPage.prototype.validAsk = function () {
        console.log(this.operationsForm.controls);
    };
    OperationsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-operations',template:/*ion-inline-start:"/home/nico/Bureau/ionic/NXVision/src/pages/operations/operations.html"*/'<ion-header>\n  <ion-navbar color="secondary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Effectuer une opération</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content id="operationsBody" padding>\n\n\n	<!-- CHOICE -->\n	<div radio-group id="choiceOperation" name="choiceOperation" (change)="changeOpe()" [(ngModel)]="displayOperation">\n				<ion-item>\n				    <ion-label>Payer</ion-label>\n				    <ion-radio value="PAY"></ion-radio>\n				</ion-item>\n				<!--<ion-item>\n				    <ion-label>Demander</ion-label>\n				    <ion-radio value="ASK"></ion-radio>\n				</ion-item>-->\n	</div>\n\n\n	<section class="contentApp"> \n\n		<form [formGroup]="operationsForm" padding >\n\n			<ion-item id="appendTel" [class.invalid]="!operationsForm.controls.destinataire.valid && (operationsForm.controls.destinataire.dirty || submitAttempt)">\n				<ion-label >Destinataire : </ion-label>\n				<ion-input type="text" name="montant" id="telephone3" placeholder="Téléphone destinataire" formControlName="destinataire" ></ion-input>\n			</ion-item>\n			<ion-item [class.invalid]="!operationsForm.controls.montant.valid && (operationsForm.controls.montant.dirty || submitAttempt)">\n				<ion-label>Montant : </ion-label>\n				<ion-input type="text" name="montant" placeholder="XX.XX" formControlName="montant" ></ion-input>\n			</ion-item>\n			<ion-item [class.invalid]="!operationsForm.controls.commentaire.valid && (operationsForm.controls.commentaire.dirty || submitAttempt)">\n				<ion-label>Commentaire : </ion-label>\n				<ion-input type="text" name="montant" formControlName="commentaire" ></ion-input>\n			</ion-item>\n\n			<button ion-button block color="secondary" (click)="validPayment(\'pay\')" *ngIf="displayOperation === \'PAY\'">Payer</button>\n			<button ion-button block color="secondary" (click)="validPayment(\'ask\')" *ngIf="displayOperation === \'ASK\'">Demander</button>\n		</form>\n\n		<table  padding id="historyOperations" *ngIf="displayOperation === \'PAY\' || displayOperation === \'ASK\'">\n			<tr>\n				<th>Somme</th>\n				<th>Type</th>\n				<th>Détail</th>\n				<th>Date</th>\n				<th>Etat</th>\n			</tr>\n			<tr *ngFor="let hist of operationHistory">\n				<td>{{hist.montant}} €</td>\n				<td>{{hist.type}}</td>\n				<td>{{hist.commentaire}}</td>\n				<td>{{hist.data}}</td>\n				<td>{{hist.etat}}</td>\n			</tr>\n		</table>\n		\n		\n	</section>\n\n\n</ion-content>\n\n\n<ion-footer>\n	<ion-toolbar>\n		<div class="foot"><img src="assets/images/walletPNG.png" /><h2>Solde actuel : {{ dataClientLocal.solde }} €</h2></div>\n	</ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/home/nico/Bureau/ionic/NXVision/src/pages/operations/operations.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1__providers_rest_rest__["a" /* RestProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */]])
    ], OperationsPage);
    return OperationsPage;
}());

//# sourceMappingURL=operations.js.map

/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_rest_rest__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__compte_compte__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_in_app_browser__ = __webpack_require__(260);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*import { RequestOptions } from '@angular/http';*/



var WalletPage = (function () {
    /*private displayMoney: string = "IN";*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*/////////////////////////////////// CONSTRUCTEUR /////////////////////////////////////////////*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    function WalletPage(navCtrl, navparams, rest, formBuilder, inappbrowser) {
        this.navCtrl = navCtrl;
        this.navparams = navparams;
        this.rest = rest;
        this.formBuilder = formBuilder;
        this.inappbrowser = inappbrowser;
        this.options = {
            location: 'yes',
            hidden: 'no',
            clearcache: 'yes',
            clearsessioncache: 'yes',
            zoom: 'yes',
            hardwareback: 'yes',
            mediaPlaybackRequiresUserAction: 'no',
            shouldPauseOnSuspend: 'no',
            closebuttoncaption: 'Close',
            disallowoverscroll: 'no',
            toolbar: 'yes',
            enableViewportScale: 'no',
            allowInlineMediaPlayback: 'no',
            presentationstyle: 'pagesheet',
            fullscreen: 'yes',
        };
        this.submitAttempt = false;
        // check if user is already connected
        if (this.rest.dataClient == undefined)
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
        else
            this.dataClientLocal = this.rest.dataClient;
        // init Wallet Form validation
        this.walletForm = this.formBuilder.group({
            montant: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(1), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(10), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].pattern('^[0-9 ,.]+$'), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])],
            commentaire: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(1), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(100), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].pattern('^[a-zA-Z0-9 ,.-_]+$')])]
        });
    }
    // When view did load
    WalletPage.prototype.ionViewDidLoad = function () {
    };
    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////// METHODS ///
    ///////////////////////////////////////////////////////////////////////////
    WalletPage.prototype.gotoCompte = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__compte_compte__["a" /* ComptePage */]);
    };
    WalletPage.prototype.validTransfer = function (type) {
        this.submitAttempt = true;
        if (!this.walletForm.valid) {
            this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incorrects");
        }
        else {
            // transforme le montant en float
            this.walletForm.controls.montant.setValue(parseFloat(this.walletForm.controls.montant.value).toFixed(2));
            this.transferWallet(type);
        }
    };
    // Requête POST à l'API de lemonway pour création de wallet
    WalletPage.prototype.transferWallet = function (type) {
        var _this = this;
        console.log(type);
        var url = this.rest.urlServer + "/addOperation.php";
        var urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', this.dataClientLocal.id);
        urlSearchParams.append('montant', this.walletForm.controls.montant.value);
        urlSearchParams.append('commentaire', this.walletForm.controls.commentaire.value);
        urlSearchParams.append('type', type);
        //urlSearchParams.append('commission', );
        if (type == "moneyIn") {
            urlSearchParams.append('source', this.dataClientLocal.telephone);
            urlSearchParams.append('target', "LemonWay");
        }
        if (type == "moneyOut") {
            urlSearchParams.append('source', "LemonWay");
            urlSearchParams.append('target', this.dataClientLocal.telephone);
        }
        var body = urlSearchParams.toString();
        // send data
        this.rest.post(url, body, true)
            .then(function (value) {
            // _sytem : system browser
            // _blank : app browser
            // _self : cordova browser
            if (value['success'] != undefined) {
                if (type == "moneyIn")
                    _this.inappbrowser.create(_this.rest.webkitURL + "?moneyintoken=" + value['success']['MONEYINWEB']['TOKEN'] + "&p=https://www.lemonway.fr/mercanet_lw.css&lang=fr", "_blank", _this.options);
                if (type == "moneyOut") {
                    _this.rest.presentToast("L'argent a été crédité sur le compte avec succès");
                }
            }
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur : ", err);
        });
    };
    WalletPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-wallet',template:/*ion-inline-start:"/home/nico/Bureau/ionic/NXVision/src/pages/wallet/wallet.html"*/'<ion-header>\n  <ion-navbar color="secondary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Gérer mon Wallet</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content id="walletBody" padding>\n	\n	<!-- CHOICE -->\n	<div radio-group id="choiceMoney" name="choiceMoney" [(ngModel)]="displayMoney">\n				<ion-item>\n				    <ion-label>Recharger Wallet</ion-label>\n				    <ion-radio value="IN"></ion-radio>\n				</ion-item>\n				<ion-item>\n				    <ion-label>Virer à ma banque</ion-label>\n				    <ion-radio value="OUT">easy</ion-radio>\n				</ion-item>\n	</div>\n\n	<section class="contentApp"> \n\n		<form [formGroup]="walletForm" padding *ngIf="(displayMoney === \'IN\' || (displayMoney === \'OUT\' && dataClientLocal.IBANfrance != null))">\n\n			<ion-item [class.invalid]="!walletForm.controls.montant.valid && (walletForm.controls.montant.dirty || submitAttempt)">\n				<ion-label>Montant : </ion-label>\n				<ion-input type="text" name="montant" placeholder="XX.XX" formControlName="montant" ></ion-input>\n			</ion-item>\n			<ion-item>\n				<ion-label>Commentaire : </ion-label>\n				<ion-input type="text" name="montant" formControlName="commentaire" [class.invalid]="!walletForm.controls.commentaire.valid && (walletForm.controls.commentaire.dirty || submitAttempt)"></ion-input>\n			</ion-item>\n\n			<button ion-button block color="secondary" (click)="validTransfer(\'moneyIn\')" *ngIf="displayMoney === \'IN\'">Recharger Wallet</button>\n			<button ion-button block color="secondary" (click)="validTransfer(\'moneyOut\')" *ngIf="displayMoney === \'OUT\'">Virer à ma banque</button>\n			<!--<h3>NXVision ne prend pas de commission sur les virements<br>Montant maximum autorisé : 1000,00€</h3>-->\n		</form>\n\n		<h2 id="titleIban" *ngIf="displayMoney === \'OUT\' && dataClientLocal.IBANfrance == null">Vous n\'avez pas encore <br><a (click)="gotoCompte()" href=\'#\'>ajouté vos informations personnelles </a></h2>\n		\n	</section>\n\n</ion-content>\n\n\n\n<ion-footer>\n	<ion-toolbar>\n		<div class="foot"><img src="assets/images/walletPNG.png" /><h2>Solde actuel : {{ dataClientLocal.solde }} €</h2></div>\n	</ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/home/nico/Bureau/ionic/NXVision/src/pages/wallet/wallet.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_rest_rest__["a" /* RestProvider */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
    ], WalletPage);
    return WalletPage;
}());

//# sourceMappingURL=wallet.js.map

/***/ }),

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(228);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_login_login__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_register_register__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_wallet_wallet__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_compte_compte__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_operations_operations__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_rest_rest__ = __webpack_require__(32);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_wallet_wallet__["a" /* WalletPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_compte_compte__["a" /* ComptePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_operations_operations__["a" /* OperationsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/compte/compte.module#ComptePageModule', name: 'ComptePage', segment: 'compte', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/operations/operations.module#OperationsPageModule', name: 'OperationsPage', segment: 'operations', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/register/register.module#RegisterPageModule', name: 'RegisterPage', segment: 'register', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/wallet/wallet.module#WalletPageModule', name: 'WalletPage', segment: 'wallet', priority: 'low', defaultHistory: [] }
                    ]
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_wallet_wallet__["a" /* WalletPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_compte_compte__["a" /* ComptePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_operations_operations__["a" /* OperationsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_12__providers_rest_rest__["a" /* RestProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MdpValidator; });
var MdpValidator = (function () {
    function MdpValidator() {
    }
    MdpValidator.passwordsMatch = function (ctrl) {
        if (ctrl.value == ctrl.root.value['mdp1'])
            return null;
        else
            return { "non identiques": true };
    };
    MdpValidator.missmatchNames = function (ctrl) {
        if (ctrl.value == ctrl.root.value['nom'])
            return { "identiques": true };
        else
            return null;
    };
    return MdpValidator;
}());

//# sourceMappingURL=mdp.js.map

/***/ }),

/***/ 286:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(33);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/nico/Bureau/ionic/NXVision/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/home/nico/Bureau/ionic/NXVision/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RestProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RestProvider = (function () {
    function RestProvider(http, loadingCtrl, alertCtrl, toastCtrl, actionSheetCtrl, platform) {
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.urlServer = "http://92.222.155.235:443/scripts";
        this.dataClient = undefined;
        this.webkitURL = "https://sandbox-webkit.lemonway.fr/nxvision2/dev/";
    }
    /*/////////////////////////////////////////////////////////////////////////////// */
    /*///////////////////////////////////////////////////// ALERT METHODS//////////// */
    /*/////////////////////////////////////////////////////////////////////////////// */
    RestProvider.prototype.showAlert = function (title, message) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    RestProvider.prototype.presentToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    };
    /*/////////////////////////////////////////////////////////////////////////////// */
    /*////////////////////////////////////////////////////// HTTP METHODS//////////// */
    /*/////////////////////////////////////////////////////////////////////////////// */
    RestProvider.prototype.get = function (url, load) {
        var _this = this;
        if (load) {
            this.loading = this.loadingCtrl.create({
                content: 'Chargement...',
            });
            this.loading.present();
        }
        return new Promise(function (resolve, reject) {
            _this.http.get(url)
                .subscribe(function (data) {
                if (load)
                    _this.loading.dismissAll();
                resolve(data);
            }, function (err) {
                if (load)
                    _this.loading.dismissAll();
                reject(err);
            });
        });
    };
    RestProvider.prototype.post = function (url, data, load) {
        var _this = this;
        if (load) {
            this.loading = this.loadingCtrl.create({
                content: 'Chargement...',
            });
            this.loading.present();
        }
        return new Promise(function (resolve, reject) {
            var params = JSON.stringify(data);
            var heady = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]().set('Content-Type', 'application/x-www-form-urlencoded');
            _this.http.post(url, params, { headers: heady })
                .subscribe(function (data) {
                if (data['error'] == undefined) {
                    if (load)
                        _this.loading.dismissAll();
                    resolve(data);
                }
                else {
                    if (load)
                        _this.loading.dismissAll();
                    reject(data['error']);
                }
            }, function (err) {
                if (load)
                    _this.loading.dismissAll();
                reject(err);
            });
        });
    };
    RestProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* Platform */]])
    ], RestProvider);
    return RestProvider;
}());

//# sourceMappingURL=rest.js.map

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register_register__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_rest_rest__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jquery__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_tel_input__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_tel_input___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_intl_tel_input__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LoginPage = (function () {
    /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    /* //////////////////////////////////////////// CONSTRUCTOR ///////////////////////////////////////////////////// */
    /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    function LoginPage(navCtrl, navParams, rest, formBuilder) {
        // check if user is already connected
        //if(this.provide.dataClient != undefined) this.navCtrl.setRoot(WalletPage);
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.rest = rest;
        this.formBuilder = formBuilder;
        this.submitAttempt = false;
        // LOGIN FORM BUILDER
        this.loginForm = this.formBuilder.group({
            telephone: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(14), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('^[0-9]+$'), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])],
            mdp: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(8), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required])]
        });
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        __WEBPACK_IMPORTED_MODULE_5_jquery__("#telephone").intlTelInput({
            // allowDropdown: false,
            // autoHideDialCode: false,
            // autoPlaceholder: "aggressive",
            dropdownContainer: "body",
            // excludeCountries: ["us"],
            // formatOnDisplay: true,
            // geoIpLookup: function(callback) {
            //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
            //     var countryCode = (resp && resp.country) ? resp.country : "";
            //     callback(countryCode);
            //   });
            // },
            // hiddenInput: "full_number",
            initialCountry: 'fr',
            // nationalMode: false,
            // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
            // placeholderNumberType: "MOBILE",
            preferredCountries: 'fr',
            // separateDialCode: true,
            utilsScript: "../../assets/js/utils.js"
        });
    };
    /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    /* //////////////////////////////////////////////// METHODS ///////////////////////////////////////////////////// */
    /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    // navigation method
    LoginPage.prototype.gotoRegister = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register_register__["a" /* RegisterPage */]);
    };
    // Attempt login
    LoginPage.prototype.loginUser = function () {
        this.submitAttempt = true;
        if (!this.loginForm.valid) {
            this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incorrects");
        }
        else {
            // recréé le téléphone format internationnal
            var dialCode = __WEBPACK_IMPORTED_MODULE_5_jquery__("#telephone").intlTelInput("getSelectedCountryData").dialCode;
            this.checkExist(dialCode + this.loginForm.controls.telephone.value, this.loginForm.controls.mdp.value);
        }
    };
    // Is the user in database ?
    LoginPage.prototype.checkExist = function (telephone, mdp) {
        /*let passwd = md5(mdp);*/
        var _this = this;
        this.rest.get(this.rest.urlServer + "/connexion.php" + "?telephone=" + telephone + "&mdp=" + mdp, true)
            .then(function (value) {
            var res = JSON.parse(value['_body']);
            if (res.length == 0)
                _this.rest.presentToast("Utilisateur inconnu");
            else {
                _this.rest.presentToast("Bienvenue " + res[0].prenom);
                _this.rest.dataClient = res[0];
                //this.navCtrl.setRoot(WalletPage);
            }
        })
            .catch(function (err) {
            _this.rest.showAlert("Erreur Serveur", err);
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/home/nico/Bureau/ionic/NXVision/src/pages/login/login.html"*/'<ion-content padding id="loginBody">\n\n	<!-- LOGIN FORM -->\n	<form [formGroup]="loginForm" padding>\n\n		<div>\n			<ion-item [class.invalid]="!loginForm.controls.telephone.valid && (loginForm.controls.telephone.dirty || submitAttempt)">\n				<ion-input id="telephone" type="tel" placeholder="Téléphone" name="telephone" formControlName="telephone" ></ion-input>\n			</ion-item>\n			<ion-item [class.invalid]="!loginForm.controls.mdp.valid && (loginForm.controls.mdp.dirty || submitAttempt)">\n			    <ion-input type="password" placeholder="Mot de passe" name="mdp" formControlName="mdp" ></ion-input>\n			</ion-item>\n		</div>\n\n		<p padding>\n	    	Recharge gratuite par VISA MASTERCARD CB, sans engagement<br>\n	    	Consultez les <a href="#">conditions d\'utilisation</a>\n	    </p>\n\n		<button ion-button block color="secondary"  (click)="loginUser()">Accédez à votre compte</button>\n		<button ion-button block outline color="secondary" (click)="gotoRegister()">Inscrivez-vous gratuitement !</button>\n\n	</form>\n\n</ion-content>\n'/*ion-inline-end:"/home/nico/Bureau/ionic/NXVision/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__providers_rest_rest__["a" /* RestProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ })

},[206]);
//# sourceMappingURL=main.js.map