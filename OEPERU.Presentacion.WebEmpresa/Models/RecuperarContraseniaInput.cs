using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class RecuperarContraseniaInput
    {
        public string usuario { get; set; }
        public RecuperarContraseniaInput()
        {
            usuario = string.Empty;
        }
    }
}
