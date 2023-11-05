using FACTURAS.Utils.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FACTURAS.Core.DapperRepository.Interface
{
    public interface IFacturaRepository
    {
        Task<IEnumerable<BuscarFacturaTDO>> ExecuteStoreGestionFacturaBuscarFactura(Dictionary<string, object> parameters);
        IEnumerable<object> ExecuteStoreProcedureGestionFactura(Dictionary<string, object> parameters);
    }
}
