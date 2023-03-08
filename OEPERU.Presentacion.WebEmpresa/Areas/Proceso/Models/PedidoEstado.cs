using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class PedidoEstado
    {
        public string id { get; set; }
        public int atributo { get; set; }
        public string motivo { get; set; }
        public int estado { get; set; }
        public bool check { get; set; }
        
        public PedidoEstado(){
            
            this.id = string.Empty;
            this.atributo = 0;
            this.motivo = string.Empty;
            this.estado = 0;
            this.check = false;
        }

    }
    
}
