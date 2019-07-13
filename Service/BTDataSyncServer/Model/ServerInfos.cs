using System;
using System.Collections.Generic;

namespace BTDataSyncServer.Model
{
    public static class ServerInfos
    {
       
        public static List<ServerInfo> ServerInfoList = new List<ServerInfo>
        {
            new ServerInfo()
            {
                Id=Guid.NewGuid().ToString(),
                TaskName = "任务测试",
                ExecWhenStart = false,
                TaskKey = "TestMethod",
                IsUsable = true,
                TaskType = (int)TaskTypeEnum.定点任务,
                ExecTime = "* * * * *",
                TaskMethod = "TestMethod",
                AddPerson = "赵江",
                AddTime = "2017-5-31"
            }
        };
    }
}
