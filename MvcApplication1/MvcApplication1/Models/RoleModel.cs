using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class RoleModel
    {
        DBEntities dbContext = new DBEntities();

        public Role findByName(string name)
        {
            return dbContext.Role.Where(r => r.name.Equals(name)).FirstOrDefault();
        }
    }
}