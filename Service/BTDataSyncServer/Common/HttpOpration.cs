using System.IO;
using System.Net;
using System.Text;

namespace BTDataSyncServer.Common
{
   public class HttpOpration
    {
        /// <summary>
        /// http_get 请求
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string HttpRequestGet(string url,int timeOut=20)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = timeOut*1000;
            request.Method = "GET";
            request.ContentType = "text/html;charset=UTF-8";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.UTF8);
            string retString = myStreamReader.ReadToEnd();
            myStreamReader.Close();
            return retString;
        }

       /// <summary>
       /// http_post请求
       /// </summary>
       /// <param name="url"></param>
       /// <param name="data"></param>
       /// <param name="timeOut"></param>
       /// <returns></returns>
       public static string HttpRequestPost(string url, string data,int timeOut=20)
        {
            WebRequest myHttpWebRequest = WebRequest.Create(url);
            myHttpWebRequest.Timeout = timeOut*1000;
            myHttpWebRequest.Method = "POST";
            UTF8Encoding encoding = new UTF8Encoding();
            byte[] byte1 = encoding.GetBytes(data);
            myHttpWebRequest.ContentType = "application/x-www-form-urlencoded";
            myHttpWebRequest.ContentLength = byte1.Length;
            Stream newStream = myHttpWebRequest.GetRequestStream();
            newStream.Write(byte1, 0, byte1.Length);
            newStream.Close();

            //发送成功后接收返回的信息
            HttpWebResponse response = (HttpWebResponse)myHttpWebRequest.GetResponse();
            string lcHtml = string.Empty;
            Encoding enc = Encoding.GetEncoding("UTF-8");
            Stream stream = response.GetResponseStream();
            StreamReader streamReader = new StreamReader(stream, enc);
            lcHtml = streamReader.ReadToEnd();
            return lcHtml;
        }

        /// <summary>
        /// 根据服务器地址下载文件
        /// </summary>
        /// <param name="url">下载地址</param>
        /// <param name="savePath">保存地址</param>
        public static void HttpDownloadFileByUrl(string url, string savePath)
        {
           
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            HttpWebResponse response = request.GetResponse() as HttpWebResponse;
            Stream responStream = response.GetResponseStream();
            Stream fileStream = new FileStream(savePath, FileMode.Create);
            byte[] bytes = new byte[1024];
            int size = responStream.Read(bytes, 0, bytes.Length);
            while (size > 0)
            {
                fileStream.Write(bytes, 0, size);
                size = responStream.Read(bytes, 0, bytes.Length);
            }
            fileStream.Close();
            responStream.Close();
        }
    }
}
