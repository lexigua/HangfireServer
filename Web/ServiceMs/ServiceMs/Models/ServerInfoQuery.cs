using System.ComponentModel.DataAnnotations;
using Util.Domains.Repositories;

namespace ServiceMs.Models
{
    public class ServerInfoQuery : Pager
    {
        /// <summary>
        /// 任务名称
        /// </summary>
        [Display(Name = "任务名称")]
        public string TaskName { get; set; }

        /// <summary>
        /// 是否可用
        /// </summary>
        [Display(Name = "是否可用")]
        public string IsUsable { get; set; }

        /// <summary>
        /// 添加人
        /// </summary>
        [Display(Name = "添加人")]
        public string AddPerson { get; set; }
    }
}