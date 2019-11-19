using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Xml;
using BTDataSyncServer.Model;

namespace BTDataSyncServer.Common
{
    public static class XmlHelper
    {
        /// <summary>
        /// 将服务列表写入配置文件
        /// </summary>
        /// <param name="dtoList"></param>
        public static void WriteServerInfoToXml(List<ServerInfo> dtoList)
        {
            try
            {
                //var basePath = ConfigurationManager.AppSettings["ConfigFilePath"];
                var basePath = AppDomain.CurrentDomain.BaseDirectory + "Config\\";
                if (!Directory.Exists(basePath))
                {
                    Directory.CreateDirectory(basePath);
                }
                var xmlFileName = basePath + "BTWindowsServerConfig.xml";

                if (File.Exists(xmlFileName))
                {
                    return;
                }
                var xmlDoc = new XmlDocument();
                XmlNode declare = xmlDoc.CreateXmlDeclaration("1.0", "utf-8", "yes");
                xmlDoc.AppendChild(declare);
                XmlElement root = xmlDoc.CreateElement("ServerInfos");
             
                #region 老代码
                //foreach (ServerInfo server in dtoList)
                //{
                //    XmlElement element = xmlDoc.CreateElement("ServerInfo");
                //    XmlElement id = xmlDoc.CreateElement("Id");
                //    XmlElement taskName = xmlDoc.CreateElement("TaskName");
                //    XmlElement isUsable = xmlDoc.CreateElement("IsUsable");
                //    isUsable.SetAttribute("启用", "true");
                //    isUsable.SetAttribute("停用", "false");
                //    XmlElement taskType = xmlDoc.CreateElement("TaskType");
                //    taskType.SetAttribute("定点任务", "0");
                //    taskType.SetAttribute("定时任务", "1");
                //    XmlElement interval = xmlDoc.CreateElement("Interval");
                //    XmlElement execTime = xmlDoc.CreateElement("ExecTime");

                //    XmlElement execWhenStar = xmlDoc.CreateElement("ExecWhenStart");
                //    execWhenStar.SetAttribute("服务启用时执行", "true");
                //    execWhenStar.SetAttribute("服务启用时不执行", "false");

                //    interval.SetAttribute("单位", "s(秒)");
                //    execTime.SetAttribute("格式", "00:00:00");
                //    XmlElement taskMethod = xmlDoc.CreateElement("TaskMethod");
                //    XmlElement addPerson = xmlDoc.CreateElement("AddPerson");
                //    XmlElement addTime = xmlDoc.CreateElement("AddTime");
                //    XmlElement taskKey = xmlDoc.CreateElement("TaskKey");
                //    XmlElement customPara = xmlDoc.CreateElement("CustomParam");

                //    id.InnerText = server.Id;
                //    taskName.InnerText = server.TaskName;
                //    isUsable.InnerText = server.IsUsable.ToString();
                //    taskType.InnerText =Convert.ToInt32(server.TaskType).ToString();
                //    interval.InnerText = server.Interval.ToString();
                //    execTime.InnerText = server.ExecTime;
                //    execWhenStar.InnerText = server.ExecWhenStart.ToString();
                //    taskMethod.InnerText = server.TaskMethod;
                //    addPerson.InnerText = server.AddPerson;
                //    addTime.InnerText = server.AddTime;
                //    taskKey.InnerText = server.TaskKey;
                //    customPara.InnerText = server.CustomParam;

                //    element.AppendChild(id);
                //    element.AppendChild(taskName);
                //    element.AppendChild(isUsable);
                //    element.AppendChild(taskType);
                //    element.AppendChild(interval);
                //    element.AppendChild(execTime);
                //    element.AppendChild(execWhenStar);
                //    element.AppendChild(taskMethod);
                //    element.AppendChild(addPerson);
                //    element.AppendChild(addTime);
                //    element.AppendChild(taskKey);
                //    element.AppendChild(customPara);

                //    root.AppendChild(element);

                //}
                //xmlDoc.AppendChild(root);
                //xmlDoc.Save(xmlFileName);
                #endregion

                xmlDoc.AppendChild(root);
                xmlDoc.Save(xmlFileName);
                AddXmlNodes(xmlFileName, "ServerInfos", "ServerInfo", dtoList);
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("服务异常：" + ex.Message);
            }
        }
        /// <summary>
        /// 读取xml配置文件数据返回任务列表 
        /// </summary>
        /// <returns></returns>
        public static List<ServerInfo> ReadServerInfosXmlToDtos()
        {
            try
            {
                var xmlFileName = AppDomain.CurrentDomain.BaseDirectory + "Config\\" + "BTWindowsServerConfig.xml";
                LogHelper.WriteLog("配置文件地址：" + xmlFileName);
                if (!File.Exists(xmlFileName))
                {
                    return null;
                }
                #region MyRegion 旧代码
                //var xmlDoc = new XmlDocument();
                //xmlDoc.Load(xmlFileName);
                //XmlNode rootNode = xmlDoc.SelectSingleNode("ServerInfos");
                //if (rootNode == null)
                //{
                //    return null;
                //}
                //var nodes = rootNode.ChildNodes;

                //var serverInfos = new List<ServerInfo>();
                //foreach (XmlNode node in nodes)
                //{
                //    var childs = node.ChildNodes;
                //    var serverInfo = new ServerInfo();
                //    serverInfo.TaskName = childs.Item(0).InnerText;
                //    if (!string.IsNullOrWhiteSpace(childs.Item(1).InnerText))
                //    {
                //        serverInfo.IsUsable = Convert.ToBoolean(childs.Item(1).InnerText);
                //    }
                //    if (!string.IsNullOrWhiteSpace(childs.Item(2).InnerText))
                //    {
                //        serverInfo.TaskType = (TaskTypeEnum)(Convert.ToInt32(childs.Item(2).InnerText));
                //    }
                //    if (!string.IsNullOrWhiteSpace(childs.Item(3).InnerText))
                //    {
                //        serverInfo.Interval = Convert.ToInt32(childs.Item(3).InnerText);
                //    }
                //    serverInfo.Id=
                //    serverInfo.ExecTime = childs.Item(4).InnerText;
                //    serverInfo.ExecWhenStart = Convert.ToBoolean(childs.Item(5).InnerText);
                //    serverInfo.TaskMethod = childs.Item(6).InnerText;
                //    serverInfo.AddPerson = childs.Item(7).InnerText;
                //    serverInfo.AddTime = childs.Item(8).InnerText;
                //    if (node.SelectSingleNode("TaskKey") != null)  //add by weiyz 20170712
                //    {
                //        serverInfo.TaskKey = node.SelectSingleNode("TaskKey").InnerText;
                //    }
                //    if (node.SelectSingleNode("CustomParam") != null)  //add by weiyz 20171021
                //    {
                //        serverInfo.CustomParam = node.SelectSingleNode("CustomParam").InnerText;
                //    }
                //    serverInfos.Add(serverInfo);
                //}
                #endregion
                var serverInfos = XmlToList<ServerInfo>(xmlFileName, "ServerInfos/ServerInfo");
                return serverInfos;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("服务异常：" + ex.Message);
                return null;
            }
        }
        
