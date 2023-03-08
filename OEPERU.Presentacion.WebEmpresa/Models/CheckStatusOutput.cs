using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OEPERU.Presentacion.WebEmpresa.ApiClient;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class CheckStatusOutput
    {
        public string id { get; set; }
        public string codigo { get; set; }
        public string apiEstado { get; set; }
        public string apiMensaje { get; set; }
        public CheckStatusOutput()
        {
            id = string.Empty;
            codigo = string.Empty;
            apiEstado = string.Empty;
            apiMensaje = string.Empty;
        }

        public CheckStatusOutput(string apiEstado, string apiMensaje)
        {
            this.apiEstado = apiEstado;
            this.apiMensaje = apiMensaje;
        }

        public CheckStatusOutput(Dictionary<string, object> diccionario)
        {
            id = (string)(diccionario[OEPERUApiName.Id]);
            codigo = (string)diccionario[OEPERUApiName.Codigo];
            apiEstado = (string)diccionario[OEPERUApiName.ApiEstado];
            apiMensaje = (string)diccionario[OEPERUApiName.ApiMensaje];

        }
    }
}
