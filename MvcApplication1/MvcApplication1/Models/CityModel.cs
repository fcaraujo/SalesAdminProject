using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class CityModel
    {
        DBEntities dbContext = new DBEntities();

        public IQueryable<City> findAll()
        {
            return dbContext.City;
        }
    }
}