using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Administracion.Models
{
    public class ClienteProductosInput
    {
        public string id { get; set; }
        public string nombre { get; set; }
        public IList<ClienteSubProductosInput> subProductos { get; set; }
        public IList<ClienteTipoTasacionInput> tiposTasacion { get; set; }
    }
}
