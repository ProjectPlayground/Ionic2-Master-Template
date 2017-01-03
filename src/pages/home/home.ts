import {Component} from '@angular/core';
import {NavController, ModalController } from 'ionic-angular';


@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  content:boolean;



  constructor(private navController: NavController, private modalController: ModalController ) {
  }
}
