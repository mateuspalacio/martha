import { Observable } from 'rxjs';
import { Recipient } from './../../models/recipient';
import { Sender } from './../../models/sender';
import { AssistService } from './../../assist.service';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NavController, Platform } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

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
  use_native_audio = true;
  preferredLanguage = 'pt-BR'
  full_response: string
  speechRecognized: string
  zone: any;
  message = {} as Sender;
  response: Array<Recipient> = [];
  resp$ = {} as Observable<Array<Recipient>>;

  constructor(public navCtrl: NavController, private plt: Platform, private speechRecognition: SpeechRecognition, private cd: ChangeDetectorRef, 
    private assist: AssistService, private tts: TextToSpeech, private nativeAudio: NativeAudio) { 
  }
  ngOnInit() {
    this.nativeAudio.preloadSimple('0e6279a37d4c9a4a8db5a0bda75f76a6', 'assets/audios/0e6279a37d4c9a4a8db5a0bda75f76a6.mp3');
    this.nativeAudio.preloadSimple('1ab425775ae974da4ce6b147198e115c', 'assets/audios/1ab425775ae974da4ce6b147198e115c.mp3');
    this.nativeAudio.preloadSimple('2a42dfeb17724a8528c599da66251850', 'assets/audios/2a42dfeb17724a8528c599da66251850.mp3');
    this.nativeAudio.preloadSimple('3ef8fa4e507a4b05bc11e6063847afe2', 'assets/audios/3ef8fa4e507a4b05bc11e6063847afe2.mp3');
    this.nativeAudio.preloadSimple('3fd9b7be9ecb91d963e3cead72015de3', 'assets/audios/3fd9b7be9ecb91d963e3cead72015de3.mp3');
    this.nativeAudio.preloadSimple('5de793ae0e15567e12705772ea6b557a', 'assets/audios/5de793ae0e15567e12705772ea6b557a.mp3');
    this.nativeAudio.preloadSimple('9d67dfa102f5fa8f464b9a9b06569636', 'assets/audios/9d67dfa102f5fa8f464b9a9b06569636.mp3');
    this.nativeAudio.preloadSimple('178d1512bc243ef55a0886fcf91d91b5', 'assets/audios/178d1512bc243ef55a0886fcf91d91b5.mp3');
    this.nativeAudio.preloadSimple('0201ea3768cfa2402500914468458b6a', 'assets/audios/0201ea3768cfa2402500914468458b6a.mp3');
    this.nativeAudio.preloadSimple('408d6bf70cafa0cbd550838b4a80a234', 'assets/audios/408d6bf70cafa0cbd550838b4a80a234.mp3');
    this.nativeAudio.preloadSimple('045533b749f088692a3dc9eb530816b0', 'assets/audios/045533b749f088692a3dc9eb530816b0.mp3');
    this.nativeAudio.preloadSimple('94387c1edec8905e5a12afde05b00633', 'assets/audios/94387c1edec8905e5a12afde05b00633.mp3');
    this.nativeAudio.preloadSimple('8979687333e4cf792495f19f7269cfe4', 'assets/audios/8979687333e4cf792495f19f7269cfe4.mp3');
    this.nativeAudio.preloadSimple('adf2619ae9ed62b82f284d27b94c1dd4', 'assets/audios/adf2619ae9ed62b82f284d27b94c1dd4.mp3');
    this.nativeAudio.preloadSimple('b8f5dede72b01ebd55876888523c7d96', 'assets/audios/b8f5dede72b01ebd55876888523c7d96.mp3');
    this.nativeAudio.preloadSimple('d5e31e4f03b3ebaa3bf71bfab2ca3ae6', 'assets/audios/d5e31e4f03b3ebaa3bf71bfab2ca3ae6.mp3');
    this.nativeAudio.preloadSimple('d8b00ac7f72c0bd010de5fca81f6bbd3', 'assets/audios/d8b00ac7f72c0bd010de5fca81f6bbd3.mp3');
    this.nativeAudio.preloadSimple('d9096ea4acd87c4afa9b2f0b26ce29ea', 'assets/audios/d9096ea4acd87c4afa9b2f0b26ce29ea.mp3');
    this.nativeAudio.preloadSimple('d18721458fb9793016983f4f8535bfc4', 'assets/audios/d18721458fb9793016983f4f8535bfc4.mp3');
    this.nativeAudio.preloadSimple('fab5a508f2fad46cd9be95a5d4b4c9d2', 'assets/audios/fab5a508f2fad46cd9be95a5d4b4c9d2.mp3');

    console.log('NgInit OK...')
  }
  async playSound(audioName: string) {
    // return new Promise((resolve, reject) => {
    //   this.nativeAudio.play(audioName, resolve).then((result) => {
    //     resolve(result);
    //   }).catch(err => reject(err))
    // });
    return new Promise((resolve) => {
      this.nativeAudio.play(audioName, (success) => resolve(success));
    });
  }
  async startListening(){
    let options = {
      language: 'pt-BR'
    }

    this.speechRecognition.startListening(options).subscribe(async matches => {
      this.matches = matches;
      this.cd.detectChanges();
      this.message = {
          sender: SENDER,
          text: matches[0]
      }

      this.resp$ = this.assist.sendUserInput(this.message);
      this.resp$.subscribe(async data => {
        this.response = data;
        console.log("recebido", data);
        
        const text = this.response.map(res => res.text).join(' ');

        if (this.use_native_audio) {
          for (const res of this.response) {
            await this.playSound(res.audio_name);
          }
        } else {
          // COLOCAR SE QUER VIA GOOGLE OU AWS
          this.tts.speak({ 
            text,
            locale: 'pt-BR',
          });
        }
        
        this.full_response = 'Resposta: ' + text
        this.cd.detectChanges();
      });
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