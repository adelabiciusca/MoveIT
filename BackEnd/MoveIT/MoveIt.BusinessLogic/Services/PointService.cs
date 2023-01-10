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
    public class PointService : BaseService, IPointService
    {
        public PointService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public async Task<bool> DeletePoint(string pointId)
        {
            await _unitOfWork.Points.DeleteById(pointId);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
