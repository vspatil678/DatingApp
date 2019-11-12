using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class CameraFeaturesController : ControllerBase
    {
        [HttpPost]
        [Route("api/UploadImage")]        
        public HttpResponseMessage UploadPhotoFromCamera()
        {
           // var httpRequest = HttpContext.Current.Request;
            var file = Request.Form.Files[0];
            // return Ok();
            return null;
        }

        [HttpGet]
        public IActionResult GetStrings()
        {
            return Ok(new { name = "hello" });
        }
    }
}
