using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using BTDataSyncServer.Common;

namespace WindowsService1
{
    public partial class Service1 : ServiceBase
    {
        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            LogHelper.WriteLog("服务已启动成功！");
        }

        protected override void OnStop()
        {
            LogHelper.WriteLog("服务已停止。");
        }
    }
}
