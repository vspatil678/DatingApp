using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    // [Authorize] services.AddControllers(etc) will tc about authorization
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;

        public readonly IMapper _mapper;
        public MessagesController(IDatingRepository datingRepository, IMapper mapper)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name ="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messageFromRepo = await _datingRepository.GetMessage(id);
            if(messageFromRepo == null)
            {
                return NotFound();
            }

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageParams.UserId = userId;

            var messagesFromRepo = await _datingRepository.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize,
                messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = await this._datingRepository.GetUser(userId, false);

            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            messageForCreationDto.SenderId = userId;
            var recipient = await _datingRepository.GetUser(messageForCreationDto.RecipientId, true);
            if (recipient == null)
            {
                return BadRequest("could not find user ");
            }

            var message = _mapper.Map<Message>(messageForCreationDto);
            _datingRepository.Add(message);
            
            if(await _datingRepository.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage", new { userId, id = message.Id}, messageToReturn);
            }
            throw new Exception("Creating the message failed on save");
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messagesFromRepo =await _datingRepository.GetMessageThread(userId, recipientId);
            var messageThread =  _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
            return Ok(messageThread);
        }
        // id message id
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messagesFromRepo = await _datingRepository.GetMessage(id);
            if(messagesFromRepo.SenderId == userId)
            {
                messagesFromRepo.SenderDeleated = true;
            }

            if (messagesFromRepo.RecipientId == userId)
            {
                messagesFromRepo.RecipientDeleted = true;
            }

            if(messagesFromRepo.SenderDeleated && messagesFromRepo.RecipientDeleted)
            {
                _datingRepository.Delete(messagesFromRepo);
            }
            if (await _datingRepository.SaveAll())
            {
                return NoContent();
            }

            throw new Exception("Error Deleting the Message");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var message = await _datingRepository.GetMessage(id);
            if(message.RecipientId != userId)
            {
                return Unauthorized();
            }
            message.IsRead = true;
            message.DateRead = DateTime.Now;
            if (await _datingRepository.SaveAll())
            {
                return NoContent();
            }

            throw new Exception("Error Deleting the Message");
        }
    }
}
