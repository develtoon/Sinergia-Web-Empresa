using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class GastosArchivos
    {
        public string id { get; set; }
        public int idTipo { get; set; }
        public string idArchivo { get; set; }
        public decimal monto { get; set; }
        public bool esFacturable { get; set; }
        
        public GastosArchivos(){
            
            this.id = string.Empty;
            this.idTipo = 0;
            this.idArchivo = string.Empty;
            this.monto = 0;
            this.esFacturable = false;

        }

    }
    
}
