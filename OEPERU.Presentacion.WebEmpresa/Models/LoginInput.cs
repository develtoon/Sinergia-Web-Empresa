using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class LoginInput
    {

        public string contrasenia { get; set; }
        public string correo { get; set; }
        public LoginInput()
        {
            correo = string.Empty;
            contrasenia = string.Empty;
        }
    }
}
