using FACTURAS.Core.DapperRepository.Interface;
using FACTURAS.Utils.Dto;
using Infraestructure.Core.DapperManager.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FACTURAS.Core.DapperRepository
{
    public class FacturaRepository: IFacturaRepository
    {
        private readonly IDapperRepository<BuscarFacturaTDO> _dapperManagerBuscarFactura;
        private readonly IDapperRepository<object> _dapperManagerDinamico;

        public FacturaRepository(IDapperRepository<BuscarFacturaTDO> dapperManagerBuscarFactura, IDapperRepository<object> dapperManager)
        {
            this._dapperManagerBuscarFactura = dapperManagerBuscarFactura;
            this._dapperManagerDinamico = dapperManager;
        }

        public async Task<IEnumerable<BuscarFacturaTDO>> ExecuteStoreGestionFacturaBuscarFactura(Dictionary<string, object> parameters)
        {
            IEnumerable<BuscarFacturaTDO> result = await this._dapperManagerBuscarFactura.ExecuteStoreProcedureAsync("[dbo].[usp_GestionFactura]", parameters);
            return result;
        }

        public IEnumerable<object> ExecuteStoreProcedureGestionFactura(Dictionary<string, object> parameters)
        {
            var result = this._dapperManagerDinamico.ExecuteStoreProcedureAsync("[dbo].[usp_GestionFactura]", parameters).Result;
            return result;
        }
    }
}
