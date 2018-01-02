import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController, ActionSheetController, LoadingController, Loading, Platform } from 'ionic-angular';


@Injectable()
export class RestProvider 
{

	public urlServer 	: string = "http://92.222.155.235:443/scripts";
	public loading		: Loading;
	public dataClient	: any = undefined;
	public webkitURL	: string = "https://sandbox-webkit.lemonway.fr/nxvision2/dev/";

	constructor(	public http				: HttpClient,
					public loadingCtrl		: LoadingController,
	  				public alertCtrl 		: AlertController,
	  				public toastCtrl		: ToastController,
	  				public actionSheetCtrl	: ActionSheetController,
					public platform			: Platform) 
	{
	}



	/*/////////////////////////////////////////////////////////////////////////////// */
	/*///////////////////////////////////////////////////// ALERT METHODS//////////// */
	/*/////////////////////////////////////////////////////////////////////////////// */	
	public showAlert(title, message) 
	{
		let alert = this.alertCtrl.create
		({
		  title: title,
		  subTitle: message,
		  buttons: ['OK']
		});
		alert.present();
	}

	public presentToast(text)
	{
		let toast = this.toastCtrl.create(
		{
			message: text,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}



	/*/////////////////////////////////////////////////////////////////////////////// */
	/*////////////////////////////////////////////////////// HTTP METHODS//////////// */
	/*/////////////////////////////////////////////////////////////////////////////// */
  	public get(url, load)
	{
		if(load)
		{
			this.loading = this.loadingCtrl.create({
			    content: 'Chargement...',
			  });
			  this.loading.present();
		}

		return new Promise((resolve, reject) =>
		{
			this.http.get(url)
			.subscribe(
	  		(data) =>
			{
				if(load) this.loading.dismissAll();
				resolve(data);				
			
			},
			(err) =>
			{
				if(load) this.loading.dismissAll();
				reject(err);
			}
		);
		});
	}


	public post(url, body, load)
	{
		if(load)
		{
			this.loading = this.loadingCtrl.create({
			    content: 'Chargement...',
			  });
			  this.loading.present();
		}

		return new Promise((resolve, reject) =>
		{
			let heady = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

			this.http.post(url, body, {headers: heady})
			.subscribe(
	  		(data) =>
			{
				if(data['error'] == undefined)
				{
					if(load) this.loading.dismissAll();
					resolve(data);	
				}
				else
				{
					if(load) this.loading.dismissAll();
					reject(data['error']);	
				}				
			},
			(err) =>
			{
				if(load) this.loading.dismissAll();
				reject(err);
			}
		);
		});
	}


	/*//////////////////////////////////////////////////////////////////////////////////// */
	/*////////////////////////////////////////////////////// SPECIFIC REQUESTS//////////// */
	/*//////////////////////////////////////////////////////////////////////////////////// */
	public getSolde()
	{
		let tel = this.dataClient.telephone;

		this.get(this.urlServer + "/returnSolde.php" + "?telephone=" + tel, false)
	      .then(value =>
	      {
	       	if(value["success"] == undefined) this.presentToast("Utilisateur inconnu");
	  		else
	  		{
	  			this.dataClient.solde = value["success"];
	  		}
	      })
	      .catch(err =>
			{
				this.showAlert("Erreur Serveur", err);
			});
	}

}
