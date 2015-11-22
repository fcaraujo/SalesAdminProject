using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class ClassificationModel
    {
        DBEntities dbContext = new DBEntities();

        public IQueryable<Classification> findAll()
        {
            return dbContext.Classification;
        }
    }
}