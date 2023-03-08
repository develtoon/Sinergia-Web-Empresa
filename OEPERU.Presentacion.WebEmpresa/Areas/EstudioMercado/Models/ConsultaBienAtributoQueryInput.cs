using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Models
{
    public class ConsultaBienAtributoQueryInput
    {
        public string id { get; set; }
        public string valor { get; set; }

        public ConsultaBienAtributoQueryInput()
        {
            this.id = string.Empty;
            this.valor = string.Empty;
        }
    }
}
