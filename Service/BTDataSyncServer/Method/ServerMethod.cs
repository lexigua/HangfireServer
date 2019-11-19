using BTDataSyncServer.Common;
using BTDataSyncServer.Model;

namespace BTWindowsServer.Method
{
    public static class ServerMethod
    {
        /// <summary>
        /// 执行任务
        /// </summary>
        /// <param name="methodName"></param>
        /// <param name="serverInfo"></param>
        public static void Execute(string methodName, ServerInfo serverInfo)
        {
            LogHelper.WriteLog("--------------------------------------分割线任务开始-------------------------------------", serverInfo.TaskName);
            var type = typeof(ServerMethod);
            var method = type.GetMethod(methodName);
            if (method != null)
            {
                method.Invoke(null, new object[] { serverInfo });
            }
            else
            {
                LogHelper.WriteLog("未查找到该任务执行方法", serverInfo.TaskName);
            }
            LogHelper.WriteLog("--------------------------------------分割线任务执行结束-------------------------------------", serverInfo.TaskName);
        }

        /// <summary>
        /// 执行api调度
        /// </summary>
        /// <param name="methodServerInfo"></param>
        public static void ExcuteApi(ServerInfo methodServerInfo)
        {
            LogHelper.WriteLog("--------------------------------------分割线任务开始-------------------------------------", methodServerInfo.TaskName);
            var result = HttpOpration.HttpRequestGet(methodServerInfo.TaskMethod);
            LogHelper.WriteLog("接口调用结果:" + result, methodServerInfo.TaskName);
            LogHelper.WriteLog("--------------------------------------分割线任务开始-------------------------------------", methodServerInfo.TaskName);
        }
        
        /// <summary>
        /// 定时测试方法
        /// </summary>
        public static void TestMethod(object serverInfo)
        {
            LogHelper.WriteLog("测试任务执行完成", ((ServerInfo)serverInfo).TaskName);
        }
       
    }
}
