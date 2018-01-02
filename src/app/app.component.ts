import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { WalletPage } from '../pages/wallet/wallet';
import { ComptePage } from '../pages/compte/compte';
import { LoginPage } from '../pages/login/login';
import { OperationsPage } from '../pages/operations/operations';
import { RestProvider } from '../providers/rest/rest';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private rest : RestProvider) {

     this.initializeApp();

     this.pages = [
        { title: 'Wallet', component: WalletPage, icon: 'basket' },
        { title: 'Opérations', component: OperationsPage, icon: 'swap' },
        { title: 'Profil', component: ComptePage, icon: 'contact' },
        { title: 'Déconnexion', component: null, icon: 'log-out' },
      ];
  }


  initializeApp() {
    this.platform.ready().then(() => 
    {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
      // check internet connexion
      /*let disconnectSub = Network.onDisconnect().subscribe(() => 
      {
         this.
      });

      let connectSub = Network.onConnect().subscribe(()=> 
      {*/
            // Reset the content nav to have just this page
            // we wouldn't want the back button to show in this scenario
            if(page.component)
            {
              this.nav.setRoot(page.component);
            }
            else
            {
              this.rest.dataClient = undefined;
              this.nav.setRoot(LoginPage);
            }
      /*});*/
  }


}

