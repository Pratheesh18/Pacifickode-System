using Microsoft.Data.SqlClient;
using Pacifickode_Practicaltest.Models;
using System.Data;

namespace Pacifickode_Practicaltest.Data
{
    public class DepartmentRepository
    {
        private readonly string _connectionString;

        public DepartmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public string GetConnectionString() => _connectionString;

        public List<Department> GetAll()
        {
            var departments = new List<Department>();

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"SELECT DepartmentId, DepartmentName 
                              FROM   Departments 
                              ORDER BY DepartmentId";

                using (var command = new SqlCommand(query, connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        departments.Add(new Department
                        {
                            DepartmentId = reader.GetString(0),
                            DepartmentName = reader.GetString(1)
                        });
                    }
                }
            }

            return departments;
        }

        public bool IdExists(string departmentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = "SELECT COUNT(1) FROM Departments WHERE DepartmentId = @DepartmentId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@DepartmentId", SqlDbType.NVarChar, 10)
                        .Value = departmentId;

                    return (int)command.ExecuteScalar()! > 0;
                }
            }
        }

        public void Add(Department department)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"INSERT INTO Departments (DepartmentId, DepartmentName) 
                              VALUES (@DepartmentId, @DepartmentName)";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@DepartmentId", SqlDbType.NVarChar, 10)
                        .Value = department.DepartmentId.Trim().ToUpper();

                    command.Parameters.Add("@DepartmentName", SqlDbType.NVarChar, 100)
                        .Value = department.DepartmentName.Trim();

                    command.ExecuteNonQuery();
                }
            }
        }

        public void Update(Department department)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"UPDATE Departments 
                              SET    DepartmentName = @DepartmentName 
                              WHERE  DepartmentId   = @DepartmentId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@DepartmentId", SqlDbType.NVarChar, 10)
                        .Value = department.DepartmentId;

                    command.Parameters.Add("@DepartmentName", SqlDbType.NVarChar, 100)
                        .Value = department.DepartmentName.Trim();

                    command.ExecuteNonQuery();
                }
            }
        }

        public void Delete(string departmentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = "DELETE FROM Departments WHERE DepartmentId = @DepartmentId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@DepartmentId", SqlDbType.NVarChar, 10)
                        .Value = departmentId;

                    command.ExecuteNonQuery();
                }
            }
        }
    }
}