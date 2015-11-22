using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class UserModel
    {
        DBEntities dbContext = new DBEntities();

        public User findByEmail(string email)
        {            
            return dbContext.User.Where(u => u.Email.Equals(email)).FirstOrDefault();
        }

        public IQueryable<User> findByRole(Role sellerRole)
        {
            return dbContext.User.Where(u => u.Role.Equals(sellerRole));
        }
        
        public IQueryable<User> findBySellerRoleId(Guid sellerId)
        {
            return dbContext.User.Where(u => u.RoleId.Equals(sellerId));
        }
    }
}