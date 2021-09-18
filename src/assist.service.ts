import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistService {
  private API_URL = 'https://reqres.in/api/'

  constructor(public http: HttpClient) { }

  sendUserInput(string: string){
    return new Promise((resolve, reject) => {
      var data = {
        text: string // aqui é o objeto que será enviado via HTTP POST
      };

      this.http.post(this.API_URL + 'register', data) // aqui então é pro endpoint https://reqres.in/api/register
        .subscribe((result: any) => { // em caso de erro de CORS, é necessário criar um proxy. o exemplo de como criar um está no código do coleta-dados-ui, no root.
          // o proxy tbm seria configurado no package.json, verificar como está o package.json de lá
          resolve(result.json());
        },
        (error) => {
          reject(error.json());
        });
    });
  }
}
