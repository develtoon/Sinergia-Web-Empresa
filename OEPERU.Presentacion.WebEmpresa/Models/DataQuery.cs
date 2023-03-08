using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OEPERU.Presentacion.WebEmpresa.ApiClient;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class DataQuery<T> where T : class
    {
        public string apiEstado { get; set; }
        public string apiMensaje { get; set; }
        public IList<T> data { get; set; }
        public int total { get; set; }

        public DataQuery()
        {
            data = new List<T>();
            apiEstado = String.Empty;
            total = 0;
            apiMensaje = String.Empty;
        }

        public DataQuery(string apiEstado, string apiMensaje)
        {
            this.apiEstado = apiEstado;
            this.apiMensaje = apiMensaje;
            data = new List<T>();
            total = 0;
        }

        public DataQuery(string apiEstado, string apiMensaje, IList<T> data, int total)
        {
            this.apiEstado = apiEstado;
            this.apiMensaje = apiMensaje;
            this.data = data;
            this.total = total;
        }

        public DataQuery(Dictionary<string, object> diccionario)
        {
            apiEstado = (string)diccionario[OEPERUApiName.ApiEstado];
            apiMensaje = (string)diccionario[OEPERUApiName.ApiMensaje];
            total = int.Parse(diccionario[OEPERUApiName.Total].ToString());
            data = JsonConvert.DeserializeObject<List<T>>(diccionario[OEPERUApiName.Data].ToString());

        }
    }
}
