using System.Configuration;
using System.IO;
using System.Web.Mvc;
using System.Web.Security;
using ServiceMs.Base;
using ServiceMs.Models;

namespace ServiceMs.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

        public ActionResult Index()
        {
            Session.Clear();
            return View();
        }

        /// <summary>
        /// </summary>
        /// <param name="txtUser">登录名</param>
        /// <param name="txtPass">用户密码</param>
        /// <param name="txtType">登陆设备类型</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Index(string txtUser, string txtPass, string txtType, string imgCode, string key)
        {
            //if (Session["ValidateCode"] != null && imgCode.ToUpper() != Session["ValidateCode"].ToString().ToUpper())
            //{
            //    return Content("验证码错误");
            //}

            var userName = ConfigurationManager.AppSettings["UserName"];
            var userPwd = ConfigurationManager.AppSettings["Password"];
            if (txtUser.ToLower() == userName.ToLower() && txtPass.ToLower() == userPwd.ToLower())
            {
                FormsAuthentication.SetAuthCookie(txtUser, false);
                UserLoginDto dto = new UserLoginDto() { UserName = txtUser };
                Session["LoginInfo"] = dto;
                return Content("OK");
            }
            return Content("用户名或密码错误");
        }
        public ActionResult CheckCode()
        {
            string code = "";
            var img = ValidateManager.CreateImg(out code);
            Session["ValidateCode"] = code;
            MemoryStream ms = new MemoryStream();
            img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            return File(ms.ToArray(), "image/jpeg");
        }
    }
}
