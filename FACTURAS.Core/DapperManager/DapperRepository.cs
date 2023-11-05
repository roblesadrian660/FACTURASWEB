
namespace Infraestructure.Core.DapperManager
{
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Threading.Tasks;
    using Dapper;
    using Infraestructure.Core.DapperManager.Interface;
    using Microsoft.Extensions.Configuration;


    public class DapperRepository<T> : IDapperRepository<T> where T : class
    {

        private readonly string connString;

        public DapperRepository(IConfiguration configuration)
        {
            this.connString = configuration.GetConnectionString("ConnectionStringSQLServer");
        }


        public int? ExecuteAction(string query)
        {
            IDbConnection connection = this.GetConnection();
            var result = connection.Execute(query);
            this.CloseConnection(connection);
            return result;
        }

        public IEnumerable<T> GetList(T entity)
        {
            IDbConnection connection = this.GetConnection();
            var result = connection.Query<T>(GetColumnList(entity));
            this.CloseConnection(connection);
            return result;
        }

        public IEnumerable<T> GetListQuery(string query, object parameters = null)
        {
            IDbConnection connection = this.GetConnection();
            var result = connection.Query<T>(query, parameters, commandType: CommandType.Text, commandTimeout: 300);
            this.CloseConnection(connection);
            return result;
        }

        public async Task<IEnumerable<T>> GetListQueryAsync(string query, object parameters = null)
        {
            IDbConnection connection = this.GetConnection();
            var result = await connection.QueryAsync<T>(query, parameters, commandType: CommandType.Text, commandTimeout: 300);
            this.CloseConnection(connection);
            return result.ToList();
        }

        public async Task<IEnumerable<T>> ExecuteStoreProcedureAsync(string storeProcedure, object filter = null)
        {
            IDbConnection connection = this.GetConnection();
            var result = await connection.QueryAsync<T>(storeProcedure, filter, commandType: CommandType.StoredProcedure, commandTimeout: 300);
            this.CloseConnection(connection);
            return result.ToList();
        }

        public async Task<IEnumerable<T>> ExecuteQuerySelectAsync(string query, object parameters = null)
        {
            IDbConnection connection = this.GetConnection();
            var result = await connection.QueryAsync<T>(query, parameters);
            this.CloseConnection(connection);
            return result;
        }


        public T SingleOrDefault(T entity)
        {
            IDbConnection connection = this.GetConnection();
            var result = connection.QueryFirstOrDefault<T>(GetColumnList(entity));
            this.CloseConnection(connection);
            return result;
        }

        /// <summary>
        /// Gets the connection.
        /// </summary>
        /// <returns>IDbConnection.</returns>
        private IDbConnection GetConnection()
        {
            var conn = new SqlConnection(connString);
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            return conn;
        }

        private void CloseConnection(IDbConnection conn)
        {
            if (conn.State == ConnectionState.Open || conn.State == ConnectionState.Broken)
            {
                conn.Close();
            }
        }


        private string GetColumnList(T entity)
        {
            string selectedColumns = "Select ";
            foreach (var prop in entity.GetType().GetProperties())
            {
                if (!prop.Name.Contains("_"))
                {
                    selectedColumns = selectedColumns + ConvertToPascalCase(prop.Name) + " AS " + prop.Name + ",";
                }
            }

            return selectedColumns + " From " + ConvertToPascalCase(entity.GetType().Name);
        }

        private string ConvertToPascalCase(string str)
        {
            return string.Concat(str.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x.ToString() : x.ToString())).ToLower();
        }
    }
}
