import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/*import { RequestOptions } from '@angular/http';*/
import { LoginPage } from '../login/login';
import { ComptePage } from '../compte/compte';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';



@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})


   
  
export class WalletPage 
{


  private options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'yes',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
    };

  private dataClientLocal : any;
  private walletForm: FormGroup;
  private submitAttempt: boolean = false;
  public displayMoney: string = "IN";



/*//////////////////////////////////////////////////////////////////////////////////////////////*/
/*/////////////////////////////////// CONSTRUCTEUR /////////////////////////////////////////////*/
/*//////////////////////////////////////////////////////////////////////////////////////////////*/
  constructor(public navCtrl	      : NavController,
      			  public navparams	    : NavParams,
              private rest          : RestProvider,
              private formBuilder   : FormBuilder,
              private inappbrowser  : InAppBrowser,
              public menuCtrl       : MenuController) 
  {
  	// check if user is already connected
    if(this.rest.dataClient == undefined) this.navCtrl.setRoot(LoginPage);
    else 
      {
        this.rest.getSolde();
        this.dataClientLocal = this.rest.dataClient;
      }

    // init Wallet Form validation
     this.walletForm = this.formBuilder.group(
    {
      montant: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(10), Validators.pattern('^[0-9 ,.]+$'), Validators.required])],
      commentaire: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9 ,.-_]+$')])]
    });
  	
  }

// When view did load
  ionViewDidLoad() 
  {
    this.menuCtrl.swipeEnable( true );
  }


///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////// METHODS ///
///////////////////////////////////////////////////////////////////////////

  gotoCompte()
  {
      this.navCtrl.setRoot(ComptePage);
  }

  validTransfer(type)
  {
    this.submitAttempt = true;

    if(!this.walletForm.valid)
    {
      this.rest.showAlert("Erreur Saisie", "Veuillez vérifier les champs incorrects");
    }
    else
    {
      // transforme le montant en float
      this.walletForm.controls.montant.setValue(parseFloat(this.walletForm.controls.montant.value).toFixed(2));
      this.transferWallet(type);
    }
  }



/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////// TRANSFER ///
///////////////////////////////////////////////////////////////////////////
  // Requête POST à l'API de lemonway pour création de wallet
  private transferWallet(type)
  {
    console.log(type);

      let  url  = this.rest.urlServer + "/addOperation.php";

      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('id', this.dataClientLocal.id);
      urlSearchParams.append('montant', this.walletForm.controls.montant.value);
      urlSearchParams.append('commentaire', this.walletForm.controls.commentaire.value);
      urlSearchParams.append('type', type);
      //urlSearchParams.append('commission', );
      if(type == "moneyIn")
      {
        urlSearchParams.append('source', this.dataClientLocal.telephone);
        urlSearchParams.append('target', "LemonWay");
      }
      if(type == "moneyOut")
      {
        urlSearchParams.append('source', "LemonWay");
        urlSearchParams.append('target', this.dataClientLocal.telephone);
      }
     

      let body = urlSearchParams.toString();

      // send data
      this.rest.post(url, body, true)
      .then(value =>
        {
           // _sytem : system browser
           // _blank : app browser 
           // _self : cordova browser
          if(value['success'] != undefined) 
          {
            if(type == "moneyIn") this.inappbrowser.create( this.rest.webkitURL + "?moneyintoken=" + value['success']['MONEYINWEB']['TOKEN']+"&p=https://www.lemonway.fr/mercanet_lw.css&lang=fr", "_system", this.options);
            if(type == "moneyOut")
            {
              this.rest.presentToast("L'argent a été crédité sur le compte avec succès");
            }
          }
        })
          .catch(err =>
        {
          this.rest.showAlert("Erreur Serveur : ", err);
        });
  }

  


}
