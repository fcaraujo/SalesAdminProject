using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Models
{
    public class HomeController : Controller
    {
        public ActionResult Index(string returnUrl)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                return RedirectToAction("List", "Customer");
            }
        }
    }
}