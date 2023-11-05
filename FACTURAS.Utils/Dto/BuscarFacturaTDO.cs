using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FACTURAS.Utils.Dto
{
    public class BuscarFacturaTDO
    {
        public int Id { get; set; }
        public int NumeroFactura { get; set; }
        public DateTime FechaEmisionFactura { get; set; }
        public decimal TotalFactura { get; set; }
        public decimal TotalImpuesto { get; set; }
        public decimal SubTotalFactura { get; set; }
        public string RazonSocial { get; set; }
    }
}
