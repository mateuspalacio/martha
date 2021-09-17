import { Component, OnInit, Input, Injectable } from '@angular/core';
import { SpeechRecognition, SpeechRecognitionListeningOptions } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
@Injectable({
  providedIn: 'root' // just before your class
})
export class ExploreContainerComponent implements OnInit {
  constructor(){}
  ngOnInit(): void {
    
  }
  
}
