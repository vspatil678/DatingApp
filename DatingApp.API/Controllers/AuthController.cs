using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [ApiController] it behaves like Modelstate.Isvalid (we can use either or both) 
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository authRepository, IConfiguration configuration, IMapper mapper)
        {
            _configuration = configuration;
            _mapper = mapper;
            _authRepository = authRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();
            if(await this._authRepository.UserExists(userForRegisterDto.UserName))
            {
                return BadRequest("User Name already exists");
            }
            // if you have less property bellow code is fine otherwise use mapper
            //User userToCreate = new User()
            //{
            //    UserName = userForRegisterDto.UserName,
            //    City = userForRegisterDto.City,
            //    Country = userForRegisterDto.Country,
            //    DateOfBirth = userForRegisterDto.DateOfBirth,
            //    KnownAs = userForRegisterDto.KnownAs,
            //    Gender = userForRegisterDto.Gender,
            //    LastActive = userForRegisterDto.LastActive,
            //    Created = userForRegisterDto.Created,
            //};
            User userToCreate = _mapper.Map<User>(userForRegisterDto);
            User createdUser = await this._authRepository.Register(userToCreate, userForRegisterDto.PassWord);
            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);
            return CreatedAtRoute("GetUser", new { controller = "Users", Id = createdUser.Id}, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await this._authRepository.Login(userForLoginDto.UserName.ToLower(), userForLoginDto.PassWord);
            if(userFromRepo == null)
            {
                return StatusCode(401, "UserName or Password is invalid");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.UserName),

            };
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
            var user = _mapper.Map<UserForListDto>(userFromRepo);
            return Ok(new { token = tokenHandler.WriteToken(token), user });
        }
    }
}