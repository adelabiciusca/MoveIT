using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.BusinessLogic.IServices
{
    public interface ITripService
    {
        Task<Trip> GetTripByUserId(string userId);
        Task<Trip> StartTrip(float latitude, float longitude, string userId);
        Task<bool> EndTrip(string tripId, string userId);
    }
}