        /// <summary>
        /// xml转list
        /// </summary>
        /// <typeparam name="T">目标对象</typeparam>
        /// <param name="xmlFullpath">xml文件地址(绝对路径)</param>
        /// <param name="nodeName">节点路径(如：nodes/node)</param>
        /// <returns></returns>
        public static List<T> XmlToList<T>(string xmlFullpath, string nodeName) where T : class
        {
            List<T> dtos = new List<T>();
            XmlDocument doc = new XmlDocument();
            if (!File.Exists(xmlFullpath))
            {
                throw new Exception("未找到数据源：" + xmlFullpath);
            }
            doc.Load(xmlFullpath);
            XmlNodeList nodes = doc.SelectNodes(nodeName);
            if (nodes != null && nodes.Count > 0)
            {
                foreach (XmlNode node in nodes)
                {
                    var dto = Activator.CreateInstance<T>();
                    var childNodes = node.ChildNodes;
                    foreach (XmlNode childNode in childNodes)
                    {
                        var property = typeof(T).GetProperty(childNode.Name);
                        if (property != null&&!string.IsNullOrEmpty(childNode.InnerText))
                        {
                            try
                            {
                                var value = Convert.ChangeType(childNode.InnerText, property.PropertyType);
                                property.SetValue(dto, value);
                            }
                            catch (Exception ex)
                            {
                                throw new Exception($"字段【{property.Name}】赋值出错,{ex.Message}");
                            }
                        }
                    }
                    dtos.Add(dto);
                }
            }
            return dtos;
        }

