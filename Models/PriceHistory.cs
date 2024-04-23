namespace Stock_Exchange.Models
{
    public class PriceHistory
    {
        public double Price { get; set; }
        public DateTime TimeStamp { get; set; }
        public PriceHistory(double price, DateTime timeStamp)
        {
            Price = price;
            TimeStamp = timeStamp;
        }
        
    }
}
