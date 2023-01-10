using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MoveIT.Domain.Models
{
    public class UserDto
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public bool isAdmin { get; set; }
        public string? error { get; set; }
    }
}
