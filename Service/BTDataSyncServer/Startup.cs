using System.Configuration;
using BTWindowsServer.Filter;
using Hangfire;
using Hangfire.Dashboard;
using Owin;

namespace BTDataSyncServer
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            app.UseHangfireServer();
            var options = new DashboardOptions {Authorization=new IDashboardAuthorizationFilter[]{ new DashboardAuthorizationFilter() } };
            var openRemoteInvoking = ConfigurationManager.AppSettings["OpenRemoteInvoking"];
            if (openRemoteInvoking=="true")
            {
                app.UseHangfireDashboard("/hangfire", options);
            }
            else
            {
                app.UseHangfireDashboard();
            }
           
        }
    }
}
