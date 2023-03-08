using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class FileResultOutput
    {
        public string apiEstado { get; set; }
        public string apiMensaje { get; set; }
        public string nombre { get; set; }
        public int statusCode { get; set; }
        public Stream stream { get; set; }

        public FileResultOutput()
        {
            this.apiEstado = string.Empty;
            this.apiMensaje = string.Empty;
            this.nombre = string.Empty;
            this.statusCode = (int)HttpStatusCode.InternalServerError;
        }

    }
}
