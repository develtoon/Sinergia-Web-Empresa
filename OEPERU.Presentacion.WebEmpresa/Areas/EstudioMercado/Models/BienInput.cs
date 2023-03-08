using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Models
{
    public class BienInput
    {       
        public string id { get; set; }      
        public string idUbigeo { get; set; }       
        public string latitud { get; set; }    
        public string longitud { get; set; }   
        public string direccion { get; set; }       
        public string referencia { get; set; }     
        public int idTipoFuente { get; set; }
        public string referenciaFuente { get; set; }
        public string fechaPublicacion { get; set; }
        public string contacto { get; set; }
        public string contactoTelefono { get; set; }      
        public string idTipoBien { get; set; }   
        public string idSubTipoBien { get; set; }       
        public string idCategoriaSubTipoBien { get; set; }
        public decimal precio { get; set; }      
        public int idEstado { get; set; }
        public IList<BienArchivoInput> archivos { get; set; }

        public BienInput()
        {
            this.id = string.Empty;
            this.idUbigeo = string.Empty;
            this.latitud = string.Empty;
            this.longitud = string.Empty;
            this.direccion = string.Empty;
            this.referencia = string.Empty;
            this.idTipoFuente = 0;
            this.referenciaFuente = string.Empty;
            this.fechaPublicacion = string.Empty;
            this.contacto = string.Empty;
            this.contactoTelefono = string.Empty;
            this.idTipoBien = string.Empty;
            this.idSubTipoBien = string.Empty;
            this.idCategoriaSubTipoBien = string.Empty;
            this.precio = 0;
            this.idEstado = 0;
            this.archivos = new List<BienArchivoInput>();
        }
    }
}
