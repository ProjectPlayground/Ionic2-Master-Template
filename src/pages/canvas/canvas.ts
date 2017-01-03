import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as createjs from 'createjs-collection';

/*
  Generated class for the Canvas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-canvas',
  templateUrl: 'canvas.html'
})
export class CanvasPage {
  can;

  test(){
    console.log('removed');
    this.can.remove();
  }

  test2(){
    this.navCtrl.pop();
  }

  ionViewDidLoad(){
    console.log('Did Load');
  }
    
  ionViewWillEnter() {
    console.log('Will Enter');
  }
  
  ionViewDidEnter() {
    console.log('Did Enter');
    this.init1();
  }

  ionViewWillLeave(){
    console.log('Will Leave');
  }

  ionViewDidLeave(){
    console.log('Did Leave');
  }

  ionViewWillUnload(){
    console.log('Will Unload');
  }

  constructor(public navCtrl: NavController) {}

  tester = 350;


      init1(){
    var stage = new createjs.Stage("demoCanvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);

    stage.update();

    createjs.Tween.get(circle, { loop: true })
    .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
    .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
    .to({ alpha: 0, y: 225 }, 100)
    .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
    .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
  }

}
