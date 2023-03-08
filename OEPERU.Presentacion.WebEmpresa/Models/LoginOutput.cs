using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Models
{
    public class LoginOutput
    {
        public string id { get; set; }
        public string codigo { get; set; }
        public string persona { get; set; }
        public string imagen { get; set; }
        public string imagenMiniatura { get; set; }
        public string usuario { get; set; }
        public string rol { get; set; }
        public string idRol { get; set; }
        public string token { get; set; }
        public IList<UsuarioMenuOutput> menus { get; set; }
        public string apiEstado { get; set; }
        public string apiMensaje { get; set; }

        public LoginOutput()
        {

        }
        public LoginOutput(Dictionary<string, object> diccionario)
        {
            id = (string)diccionario["id"];
            codigo = (string)diccionario["codigo"];
            usuario = (string)diccionario["usuario"];
            apiEstado = (string)diccionario["apiEstado"];
            apiMensaje = (string)diccionario["apiMensaje"];
            persona = (string)diccionario["persona"];
            rol = (string)diccionario["rol"];
            token = (string)diccionario["token"];
            menus = JsonConvert.DeserializeObject<List<UsuarioMenuOutput>>(diccionario["menus"].ToString());

        }
    }
}
