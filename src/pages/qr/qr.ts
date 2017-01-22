import { Component } from '@angular/core';

import { NavController, NavParams, ViewController } from 'ionic-angular';
import {Screenshot} from 'ionic-native';


@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html'
})
export class QR {
  name;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.name = navParams.get('name');
  }

  shot(){
    Screenshot.save('jpg', 80, this.name + '.jpg');
    alert('Screenshot saved');
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
