import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stocks: StocksDetails[];

  constructor(private http: HttpClient) {
    this.stocks = [];
  }

  ngOnInit() {
    this.getStocks();
  }
  getStocks() {
    const headers = new HttpHeaders().set('X-Api-Key', 'EDIG_Assessment'); 

    this.http.get<StocksDetails[]>('http://localhost:7272/stocks', { headers }).subscribe(data => {
      this.stocks = data;
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
