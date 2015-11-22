using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class RegionModel
    {
        DBEntities dbContext = new DBEntities();

        public IQueryable<Region> findAll()
        {
            return dbContext.Region;
        }
    }
}