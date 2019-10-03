﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{
    public class PhotoForCreationDto
    {
        public string Url { get; set; }

        public string Description { get; set; }

        public DateTime DateAdded { get; set; }

        public bool IsMain { get; set; }

        public IFormFile File { get; set; }

        public string PublicId { get; set; }

        public PhotoForCreationDto()
        {
            this.DateAdded = DateTime.Now;
        }
    }
}
