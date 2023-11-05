

namespace Infraestructure.Core.DapperManager.Interface
{
    using System.Threading.Tasks;
    using System.Collections.Generic;

    public interface IDapperRepository<T> where T : class
    {
        IEnumerable<T> GetList(T entity);

        IEnumerable<T> GetListQuery(string query, object parameters = null);

        Task<IEnumerable<T>> ExecuteStoreProcedureAsync(string storeProcedure, object filter = null);

        T SingleOrDefault(T entity);

        int? ExecuteAction(string query);

        Task<IEnumerable<T>> GetListQueryAsync(string query, object parameters = null);

        Task<IEnumerable<T>> ExecuteQuerySelectAsync(string query, object parameters = null);
    }
}
