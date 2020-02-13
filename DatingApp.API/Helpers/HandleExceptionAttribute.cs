using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Logger;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DatingApp.API.Helpers
{
    public class HandleExceptionAttribute : ExceptionFilterAttribute
    {
        private ILog _log;
        public HandleExceptionAttribute()
        {
            _log = Log.GetInstance();
        }

        // we are not returning the exception
        public override void OnException(ExceptionContext context)
        {
            //base.OnException(context);
            _log.LogException(context.Exception.ToString());
            context.ExceptionHandled = true;
        }
    }
}
