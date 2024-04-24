using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Stock_Exchange.Hubs;
using Stock_Exchange.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Linq;

namespace Stock_Exchange.Controllers
{

    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = "APIKey")]
    public class StocksController : ControllerBase
    {
        //private readonly IHubContext<StockUpdates> HubContext;
        private readonly IHubContext<StockUpdates,ClientHub> HubContext;
        private static Timer _timer;
        //This will act as a database for this assessment
        private readonly ILogger<StocksController> loggerList;
        private static List<Stocks> stocksList; // Make stocksList static so it persists across requests

        public StocksController(ILogger<StocksController> logger, IHubContext<StockUpdates, ClientHub> hubContext)
        {
            loggerList = logger;
            HubContext = hubContext;
            if (stocksList == null) // Only initialize stocksList if it hasn't been initialized yet
            {
                stocksList = GetInitialStocks();
            }

            
            if (_timer == null) // Only initialize _timer if it hasn't been initialized yet
            {
                System.Diagnostics.Debug.WriteLine("call timer");
                // Start a timer to update stocks every 5 seconds
                _timer = new Timer(state => UpdateStocks(), null, 0, 5000);
            }


        }


        [HttpGet]
        public IEnumerable<Stocks> stocks()
        {
            return stocksList;
        }

        [HttpGet("{symbol}/history")]
        public IEnumerable<PriceHistory> GetStockHistory(string symbol)
        {
            var stock = stocksList.FirstOrDefault(s => s.Symbol == symbol);
            if (stock != null)
            {
                return stock.PriceHistories;
            }
            return new List<PriceHistory>();
        }

        private List<Stocks> GetInitialStocks()
        {
            Random rnd = new Random();

            return new List<Stocks>
            {
                new Stocks(
    Guid.NewGuid(),
    "Apple Inc.",
    "AAPL",
    166.28 + rnd.NextDouble() * 100 - 50,
    new List<PriceHistory> { new PriceHistory(166.10, DateTime.Now.AddDays(-1)) }
),
new Stocks(
    Guid.NewGuid(),
    "Alphabet Inc.",
    "GOOGL",
    158.54 + rnd.NextDouble() * 100 - 50,
    new List<PriceHistory> { new PriceHistory(158.10, DateTime.Now.AddDays(-1)) }
),
new Stocks(
    Guid.NewGuid(),
    "Microsoft Corporation",
    "MSFT",
    406.63 + rnd.NextDouble() * 100 - 50,
    new List<PriceHistory> { new PriceHistory(406.10, DateTime.Now.AddDays(-1)) }
),
new Stocks(
    Guid.NewGuid(),
    "Amazon.com Inc.",
    "AMZN",
    178.53 + rnd.NextDouble() * 100 - 50,
    new List<PriceHistory> { new PriceHistory(178.10, DateTime.Now.AddDays(-1)) }
),
new Stocks(
    Guid.NewGuid(),
    "Tesla Inc.",
    "TSLA",
    145.53 + rnd.NextDouble() * 100 - 50,
    new List<PriceHistory> { new PriceHistory(145.10, DateTime.Now.AddDays(-1)) }
)
            };
        }

        private void UpdateStocks()
        {
            //System.Diagnostics.Debug.WriteLine("backend updating");
            Random rnd = new Random();

            // Randomly select a stock
            var stock = stocksList[rnd.Next(stocksList.Count)];

            // Update the current price and add a new price history
            var newPrice = stock.CurrentPrice + rnd.NextDouble() * 100 - 50;
            stock.CurrentPrice = newPrice;
            stock.PriceHistories.Add(new PriceHistory(newPrice, DateTime.Now));
            System.Diagnostics.Debug.WriteLine($"UpdateStocks: Updated price for {stock.Symbol} to {newPrice}");
            var priceUpdate = new PriceUpdate
            {
                Symbol = stock.Symbol,
                Price = newPrice
            };

            // Send price update to all clients
            HubContext.Clients.All.BroadcastMessage(priceUpdate);
        }


    }
}
