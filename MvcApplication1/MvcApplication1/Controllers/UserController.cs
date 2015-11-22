using MvcApplication1.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class UserController : Controller
    {
        //
        // GET: /User/

        public JsonResult Get()
        {
            var user = Session["user"];

            if( user == null )
            {
                return fail();
            }
            else
            {
                var model = new UserModel();
                var _user = (User)user;
                
                return Json( new { 
                    success = true,
                    role = _user.Role.name
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult fail()
        {
            return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
    }
}
