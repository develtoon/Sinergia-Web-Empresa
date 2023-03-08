using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.ApiClient
{
    public class OEPERUApiName
    {

        public const string Cuenta = "v1/cuentas";

        public const string Colaboradores = "v1/colaboradores";
        public const string EmpresaRol = "v1/empresas-roles";
        public const string EmpresaColaborador = "/v1/empresas-colaboradores";
        public const string ColaboradoresTiposRoles = "/v1/empresas-colaboradores/tiposroles";
        public const string EmpresaClientes = "/v1/empresas-clientes";
        public const string TipoTasacion = "/v1/tipostasaciones";
        public const string Ubigueos = "/v1/ubigeos";
        public const string Pedidos = "/v1/pedidos";
        public const string PedidosClonar = "/v1/pedidos/clonar";
        public const string PedidosRolesNegocioContenedor = "/v1/rolesnegociocontenedor";
        public const string PedidosRolesNegocioSeccion = "/v1/rolesnegocioseccion";
        public const string PedidosGetRolesNegocioDocumentos = "/v1/rolesnegociodocumento";
        public const string PedidosCalendarios = "/v1/pedidoscalendarios";
        public const string PedidosCalendariosEstados = "/v1/pedidos/estadostipos";
        public const string PedidosEstado = "/v1/pedidos/estado";
        public const string PedidosCampo= "/v1/pedidos/campos";
        public const string PedidosAtributos = "/v1/pedidos/atributo";
        public const string PedidosBitacoras = "/v1/pedidos/bitacoras";
        public const string PedidosClientes = "/v1/pedidos/clientes";
        public const string PedidosClientesProductos = "/v1/pedidos/clientesproductos"; /*para filtro de reporte general*/
        public const string PedidosTiposTasacionesClientesProductos = "/v1/pedidos/tipostasacionesclientesproductos"; /*para sección principal*/
        public const string PedidosClientesSubProductos = "/v1/pedidos/clientessubproductos";
        public const string PedidosClientesTiposTasaciones = "/v1/pedidos/clientestipostasaciones";
        public const string PedidosClientesSubTiposTasaciones = "/v1/pedidos/clientesproductossubtipostasaciones";

        /*S3*/
        public const string PedidoDocumentoArchivo = "/v1/pedidos/documentoarchivo";
        public const string PedidoDocumentoArchivoDownload = "/v1/pedidos/documentoarchivodownload";
        public const string PedidoDocumentoArchivoZipDownload = "/v1/pedidos/documentoarchivozipdownload";
        public const string PedidoDocumentoArchivoTipoDownload = "/v1/pedidos/documentoarchivotipodownload";

        public const string PedidoGastoArchivo = "/v1/pedidos/gastoarchivo";
        public const string PedidoGastoArchivoDownload = "/v1/pedidos/gastoarchivodownload";
        public const string PedidoGastoArchivoZipDownload = "/v1/pedidos/gastoarchivozipdownload";

        /*Fin S3*/

        /*DropBox*/
        public const string PedidoDocumentoArchivoDropBox = "/v1/pedidos/documentoarchivodropbox";
        public const string PedidoDocumentoArchivoDropBoxDownload = "/v1/pedidos/documentoarchivodropboxdownload";
        public const string PedidoDocumentoArchivoZipDropBoxDownload = "/v1/pedidos/documentoarchivozipdropboxdownload";

        public const string PedidoGastoArchivoDropBox = "/v1/pedidos/gastoarchivodropbox";
        public const string PedidoGastoArchivoDropBoxDownload = "/v1/pedidos/gastoarchivodropboxdownload";
        public const string PedidoGastoArchivoZipDropBoxDownload = "/v1/pedidos/gastoarchivozipdropboxdownload";
        /*Fin DropBox*/

        public const string ReportesGenerales = "/v1/reportesgenerales";
        public const string ReportesControl = "/v1/reportescontrol";


        public const string Bienes = "/v1/bienes";
        public const string BienesArchivo = "/v1/bienes/archivo";
        public const string ConsultaBienes= "/v1/consultabienes";

        public const string CatalogoValor = "/v1/catalogos/valores";
        public const string CatalogoEstado = "v1/catalogoEstados";
        public const string TiposBienes = "/v1/tiposbienes";
        public const string SubTiposBienes = "/v1/tiposbienes/subtiposbienes";
        public const string CategoriasSubTiposBienes = "/v1/tiposbienes/categoriassubtiposbienes";
        public const string SubTiposBienesAtributo = "/v1/tiposbienes/atributo";

        public const string Rol = "v1/roles";
        public const string Menu = "v1/menus";
        public const string Login = "v1/login/empresa";
        public const string LoginToken = "v1/login/empresa/token";

        public const string ApiGetBusqueda = "{0}?texto={1}&ordenamiento={2}&pagina={3}";
        public const string ApiGetBusquedaTamanio = "{0}?texto={1}&ordenamiento={2}&pagina={3}&tamanio={4}";
        public const string ApiCambiarContraseniaCorreo = "v1/cambiarcontrasenia/correo";
        public const string ApiCambiarContrasenia = "v1/cambiarcontrasenia";
        public const string ApiDelete = "{0}/{1}";
        public const string ApiEstado = "apiEstado";
        public const string ApiMensaje = "apiMensaje";

        public const string Id = "id";
        public const string Codigo = "codigo";
        public const string urlArchivo = "urlArchivo";
        public const string urlArchivoMiniatura= "urlArchivoMiniatura";
        public const string Total = "total";
        public const string Data = "data";
        public const string Ok = "ok";
        public const string StatusCode = "StatusCode";
        public const string Error = "error";
        public const string Token = "token";
    }
}
