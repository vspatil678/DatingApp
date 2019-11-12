using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public static class ImageExtension
    {
          public static Stream ImageToStream(this Image image)
            {
                var stream = new System.IO.MemoryStream();
                stream.Position = 0;
                return stream;
            
        }
    }
}
