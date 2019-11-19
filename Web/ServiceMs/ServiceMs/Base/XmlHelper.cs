using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Xml;

namespace ServiceMs.Base
{
    public class XmlHelper
    {
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
                        if (property != null)
                        {
                            try
                            {
                                if (!string.IsNullOrEmpty(childNode.InnerText))
                                {
                                    var value = Convert.ChangeType(childNode.InnerText, property.PropertyType);
                                    property.SetValue(dto, value);
                                }

                            }
                            catch (Exception ex)
                            {
                                throw new Exception(string.Format("字段【{0}】赋值出错,{1}", property.Name, ex.Message));
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
                                var val = childItem.GetValue(item);
                                if (val!=null)
                                {
                                    child.InnerText = val.ToString();
                                }
                                
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