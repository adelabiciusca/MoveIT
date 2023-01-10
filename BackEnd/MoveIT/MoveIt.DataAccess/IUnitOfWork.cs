using MoveIt.DataAccess.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ITripRepository Trips { get; }
        IPointRepository Points { get; }
        IProductRepository Products { get; }

        Task CompleteAsync();
    }
}
