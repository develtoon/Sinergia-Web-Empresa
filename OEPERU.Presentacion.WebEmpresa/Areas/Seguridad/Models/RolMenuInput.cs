using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebAdministracion.Areas.Seguridad.Models
{
    public class RolMenuInput
    {
        public string id { get; set; }
        public bool esconsultar { get; set; }
        public bool esexportar { get; set; }
        public bool escrear { get; set; }
        public bool eseditar { get; set; }
        public bool eseliminar { get; set; }
        
        public RolMenuInput()
        {
            this.id = string.Empty;
            this.esconsultar = false;
            this.esexportar = false;
            this.escrear = false;
            this.eseditar = false;
            this.eseliminar = false;
        }
    }
}
