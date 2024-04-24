using Microsoft.AspNetCore.SignalR;

namespace Stock_Exchange.Hubs
{
    public class StockUpdates : Hub<ClientHub>
    {
        //public async Task updatePrice(string symbol, double price)
        //{
        //    await Clients.All.SendAsync("ReceiveUpdate", symbol, price);
        //}
    }
}
