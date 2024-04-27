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
  orders: OrdersDetails[];
  form: FormGroup;
  isModalOpen = false;
  isModalHistoryOpen = false;
 

  constructor(private fb: FormBuilder, private http: HttpClient, private webSocketService: WebSocketService) { // Inject WebSocketService
    this.stocks = [];
    this.orders = [];
    this.form = this.fb.group({
      stockSymbol: [''],
      orderType: [''],
      quantity: ['']
    });
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  openHistoryModal() {
    const headers = new HttpHeaders().set('X-Api-Key', 'EDIG_Assessment');
    this.http.get<OrdersDetails[]>('http://localhost:7272/order', { headers }).subscribe(data => {
      this.orders = data;
    });

    this.isModalHistoryOpen = true;
  }

  closeHistoryModal() {
    this.isModalHistoryOpen = false;
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

        stock.isPriceRecentlyUpdated = true;
        setTimeout(() => {
          stock.isPriceRecentlyUpdated = false;
        }, 3000);
      }
    });
  }
  placeOrder() {
    const headers = new HttpHeaders().set('X-Api-Key', 'EDIG_Assessment');
    const order = {
      Symbol: this.form.get('stockSymbol')?.value,
      Type: this.form.get('orderType')?.value,
      Quantity: this.form.get('quantity')?.value,
      TimeStamp: new Date().toISOString()
    };

    this.http.post('http://localhost:7272/order', order, { headers }).subscribe(response => {
      console.log(response);
    });
    this.closeModal();
  }

}

export interface StocksDetails {
  title: string,
  symbol: string,
  currentPrice: number,
  priceHistories: PriceHistory[]
  isPriceRecentlyUpdated?: boolean;
}
export interface OrdersDetails {
  symbol: string,
  type: string,
  quantity: number,
  timeStamp: string
}


export interface PriceHistory {
  price: number,
  timeStamp: string
}
export interface StockUpdate {
  symbol: string;
  price: number;
}
