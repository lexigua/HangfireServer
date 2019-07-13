using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ServiceMs.Base;
using ServiceMs.Models;
using Util.Webs.EasyUi.Results;
using Util.Webs.EasyUi.Trees;

namespace ServiceMs.Controllers
{
    public class HomeController : Controller
    {
        private static string HangfireAddr = ConfigurationManager.AppSettings["HangfireAddr"];

        [SessionUserParameter]
        public ActionResult Index()
        {
            IList<MenuDto> list = GetDefaultMenu();
            return View(list);
        }

        private IList<MenuDto> GetDefaultMenu()
        {
            IList<MenuDto> menuLists = new List<MenuDto>();
            MenuDto menuDto = new MenuDto() { Name = "任务管理" };
            IList<TreeNode> treeNodes = new List<TreeNode>();
            treeNodes.Add(new TreeNode() { Id = Guid.NewGuid().ToString(), Text = "任务列表", Attributes = new { url = "/Service/Index" } });
            treeNodes.Add(new TreeNode() { Id = Guid.NewGuid().ToString(), Text = "任务调度", Attributes = new { url = HangfireAddr } });
            menuDto.Nodes = new TreeResult(treeNodes).ToString();
            menuLists.Add(menuDto);
            return menuLists;
        }
    }
}
