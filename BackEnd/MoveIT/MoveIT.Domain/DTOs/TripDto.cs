using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIT.Domain.Models
{
    public class TripDto
    {
        public int Id { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public User? User { get; set; }
        public ICollection<Point>? Points { get; set; }

        

    }
}
