using System;
using System.Collections.Generic;
using System.Text;

namespace Logger
{
   public interface ILog
    {
        void LogException(string message);
    }
}
