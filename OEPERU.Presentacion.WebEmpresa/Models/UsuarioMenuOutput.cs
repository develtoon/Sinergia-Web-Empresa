using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class UsuarioMenuOutput
    {
        public string id { get; set; }
        public int orden { get; set; }
        public string nombre { get; set; }
        public string icono { get; set; }
        public IList<UsuarioSubMenuOutput> subMenus { get; set; }

        public UsuarioMenuOutput()
        {
            this.id = string.Empty;
            this.orden = 0;
            this.nombre = string.Empty;
            this.icono = string.Empty;
            this.subMenus = new List<UsuarioSubMenuOutput>();
        }
    }
}
