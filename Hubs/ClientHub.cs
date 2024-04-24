using Stock_Exchange.Models;

namespace Stock_Exchange.Hubs
{
    public interface ClientHub
    {
        Task BroadcastMessage(PriceUpdate priceUpdate);
    }
}
