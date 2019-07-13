using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Util.ApplicationServices;

namespace ServiceMs.Models
{
    [DataContract]
    public class ServerInfo:DtoBase
    {
        /// <summary>
        /// 唯一标识
        /// </summary>
        [Display(Name = "唯一标识")]
        [DataMember]
        public string Id { get; set; }

        /// <summary>
        /// 任务名称
        /// </summary>
        [DataMember]
        [Display(Name = "任务名称")]
        public string TaskName { get; set; }

        /// <summary>
        /// 是否可用
        /// </summary>
        [DataMember]
        [Display(Name = "是否可用")]
        public bool IsUsable { get; set; }

        /// <summary>
        /// 任务类型
        /// </summary>
        [DataMember]
        [Display(Name = "任务类型")]
        public int TaskType { get; set; }

        /// <summary>
        /// 执行任务时间间隔(秒)
        /// </summary>
        [DataMember]
        [Display(Name = "执行任务时间间隔")]
        public int Interval { get; set; }

        /// <summary>
        /// 执行时间【例如：00:00:01】
        /// </summary>
        [DataMember]
        [Display(Name = "执行时间")]
        public string ExecTime { get; set; }

        /// <summary>
        /// 是否启动执行
        /// </summary>
        [DataMember]
        [Display(Name = "是否启动执行")]
        public bool ExecWhenStart { get; set; }

        /// <summary>
        /// 执行任务的方法
        /// </summary>
        [DataMember]
        [Display(Name = "执行任务的方法")]
        public string TaskMethod { get; set; }

        /// <summary>
        /// 添加人
        /// </summary>
        [DataMember]
        [Display(Name = "添加人")]
        public string AddPerson { get; set; }

        /// <summary>
        /// 添加日期
        /// </summary>
        [DataMember]
        [Display(Name = "添加日期")]
        public string AddTime { get; set; }

        /// <summary>
        /// 任务标识
        /// </summary>
        [DataMember]
        [Display(Name = "任务标识")]
        public string TaskKey { get; set; }
        /// <summary>
        /// 自定义参数
        /// </summary>
        [DataMember]
        [Display(Name = "自定义参数")]
        public string CustomParam { get; set; }

    }
}