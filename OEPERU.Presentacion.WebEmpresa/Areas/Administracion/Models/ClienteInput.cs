using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Administracion.Models
{
    public class ClienteInput
    {
        public string id { get; set; }
        public string abreviatura { get; set; }
        public string nombre { get; set; }
        public int idTipoDocumento { get; set; }
        public string documento { get; set; }
        public int estado { get; set; }
        public bool esParticular { get; set; }
        public IList<ClienteProductosInput> productos { get; set; }

        public ClienteInput()
        {
            this.id = string.Empty;
            this.abreviatura = string.Empty;
            this.nombre = string.Empty;
            this.idTipoDocumento = 0;
            this.nombre = string.Empty;
            this.estado = 0;
            this.esParticular = false;
            this.productos = new List<ClienteProductosInput>();
        }
    }
}