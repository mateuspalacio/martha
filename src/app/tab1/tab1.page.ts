import { Observable } from 'rxjs';
import { Recipient } from './../../models/recipient';
import { Sender } from './../../models/sender';
import { AssistService } from './../../assist.service';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NavController, Platform } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
//import { SpeechRecognition } from '@ionic-native/speech-recognition';

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
    this.speechRecognition.startListening().subscribe(matches => {
      this.matches = matches;
      this.cd.detectChanges();
      this.message = {
          sender: "TabletTotem",
          text: matches[0]
      }
      this.resp$ = this.assist.sendUserInput(this.message);
      this.resp$.subscribe(data => {
        this.response = data
        console.log("recebido", data)
        console.log("variavel local", this.response[0])
      });
      this.tts.speak(this.response[0].text);
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
  isIos(){
    return this.plt.is('ios');
  }


}