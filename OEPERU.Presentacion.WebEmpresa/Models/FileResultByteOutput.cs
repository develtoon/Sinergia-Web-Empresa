using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class FileResultByteOutput
    {
        public string apiEstado { get; set; }
        public string apiMensaje { get; set; }
        public string nombre { get; set; }
        public int statusCode { get; set; }
        public byte[] archivoByte { get; set; }

        public FileResultByteOutput()
        {
            this.apiEstado = string.Empty;
            this.apiMensaje = string.Empty;
            this.nombre = string.Empty;
            this.statusCode = (int)HttpStatusCode.InternalServerError;
        }
    }
}
