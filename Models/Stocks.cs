namespace Stock_Exchange.Models
{
    public class Stocks
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Symbol { get; set; }
        public double CurrentPrice { get; set; }
        public List<PriceHistory> PriceHistories { get; set; }
        public Stocks(Guid id, string title, string symbol, double currentPrice, List<PriceHistory> priceHistories)
        {
            Id = id;
            Title = title;
            Symbol = symbol;
            CurrentPrice = currentPrice;
            PriceHistories = priceHistories;
        }

        
    }
}

