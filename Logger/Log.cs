using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Logger
{
   public sealed class Log : ILog
    {
        private Log()
        {

        }

        private static readonly Lazy<Log> logger = new Lazy<Log>(() => new Log());

        public static Log GetInstance()
        {
            return logger.Value;
        }

        public void LogException(string message)
        {
            // C:\_Vinod_Files_Folders\Udemy_Emids\DatingApp\DatingApp.API\bin\Debug\netcoreapp3.0
            string fileName = string.Format("{0}_{1}.log", "Exception", DateTime.Now.ToShortDateString());
            string logFilePath = string.Format(@"{0}\{1}", AppDomain.CurrentDomain.BaseDirectory, fileName);
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("----------------------------------------");
            sb.AppendLine(DateTime.Now.ToString());
            sb.AppendLine(message);
            using (StreamWriter writer = new StreamWriter(logFilePath, true))
            {
                writer.Write(sb.ToString());
                writer.Flush();
            }
        }

    }
}
