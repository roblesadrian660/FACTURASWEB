using FACTURAS.Service.Services.Interface;
using FACTURAS.Utils.Dto;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FACTURAS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IFacturaServices _facturaServices;

        public FacturaController( IFacturaServices facturaServices)
        {
            _facturaServices = facturaServices;
        }

        [HttpPost("GuardarFactura")]
        public IActionResult GuardarFactura(RequestGuardar requestGuardar)
        {
            ResponseModel responseModel = _facturaServices.GuardarFactura(requestGuardar);

            if (responseModel.StatusRequest == 404)
            {
                return NotFound(responseModel.Mensaje);
            }
            if (responseModel.StatusRequest == 400)
            {
                return BadRequest(responseModel.Mensaje);
            }
            return Ok(responseModel.Resultado);
        }

        [HttpPost("ConsultarFactura")]
        public async Task<IActionResult> ConsultarFactura(RequestConsulta requestConsulta)
        {
            ResponseModel responseModel = await _facturaServices.ConsultarFactura(requestConsulta);

            if (responseModel.StatusRequest == 404)
            {
                return NotFound(responseModel.Mensaje);
            }
            if (responseModel.StatusRequest == 400)
            {
                return BadRequest(responseModel.Mensaje);
            }
            return Ok(responseModel.Resultado);
        }

        [HttpPost("ConsultaDinamica")]
        public IActionResult ConsultaDinamica(RequestConsulta requestConsulta)
        {
            ResponseModel responseModel = _facturaServices.ConsultaDinamica(requestConsulta);

            if (responseModel.StatusRequest == 404)
            {
                return NotFound(responseModel.Mensaje);
            }
            if (responseModel.StatusRequest == 400)
            {
                return BadRequest(responseModel.Mensaje);
            }
            return Ok(responseModel.Resultado);
        }
    }
}
