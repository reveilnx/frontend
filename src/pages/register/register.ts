import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdpValidator } from '../../validators/mdp';
import { RestProvider } from '../../providers/rest/rest';
import { Md5 } from 'ts-md5/dist/md5';
import * as $ from 'jquery'; 
import 'intl-tel-input';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage 
{
	/* /////////// Form Data ////////////*/
	private registerForm: FormGroup;
	private submitAttempt: boolean = false;
	private stateISO 	: any;
	private assoNumbers : any;
	private displayInfoAsso: string = "N";
	private assoMember : string = "N";

  constructor(	public navCtrl			: NavController, 
  				private rest			: RestProvider,
  				private formBuilder 	: FormBuilder,
  				public navParams		: NavParams,
  				public menuCtrl			: MenuController) 
  {

  		this.getStateISO();
		this.getAssoNumbers();


		// REGISTER FORM BUILDER
		this.registerForm = this.formBuilder.group(
		{
			nom: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(40), Validators.pattern('^[a-zA-Z- ]+$'), Validators.required])],
			prenom: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z- ]+$'), Validators.required, MdpValidator.missmatchNames])],
			civilite: ['', Validators.required],
			mdp1: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required])],
			mdp2: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, MdpValidator.passwordsMatch])],
			typeClient: ['', Validators.required],
			telephone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('^[0-9]+$'), Validators.required])],
			email: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9-.]+[.]+[a-zA-Z]{2,4}$'), Validators.required])],
			dateNaissance: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$'), Validators.required])],
			lieuNaissance: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9 -]+$'), Validators.required])],
			nationalite: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('^[a-zA-Z]+$'), Validators.required])],
			pays: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('^[A-Z]{3}$'), Validators.required])],
			rue: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9 -]+$'), Validators.required])],
			CP: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$'), Validators.required])],
			ville: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z -]+$'), Validators.required])],
			codeAssoClient: [''],
			dateAdhesionAsso: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')])],
			nomAsso: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9 -_]+$')])],
			SIREN: ['', Validators.compose([Validators.maxLength(14), Validators.pattern('^[a-zA-Z0-9]+$')])],
			site: ['', Validators.compose([Validators.maxLength(50)])],
			assoDescription: ['', Validators.compose([Validators.maxLength(50)])],
			rueAsso: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9 -]+$')])],
			CPAsso: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$')])],
			villeAsso: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z -_]+$')])],
			paysAsso:  ['', Validators.compose([Validators.maxLength(3), Validators.pattern('^[A-Z]{3}$')])]
		});
  }

  ionViewDidLoad() 
  {
  	this.menuCtrl.swipeEnable( false );
  	$("#telephone2").intlTelInput({
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
  }

  /*/////////////////////////////////////////////////////////////  */
  /*////////////////////// GET DATA//////////////////////////////  */
  /*/////////////////////////////////////////////////////////////  */
  private getStateISO()
  {
  	// charge State file text
	this.rest.get('countries.json', false)
	.then(value => 
	{
		this.stateISO = value;
	})
	.catch(err =>
	{
		this.rest.showAlert("Erreur Serveur", err);
	});
  }

  private getAssoNumbers()
  {
  	// charge Asso numbers
	this.rest.get(this.rest.urlServer + "/getAssoNumbers.php", false)
	.then(value => 
	{
		this.assoNumbers = value;
	})
	.catch(err =>
	{
		this.rest.showAlert("Erreur Serveur", err);
	});
  }


  /*/////////////////////////////////////////////////////////////  */
  /*////////////////////// CHANGE DISPLAY//////////////////////////////  */
  /*/////////////////////////////////////////////////////////////  */
	public changeDisplayAsso()
	{
		if((this.registerForm.controls.typeClient.value == "E")||(this.registerForm.controls.typeClient.value == "A")) 	this.displayInfoAsso = "O";
		else this.displayInfoAsso = "N";
	}

	public displayMembreAsso(i)
	{
		if(i == "O") this.assoMember = "O";
		if(i == "N") this.assoMember = "N";
	}



/* ///////////////////////////////////////////////////////////////////////////////////////*/
/* /////////////////////////////////////////////////////////////////////////////////////// SUBMIT */
/* ///////////////////////////////////////////////////////////////////////////////////////*/


	/////////////////////////////////////////////
	// --------- VALID, PRE POST ---------------
	/////////////////////////////////////////////
	// méthode pour ajouter le dial code international et minuscule email
	private formatVal()
	{
		// on rajoute l'identifiant international au téléphone
		var dialCode = $("#telephone2").intlTelInput("getSelectedCountryData").dialCode;
		this.registerForm.controls.telephone.setValue(dialCode+this.registerForm.controls.telephone.value);
		// on transfoprme l'email, minuscule
		this.registerForm.controls.email.setValue(this.registerForm.controls.email.value.toLowerCase());
	}


	private validAsso()
	{
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
		if(!this.registerForm.valid || ((typeClient=="A" || typeClient=="E")&&(nomAsso == "" || SIREN == "" || site == "" || description == "" || paysAsso == "" || villeAsso == "" || rueAsso == "" || CPAsso == "" )))
		{
			this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incomplets ou incorrects");
			return false;
		}
		// SEMI-VALIDE
		else
		{
			return true;
		}
	}	

	/////////////////////////////////////////////
	// ----------- VALID register ---------------
	/////////////////////////////////////////////
	validRegister()
	{
		this.submitAttempt = true;

		if(!this.registerForm.valid)
		{
			this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incomplets ou incorrects");
		}
		else
		{
			if(this.validAsso())
			{				
				// vérifie si l'utilisateur existe déjà
				// 1. téléphone
				var dialCode = $("#telephone2").intlTelInput("getSelectedCountryData").dialCode;
				var telephone = dialCode + this.registerForm.controls.telephone.value;
				this.rest.get(this.rest.urlServer + "/checkUser.php?key=telephone&data="+ telephone, false)
				.then(value =>
				{
					if(value[0] != undefined)  
					{
						this.rest.showAlert("L'utilisateur existe déjà", "Un utilisateur est déjà inscris avec ce téléphone");
					}
					else
					{
						// 2. email
						this.rest.get(this.rest.urlServer + "/checkUser.php?key=email&data="+ this.registerForm.controls.email.value.toLowerCase(), false)
						.then(value =>
						{
							if(value[0] != undefined)  
							{
								this.rest.showAlert("L'utilisateur existe déjà", "Un utilisateur est déjà inscris avec cet email");
							}
							else
							{
								// VALIDE
								this.formatVal();
								this.registerUser();
							}
						})
						.catch(err =>
						{
							this.rest.showAlert("Erreur Serveur", err);
						});
					}
				})
				.catch(err =>
				{
					this.rest.showAlert("Erreur Serveur", err);
				});
			}
		}
	}



	/////////////////////////////////////////////
	// ----------- REGISTER USER ---------------
	/////////////////////////////////////////////
	private registerUser()
	{
		let  url  = this.rest.urlServer + "/RegisterWallet.php";
		let	passwd = Md5.hashStr(this.registerForm.controls.mdp1.value);
		let urlSearchParams = new URLSearchParams();

		urlSearchParams.append('nom', this.registerForm.controls.nom.value);
		urlSearchParams.append('prenom', this.registerForm.controls.prenom.value);
		urlSearchParams.append('mdp', passwd.toString());
		urlSearchParams.append('telephone', this.registerForm.controls.telephone.value);
		urlSearchParams.append('civilite', this.registerForm.controls.civilite.value);
		urlSearchParams.append('email', this.registerForm.controls.email.value);
		urlSearchParams.append('dateNaissance', this.registerForm.controls.dateNaissance.value);
		urlSearchParams.append('lieuNaissance', this.registerForm.controls.lieuNaissance.value);
		urlSearchParams.append('nationalite', this.registerForm.controls.nationalite.value);
		urlSearchParams.append('typeClient', this.registerForm.controls.typeClient.value);
		urlSearchParams.append('pays', this.registerForm.controls.pays.value);
		urlSearchParams.append('rue', this.registerForm.controls.rue.value);
		urlSearchParams.append('CP', this.registerForm.controls.CP.value);
		urlSearchParams.append('ville', this.registerForm.controls.ville.value);
		urlSearchParams.append('nomAsso', this.registerForm.controls.nomAsso.value);
		urlSearchParams.append('SIREN', this.registerForm.controls.SIREN.value);
		urlSearchParams.append('rueAsso', this.registerForm.controls.rueAsso.value);
		urlSearchParams.append('siteAsso', this.registerForm.controls.site.value);
		urlSearchParams.append('assoDescription', this.registerForm.controls.assoDescription.value);
		urlSearchParams.append('CPAsso', this.registerForm.controls.CPAsso.value);
		urlSearchParams.append('villeAsso', this.registerForm.controls.villeAsso.value);
		urlSearchParams.append('codeAssoClient', this.registerForm.controls.codeAssoClient.value);
		urlSearchParams.append('dateAdhesionAsso', this.registerForm.controls.dateAdhesionAsso.value);
		let body = urlSearchParams.toString();

      // send data
      this.rest.post(url, body, true)
      .then(value =>
      	{
      	 	if(value['success'] != undefined)
      		{
      			this.rest.presentToast("Inscription réussie. Connectez vous pour accéder à la plateforme");
  				this.navCtrl.pop();
      		}
      		else
      		{
      			this.rest.showAlert("Erreur : ", value['error']);
      		}
		})
      .catch(err =>
		{
			this.rest.showAlert("Erreur Serveur : ", err);
		});

	}

}
