import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NavController, Platform } from '@ionic/angular';
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
  
  constructor(public navCtrl: NavController, private plt: Platform, private speechRecognition: SpeechRecognition, private cd: ChangeDetectorRef) { 
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