using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class Equipo
    {
        public string idUsuario { get; set; }
        public int idTipo { get; set; }
        
        public Equipo(){
            
            this.idUsuario = string.Empty;
            this.idTipo = 0;

        }

    }
    
}
