using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MvcApplication1.Models
{
    class CustomerModel
    {
        DBEntities dbContext = new DBEntities();

        public IQueryable<Client> findAll()
        {
            return dbContext.Client;
        }

        public IQueryable<Client> findBySellerId(Guid userId)
        {
            return dbContext.Client.Where(c => c.SellerId.Equals(userId));
        }
    }
}
