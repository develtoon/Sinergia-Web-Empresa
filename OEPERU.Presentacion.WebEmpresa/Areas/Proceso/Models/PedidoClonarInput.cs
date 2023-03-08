using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Proceso.Models
{
    public class PedidoClonarInput
    {
        public string id { get; set; }

        public PedidoClonarInput()
        {
            this.id = string.Empty;
        }
    }
}
