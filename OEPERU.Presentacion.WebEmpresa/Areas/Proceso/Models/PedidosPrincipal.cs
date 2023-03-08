using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models
{
    public class PedidosPrincipal
    {
        public string id { get; set; }
        public int estado { get; set;}
        public int idContenedor { get; set; }
        public string idUbigeo { get; set; }
        public string idDepartamento { get; set; }
        public string idProvincia { get; set; }
        public string idDistrito { get; set; }
        public string direccion { get; set; }
        public string referencia { get; set; }
        public string latitud { get; set; }
        public string longitud { get; set; }
        public string solicitante { get; set; }
        public int idTipoDocumento { get; set; }
        public string documento { get; set; }
        public string idCliente { get; set; }
        public string numeroSolicitud { get; set; }
        public string numeroGarantia { get; set; }
        public bool esImpresion { get; set; }
        public string oficina { get; set; }
        public string oficinaDestino { get; set; }
        public string funcionario { get; set; }
        public string funcionarioDestino { get; set; }
        public string idTipoServicio{ get; set; }
        public string idTipoTasacion { get; set; }
        public string idSubTipoTasacion { get; set; }
        public string idClienteProducto { get; set; }
        public string idClienteSubProducto { get; set; }
        public string idTipoBien { get; set; }
        public string idSubTipoBien { get; set; }
        public int idTipoVisita { get; set; }
        public string placa { get; set; }
        public string marca { get; set; }
        public string modelo { get; set; }
        public int idFormaPago { get; set; }
        public decimal montoCotizado { get; set; }
        public decimal pagoCuenta { get; set; }
        public int idFacturar { get; set; }
        public string razonSocialFacturacion { get; set; }
        public string rucFacturacion { get; set; }
        public string correoReceptor { get; set; }
        public bool esCobroAnticipado { get; set; }
        public int idEstadoFacturacion { get; set; }
        public string contacto { get; set; }
        public string contactoTelefono { get; set; }
        public string contactoCorreo { get; set; }
        public string fechaInicio { get; set; }
        public string horaInicio { get; set; }
        public string horaFin { get; set; }
        public bool esUrgente { get; set; }
        public string observacion { get; set; }
        public IList<Equipo> equipo { get; set; }
        public PedidosPrincipal(){
            this.id = string.Empty;
            this.idContenedor = 0;
            this.idUbigeo = string.Empty;
            this.idDepartamento = string.Empty;
            this.idProvincia = string.Empty;
            this.idDistrito = string.Empty;
            this.direccion = string.Empty;
            this.referencia = string.Empty;
            this.latitud = string.Empty;
            this.longitud = string.Empty;
            this.solicitante = string.Empty;
            this.idTipoDocumento = 0;
            this.documento = string.Empty;
            this.idCliente = string.Empty;
            this.numeroSolicitud = string.Empty;
            this.numeroGarantia = string.Empty;
            this.esImpresion = false;
            this.oficina = string.Empty;
            this.oficinaDestino = string.Empty;
            this.funcionario = string.Empty;
            this.funcionarioDestino = string.Empty;
            this.idTipoTasacion = string.Empty;
            this.idSubTipoTasacion = string.Empty;
            this.idClienteProducto = string.Empty;
            this.idClienteSubProducto = string.Empty;
            this.idTipoBien = string.Empty;
            this.idSubTipoBien = string.Empty;
            this.idTipoVisita = 0;
            this.placa = string.Empty;
            this.marca = string.Empty;
            this.modelo = string.Empty;
            this.idFormaPago = 0;
            this.montoCotizado = 0;
            this.pagoCuenta = 0;
            this.idFacturar = 0;
            this.razonSocialFacturacion = string.Empty;
            this.rucFacturacion = string.Empty;
            this.correoReceptor = string.Empty;
            this.esCobroAnticipado = false;
            this.idEstadoFacturacion = 0;
            this.contacto = string.Empty;
            this.contactoTelefono = string.Empty;
            this.contactoCorreo = string.Empty;
            this.fechaInicio = string.Empty;
            this.horaInicio = string.Empty;
            this.horaFin = string.Empty;
            this.esUrgente = false;
            this.observacion = string.Empty;
            this.equipo = new List<Equipo>();
        }

    }
    
}
