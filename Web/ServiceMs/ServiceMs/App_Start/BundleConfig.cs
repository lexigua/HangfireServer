using System.Web;
using System.Web.Optimization;

namespace ServiceMs
{
    public class BundleConfig
    {
        // 有关 Bundling 的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            //是否启用打包压缩
            BundleTable.EnableOptimizations = true;

            //css样式
            bundles.Add(new StyleBundle("~/Css/css").Include(
                "~/Css/icon.css",
                "~/Css/icons.css",
                "~/Css/common.css",
                "~/Css/style.min.css"
            ));
            //Easyui扩展
            bundles.Add(new ScriptBundle("~/Scripts/EasyUi/js").Include(
                "~/Scripts/EasyUi/easyui-lang-zh_CN.js",
                "~/scripts/EasyUi/jquery.easyui.edatagrid.js",
                "~/scripts/EasyUi/jquery.easyui.treegrid.dnd.js",
                "~/scripts/EasyUi/jquery.easyui.etreegrid.js",
                "~/scripts/EasyUi/jquery.easyui.datagrid.detailview.js",
                "~/scripts/EasyUi/jquery.easyui.datagrid.lookup.js"));
            //util js
            bundles.Add(new ScriptBundle("~/Scripts/Utils/js").Include(
                "~/Scripts/Utils/util.js",
                "~/Scripts/Utils/jquery.util.js",
                "~/Scripts/Utils/jquery.util.webuploader.js",
                "~/Scripts/Utils/jquery.util.easyui.extension.js",
                "~/Scripts/Utils/jquery.util.easyui.js",
                "~/Scripts/Utils/jquery.util.easyui.config.js",
                "~/Scripts/Utils/jquery.util.easyui.form.js",
                "~/Scripts/Utils/jquery.util.easyui.grid.js",
                "~/Scripts/Utils/jquery.util.easyui.tree.js",
                "~/Scripts/Utils/jquery.util.easyui.fn.js"));
            //公用
            //bundles.Add(new ScriptBundle("~/Scripts/Common").Include(
            //    "~/Scripts/Common/BaseInspect.js"));
        }
    }
}