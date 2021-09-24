import { Observable } from 'rxjs';
import { Recipient } from './../../models/recipient';
import { Sender } from './../../models/sender';
import { AssistService } from './../../assist.service';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NavController, Platform } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
//import { SpeechRecognition } from '@ionic-native/speech-recognition';

const SENDER = 'TabletTotem'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  matches: String[];
  isRecording = false;
  preferredLanguage = 'pt-BR'
  speechRecognized: string
  zone: any;
  message = {} as Sender;
  response: Array<Recipient> = [];
  resp$ = {} as Observable<Array<Recipient>>;
  constructor(public navCtrl: NavController, private plt: Platform, private speechRecognition: SpeechRecognition, private cd: ChangeDetectorRef, 
    private assist: AssistService, private tts: TextToSpeech) { 
  }
  ngOnInit() {
  }
  startListening(){
    let options = {
      language: 'pt-BR'
    }

    this.speechRecognition.startListening(options).subscribe(matches => {
      this.matches = matches;
      this.cd.detectChanges();
      this.message = {
          sender: SENDER,
          text: matches[0]
      }

      this.resp$ = this.assist.sendUserInput(this.message);
      this.resp$.subscribe(data => {
        this.response = data;
        console.log("recebido", data);
        
        const text = this.response.map(res => res.text).join(' ');
        
        // REMOVER DEPOIS...
        this.response[0].text = 'Resposta: ' + this.response[0].text;

        this.tts.speak({ 
          text,
          locale: 'pt-BR',
        });

        this.cd.detectChanges();
      });
      // .subscribe(data => {
      //     this.response = data as Recipient;
      // })
    });
    this.isRecording = true;
  }
  stopListening(){
    this.speechRecognition.stopListening().then(()=>{
      this.isRecording = false;
    });
  }
  getPermissions(){
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if(!hasPermission){
        this.speechRecognition.requestPermission();
      }
    })
  }
  restartSession() {
    this.resp$ = this.assist.restartSession(SENDER);
    this.resp$.subscribe(data => {
      console.log('[INFO] Restarted...');
      console.log(data);
    
      this.matches = [];
      this.response = [];

      this.cd.detectChanges();
    });

  }
  isIos(){
    return this.plt.is('ios');
  }


}