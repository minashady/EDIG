using Microsoft.AspNetCore.Mvc;
using Stock_Exchange.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Stock_Exchange.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private static List<Orders> ordersList = new List<Orders>(); // This will act as a database for this assessment

        [HttpGet]
        public IEnumerable<Orders> GetOrders()
        {
            return ordersList;
        }

        [HttpPost]
        public IActionResult CreateOrder([FromBody] Orders order)
        {
            // Generate a new Id for the order
            order.Id = Guid.NewGuid();

            // Add the new order to the list
            ordersList.Add(order);

            // Return a success status code
            return Ok();
        }
    }
}
