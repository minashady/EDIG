import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { WebSocketService } from '../../../Services/webSocket.service';
import { catchError, throwError } from 'rxjs';
import { ReactiveFormsModule,FormBuilder, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stocks: StocksDetails[];
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private webSocketService: WebSocketService) { // Inject WebSocketService
    this.stocks = [];
    this.form = this.fb.group({
      stockSymbol: [''],
      orderType: [''],
      quantity: ['']
    });
  }

  ngOnInit() {
    this.getStocks();
  }

  getStocks() {
    const headers = new HttpHeaders().set('X-Api-Key', 'EDIG_Assessment');

    this.http.get<StocksDetails[]>('http://localhost:7272/stocks', { headers }).subscribe(data => {
      this.stocks = data;
    });

    this.webSocketService.getMessages().pipe(
      catchError(err => {
        console.error('Error in subscribe:', err);
        return throwError(err);
      })
    ).subscribe((PriceUpdate: StockUpdate) => { // Specify the type of update
      console.log("frontend updating");
      // Find the stock that was updated
      const stock = this.stocks.find(s => s.symbol === PriceUpdate.symbol);

      if (stock) {
        // Get the previous price from PriceHistories
        const previousPrice = stock.priceHistories[stock.priceHistories.length - 1].price;

        // Update the current price
        stock.currentPrice = PriceUpdate.price;

        // Add the new price to PriceHistories
        stock.priceHistories.push({ price: PriceUpdate.price, timeStamp: new Date().toISOString() });
      }
    });
  }
  placeOrder() {
    const order = {
      Symbol: this.form.get('stockSymbol')?.value,
      Type: this.form.get('orderType')?.value,
      Quantity: this.form.get('quantity')?.value
    };

    this.http.post('http://localhost:7272/order', order).subscribe(response => {
      console.log(response);
    });
  }

}

export interface StocksDetails {
  title: string,
  symbol: string,
  currentPrice: number,
  priceHistories: PriceHistory[]
}

export interface PriceHistory {
  price: number,
  timeStamp: string
}
export interface StockUpdate {
  symbol: string;
  price: number;
}
