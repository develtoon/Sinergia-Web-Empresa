using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Models
{
    public class ConsultaBienQueryInput
    {
        public string idsBien { get; set; }
        public string idTipoBien { get; set; }
        public string idSubTipoBien { get; set; }

        public string idCategoriaSubTipoBien { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }
        public string idDepartamento { get; set; }
        public string idProvincia { get; set; }
        public string idDistrito { get; set; }
        public string direccion { get; set; }
        public int tipoBusqueda { get; set; }
        public string centerLat { get; set; }
        public string centerLng { get; set; }
        public int zoom { get; set; }
        public string neLat { get; set; }
        public string neLng { get; set; }
        public string swLat { get; set; }
        public string swLng { get; set; }
        public int idEstado { get; set; }

        public IList<ConsultaBienAtributoQueryInput> atributos { get; set; }

        public ConsultaBienQueryInput()
        {
            this.idsBien = string.Empty;
            this.idTipoBien = string.Empty;
            this.idSubTipoBien = string.Empty;
            this.idCategoriaSubTipoBien = string.Empty;
            this.fechaInicio = string.Empty;
            this.fechaFin = string.Empty;
            this.idDepartamento = string.Empty;
            this.idProvincia = string.Empty;
            this.idDistrito = string.Empty;
            this.direccion = string.Empty;
            this.tipoBusqueda = 0;
            this.centerLat = string.Empty;
            this.centerLng = string.Empty;
            this.zoom = 0;
            this.neLat = string.Empty;
            this.neLng = string.Empty;
            this.swLat = string.Empty;
            this.swLng = string.Empty;
            this.idEstado = 0;
            this.atributos = new List<ConsultaBienAtributoQueryInput>();
        }
    }
}
