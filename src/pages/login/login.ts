import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletPage } from '../wallet/wallet';
import { RegisterPage } from '../register/register';
import { RestProvider } from '../../providers/rest/rest';
import { Md5 } from 'ts-md5/dist/md5';
import * as $ from 'jquery'; 
import 'intl-tel-input';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage 
{

	/* /////////// Form Data ////////////*/
	private loginForm: FormGroup;
	private submitAttempt: boolean = false;


	/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
	/* //////////////////////////////////////////// CONSTRUCTOR ///////////////////////////////////////////////////// */
	/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
	constructor(	public navCtrl		: NavController, 
					public navParams	: NavParams,
					private rest		: RestProvider,
					private formBuilder : FormBuilder,
					public menuCtrl		: MenuController) 
	{
		// check if user is already connected
		if(this.rest.dataClient != undefined) this.navCtrl.setRoot(WalletPage);

		// LOGIN FORM BUILDER
		this.loginForm = this.formBuilder.group(
		{
			telephone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(14), Validators.pattern('^[0-9]+$'), Validators.required])],
			mdp: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required])]
		});
	}


	ionViewDidLoad() {
		this.menuCtrl.swipeEnable( false );
		$("#telephone").intlTelInput({
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




/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////// METHODS ///////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

	// navigation method
	gotoRegister()
	{
		this.navCtrl.push(RegisterPage);
	}

	// Attempt login
	loginUser()
	{
		this.submitAttempt = true;

		if(!this.loginForm.valid)
		{
			this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incorrects");
		}
		else
		{
			// recréé le téléphone format internationnal
			var dialCode = $("#telephone").intlTelInput("getSelectedCountryData").dialCode;
			this.checkExist(dialCode+this.loginForm.controls.telephone.value, this.loginForm.controls.mdp.value);	
		}
	}


	// Is the user in database ?
	private checkExist(telephone, mdp)
	{
		let	passwd = Md5.hashStr(mdp);

		this.rest.get(this.rest.urlServer + "/connexion.php" + "?telephone=" + telephone + "&mdp=" + passwd, true)
	      .then(value =>
	      {
	      	if(value[0] == undefined) this.rest.presentToast("Utilisateur inconnu");
      		else
      		{
      			this.rest.presentToast("Bienvenue " + value[0].prenom);
      			this.rest.dataClient = value[0];
      			this.navCtrl.setRoot(WalletPage);
      		}
	      })
	      .catch(err =>
			{
				this.rest.showAlert("Erreur Serveur", err);
			});
	}

}
