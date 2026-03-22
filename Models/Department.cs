using System.ComponentModel.DataAnnotations;

namespace Pacifickode_Practicaltest.Models
{
    public class Department
    {
        [Required(ErrorMessage = "Department id is required.")]
        [StringLength(10, ErrorMessage = "Department id cannot exceed 10 characters.")]
        public string DepartmentId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department name is required.")]
        [StringLength(50, ErrorMessage = "Department name cannot exceed 100 characters.")]
        public string DepartmentName { get; set; } = string.Empty;
    }
}
