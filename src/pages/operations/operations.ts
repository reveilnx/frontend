import { Component } from '@angular/core';
import { RestProvider } from '../../providers/rest/rest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import * as $ from 'jquery';
import { LoginPage } from '../login/login';


/**
 * Generated class for the OperationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-operations',
  templateUrl: 'operations.html',
})
export class OperationsPage 
{

	private dataClientLocal : any;
  private operationHistory : any;

	private operationsForm: FormGroup;
  private submitAttempt: boolean = false;

  public displayOperation: string = "PAY";



/*//////////////////////////////////////////////////////////////////////////////////////////////*/
/*/////////////////////////////////// CONSTRUCTEUR /////////////////////////////////////////////*/
/*//////////////////////////////////////////////////////////////////////////////////////////////*/
  constructor(	public navCtrl	   		: NavController,
      		  	  public navparams	  	: NavParams,
              	private rest     		  : RestProvider,
              	private formBuilder 	: FormBuilder,
                public menuCtrl       : MenuController) 
  {
  	// check if user is already connected
    if(this.rest.dataClient == undefined) this.navCtrl.setRoot(LoginPage);
    else 
      {
        this.rest.getSolde();
        this.dataClientLocal = this.rest.dataClient;
      }

    // retrieve operations history data 
    this.getOperationsHistory();

     // init Wallet Form validation
     this.operationsForm = this.formBuilder.group(
    {
      destinataire: 	['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('^[0-9]+$'), Validators.required])],
      montant: 			['', Validators.compose([Validators.minLength(1), Validators.maxLength(10), Validators.pattern('^[0-9 ,.]+$'), Validators.required])],
      commentaire: 		['', Validators.compose([Validators.minLength(1), Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9 ,.-_]+$')])]
    });

  }

  ionViewDidLoad() 
  {    
    this.menuCtrl.swipeEnable( true );
    $("#telephone3").intlTelInput({
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



  private getOperationsHistory()
  {
    this.rest.get(this.rest.urlServer + "/getOperationHistory.php" + "?client=" + this.dataClientLocal.telephone, true)
        .then(value =>
        {
          this.operationHistory = value;
        })
        .catch(err =>
      {
        this.rest.showAlert("Erreur Serveur", err);
      });
  }


  validPayment(mode)
  {
    this.submitAttempt = true;

      if(!this.operationsForm.valid)
      {
        this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incorrects");
      }
      else
      {
        // transforme le montant en float
        this.operationsForm.controls.montant.setValue(parseFloat(this.operationsForm.controls.montant.value).toFixed(2));
        // on rajoute l'identifiant international au téléphone
        var dialCode = $("#telephone3").intlTelInput("getSelectedCountryData").dialCode;
        this.operationsForm.controls.destinataire.setValue(dialCode+this.operationsForm.controls.destinataire.value);
        if(mode == "pay")  this.validPay();
        //if(mode == "ask")  this.validAsk();
      }
  }

  private validPay()
  {
      let  url  = this.rest.urlServer + "/addOperation.php";

      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('id', this.dataClientLocal.id);
      urlSearchParams.append('montant', this.operationsForm.controls.montant.value);
      urlSearchParams.append('commentaire', this.operationsForm.controls.commentaire.value);
      urlSearchParams.append('type', "P2P");
      urlSearchParams.append('source', this.dataClientLocal.telephone);
      urlSearchParams.append('target', this.operationsForm.controls.destinataire.value);
     

      let body = urlSearchParams.toString();

      // send data
      this.rest.post(url, body, true)
      .then(value =>
        {         
            this.rest.presentToast("Opération effectuée avec succès");
        })
          .catch(err =>
        {
          this.rest.showAlert("Erreur Serveur : ", err);
        });
  }


  /*private validAsk()
  {
     console.log(this.operationsForm.controls);
  }*/


}
