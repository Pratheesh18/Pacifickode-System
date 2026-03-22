using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Pacifickode_Practicaltest.Data;
using Pacifickode_Practicaltest.Models;

namespace Pacifickode_Practicaltest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentRepository _repository;

        public DepartmentController(DepartmentRepository repository)
        {
            _repository = repository;
        }

        // GET api/department
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var departments = _repository.GetAll();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // POST api/department
        [HttpPost]
        public IActionResult Add([FromBody] Department department)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_repository.IdExists(department.DepartmentId.Trim().ToUpper()))
                return BadRequest("Department ID already exists.");

            try
            {
                _repository.Add(department);
                return Ok("Department added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // PUT api/department/HR
        [HttpPut("{departmentId}")]
        public IActionResult Update(string departmentId, [FromBody] Department department)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            department.DepartmentId = departmentId;

            try
            {
                _repository.Update(department);
                return Ok("Department updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE api/department/HR
        [HttpDelete("{departmentId}")]
        public IActionResult Delete(string departmentId)
        {
            try
            {
                _repository.Delete(departmentId);
                return Ok("Department deleted successfully.");
            }
            catch (SqlException ex)
            {
                return BadRequest("Cannot delete — department has employees assigned.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}