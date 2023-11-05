using FACTURAS.Utils.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FACTURAS.Service.Services.Interface
{
    public interface IFacturaServices
    {
        ResponseModel GuardarFactura(RequestGuardar requestGuardar);
        Task<ResponseModel> ConsultarFactura(RequestConsulta requestConsulta);
        ResponseModel ConsultaDinamica(RequestConsulta requestConsulta);
    }
}
