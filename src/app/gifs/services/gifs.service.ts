import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  public gifList: Gif[] = [];

  private _tagsHistory: string[]= [];
  private apiKey: string = '19dKlWS1ty1iRykeaWCrw8dgcQsWH8OY';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();
    if (this.tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag)=> oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    sessionStorage.setItem('history', JSON.stringify(this._tagsHistory) );
  }

  private loadLocalStorage(): void{
    if(!sessionStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(sessionStorage.getItem('history')!)

    if(this._tagsHistory.length === 0 ) return
    this.searchTag(this._tagsHistory[0])

  }

  searchTag( tag: string):void{
    if (tag.length === 0) return;
    this.organizeHistory(tag)

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
    .subscribe(resp=>{
      this.gifList = resp.data;
    })

  }
}
