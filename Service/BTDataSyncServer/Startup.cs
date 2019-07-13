using Hangfire;
using Owin;

namespace BTDataSyncServer
{
   public class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            app.UseHangfireServer();
            app.UseHangfireDashboard();

        }
    }
}
