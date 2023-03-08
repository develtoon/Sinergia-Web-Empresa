using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Administracion.Models
{
    public class ColaboradorInput
    {
        public string id { get; set; }
        public string idEmpresa { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public int idRegion { get; set; }
        public string documento { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public bool cambiarContrasenia { get; set; }
        public string contrasenia { get; set; }
        public string idRol { get; set; }
        public int estado { get; set; }
        public IList<ColaboradorClienteInput> clientes { get; set; }

            public ColaboradorInput(){
                this.id = string.Empty;
                this.idEmpresa = string.Empty;
                this.nombre = string.Empty;
                this.apellido = string.Empty;
                this.idRegion = 0;
                this.documento = string.Empty;
                this.telefono = string.Empty;
                this.cambiarContrasenia = false;
                this.correo = string.Empty;
                this.contrasenia = string.Empty;
                this.idRol = string.Empty;
                this.estado = 0;
                this.clientes = new List<ColaboradorClienteInput>();
            }

    }
}
