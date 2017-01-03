import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase';
// import { REQUESTS } from '../../assets/providers/mock-game-requests';

/*
  Generated class for the ServerPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'server.html',
})


export class ServerPage {
  REQUESTS = {
  lkjdfsl:{
    name: "AJ",
    id: "sldfkjslj"
  },
  lkjda:{
    name: "Ron",
    id: "utyuhjk"
  },
  yuue:{
    name: "Mark",
    id: "sdfdfwd"
  },
  sfgsgf:{
    name: "Adam",
    id: "bvcxxsrr"
  },
  zcvzv:{
    name: "Gabe",
    id: "lkddfg"
  },
  adffdf:{
    name: "Til",
    id: "dfgbert"
  }
}

  fbRequests = firebase.database().ref('requests');
  fbActive = firebase.database().ref('active');
  email = "server@aj.com";
  password = "aDW3__4jS2G_f";

  constructor(private navCtrl: NavController) {
    this.init();
  }


  popRequests(){
    console.log('pop');
    var test = {};
    test = this.REQUESTS;
    console.log(test);
    this.fbRequests.set(test);
  }

  testRemove(){
    var request:any = "bvcxxsrr";
    var request2:any = "sldfkjslj";
    // var requests = this.fbRequests;
    var active = this.fbActive;

    active.child(request).child(request).remove();
    active.child(request).child(request2).remove();

    console.log(request);
    console.log(request2);
  }

  testUser(){
    var testUser:string = "";
    var userFB = firebase.database().ref('users/' + testUser + '/server');
    userFB.set({test: "t"});
  }




  preUser;
  numOfRequests:number = 0;
  preUserKey;
  init(){
    var requests = this.fbRequests;
    var active = this.fbActive;

    requests.once('child_added', (snap)=>{
      var val = snap.val();
      var key = snap.key;
      var fbKey;
      if(this.numOfRequests == 0 ){
        fbKey = active.push().key;
        active.child(fbKey).child(val.id).set({
          gameStart: false
        });
        requests.child(key).remove();
        this.preUser = val.id;
        this.preUserKey = fbKey;
        this.numOfRequests = 1;
      }else{
        active.child(this.preUserKey).child(val.id).set({
          gameStart: true
        });
        active.child(this.preUserKey).child(this.preUser).set({
          gameStart: true
        });
        requests.child(key).remove();
        this.preUser = null;
        this.preUserKey = null;
        this.numOfRequests = 0;
      }
      this.init();
    })



  //   var firstRequest:any = this.fbRequests.orderByValue();
  //   firstRequest.once('value')
  //     .then((snapshot) => {
  //       console.log(snapshot.numChildren())
  //       snapshot.forEach((childSnapshot) => {
  //         console.log(childSnapshot.key);
  //         console.log(childSnapshot.val());
  //         // numOfRequests++;
  //     })
  //   })
  }

}
