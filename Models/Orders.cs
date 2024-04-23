using System.Linq.Expressions;

namespace Stock_Exchange.Models
{
    public class Orders
    {
        public Guid Id { get; set; }
        public string Symbol {  get; set; }
        public string Type { get; set; }
        public int Quantity { get; set; }

        public Orders(Guid Id, string Symbol, string Type, int Quantity) 
        {
            this.Id = Id;
            this.Symbol = Symbol;
            this.Type = Type;
            this.Quantity = Quantity;

        }
    }
}
