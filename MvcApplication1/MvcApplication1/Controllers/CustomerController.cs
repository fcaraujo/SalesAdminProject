using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Models
{
    public class CustomerController : Controller
    {
        //
        // GET: /Customer/
        public ActionResult Index()
        {
            return RedirectToAction("List", "Customer");
        }

        public JsonResult Get()
        {
            if (Session["user"] == null)
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

            CustomerModel selfModel = new CustomerModel();
            List<Client> _res = new List<Client>();

            RoleModel roleModel = new RoleModel();
            Role adminRole = roleModel.findByName("Administrator");
            Role sellerRole = roleModel.findByName("Seller");
            User user = (User) Session["user"];

            if (user.Role.RoleId.Equals(adminRole.RoleId))
            {
                _res = selfModel.findAll().ToList();
            }
            else if (user.Role.RoleId.Equals(sellerRole.RoleId))
            {
                _res = selfModel.findBySellerId(user.UserId).ToList();
            }

            return Json(new { 
                success = true,
                rowData = _res
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult List()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Login", "Login");
            }

            return View();
        }
    }
}
