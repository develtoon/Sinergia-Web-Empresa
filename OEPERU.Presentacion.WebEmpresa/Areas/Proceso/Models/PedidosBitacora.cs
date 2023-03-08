using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class PedidosInspeccion
    {
        public string id { get; set; }
        public int idContenedor { get; set; }
        public string esDireccionValida { get; set; }
        public string comentarioPedidoInspeccion { get; set; }
        public int estado { get; set; }
        public IList<Detalle> detalle { get; set; }
        
        public PedidosInspeccion(){
            this.id = string.Empty;
            this.idContenedor = 0;
            this.esDireccionValida = string.Empty;
            this.comentarioPedidoInspeccion = string.Empty;
            this.estado = 0;
            this.detalle = new List<Detalle>();
        }

    }
    
}
