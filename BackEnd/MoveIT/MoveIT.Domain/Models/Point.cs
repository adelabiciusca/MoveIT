﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIT.Domain.Models
{
    public class Point : BaseModel
    {
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
    }
}
