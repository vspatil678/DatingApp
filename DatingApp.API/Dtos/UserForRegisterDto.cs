using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(8,MinimumLength =4, ErrorMessage ="you must specifiey password between 4-8 characters")]
        public string PassWord { get; set; }

        [Required]
        [NotMapped]
        [Compare("PassWord")]
        public string ConfirmPassWord { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string KnownAs { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }

         [Required]
        public string Country { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }


        public UserForRegisterDto()
        {
            this.Created = DateTime.Now;
            this.LastActive = DateTime.Now;
        }
    }
}
