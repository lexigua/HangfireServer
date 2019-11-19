using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using ServiceMs.Base;
using ServiceMs.Models;
using Util;
using Util.ApplicationServices;
using System.ServiceProcess;

namespace ServiceMs.Controllers
{
    public class ServiceController : GridControllerBase<ServerInfo, ServerInfoQuery>
    {
        private static string ConfigPath = ConfigurationManager.AppSettings["ConfigPath"];
        private static string ServiceName = ConfigurationManager.AppSettings["ServiceName"];

        public ServiceController()
        {
        }

        /// <summary>
        /// 初始化表格控制器
        /// </summary>
        /// <param name="service">服务</param>
        public ServiceController(IBatchService<ServerInfo, ServerInfoQuery> service)
            : base(service)
        {
        }


        //
        // GET: /Service/

        public override ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="query">查询对象</param>
        public override ActionResult Query(ServerInfoQuery query)
        {
            SetPage(query);
            var result = XmlHelper.XmlToList<ServerInfo>(ConfigPath, "ServerInfos/ServerInfo");
            if (!query.TaskName.IsNullOrWhiteSpace())
            {
                result = result.Where(t => t.TaskName.Contains(query.TaskName)).ToList();
            }

            if (!query.AddPerson.IsNullOrWhiteSpace())
            {
                result = result.Where(t => t.AddPerson.Contains(query.AddPerson)).ToList();
            }
            if (!query.IsUsable.IsNullOrWhiteSpace())
            {
                result = result.Where(t => t.IsUsable.ToString().ToLower() == query.IsUsable).ToList();
            }

            var totalCount = result.Count;
            result = result.Skip((query.Page-1) * query.PageSize).Take(query.PageSize).ToList();
            return ToDataGridResult(ConvertQueryResult(result).ToList(), totalCount);
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="addList">新增列表</param>
        /// <param name="updateList">修改列表</param>
        /// <param name="deleteList">删除列表</param>
        public override ActionResult Save(string addList, string updateList, string deleteList)
        {
            try
            {
                var listAdd = Util.Json.ToObject<List<ServerInfo>>(addList);
                foreach (var item in listAdd)
                {
                    item.Id = Guid.NewGuid().ToString();
                }
                var listUpdate = Util.Json.ToObject<List<ServerInfo>>(updateList);
                var listDelete = Util.Json.ToObject<List<ServerInfo>>(deleteList);

                XmlHelper.AddXmlNodes(ConfigPath, "ServerInfos", "ServerInfo", listAdd);
                XmlHelper.UpdateNodes(ConfigPath, "ServerInfos", "Id", listUpdate);
                XmlHelper.DeleteNodes(ConfigPath, "ServerInfos", "Id", listDelete);
            }
            catch (Exception ex)
            {
                return Fail("保存失败," + ex.Message);
            }
            return Ok(R.SaveSuccess);
        }

        public ActionResult ReStartService()
        {
            System.ServiceProcess.ServiceController service = new System.ServiceProcess.ServiceController(ServiceName);
            try
            {
                if (service.Status == ServiceControllerStatus.Running)
                {
                    service.Stop();
                    service.WaitForStatus(ServiceControllerStatus.Stopped);
                    
                }
                Thread.Sleep(1000);
                service.Start();
                service.WaitForStatus(ServiceControllerStatus.Running);
              
            }
            catch (Exception ex)
            {
                return Fail("服务重启失败," + ex.Message);
            }

            return Ok("服务重启成功");
        }

    }
}
