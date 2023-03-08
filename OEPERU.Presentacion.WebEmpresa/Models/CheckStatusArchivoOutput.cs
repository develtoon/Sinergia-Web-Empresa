using OEPERU.Presentacion.WebEmpresa.ApiClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class CheckStatusArchivoOutput
    {
        public string id { get; set; }
        public string urlArchivo { get; set; }
        public string urlArchivoMiniatura { get; set; }
        public string apiEstado { get; set; }
        public string apiMensaje { get; set; }
        public CheckStatusArchivoOutput()
        {
            id = string.Empty;
            urlArchivo = string.Empty;
            urlArchivoMiniatura = string.Empty;
            apiEstado = string.Empty;
            apiMensaje = string.Empty;
        }

        public CheckStatusArchivoOutput(string apiEstado, string apiMensaje)
        {
            this.apiEstado = apiEstado;
            this.apiMensaje = apiMensaje;
        }

        public CheckStatusArchivoOutput(Dictionary<string, object> diccionario)
        {
            id = (string)(diccionario[OEPERUApiName.Id]);
            urlArchivo = (string)diccionario[OEPERUApiName.urlArchivo];
            urlArchivoMiniatura = (string)diccionario[OEPERUApiName.urlArchivoMiniatura];
            apiEstado = (string)diccionario[OEPERUApiName.ApiEstado];
            apiMensaje = (string)diccionario[OEPERUApiName.ApiMensaje];

        }
    }
}
