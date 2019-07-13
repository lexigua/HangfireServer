using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BTDataSyncServer.Common
{
    public static class FtpHelper
    {
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="fileinfo">需要上传的文件</param>
        /// <param name="targetDir">目标路径</param>
        /// <param name="hostname">ftp地址</param>
        /// <param name="username">ftp用户名</param>
        /// <param name="password">ftp密码</param>
        /// <param name="taskName">任务名称</param>
        public static void UploadFile(FileInfo fileinfo, string targetDir, string hostname, string username, string password,string taskName="")
        {
            //1. check target
            string target;
           
            target = Guid.NewGuid().ToString();  //使用临时文件名

            if (!string.IsNullOrEmpty(targetDir)&&!ftpIsExistsFile(targetDir, hostname, username, password))
            {
                MakeDir(targetDir, hostname, username, password);
            }

            string URI = "";
            if (!string.IsNullOrEmpty(targetDir))
            {
                URI = "FTP://" + hostname + "/" + targetDir + "/" + target;
            }
            else
            {
                URI = "FTP://" + hostname+ "/" + target;
            }
            
            System.Net.FtpWebRequest ftp = GetRequest(URI, username, password);

            //设置FTP命令 设置所要执行的FTP命令，
            ftp.Method = System.Net.WebRequestMethods.Ftp.UploadFile;
            //指定文件传输的数据类型
            ftp.UseBinary = true;
            ftp.UsePassive = true;

            //告诉ftp文件大小
            ftp.ContentLength = fileinfo.Length;
            //缓冲大小设置为2KB
            const int BufferSize = 2048;
            byte[] content = new byte[BufferSize];
            int dataRead;

            //打开一个文件流 (System.IO.FileStream) 去读上传的文件
            using (FileStream fs = fileinfo.OpenRead())
            {
                try
                {
                    //把上传的文件写入流
                    using (Stream rs = ftp.GetRequestStream())
                    {
                        do
                        {
                            //每次读文件流的2KB
                            dataRead = fs.Read(content, 0, BufferSize);
                            rs.Write(content, 0, dataRead);
                        } while (dataRead >= BufferSize);
                        rs.Close();
                    }
                }
                catch (Exception ex) { }
                finally
                {
                    fs.Close();
                }

            }

            ftp = null;
            //设置FTP命令
            ftp = GetRequest(URI, username, password);
            ftp.Method = System.Net.WebRequestMethods.Ftp.Rename; //改名
            ftp.RenameTo = fileinfo.Name;
            try
            {
                ftp.GetResponse();
            }
            catch (Exception ex)
            {
                ftp = GetRequest(URI, username, password);
                ftp.Method = System.Net.WebRequestMethods.Ftp.DeleteFile; //删除
                ftp.GetResponse();
                LogHelper.WriteLog("上传" + fileinfo.FullName + "上传到" + "FTP://" + hostname + "/" + targetDir + "/" + fileinfo.Name + "失败.异常信息："+ex.Message, taskName);
            }
            finally
            {
                //fileinfo.Delete();
            }
            ftp = null;
            LogHelper.WriteLog("上传" + fileinfo.FullName + "上传到" + "FTP://" + hostname + "/" + targetDir + "/" + fileinfo.Name + "成功.",taskName);
          
        }
        /// <summary>
        /// 下载文件
        /// </summary>
        /// <param name="localDir">下载至本地路径</param>
        /// <param name="FtpDir">ftp目标文件路径</param>
        /// <param name="FtpFile">从ftp要下载的文件名</param>
        /// <param name="hostname">ftp地址即IP</param>
        /// <param name="username">ftp用户名</param>
        /// <param name="password">ftp密码</param>
        public static void DownloadFile(string localDir, string FtpDir, string FtpFile, string hostname, string username, string password)
        {
            string URI = "FTP://" + hostname + "/" + FtpDir + "/" + FtpFile;
            string tmpname = Guid.NewGuid().ToString();
            string localfile = localDir + @"\" + tmpname;

            System.Net.FtpWebRequest ftp = GetRequest(URI, username, password);
            ftp.Method = System.Net.WebRequestMethods.Ftp.DownloadFile;
            ftp.UseBinary = true;
            ftp.UsePassive = false;

            using (FtpWebResponse response = (FtpWebResponse)ftp.GetResponse())
            {
                using (Stream responseStream = response.GetResponseStream())
                {
                    //loop to read & write to file
                    using (FileStream fs = new FileStream(localfile, FileMode.CreateNew))
                    {
                        try
                        {
                            byte[] buffer = new byte[2048];
                            int read = 0;
                            do
                            {
                                read = responseStream.Read(buffer, 0, buffer.Length);
                                fs.Write(buffer, 0, read);
                            } while (!(read == 0));
                            responseStream.Close();
                            fs.Flush();
                            fs.Close();
                        }
                        catch (Exception)
                        {
                            //catch error and delete file only partially downloaded
                            fs.Close();
                            //delete target file as it's incomplete
                            File.Delete(localfile);
                            throw;
                        }
                    }

                    responseStream.Close();
                }

                response.Close();
            }



            try
            {
                File.Delete(localDir + @"\" + FtpFile);
                File.Move(localfile, localDir + @"\" + FtpFile);


                ftp = null;
                ftp = GetRequest(URI, username, password);
                ftp.Method = System.Net.WebRequestMethods.Ftp.DeleteFile;
                ftp.GetResponse();

            }
            catch (Exception ex)
            {
                File.Delete(localfile);
                throw ex;
            }

            // 记录日志 "从" + URI.ToString() + "下载到" + localDir + @"\" + FtpFile + "成功." );
            ftp = null;
        }

        /// <summary>
        /// 搜索远程文件
        /// </summary>
        /// <param name="targetDir"></param>
        /// <param name="hostname"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="SearchPattern"></param>
        /// <returns></returns>
        public static List<string> ListDirectory(string targetDir, string hostname, string username, string password, string SearchPattern)
        {
            List<string> result = new List<string>();
            try
            {
                string URI = "FTP://" + hostname + "/" + targetDir + "/" + SearchPattern;

                System.Net.FtpWebRequest ftp = GetRequest(URI, username, password);
                ftp.Method = System.Net.WebRequestMethods.Ftp.ListDirectory;
                ftp.UsePassive = true;
                ftp.UseBinary = true;

                string str = GetStringResponse(ftp);
                str = str.Replace("\r\n", "\r").TrimEnd('\r');
                str = str.Replace("\n", "\r");
                if (str != string.Empty)
                    result.AddRange(str.Split('\r'));

                return result;
            }
            catch { }
            return null;
        }

        ///<summary>
        /// 在ftp服务器上创建目录
        /// </summary>
        /// <param name="dirName">创建的目录名称</param>
        /// <param name="ftpHostIP">ftp地址</param>
        /// <param name="username">用户名</param>
        /// <param name="password">密码</param>
        public static void MakeDir(string dirName, string ftpHostIP, string username, string password)
        {
            try
            {
                string uri = "ftp://" + ftpHostIP + "/" + dirName;
                System.Net.FtpWebRequest ftp = GetRequest(uri, username, password);
                ftp.Method = WebRequestMethods.Ftp.MakeDirectory;
                FtpWebResponse response = (FtpWebResponse)ftp.GetResponse();
                response.Close();
            }
            catch (Exception ex)
            {
               LogHelper.WriteLog("ftp创建目录失败！"+ex.Message);
            }
        }
        /// <summary>
        /// 删除目录
        /// </summary>
        /// <param name="dirName">创建的目录名称</param>
        /// <param name="ftpHostIP">ftp地址</param>
        /// <param name="username">用户名</param>
        /// <param name="password">密码</param>
        public static void delDir(string dirName, string ftpHostIP, string username, string password)
        {
            try
            {
                string uri = "ftp://" + ftpHostIP + "/" + dirName;
                System.Net.FtpWebRequest ftp = GetRequest(uri, username, password);
                ftp.Method = WebRequestMethods.Ftp.RemoveDirectory;
                FtpWebResponse response = (FtpWebResponse)ftp.GetResponse();
                response.Close();
            }
            catch (Exception ex)
            {

                //MessageBox.Show(ex.Message);
            }
        }
       
        /// <summary>
        /// 判断ftp服务器上该目录是否存在
        /// </summary>
        /// <param name="dirName"></param>
        /// <param name="ftpHostIP"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        private static bool ftpIsExistsFile(string dirName, string ftpHostIP, string username, string password)
        {
            bool flag = true;
            try
            {
                string uri = "ftp://" + ftpHostIP + "/" + dirName;
                System.Net.FtpWebRequest ftp = GetRequest(uri, username, password);
                ftp.Method = WebRequestMethods.Ftp.ListDirectory;
                WebResponse response =ftp.GetResponse();
                
                var reader=new StreamReader(response.GetResponseStream());
                string line= reader.ReadLine();
               
                if (string.IsNullOrEmpty(line))
                {
                    flag = false;
                }
                response.Close();
               
            }
            catch (Exception ex)
            {
                flag = false;
                LogHelper.WriteLog("ftp获取目录异常，"+ex.Message);
            }
            
            return flag;
        }

        private static string GetStringResponse(FtpWebRequest ftp)
        {
            //Get the result, streaming to a string
            string result = "";
            using (FtpWebResponse response = (FtpWebResponse)ftp.GetResponse())
            {
                long size = response.ContentLength;
                using (Stream datastream = response.GetResponseStream())
                {
                    using (StreamReader sr = new StreamReader(datastream, System.Text.Encoding.Default))
                    {
                        result = sr.ReadToEnd();
                        sr.Close();
                    }

                    datastream.Close();
                }

                response.Close();
            }
            LogHelper.WriteLog("流内容:"+result);
            return result;
        }


        private static FtpWebRequest GetRequest(string URI, string username, string password)
        {
            try
            {
                //根据服务器信息FtpWebRequest创建类的对象
                FtpWebRequest result = (FtpWebRequest)FtpWebRequest.Create(URI);
                //提供身份验证信息
                result.Credentials = new System.Net.NetworkCredential(username, password);
                //设置请求完成之后是否保持到FTP服务器的控制连接，默认值为true
                result.KeepAlive = false;
                return result;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("ftp创建请求失败！异常信息："+ex.Message);
                return null;
            }
        }

    }
}
