using System;
using System.Drawing;

namespace ServiceMs.Base
{
    public class ValidateManager
    {
        /// <summary>
        /// 创建图形
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static Bitmap CreateImg(out string code)
        {
            Bitmap img = new Bitmap(70, 30);
            Graphics graphics = Graphics.FromImage(img);
            graphics.Clear(Color.White);
            code = RandomString();
            int intx = 5;
            Random random = new Random(Convert.ToInt32(Guid.NewGuid().GetHashCode()));
            foreach (var s in code)
            {
                //graphics.TranslateTransform(0, 0, MatrixOrder.Prepend);
                var trans = random.Next(-13, 13);
                graphics.RotateTransform(trans);
                graphics.DrawString(s.ToString(), GetFont(), new SolidBrush(RandomColor()), intx, 0);
                intx += 14;
                graphics.RotateTransform(360 - trans);
            }
            var lins = random.Next(2, 6);
            for (int i = 0; i < lins; i++)
            {
                Pen pen = new Pen(RandomColor());
                graphics.DrawLine(pen, random.Next(8, 12), random.Next(0, 25), random.Next(70, 90), random.Next(2, 40));
            }
            graphics.Dispose();
            return img;
        }

        private static Font GetFont()
        {
            string fontmat = "";
            Random random = new Random();
            var rand = random.Next(0, 30);
            if (rand % 2 == 0)
            {
                fontmat = "Arial";
            }
            else if (rand % 3 == 0)
            {
                fontmat = "宋体";
            }
            else
            {
                fontmat = "黑体";
            }
            FontStyle fontStyle;
            rand = random.Next(0, 30);
            if (rand % 3 == 0)
            {
                fontStyle = FontStyle.Bold;
            }
            else if (rand % 5 == 0)
            {
                fontStyle = FontStyle.Underline;
            }
            else
            {
                fontStyle = FontStyle.Italic;
            }
            Font font = new Font(fontmat, random.Next(16, 24), fontStyle);
            return font;
        }

        private static string RandomString()
        {
            string allchars = "23456789abcdefghijklmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
            string ranchars = string.Empty;
            for (int i = 0; i < 4; i++)
            {
                Random random = new Random(Convert.ToInt32(Guid.NewGuid().GetHashCode()));
                int num = random.Next(0, 55);
                ranchars += allchars[num].ToString();//...
            }
            return ranchars;//返回 随机数
        }
        /// <summary>
        /// 产生随机的背景颜色
        /// </summary>
        /// <returns></returns>
        private static Color RandomColor()
        {
            Random random = new Random(Convert.ToInt32(Guid.NewGuid().GetHashCode()));
            Color c = Color.FromArgb(255, random.Next(0, 150), random.Next(0, 150), random.Next(0, 150));
            return c;//返回背景颜色
        }
    }
}