        /// <summary>
        /// 新增xml节点
        /// </summary>
        /// <typeparam name="T">泛型类</typeparam>
        /// <param name="xmlFilePath">xml文件绝对地址</param>
        /// <param name="xPath">要添加的xml父级节点路径</param>
        /// <param name="nodeName">要添加节点的名称</param>
        /// <param name="addList">数据集合</param>
        public static void AddXmlNodes<T>(string xmlFilePath, string xPath, string nodeName, List<T> addList) where T : class
        {
            if (addList == null || addList.Count == 0)
            {
                return;
            }
            if (!File.Exists(xmlFilePath))
            {
                throw new Exception("文件不存在");
            }
            var xmlDoc = new XmlDocument();
            xmlDoc.Load(xmlFilePath);
            var rootNode = xmlDoc.SelectSingleNode(xPath);
            if (rootNode == null)
            {
                throw new Exception("不存在根节点");
            }
            foreach (var item in addList)
            {
                var node = xmlDoc.CreateElement(nodeName);
                var properties = typeof(T).GetProperties();
                foreach (var property in properties)
                {
                    //过滤掉忽略的字段
                    var ignoreAttr = property.GetCustomAttributes(typeof(IgnoreDataMemberAttribute)).FirstOrDefault();
                    if (ignoreAttr != null)
                        continue;
                    var childNode = xmlDoc.CreateElement(property.Name);
                    childNode.InnerText = property.GetValue(item) != null ? property.GetValue(item).ToString() : "";
                    node.AppendChild(childNode);
                }
                rootNode.AppendChild(node);
            }
            xmlDoc.Save(xmlFilePath);
        }

        /// <summary>
        /// 更新xml节点
        /// </summary>
        /// <typeparam name="T">泛型类</typeparam>
        /// <param name="xmlFilePath">xml文件绝对地址</param>
        /// <param name="xPath">要更新的xml父级点路径</param>
        /// <param name="key">唯一标识名称</param>
        /// <param name="updateList">要更新的数据集</param>
        public static void UpdateNodes<T>(string xmlFilePath, string xPath, string key, List<T> updateList) where T : class
        {
            var xmlDoc = new XmlDocument();
            if (!File.Exists(xmlFilePath))
            {
                throw new Exception("文件不存在");
            }
            xmlDoc.Load(xmlFilePath);
            var rootNode = xmlDoc.SelectSingleNode(xPath);
            if (rootNode == null)
            {
                throw new Exception("xml节点不存在");
            }
            var nodes = rootNode.ChildNodes;
            foreach (var item in updateList)
            {
                var properties = typeof(T).GetProperties();
                var keyItem = properties.FirstOrDefault(t => t.Name == key);
                if (keyItem == null)
                    throw new Exception("未在泛型类中查找到与唯一标识名称对应的字段属性");
                var keyValue = keyItem.GetValue(item, null);
                if (keyValue == null)
                {
                    throw new Exception(string.Format("唯一标识{0}值不能为空", key));
                }
                foreach (XmlNode node in nodes)
                {
                    var xmlKeyNode = node.SelectSingleNode(key);
                    if (xmlKeyNode != null && xmlKeyNode.InnerText == keyValue.ToString())
                    {
                        foreach (XmlNode child in node.ChildNodes)
                        {
                            var childItem = properties.FirstOrDefault(t => t.Name == child.Name);
                            if (childItem != null)
                            {
                                child.InnerText = childItem.GetValue(item).ToString();
                            }
                        }
                        break;
                    }
                }
            }
            xmlDoc.Save(xmlFilePath);
        }

        /// <summary>
        /// 删除xml节点
        /// </summary>
        /// <typeparam name="T">泛型类</typeparam>
        /// <param name="xmlFilePath">xml文件绝对地址</param>
        /// <param name="xPath">要删除的xml父级点路径</param>
        /// <param name="key">唯一标识名称</param>
        /// <param name="deleteList">要删除的数据集</param>
        public static void DeleteNodes<T>(string xmlFilePath, string xPath, string key, List<T> deleteList) where T : class
        {
            var xmlDoc = new XmlDocument();
            if (!File.Exists(xmlFilePath))
            {
                throw new Exception("文件不存在");
            }
            xmlDoc.Load(xmlFilePath);
            var rootNode = xmlDoc.SelectSingleNode(xPath);
            if (rootNode == null)
            {
                throw new Exception("xml节点不存在");
            }
            var nodes = rootNode.ChildNodes;
            foreach (var item in deleteList)
            {
                var properties = typeof(T).GetProperties();
                var keyItem = properties.FirstOrDefault(t => t.Name == key);
                if (keyItem == null)
                    throw new Exception("未在泛型类中查找到与唯一标识名称对应的字段属性.");
                var keyValue = keyItem.GetValue(item, null);
                if (keyValue == null)
                {
                    throw new Exception(string.Format("唯一标识{0}值不能为空.", key));
                }
                foreach (XmlNode node in nodes)
                {
                    var xmlKeyNode = node.SelectSingleNode(key);
                    if (xmlKeyNode != null && xmlKeyNode.InnerText == keyValue.ToString())
                    {
                        rootNode.RemoveChild(node);
                        break;
                    }
                }
            }
            xmlDoc.Save(xmlFilePath);
        }
    }
}
