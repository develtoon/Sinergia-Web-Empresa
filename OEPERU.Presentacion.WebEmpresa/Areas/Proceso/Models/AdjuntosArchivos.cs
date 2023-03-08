using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class AdjuntosArchivos
    {
        public string id { get; set; }
        public int idTipo { get; set; }
        public string idArchivo { get; set; }
        public string referencia { get; set; }
        
        public AdjuntosArchivos(){
            
            this.id = string.Empty;
            this.idTipo = 0;
            this.idArchivo = string.Empty;
            this.referencia = string.Empty;

        }

    }
    
}
