using System.Web.Mvc;
using Util.ApplicationServices;
using Util.Domains.Repositories;

namespace ServiceMs.Base
{
    public abstract class InterfaceControllerBase<TDto, TQuery> : Util.Webs.ControllerBase
        where TQuery : IPager
        where TDto : class ,IDto, new() {
        /// <summary>
        /// 初始化表格控制器
        /// </summary>
        /// <param name="service">服务</param>
        protected InterfaceControllerBase(IBatchService<TDto, TQuery> service) 
        {
            Service = service;
        }

        /// <summary>
        /// 服务
        /// </summary>
        protected new IBatchService<TDto, TQuery> Service { get; private set; }

        public virtual ActionResult Index()
        {
            return View();
        }
    }
}
