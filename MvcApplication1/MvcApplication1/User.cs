//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MvcApplication1
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Data.Entity;
    using System.Security.Cryptography;
    using System.Text;
    
    public partial class User
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public System.Guid UserId { get; set; }
        public string Password { get; set; }
        public Nullable<System.Guid> RoleId { get; set; }
    
        public virtual Role Role { get; set; }
    } 
}
