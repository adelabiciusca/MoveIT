using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MoveIT.Domain.Models
{
    public class User : BaseModel
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public ICollection<Trip>? Trips { get; set; }
        public bool isAdmin { get; set; }
        public int storePoints { get; set; }
    }
}
