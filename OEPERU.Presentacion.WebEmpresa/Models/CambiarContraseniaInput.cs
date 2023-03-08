using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class CambiarContraseniaInput
    {
        public string contenido { get; set; }
        public string contrasenia { get; set; }

        public string repetircontrasenia { get; set; }

        public CambiarContraseniaInput()
        {
            contenido = string.Empty;
            contrasenia = string.Empty;
            repetircontrasenia = string.Empty;
        }
    }
}
