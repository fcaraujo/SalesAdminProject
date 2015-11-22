using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Models
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/
        
        [AllowAnonymous]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(UserViewModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel userModel = new UserModel();
                User user = userModel.findByEmail(model.Email);

                if (user != null && verifyMd5Hash(model.Password, user.Password))
                {
                    Session["user"] = user;
                    return RedirectToAction("List", "Customer");
                }

                ViewData["authErrorMessage"] = "The e-mail and/or password entered is invalid. Please try again.";
            }

            return View(model);
        }
        
        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Index", "Home");
        }
        
        private string getMd5Hash(string input)
        {
            MD5 md5Hasher = MD5.Create();
            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }

        private bool verifyMd5Hash(string input, string hash)
        {
            string hashOfInput = getMd5Hash(input);
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;
            if (0 == comparer.Compare(hashOfInput, hash))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
