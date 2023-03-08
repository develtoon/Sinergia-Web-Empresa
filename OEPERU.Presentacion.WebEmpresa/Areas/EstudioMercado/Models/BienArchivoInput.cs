using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Models
{
    public class BienArchivoInput
    {
        public string id { get; set; }
        public string idArchivo { get; set; }

        public BienArchivoInput()
        {
            this.id = string.Empty;
            this.idArchivo = string.Empty;
        }
    }
}
