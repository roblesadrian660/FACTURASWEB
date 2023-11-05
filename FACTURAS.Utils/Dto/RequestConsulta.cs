using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FACTURAS.Utils.Dto
{
    public class RequestConsulta
    {
        public string? Accion { get; set; }
        public int IdFactura { get; set; }
        public int IdCliente { get; set; }
        public int NumeroFactura { get; set; }
    }
}
