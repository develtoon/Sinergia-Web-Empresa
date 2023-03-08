using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class PedidosBitacora
    {
        public string id { get; set; }
        public int idContenedor { get; set; }
        public string idPedidoBitacora { get; set; }
        public string comentarioPedidoBitacora { get; set; }
        public PedidosBitacora(){
            this.id = string.Empty;
            this.idContenedor = 0;
            this.idPedidoBitacora = string.Empty;
            this.comentarioPedidoBitacora = string.Empty;
        }

    }
    
}
