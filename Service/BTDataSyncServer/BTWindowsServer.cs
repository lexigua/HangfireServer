﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceProcess;
using BTDataSyncServer;
using BTDataSyncServer.Common;
using BTDataSyncServer.Model;
using BTWindowsServer.Method;
using Hangfire;
using Microsoft.Owin.Hosting;

namespace BTWindowsServer
{
    public partial class BTWindowsServer : ServiceBase
    {
        public BTWindowsServer()
        {
            InitializeComponent();
           
        }

        //要执行的任务列表
        List<ServerInfo> _serverList = null;

        protected override void OnStart(string[] args)
        {
            //服务初始化部分
            try
            {
                LogHelper.WriteLog("服务初始化开始");


                //为HangFire指定数据库连接
                GlobalConfiguration.Configuration.UseSqlServerStorage("HangFireDataBase");
                //重试次数设置
                GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute() { Attempts = 4 });
                var listenAddrs = ConfigurationManager.AppSettings["ListenerAddr"];

                //为Hangfire创建宿主Web服务并指定监听地址和端口  例如：http://localhost:9019
                StartOptions options = new StartOptions();
                var listenAddrArray = listenAddrs.Split(',');
                foreach (var addr in listenAddrArray)
                {
                    options.Urls.Add(addr);
                }
                WebApp.Start<Startup>(options);
                LogHelper.WriteLog("服务初始化结束");
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("服务初始化异常," + ex.Message);
            }


            try
            {
                LogHelper.WriteLog("开始读取配置文件");

                var configFileName = AppDomain.CurrentDomain.BaseDirectory + "Config\\" + "BTWindowsServerConfig.xml";

                //如果配置文件不存在则创建，否则任务列表从配置文件中读取
                if (!File.Exists(configFileName))
                {
                    XmlHelper.WriteServerInfoToXml(ServerInfos.ServerInfoList);
                }
                else
                {
                    _serverList = XmlHelper.ReadServerInfosXmlToDtos();
                }
                if (_serverList == null)
                {
                    _serverList = ServerInfos.ServerInfoList;
                }
                LogHelper.WriteLog("配置文件读取完成");

                LogHelper.WriteLog("开始添加任务列表");
                var serverInfos = _serverList.Where(t => t.IsUsable).ToList();
                foreach (var serverInfo in serverInfos)
                {
                    AddJob(serverInfo);
                }
                LogHelper.WriteLog("任务列表添加完成");

            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("服务启动异常：" + ex.Message);
            }
        }

        /// <summary>
        /// 添加任务到调度
        /// </summary>
        /// <param name="methodServerInfo"></param>
        private void AddJob(ServerInfo methodServerInfo)
        {
            try
            {
                RecurringJob.RemoveIfExists(methodServerInfo.TaskName);
                var type = typeof(ServerMethod);
                MethodInfo method = type.GetMethod(methodServerInfo.TaskMethod);

                if (method != null)
                {
                    RecurringJob.AddOrUpdate(methodServerInfo.TaskName,
                        () => ServerMethod.Execute(methodServerInfo.TaskMethod, methodServerInfo),
                        methodServerInfo.ExecTime, TimeZoneInfo.Local);
                }
                else if (methodServerInfo.TaskMethod.ToLower().StartsWith("http://")
                         || methodServerInfo.TaskMethod.ToLower().StartsWith("https://"))
                {
                    RecurringJob.AddOrUpdate(methodServerInfo.TaskName,
                        () => ServerMethod.ExcuteApi(methodServerInfo),
                        methodServerInfo.ExecTime, TimeZoneInfo.Local);
                }
                else
                {
                    LogHelper.WriteLog("加入任务队列失败，未查找到任务执行方法", methodServerInfo.TaskName);
                    return;
                }
                LogHelper.WriteLog("加入任务队列成功", methodServerInfo.TaskName);
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("加入任务队列失败," + ex.Message, methodServerInfo.TaskName);
            }
        }

        /// <summary>
        /// 服务停止
        /// </summary>
        protected override void OnStop()
        {
            StopTask();
            base.OnStop();
        }

        private void StopTask()
        {
            if (_serverList == null) return;

            foreach (ServerInfo serverInfo in _serverList)
            {
                if (serverInfo.IsUsable)
                {
                    RecurringJob.RemoveIfExists(serverInfo.TaskName);
                    LogHelper.WriteLog("服务停止，任务已停止执行。", serverInfo.TaskName);
                }
            }
        }
    }
}
