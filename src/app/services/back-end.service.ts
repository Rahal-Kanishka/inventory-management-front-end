import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { ColDef } from "ag-grid-community";

const API_URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

    getRequest(getPath: string): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token')
      });
      return this.http.get<any>(API_URL + getPath, { headers });
    }


    putRequest(updateData: any, putPath: string): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token')
      });
      return this.http.put<any>(API_URL + putPath, updateData,{ headers });
    }

    postRequest(saveData: any, postPath: string): Observable<any> {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };

      return new Observable((subscriber) => {
        this.http.post<any>(API_URL + postPath, saveData, httpOptions).subscribe(
          (response) => {
            return subscriber.next(response)
          }, error => {
            return subscriber.next(error)
          }
        );
      });



    }



}
