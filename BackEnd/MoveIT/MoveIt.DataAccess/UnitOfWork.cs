using Microsoft.Extensions.Logging;
using MoveIt.DataAccess.IRepositories;
using MoveIt.DataAccess.Repositories;
using MoveIT.Domain.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.DataAccess
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly MoveITContext _context;
        public IUserRepository Users { get; private set; }
        public ITripRepository Trips { get; private set; }
        public IPointRepository Points { get; private set; }
        public IProductRepository Products { get; private set; }
        public UnitOfWork(MoveITContext context)
        {
            _context = context;
            _context.ChangeTracker.LazyLoadingEnabled = false;
            Users = new UserRepository(_context);
            Trips = new TripRepository(_context);
            Points = new PointRepository(_context);
            Products = new ProductRepository(_context);
        }
        public async Task CompleteAsync()
        {
            await _context.SaveChangesAsync();
        }
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
