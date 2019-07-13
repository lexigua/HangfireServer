namespace BTDataSyncServer.Model
{
    public  class ServerInfo
    {
        /// <summary>
        /// 唯一标识
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// 任务名称
        /// </summary>
        public string TaskName { get; set; }

        /// <summary>
        /// 是否可用
        /// </summary>
        public bool IsUsable { get; set; }

        /// <summary>
        /// 任务类型
        /// </summary>
        public int TaskType { get; set; }

        /// <summary>
        /// 执行任务时间间隔(秒)
        /// </summary>
        public int Interval { get; set; }

        /// <summary>
        /// 执行时间【例如：00:00:01】
        /// </summary>
        public string ExecTime { get; set; }

        /// <summary>
        /// 是否启动执行
        /// </summary>
        public bool ExecWhenStart { get; set; }

        /// <summary>
        /// 执行任务的方法
        /// </summary>
        public string TaskMethod { get; set; }

        /// <summary>
        /// 添加人
        /// </summary>
        public string AddPerson { get; set; }

        /// <summary>
        /// 添加日期
        /// </summary>
        public string AddTime { get; set; }

        /// <summary>
        /// 任务标识
        /// </summary>
        public string TaskKey { get; set; }
        /// <summary>
        /// 自定义参数
        /// </summary>
        public string CustomParam { get; set; }

    }

    public enum TaskTypeEnum
    {
        定点任务=0,
        定时任务=1
    }



}
