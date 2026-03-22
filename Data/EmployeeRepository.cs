using Microsoft.Data.SqlClient;
using Pacifickode_Practicaltest.Models;
using System.Data;

namespace Pacifickode_Practicaltest.Data
{
    public class EmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public List<Employee> GetAll()
        {
            var employees = new List<Employee>();

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"SELECT  e.EmployeeId,
                                      e.FirstName,
                                      e.LastName,
                                      e.Email,
                                      e.DateOfBirth,
                                      e.Salary,
                                      e.DepartmentId,
                                      d.DepartmentName
                              FROM    Employees e
                              INNER JOIN Departments d ON e.DepartmentId = d.DepartmentId
                              ORDER BY e.LastName, e.FirstName";

                using (var command = new SqlCommand(query, connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            EmployeeId = reader.GetInt32(0),
                            FirstName = reader.GetString(1),
                            LastName = reader.GetString(2),
                            Email = reader.GetString(3),
                            DateOfBirth = reader.GetDateTime(4),
                            Salary = reader.GetDecimal(5),
                            DepartmentId = reader.GetString(6),
                            DepartmentName = reader.GetString(7)
                        });
                    }
                }
            }

            return employees;
        }

        public bool EmailExists(string email, int excludeId = 0)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"SELECT COUNT(1) FROM Employees 
                              WHERE Email = @Email AND EmployeeId <> @EmployeeId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = email;
                    command.Parameters.Add("@EmployeeId", SqlDbType.Int).Value = excludeId;

                    return (int)command.ExecuteScalar()! > 0;
                }
            }
        }

        public void Add(Employee employee)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"INSERT INTO Employees 
                                (FirstName, LastName, Email, DateOfBirth, Salary, DepartmentId)
                              VALUES 
                                (@FirstName, @LastName, @Email, @DateOfBirth, @Salary, @DepartmentId)";

                using (var command = new SqlCommand(query, connection))
                {
                    SetEmployeeParameters(command, employee);
                    command.ExecuteNonQuery();
                }
            }
        }

        public void Update(Employee employee)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = @"UPDATE Employees
                              SET FirstName    = @FirstName,
                                  LastName     = @LastName,
                                  Email        = @Email,
                                  DateOfBirth  = @DateOfBirth,
                                  Salary       = @Salary,
                                  DepartmentId = @DepartmentId
                              WHERE EmployeeId = @EmployeeId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@EmployeeId", SqlDbType.Int)
                        .Value = employee.EmployeeId;

                    SetEmployeeParameters(command, employee);
                    command.ExecuteNonQuery();
                }
            }
        }

        public void Delete(int employeeId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var query = "DELETE FROM Employees WHERE EmployeeId = @EmployeeId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@EmployeeId", SqlDbType.Int)
                        .Value = employeeId;

                    command.ExecuteNonQuery();
                }
            }
        }

        // ── Private helper — reused by both Add and Update ──
        private static void SetEmployeeParameters(SqlCommand command, Employee employee)
        {
            command.Parameters.Add("@FirstName", SqlDbType.NVarChar, 50)
                .Value = employee.FirstName.Trim();

            command.Parameters.Add("@LastName", SqlDbType.NVarChar, 50)
                .Value = employee.LastName.Trim();

            command.Parameters.Add("@Email", SqlDbType.NVarChar, 100)
                .Value = employee.Email.Trim();

            command.Parameters.Add("@DateOfBirth", SqlDbType.Date)
                .Value = employee.DateOfBirth.Date;

            command.Parameters.Add("@Salary", SqlDbType.Decimal)
                .Value = employee.Salary;

            command.Parameters.Add("@DepartmentId", SqlDbType.NVarChar, 10)
                .Value = employee.DepartmentId;
        }
    }
}