using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class PedidosDocumentosAdjuntos
    {
        public string id { get; set; }
        public int idContenedor { get; set; }
        public IList<AdjuntosArchivos> archivos { get; set; }
        
        public PedidosDocumentosAdjuntos(){
            this.id = string.Empty;
            this.idContenedor = 0;
            this.archivos = new List<AdjuntosArchivos>();
        }

    }
    
}
