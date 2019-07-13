using System.Web.Mvc;

namespace ServiceMs.Base
{
    public class SessionUserParameterAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// 在过程请求授权时调用。
        /// </summary>
        /// <param name="filterContext">筛选器上下文，它封装有关使用 <see cref="T:System.Web.Mvc.AuthorizeAttribute"/> 的信息。</param><exception cref="T:System.ArgumentNullException"><paramref name="filterContext"/> 参数为 null。</exception>
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
            var isAuthenticated = filterContext.HttpContext.Session != null && filterContext.HttpContext.Session["LoginInfo"] != null;
            if (!isAuthenticated)
            {
                var result = new ContentResult { Content = "<script>window.top.location='/Login/index'</script>" };
                filterContext.Result = result;
            }
        }


    }
}