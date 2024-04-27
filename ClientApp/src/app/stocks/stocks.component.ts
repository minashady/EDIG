import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { WebSocketService } from '../../../Services/webSocket.service';
import { catchError, throwError } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'



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
      stockSymbol: [{ value: '', disabled: true }],
      orderType: [{ value: '', disabled: true }],
      quantity: ['']
    });
  }
  openModal(stockSymbol: string, orderType: string) {

    this.form.setValue({
      stockSymbol: stockSymbol,
      orderType: orderType,
      quantity: ''
    });

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  openHistoryModal() {
    const headers = new HttpHeaders().set('X-Api-Key', 'EDIG_Assessment');
    this.http.get<OrdersDetails[]>('http://localhost:7272/order', { headers }).subscribe(data => {
      this.orders = data;
      if (this.orders.length < 1) {
        Swal.fire({
          title: 'You have not placed any orders Yet',
          text: 'Orders placed will show up here',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
      else {
        this.isModalHistoryOpen = true;
      }
    });


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
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    const headers = new HttpHeaders().set('X-Api-Key', 'EDIG_Assessment');
    const order = {
      Symbol: this.form.get('stockSymbol')?.value,
      Type: this.form.get('orderType')?.value,
      Quantity: this.form.get('quantity')?.value,
      TimeStamp: new Date().toISOString()
    };

    // Calculate the total quantity of this stock that the user has bought and sold
    let totalBought = Number(this.orders.filter(pastOrder => pastOrder.symbol === order.Symbol && pastOrder.type == "Buy").reduce((sum, pastOrder) => sum + Number(pastOrder.quantity), 0));
    let totalSold = Number(this.orders.filter(pastOrder => pastOrder.symbol === order.Symbol && pastOrder.type == "Sell").reduce((sum, pastOrder) => sum + Number(pastOrder.quantity), 0));

    // Check if the user has enough stocks to sell
    let hasEnoughStocks = totalBought - totalSold >= order.Quantity;

    if (order.Symbol == "" || order.Symbol == null) {
      Toast.fire({
        icon: "error",
        title: "You have to enter a valid stock Symbol"
      });
    }
    else if (order.Type == "" || order.Type == null) {
      Toast.fire({
        icon: "error",
        title: "You have to enter a valid order type (either Buy or Sell)"
      });
    }
    else if (order.Quantity == "" || order.Quantity == null) {
      Toast.fire({
        icon: "error",
        title: "You have to enter a stock quantity for your order"
      });
    }
    else if (!this.stocks.some(stock => stock.symbol === order.Symbol)) {
      Toast.fire({
        icon: "error",
        title: "Your chosen Stock is not among the available stocks , please choose one of the available stocks"
      });
    }
    else if (!this.orders.some(pastOrder => pastOrder.symbol === order.Symbol && pastOrder.type == "Buy") && order.Type == "Sell") {
      Toast.fire({
        icon: "error",
        title: "You cannot sell a stock you don't own"
      });
    }
    else if (order.Type == "Sell" && !hasEnoughStocks) {
      Toast.fire({
        icon: "error",
        title: `You don't have enough stocks to sell. You only have ${totalBought - totalSold} stocks.`
      });
    }
    else {
      Swal.fire({
        title: 'Are you sure?',
        text: `Your order details are in order, are you sure you want to continue? You are about to ${order.Type} ${order.Quantity} of Stock ${order.Symbol}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post('http://localhost:7272/order', order, { headers }).subscribe(response => {
            console.log(response);
            const order: OrdersDetails = {
              symbol: this.form.get('stockSymbol')?.value,
              type: this.form.get('orderType')?.value,
              quantity: this.form.get('quantity')?.value,
              timeStamp: new Date().toISOString()
            };
            this.orders.push(order);
          });
          this.closeModal();
          Toast.fire({
            icon: "success",
            title: "Your order has been placed successfully, you can check your order history for more details"
          });
        }
      })
    }
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
