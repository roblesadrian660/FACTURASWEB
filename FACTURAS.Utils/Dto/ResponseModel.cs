using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FACTURAS.Utils.Dto
{
    public class ResponseModel
    {
        public int StatusRequest { get; set; }
        public string Mensaje { get; set; }
        public object Resultado { get; set; }
    }
}
