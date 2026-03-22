using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Pacifickode_Practicaltest.Data;
using Pacifickode_Practicaltest.Models;

namespace Pacifickode_Practicaltest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeRepository _repository;

        public EmployeeController(EmployeeRepository repository)
        {
            _repository = repository;
        }

        // get all employees api
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var employees = _repository.GetAll();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Add employee api
        [HttpPost]
        public IActionResult Add([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_repository.EmailExists(employee.Email))
                return BadRequest("Email address already exists.");

            try
            {
                _repository.Add(employee);
                return Ok("Employee added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Update employees details api
        [HttpPut("{employeeId:int}")]
        public IActionResult Update(int employeeId, [FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_repository.EmailExists(employee.Email, excludeId: employeeId))
                return BadRequest("Email address already exists.");

            employee.EmployeeId = employeeId;

            try
            {
                _repository.Update(employee);
                return Ok("Employee updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Delete employee api
        [HttpDelete("{employeeId:int}")]
        public IActionResult Delete(int employeeId)
        {
            try
            {
                _repository.Delete(employeeId);
                return Ok("Employee deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}