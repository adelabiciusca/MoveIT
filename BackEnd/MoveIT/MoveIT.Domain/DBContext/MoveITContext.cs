using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoveIT.Domain.Models;
using MoveIT;

namespace MoveIT.Domain.DBContext
{
    public class MoveITContext : DbContext
    {
        
        DbSet<User> Users { get; set; }
        DbSet<Point> Points { get; set; }
        DbSet<Product> Products { get; set; }
        DbSet<Trip> Trips { get; set; }

        public MoveITContext(DbContextOptions<MoveITContext> options) : base(options) { }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=moveitdb;Trusted_Connection=True;TrustServerCertificate=True");
        }
    }
}
