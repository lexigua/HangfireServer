using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Web.Mvc;
using Util;
using Util.ApplicationServices;
using Util.Domains.Repositories;
using Util.Webs;

namespace ServiceMs.Base {
    /// <summary>
    /// 表格控制器
    /// </summary>
    /// <typeparam name="TDto">数据传输对象类型</typeparam>
    /// <typeparam name="TQuery">查询实体类型</typeparam>
    public abstract class GridControllerBase<TDto, TQuery> : QueryControllerBase<TDto, TQuery>
        where TQuery : IPager
        where TDto : class ,IDto, new() {
        /// <summary>
        /// 初始化表格控制器
        /// </summary>
        /// <param name="service">服务</param>
        protected GridControllerBase( IBatchService<TDto, TQuery> service ) 
            : base( service ) {
            Service = service;
        }

        protected GridControllerBase()   :base()
        {
        }

        /// <summary>
        /// 服务
        /// </summary>
        protected new IBatchService<TDto, TQuery> Service { get; private set; }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="addList">新增列表</param>
        /// <param name="updateList">修改列表</param>
        /// <param name="deleteList">删除列表</param>
        [HttpPost]
        //[ValidateAntiForgeryToken]
        //[FormExceptionHandler]
        
        public virtual ActionResult Save( string addList, string updateList, string deleteList ) {
            var listAdd = Util.Json.ToObject<List<TDto>>( addList );
            var listUpdate = Util.Json.ToObject<List<TDto>>( updateList );
            var listDelete = Util.Json.ToObject<List<TDto>>( deleteList );
            var data = Service.Save( listAdd, listUpdate, listDelete );
            return Ok( R.SaveSuccess, data );
        }

        /// <summary>
        /// 获取新实体
        /// </summary>
        /// <param name="parentId">父Id</param>
        [AjaxOnly]
        public virtual ActionResult New( string parentId ) {
            return ToJsonResult( Service.Create() );
        }
       

        private string CreatFolder()
        {
            string childFolder = string.Format("{0:yyyMMdd}", DateTime.Now);
            if (!Directory.Exists(Server.MapPath(ConfigurationManager.AppSettings["FileUploadPath"] + "/" + childFolder)))
            {
                Directory.CreateDirectory(Server.MapPath(ConfigurationManager.AppSettings["FileUploadPath"] + "/" + childFolder));
            }
            return childFolder + "/";
        }

        private string CreatFileName()
        {
            return string.Format("file{0:yyyyMMddHHmmssffffff}", DateTime.Now);
        }
    }
}
