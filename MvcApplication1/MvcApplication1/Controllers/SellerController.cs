using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class SellerController : Controller
    {
        //
        // GET: /Seller/
        public JsonResult Get()
        {
            var roleModel = new RoleModel();
            Role sellerRole = roleModel.findByName("Seller");
            var sellerList = sellerRole.User.ToList();
            
            var _res = from U in sellerList
                       select new SellerViewModel
                       {
                            Name = U.Name
                            , UserId = U.UserId
                        };

            return Json(new
            {
                success = true,
                rowData = _res
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
