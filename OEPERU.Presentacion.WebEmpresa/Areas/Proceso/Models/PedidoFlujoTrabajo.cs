using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class PedidoFlujoTrabajo
    {
        public string id { get; set; }
        public int estado { get; set; }
        public bool check { get; set; }
        
        public PedidoFlujoTrabajo(){
            
            this.id = string.Empty;
            this.estado = 0;
            this.check = false;
        }

    }
    
}
