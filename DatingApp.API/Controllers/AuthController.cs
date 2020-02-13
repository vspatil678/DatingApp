using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [ApiController] it behaves like Modelstate.Isvalid (we can use either or both) 
    [AllowAnonymous]
   // [HandleExceptionAttribute] // explicitly no need to add any try catch for any methods
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public readonly SignInManager<User> _signInManager;
        public readonly UserManager<User> _userManager;

        public AuthController(IConfiguration configuration, IMapper mapper,
            UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _configuration = configuration;
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            
            User userToCreate = _mapper.Map<User>(userForRegisterDto);
            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.PassWord);
            var userToReturn = _mapper.Map<UserForDetailedDto>(userToCreate);
            if (result.Succeeded)
            {
                return CreatedAtRoute("GetUser", new { controller = "Users", Id = userToCreate.Id }, userToReturn);
            }
            return BadRequest(result.Errors);
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByNameAsync(userForLoginDto.UserName);
            if(user == null)
            {
                return Unauthorized();
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.PassWord, false);

            if(result.Succeeded)
            {
                var appUser = await _userManager.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.NormalizedUserName == userForLoginDto.UserName.ToUpper());

                var userToReturn = _mapper.Map<UserForListDto>(appUser);

                return Ok(new { token = GenerateJwtToken(appUser).Result, user = userToReturn });
            }
            return Unauthorized();
            
            
        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),

            };
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}