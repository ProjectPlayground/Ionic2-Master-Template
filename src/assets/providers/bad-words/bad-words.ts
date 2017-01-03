import { Injectable } from '@angular/core';
import { BADWORDLIST } from '../bad-word-list';
import 'rxjs/add/operator/map';

/*
  Generated class for the BadWords provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BadWords {

  clean(text:string): Promise<any> {
    var words = [];
    words = BADWORDLIST.words;
    var filterWords = BADWORDLIST.words;
    // "i" is to ignore case and "g" for global
    var rgx = new RegExp(filterWords.join("|"), "gi");

    function wordFilter(str) {
      return str.replace(rgx, "****");
    }
    var x = wordFilter(text);
    return Promise.resolve(x);
  }
}
