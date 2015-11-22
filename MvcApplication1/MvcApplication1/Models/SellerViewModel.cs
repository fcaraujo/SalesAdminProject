using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class SellerViewModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public Guid UserId { get; set; }
    }
}