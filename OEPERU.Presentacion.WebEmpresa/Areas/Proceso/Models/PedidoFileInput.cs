using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Proceso.Models
{
    public class PedidoFileInput
    {
        public string idPedido { get; set; }
        public IFormFile archivo { set; get; }

        public PedidoFileInput()
        {
            this.idPedido = string.Empty;
        }
    }
}
