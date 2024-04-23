using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stock_Exchange.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Stock_Exchange.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = "APIKey")]
    public class StocksController : ControllerBase
    {   //This will act as a database for this assessment
        private readonly ILogger<StocksController> loggerList;
        private static List<Stocks> stocksList; // Make stocksList static so it persists across requests

        public StocksController(ILogger<StocksController> logger)
        {
            loggerList = logger;
            if (stocksList == null) // Only initialize stocksList if it hasn't been initialized yet
            {
                stocksList = GetInitialStocks();
            }
            else
            {
                UpdateStocks();
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
            Random rnd = new Random();

            foreach (var stock in stocksList)
            {
                // Update the current price and add a new price history
                var newPrice = stock.CurrentPrice + rnd.NextDouble() * 100 - 50;
                stock.CurrentPrice = newPrice;
                stock.PriceHistories.Add(new PriceHistory ( newPrice, DateTime.Now ));
            }
        }

    }
}
