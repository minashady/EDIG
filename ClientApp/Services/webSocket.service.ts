import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject, Observable } from 'rxjs';
import { StockUpdate } from '../src/app/stocks/stocks.component';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private hubConnection: signalR.HubConnection;
  private subject: Subject<StockUpdate>;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:7272/priceUpdateHub')
      .build();

    this.subject = new Subject<StockUpdate>();

    this.hubConnection.start()
      .then(() => {
        this.hubConnection.on('BroadcastMessage', (PriceUpdate) => {
          //const update: StockUpdate = { symbol, price };
          this.subject.next(PriceUpdate);
        });
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  getMessages(): Observable<StockUpdate> {
    return this.subject.asObservable();
  }
}
