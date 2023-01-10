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
    public class ProductService : BaseService, IProductService
    {
        public ProductService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _unitOfWork.Products.GetAll();
        }

        public async Task<bool> ClaimProduct(string productId, string userId)
        {
            var product = await _unitOfWork.Products.GetById(productId);
            var user = await _unitOfWork.Users.GetById(userId);

            if (user.storePoints < product.Price) return false;

            user.storePoints = (int)(user.storePoints - product.Price);

            await _unitOfWork.Users.Update(user);
            await _unitOfWork.Products.DeleteById(productId);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<Product> Create(string name, int price)
        {
            Product p = new Product() { Name = name, Price = price };
            await _unitOfWork.Products.Create(p);
            await _unitOfWork.CompleteAsync();
            return p;
        }
    }
}
