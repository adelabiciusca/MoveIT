using MoveIt.DataAccess.IRepositories;
using MoveIT.Domain.DBContext;
using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.DataAccess.Repositories
{
    public class TripRepository : GenericRepository<Trip>, ITripRepository
    {
        public TripRepository(MoveITContext context) : base(context)
        {
        }
    }
}
