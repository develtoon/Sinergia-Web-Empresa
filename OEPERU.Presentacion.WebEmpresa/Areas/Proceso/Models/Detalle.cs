using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class Detalle
    {
        public int idTipo { get; set; }
        public int valor { get; set; }
        
        public Detalle(){
            
            this.idTipo = 0;
            this.valor = 0;

        }

    }
    
}
