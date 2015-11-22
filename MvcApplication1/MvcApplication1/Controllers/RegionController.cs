using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class RegionController : Controller
    {
        //
        // GET: /Region/
        public JsonResult Get()
        {
            RegionModel model = new RegionModel();
            var _res = model.findAll().ToList();

            return Json(new
            {
                success = true,
                rowData = _res
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
