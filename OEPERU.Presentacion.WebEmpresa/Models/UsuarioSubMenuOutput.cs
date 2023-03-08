using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class UsuarioSubMenuOutput
    {
        public string id {get;set;}
        public int orden {get;set;}
        public string nombre {get;set;}
        public string enlace { get; set; }

        public UsuarioSubMenuOutput()
        {
            this.id = string.Empty;
            this.orden = 0;
            this.nombre = string.Empty;
            this.enlace = string.Empty;
        }
    }
}
