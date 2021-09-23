import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipient } from './models/recipient';
import { Sender } from './models/sender';

@Injectable({
  providedIn: 'root'
})
export class AssistService {
  private API_URL = 'http://143.198.161.108:8000/'

  constructor(public http: HttpClient) { }

  sendUserInput(message: Sender): Observable<Array<Recipient>>{

      var resp = this.http.post<Array<Recipient>>(this.API_URL + 'messages/', message) // aqui então é pro endpoint http://143.198.161.108:8000/messages/
      return resp;
  }
}
