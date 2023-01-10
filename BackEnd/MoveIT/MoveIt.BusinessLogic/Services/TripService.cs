using MoveIt.BusinessLogic.IServices;
using MoveIt.DataAccess;
using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.BusinessLogic.Services
{
    public class TripService : BaseService, ITripService
    {
        public TripService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public async Task<bool> EndTrip(string tripId, string userId)
        {
            Trip trip = await _unitOfWork.Trips.GetById(tripId);
            User user = await _unitOfWork.Users.GetById(userId);
            trip.EndTime = DateTime.Now;
            user.storePoints = user.storePoints + (10 - trip.Points.Count);
            await _unitOfWork.Trips.Update(trip);
            await _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<Trip> GetTripByUserId(string userId)
        {
            var user = await _unitOfWork.Users.GetById(userId);

            var userLastTrip = user.Trips.Where(x => x.EndTime == null).FirstOrDefault();
            if (userLastTrip == null) return null;
            return await _unitOfWork.Trips.GetById(userLastTrip.Id);
        }
        public async Task<Trip> StartTrip(float latitude, float longitude, string userId)
        {
            var user = await _unitOfWork.Users.GetById(userId);

            List<Point> points = new List<Point>();

            for(int i=0; i<10; i++)
            {
                Point p = await generatePointAsync(latitude, longitude);
                points.Add(p);
            }

            var trip = new Trip()
            {
                StartTime = DateTime.Now,
                User = user,
                Points = points,
            };

            await _unitOfWork.Trips.Create(trip);
            await _unitOfWork.CompleteAsync();

            return trip;
        }

        // handlers
        protected async Task<Point> generatePointAsync(float latitude, float longitude)
        {
            var y0 = latitude;
            var x0 = longitude;
            var rd = 0.00898472596; //1km

            Random rnd = new();

            var u = rnd.NextDouble();
            var v = rnd.NextDouble();

            var w = rd * Math.Sqrt(u);
            var t = 2 * Math.PI * v;
            var x = w * Math.Cos(t);
            var y = w * Math.Sin(t);

            var newlat = y + y0;
            var newlon = x + x0;
            Point p = new Point()
            {
                Latitude = (float?)newlat,
                Longitude = (float?)newlon,
            };
            Point newPoint = await _unitOfWork.Points.Create(p);
            await _unitOfWork.CompleteAsync();
            return newPoint;
        }
    }
}
