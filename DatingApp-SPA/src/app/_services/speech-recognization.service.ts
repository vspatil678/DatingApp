import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognizationService {
 public speechRecognition: any;

constructor(private zone: NgZone) { }

public record(): Observable<string> {

  return Observable.create(observer => {
      // tslint:disable-next-line:no-angle-bracket-type-assertion
      const { webkitSpeechRecognition }: IWindow = <IWindow> window;
      this.speechRecognition = new webkitSpeechRecognition();
      // this.speechRecognition = SpeechRecognition;
      this.speechRecognition.continuous = true;
      // this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
          let term = '';
          if (speech.results) {
              const result = speech.results[speech.resultIndex];
              const transcript = result[0].transcript;
              if (result.isFinal) {
                  if (result[0].confidence < 0.3) {
                    //  console.log('Unrecognized result - Please try again');
                  } else {
                      term = _.trim(transcript);
                     // console.log('Did you said? -> " + term + " , If not then say something else...');
                  }
              }
          }
          this.zone.run(() => {
              observer.next(term);
          });
      };

      this.speechRecognition.onerror = error => {
          observer.error(error);
      };

      this.speechRecognition.onend = () => {
          observer.complete();
      };

      this.speechRecognition.start();
     // console.log('Say something - We are listening !!!');
  });
}

public DestroySpeechObject() {
  if (this.speechRecognition) {
    this.speechRecognition.stop();
  }
}

}
