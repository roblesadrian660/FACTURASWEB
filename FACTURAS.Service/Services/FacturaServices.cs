using FACTURAS.Core.DapperRepository.Interface;
using FACTURAS.Service.Services.Interface;
using FACTURAS.Utils.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace FACTURAS.Service.Services
{
    public class FacturaServices : IFacturaServices
    {
        private readonly IFacturaRepository _facturaRepository;

        public FacturaServices(IFacturaRepository facturaRepository)
        {
            _facturaRepository = facturaRepository;
        }

        public ResponseModel GuardarFactura(RequestGuardar requestGuardar)
        {
            XElement facturaDetalle = new XElement("FacturaDetalle");
            Dictionary<string, object> parametersStoreProcedure = new Dictionary<string, object>();
            try
            {
                IEnumerable<object> buscarFactura = _facturaRepository.ExecuteStoreProcedureGestionFactura(new Dictionary<string, object>
                {
                    { "Accion", "BuscarFactura" },
                    { "NumeroFactura", requestGuardar.NumeroFactura }
                });
                if (buscarFactura.Count() >= 1)
                {
                    return new ResponseModel
                    {
                        StatusRequest = 400,
                        Mensaje = $"El numero de factura ya se encuentra registrada"
                    };
                }
                if (requestGuardar.DetalleFactura.Count <= 0)
                {
                    return new ResponseModel
                    {
                        StatusRequest = 400,
                        Mensaje = $"No se encontraron detalles para registrar"
                    };
                }

                foreach (var detalle in requestGuardar.DetalleFactura)
                {
                    detalle.SubtotalProducto = detalle.CantidadDeProducto * detalle.PrecioUnitarioProducto;
                    XElement datos = new XElement("Datos",
                        new XAttribute("IdProducto", detalle.IdProducto),
                        new XAttribute("CantidadDeProducto", detalle.CantidadDeProducto),
                        new XAttribute("PrecioUnitarioProducto", detalle.PrecioUnitarioProducto),
                        new XAttribute("SubtotalProducto", detalle.SubtotalProducto),
                        new XAttribute("Notas", detalle.Notas)
                    );
                    facturaDetalle.Add(datos);
                }

                parametersStoreProcedure.Add("Accion", "GuardarFactura");
                parametersStoreProcedure.Add("IdCliente", requestGuardar.IdCliente);
                parametersStoreProcedure.Add("NumeroFactura", requestGuardar.NumeroFactura);
                parametersStoreProcedure.Add("NumeroTotalArticulos", requestGuardar.DetalleFactura.Count);
                parametersStoreProcedure.Add("SubTotalFactura", requestGuardar.DetalleFactura.Sum(detalle => detalle.SubtotalProducto));
                parametersStoreProcedure.Add("TotalImpuesto", requestGuardar.DetalleFactura.Sum(detalle => detalle.SubtotalProducto * 0.19m));
                parametersStoreProcedure.Add("TotalFactura", requestGuardar.DetalleFactura.Sum(detalle => detalle.SubtotalProducto * 1.19m));
                parametersStoreProcedure.Add("XmlFacturaDetalle", facturaDetalle.ToString());
                IEnumerable<object> listaFacturas = _facturaRepository.ExecuteStoreProcedureGestionFactura(parametersStoreProcedure);

                return new ResponseModel
                {
                    Mensaje = $"ok",
                    Resultado = listaFacturas
                };
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public async Task<ResponseModel> ConsultarFactura(RequestConsulta requestConsulta)
        {
            try
            {
                Dictionary<string, object> parametersStoreProcedure = new Dictionary<string, object>();
                parametersStoreProcedure.Add("Accion", "BuscarFactura");
                parametersStoreProcedure.Add("IdFactura", requestConsulta.IdFactura);
                parametersStoreProcedure.Add("IdCliente", requestConsulta.IdCliente);
                parametersStoreProcedure.Add("NumeroFactura", requestConsulta.NumeroFactura);
                IEnumerable<BuscarFacturaTDO> listaFacturas = await _facturaRepository.ExecuteStoreGestionFacturaBuscarFactura(parametersStoreProcedure);

                return new ResponseModel
                {
                    Mensaje = $"ok",
                    Resultado = listaFacturas
                };
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResponseModel ConsultaDinamica(RequestConsulta requestConsulta)
        {
            try
            {
                Dictionary<string, object> parametersStoreProcedure = new Dictionary<string, object>();
                parametersStoreProcedure.Add("Accion", requestConsulta.Accion);
                IEnumerable<object> listaFacturas = _facturaRepository.ExecuteStoreProcedureGestionFactura(parametersStoreProcedure);

                return new ResponseModel
                {
                    Mensaje = $"ok",
                    Resultado = listaFacturas
                };
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
