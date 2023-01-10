using Microsoft.Extensions.Logging;
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
    public class PointRepository : GenericRepository<Point>, IPointRepository
    {
        public PointRepository(MoveITContext context) : base(context)
        {
        }
    }
}
