import { Component } from '@angular/core';
import { RestProvider } from '../../providers/rest/rest';
/*import { Storage } from '@ionic/storage';*/
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-compte',
  templateUrl: 'compte.html',
})
export class ComptePage 
{

  // data form
	private dataClientLocal : any;
	private compteForm: FormGroup;
	private submitAttempt: boolean = false;



/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////// CONSTRUCTOR ///////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
  constructor(  public navCtrl		    : NavController, 
        		    private rest    	 	  : RestProvider,
        		    private formBuilder 	: FormBuilder,
      			    public navParams		  : NavParams,
                public menuCtrl       : MenuController) 
  {
  	// check if user is already connected
    if(this.rest.dataClient == undefined) this.navCtrl.setRoot(LoginPage);
    else 
      {
        this.rest.getSolde();
        this.dataClientLocal = this.rest.dataClient;
      }

	// init Compte Form validation
     this.compteForm = this.formBuilder.group(
    {
       	//RIBfrance: 	    ['', Validators.required],
       	IBANfrance:     ['', Validators.compose([Validators.minLength(15), Validators.maxLength(34), Validators.pattern('^[a-zA-Z0-9]*$'), Validators.required])],
	    	BICfrance:     	['', Validators.compose([Validators.minLength(8), Validators.maxLength(11), Validators.pattern('^[a-zA-Z0-9]*$'), Validators.required])],
	    	//RIBafrique:     ['', Validators.required],
	    	//IBANafrique:    ['', Validators.required],
       	//BICafrique:     ['', Validators.required],
        //devise: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('^[a-zA-Z0-9]*$')])],
        //photocopieID:   ['', Validators.required],
        //expirationID:   ['', Validators.required],
        //justifDomicile: ['', Validators.required]       
    });
  }

  ionViewDidLoad() 
  {
    this.menuCtrl.swipeEnable( true );
  }


  /* ///////////////////////////////////////////////////////////////////////////////////////*/
  /* /////////////////////////////////////////////////////////////////////////////////////// IMAGE UPLOAD AND TRANSFER */
  /* ///////////////////////////////////////////////////////////////////////////////////////*/


// verify iban
private validIBAN(input) 
{
    let CODE_LENGTHS = 
    {
        AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
        CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
        FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
        HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
        LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
        MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
        RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
    };

    let iban = input.toUpperCase().replace(/[^A-Z0-9]/g, ''), 
            code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/),
            digits;

    if (!code || iban.length !== CODE_LENGTHS[code[1]])     return false;

    digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) 
    {
        return letter.charCodeAt(0) - 55;
    });

    return this.mod97(digits);
}

private mod97(string) 
{
    let checksum = string.slice(0, 2), fragment;

    for (let offset = 2; offset < string.length; offset += 7) 
    {
        fragment = checksum + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }

    return checksum;
}



  /* ///////////////////////////////////////////////////////////////////////////////////////*/
  /* ///////////////////////////////////////////////////////////////////////////////////////// SUBMIT MODIFICATIONS */
  /* ///////////////////////////////////////////////////////////////////////////////////////*/
  uploadUser()
  {
      this.submitAttempt = true;

      if(!this.compteForm.valid)
      {
        this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incomplets ou incorrects");
      }
      else
      {
            var isValidIBAN = this.validIBAN(this.compteForm.controls.IBANfrance.value )
           if(isValidIBAN == 1)
            {
                 // first upload the documents
                 //this.transferDoc();

                 // then transfer updated client 
                  let  url  = this.rest.urlServer + "/updateUser.php";

                  let urlSearchParams = new URLSearchParams();
                  urlSearchParams.append('id', this.dataClientLocal.id);
                  urlSearchParams.append('wallet', this.dataClientLocal.telephone);
                  urlSearchParams.append('nom', this.dataClientLocal.nom);
                  urlSearchParams.append('prenom', this.dataClientLocal.prenom);
                  urlSearchParams.append('IBANfrance', this.compteForm.controls.IBANfrance.value);
                  urlSearchParams.append('BICfrance', this.compteForm.controls.BICfrance.value);

                  let body = urlSearchParams.toString();

                  // send data
                        this.rest.post(url, body, true)
                        .then(value =>
                          {
                            if(value['success'] != undefined) 
                            {
                                this.dataClientLocal.IBANfrance = this.compteForm.controls.IBANfrance.value;
                                this.dataClientLocal.BICfrance = this.compteForm.controls.BICfrance.value;
                                this.rest.dataClient.IBANfrance = this.compteForm.controls.IBANfrance.value;
                                this.rest.dataClient.BICfrance = this.compteForm.controls.BICfrance.value;
                                this.rest.presentToast("Modification effectuées");           
                            }

                          })
                            .catch(err =>
                          {
                            this.rest.showAlert("Erreur Serveur : ", err);
                          });
             }
             else this.rest.showAlert("Erreur Saisie", "Le RIB renseigné est invalide");
        }
        
   }


}
