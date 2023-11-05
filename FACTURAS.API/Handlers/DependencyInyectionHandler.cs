using FACTURAS.Service.Services;
using FACTURAS.Service.Services.Interface;
using Infraestructure.Core.DapperManager.Interface;
using Infraestructure.Core.DapperManager;
using FACTURAS.Core.DapperRepository.Interface;
using FACTURAS.Core.DapperRepository;

namespace FACTURAS.API.Handlers
{
    public class DependencyInyectionHandler
    {
        public static void DependencyInyectionConfig(IServiceCollection services)
        {
            services.AddSingleton<IFacturaServices, FacturaServices>();

            services.AddTransient(typeof(IDapperRepository<>), typeof(DapperRepository<>));
            services.AddTransient<IFacturaRepository, FacturaRepository>();
        }
    }
}
