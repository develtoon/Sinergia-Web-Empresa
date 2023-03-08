using OEPERU.Presentacion.WebAdministracion.Areas.Seguridad.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Seguridad.Models
{
    public class RolInput
    {
        public string id { get; set; }
        public string nombre { get; set; }
        public int estado { get; set; }
        public int idTipoRol { get; set; }
        public IList<RolMenuInput> menus { get; set; }
        public IList<RolNegocioSeccionInput> secciones { get; set; }
        public RolInput()
        {
            this.id = string.Empty;
            this.nombre = String.Empty;
            this.estado = 0;
            this.idTipoRol = 0;
            this.menus = new List<RolMenuInput>();
            this.secciones = new List<RolNegocioSeccionInput>();

        }
    }
}