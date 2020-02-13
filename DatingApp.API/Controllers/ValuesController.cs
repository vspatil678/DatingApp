using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
   // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
     [HandleExceptionAttribute] //(Exception Middlewares taking care no need to worry in .net core)
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public ValuesController(DataContext dataContext)
        {
            this._dataContext = dataContext;
        }
        // GET api/values
        [HttpGet]
        public async Task<IActionResult> GetValues()
        {
            throw new Exception("throwing new exception to test exception filter attribute");
            var values = await this._dataContext.Values.ToListAsync();
            return Ok(values);
        }

        // GET api/values/5
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id)
        {
            var values = await this._dataContext.Values.FirstOrDefaultAsync(s => s.Id == id);
            return Ok(values);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
