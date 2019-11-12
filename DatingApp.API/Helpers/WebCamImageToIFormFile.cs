using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public class WebCamImageToIFormFile : IFormFile
    {
        public string ContentType => throw new NotImplementedException();

        public string ContentDisposition => throw new NotImplementedException();

        public IHeaderDictionary Headers => throw new NotImplementedException();

        public long Length => throw new NotImplementedException();

        public string Name => throw new NotImplementedException();

        public string FileName => throw new NotImplementedException();

        public void CopyTo(Stream target)
        {
            throw new NotImplementedException();
        }

        public Task CopyToAsync(Stream target, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Stream OpenReadStream()
        {
            throw new NotImplementedException();
        }

        public static IFormFile ReturnIFormFileType(string ImageData)
        {
            WebCamImageToIFormFile WebCamImageToIFormFile = new WebCamImageToIFormFile();
            // WebCamImageToIFormFile;
            return WebCamImageToIFormFile;
        }
    }
}
