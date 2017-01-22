import { Component } from '@angular/core';

import { NavController, NavParams, ViewController, ToastController  } from 'ionic-angular';
import {Screenshot} from 'ionic-native';


@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html'
})
export class QR {
  name;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController) {
    this.name = navParams.get('name');
  }

  shot(){
    Screenshot.save('jpg', 80, this.name + '.jpg').then(
      res => this.presentToast('Screenshot saved'),
      err => this.presentToast("Error taking picture: " + err)
    );
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

   presentToast(text:string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }

}
