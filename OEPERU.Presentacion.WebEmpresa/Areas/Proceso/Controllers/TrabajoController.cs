using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models;
using OEPERU.Presentacion.WebEmpresa.Areas.Proceso.Models;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    [Area("Proceso")]
    public class TrabajoController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";
        string idTipotasacionComercial = "";

        public TrabajoController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
            idTipotasacionComercial = _oeperuClient.getIdTipoTasacionComercial();
        }

        [AuthorizationApiFilter]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult>
            GetList(
                string texto = "",
                string ordenamiento = "",
                int pagina = 1,
                int tamanio = 0,
                string fechaInicio = "",
                string fechaFin = "",
                string idCliente = "",
                string solicitante = "",
                string funcionario = "",
                int estado = 1,
                bool esDocumentoPendiente = true,
                bool esDesestimado = false,
                bool esInspeccionConforme = false,
                bool esStandBy = false,
                bool esReproceso = false,
                string numeroSolicitud = "",
                string direccion = "",
                int tipoBusqueda = 1, string neLat = "", string neLng = "", string swLat = "", string swLng = "",
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                string idSeguimiento = ""
            )
        {
            Dictionary<string, object> query = await
                GetListSearch(
                    texto,
                    ordenamiento,
                    pagina,
                    tamanio,
                    fechaInicio,
                    fechaFin,
                    idCliente,
                    solicitante,
                    funcionario,
                    estado,
                    esDocumentoPendiente,
                    esDesestimado,
                    esInspeccionConforme,
                    esStandBy,
                    esReproceso,
                    numeroSolicitud,
                    direccion,
                    tipoBusqueda, neLat, neLng, swLat, swLng,
                    idCoordinador,
                    idInspector,
                    idRevisor,
                    idVisador,
                    idSeguimiento
                );

            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>>
            GetListSearch(
                string texto = "",
                string ordenamiento = "",
                int pagina = 1,
                int tamanio = 0,
                string fechaInicio = "",
                string fechaFin = "",
                string idCliente = "",
                string solicitante = "",
                string funcionario = "",
                int estado = 1,
                bool esDocumentoPendiente = true,
                bool esDesestimado = false,
                bool esInspeccionConforme = false,
                bool esStandBy = false,
                bool esReproceso = false,
                string numeroSolicitud = "",
                string direccion = "",
                int tipoBusqueda = 1, string neLat = "", string neLng = "", string swLat = "", string swLng = "",
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                string idSeguimiento = ""
                )
        {
            string url = "";
            url = string.Format("{0}?texto={1}&ordenamiento={2}&pagina={3}&tamanio={4}&fechaInicio={5}&fechaFin={6}&idCliente={7}&solicitante={8}&funcionario={9}&estado={10}&esDocumentoPendiente={11}&esDesestimado={12}&esInspeccionConforme={13}&esStandBy={14}&esReproceso={15}&numeroSolicitud={16}&direccion={17}" +
                 "&tipoBusqueda={18}&neLat={19}&neLng={20}&swLat={21}&swLng={22}" +
                "&idCoordinador={23}&idInspector={24}&idRevisor={25}&idVisador={26}&idSeguimiento={27}",
            OEPERUApiName.Pedidos,
            texto,
            ordenamiento,
            pagina,
            tamanio,
            fechaInicio,
            fechaFin,
            idCliente,
            solicitante,
            funcionario,
            estado,
            esDocumentoPendiente,
            esDesestimado,
            esInspeccionConforme,
            esStandBy,
            esReproceso,
            numeroSolicitud,
            direccion, tipoBusqueda, neLat, neLng, swLat, swLng,
            idCoordinador,
            idInspector,
            idRevisor,
            idVisador,
            idSeguimiento
            );

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> ExportXLS(
                string texto = "",
                string ordenamiento = "",
                int pagina = 1,
                int tamanio = 0,
                string fechaInicio = "",
                string fechaFin = "",
                string idCliente = "",
                string solicitante = "",
                string funcionario = "",
                int estado = 1,
                bool esDocumentoPendiente = true,
                bool esDesestimado = false,
                bool esInspeccionConforme = false,
                bool esStandBy = false,
                bool esReproceso = false,
                string numeroSolicitud = "",
                string direccion = "",
                int tipoBusqueda = 1, string neLat = "", string neLng = "", string swLat = "", string swLng = "",
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                string idSeguimiento = ""
                )
        {
            string url = "";
            url = string.Format("{0}/exportar?texto={1}&ordenamiento={2}&pagina={3}&tamanio={4}&fechaInicio={5}&fechaFin={6}&idCliente={7}&solicitante={8}&funcionario={9}&estado={10}&esDocumentoPendiente={11}&esDesestimado={12}&esInspeccionConforme={13}&esStandBy={14}&esReproceso={15}&numeroSolicitud={16}&direccion={17}" +
                "&tipoBusqueda={18}&neLat={19}&neLng={20}&swLat={21}&swLng={22}" +
                "&idCoordinador={23}&idInspector={24}&idRevisor={25}&idVisador={26}&idSeguimiento={27}",
            OEPERUApiName.Pedidos,
            texto,
            ordenamiento,
            pagina,
            tamanio,
            fechaInicio,
            fechaFin,
            idCliente,
            solicitante,
            funcionario,
            estado,
            esDocumentoPendiente,
            esDesestimado,
            esInspeccionConforme,
            esStandBy,
            esReproceso,
            numeroSolicitud,
            direccion,
            tipoBusqueda, neLat, neLng, swLat, swLng,
            idCoordinador,
            idInspector,
            idRevisor,
            idVisador,
            idSeguimiento
            );

            var response = await _oeperuClient.GetFileAsync(url, HttpContext, urlApiAdministracion);

            using (Stream responseStream = response.stream)
            using (MemoryStream memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[1024];
                int bytesRead;
                do
                {
                    bytesRead = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, bytesRead);
                } while (bytesRead > 0);

                var filename = $"Trabajo_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                string fileName = filename;
                string fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.StatusCode = response.statusCode;
                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(memoryStream.ToArray(), fileType, fileName);
            }
        }

        //Clonar

        public async Task<JsonResult> Clonar([FromBody] PedidoClonarInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.PedidosClonar;
                Dictionary<string, object> response = null;

                response = await _oeperuClient.PostAsync(url,
                new
                {
                    id = input.id

                }, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }
                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        // Obtener lista de documentos que se pueden subir
        public async Task<JsonResult> GetRolesNegocioDocumentoList()
        {
            Dictionary<string, object> query = await GetRolesNegocioDocumentoSearch();
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetRolesNegocioDocumentoSearch()
        {
            string url = "";
            url = string.Format("{0}", OEPERUApiName.PedidosGetRolesNegocioDocumentos);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener valores de Ubigeo
        public async Task<JsonResult> GetUbigueoList(int tipo = 1, string codigo = "", string ordenamiento = "", int pagina = 0)
        {
            Dictionary<string, object> query = await GetUbigueoSearch(tipo, codigo, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetUbigueoSearch(int tipo = 1, string codigo = "", string ordenamiento = "", int pagina = 0)
        {
            string url = "";
            url = string.Format("{0}?tipo={1}&codigo={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.Ubigueos, tipo, codigo, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener Documento u otros listados por código
        public async Task<JsonResult> GetDataList(string codigo = "")
        {
            Dictionary<string, object> query = await GetDataListSearch(codigo);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetDataListSearch(string codigo = "")
        {
            string url = "";
            url = string.Format("{0}?codigo={1}", OEPERUApiName.CatalogoValor, codigo);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
        // Obtener Pedidos Campos
        public async Task<JsonResult> GetCampoList(string idTipos = "")
        {
            Dictionary<string, object> query = await GetCampoListSearch(idTipos);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetCampoListSearch(string idTipos = "")
        {
            string url = "";
            url = string.Format("{0}?idTipos={1}", OEPERUApiName.PedidosCampo, idTipos);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
        // Obtener lista de Clientes
        public async Task<JsonResult> GetClientList()
        {
            Dictionary<string, object> query = await GetClientSearch();
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetClientSearch()
        {
            string url = "";
            url = string.Format("{0}?ordenamiento=nombre asc&pagina=0", OEPERUApiName.PedidosClientes);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener lista de productos
        public async Task<JsonResult> GetCatalogoEstadoList(string id = "")
        {
            Dictionary<string, object> query = await GetCatalogoEstadoSearch(id);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetCatalogoEstadoSearch(string id = "")
        {
            string url = "";
            url = string.Format("{0}?id={1}", OEPERUApiName.CatalogoEstado, id);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener lista de productos
        public async Task<JsonResult> GetProductosList(string idcliente = "", string idtipotasacion = "")
        {
            Dictionary<string, object> query = await GetProductosSearch(idcliente, idtipotasacion);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetProductosSearch(string idcliente = "", string idtipotasacion = "")
        {
            string url = "";
            url = string.Format("{0}?idcliente={1}&idtipotasacion={2}&pagina=0", OEPERUApiName.PedidosTiposTasacionesClientesProductos, idcliente, idtipotasacion);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener lista de sub productos
        public async Task<JsonResult> GetSubProductosList(string idclienteproducto = "")
        {
            Dictionary<string, object> query = await GetSubProductosSearch(idclienteproducto);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSubProductosSearch(string idclienteproducto = "")
        {
            string url = "";
            url = string.Format("{0}?idclienteproducto={1}&pagina=0", OEPERUApiName.PedidosClientesSubProductos, idclienteproducto);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener tipos de tasacion
        public async Task<JsonResult> GetTasacionList(string idCliente = "")
        {
            Dictionary<string, object> query = await GetTasacionSearch(idCliente);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetTasacionSearch(string idCliente = "")
        {
            string url = "";
            url = string.Format("{0}?idCliente={1}&pagina=0", OEPERUApiName.PedidosClientesTiposTasaciones, idCliente);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
        // Obtener tipos de subtasacion
        public async Task<JsonResult> GetSubTasacionList(string idclienteproducto = "", string idtipotasacion = "")
        {
            Dictionary<string, object> query = await GetSubTasacionSearch(idclienteproducto, idtipotasacion);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSubTasacionSearch(string idclienteproducto = "", string idtipotasacion = "")
        {
            string url = "";
            url = string.Format("{0}?idclienteproducto={1}&idtipotasacion={2}&pagina=0", OEPERUApiName.PedidosClientesSubTiposTasaciones, idclienteproducto, idtipotasacion);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        // Obtener valores de tipo de bien
        public async Task<JsonResult> GetTipoBienList(string texto, string ordenamiento = "", int pagina = 1)
        {
            Dictionary<string, object> query = await GetTipoBienSearch(texto, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetTipoBienSearch(string texto = "", string ordenamiento = "", int pagina = 1)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&ordenamiento={2}&pagina={3}", OEPERUApiName.TiposBienes, texto, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
        // Obtener valores de subtipo de bien
        public async Task<JsonResult> GetSubTipoBienList(string texto, string id = "", string ordenamiento = "", int pagina = 1)
        {
            Dictionary<string, object> query = await GetSubTipoBienSearch(texto, id, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSubTipoBienSearch(string texto = "", string id = "", string ordenamiento = "", int pagina = 1)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&id={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.SubTiposBienes, texto, id, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        // Obtener Colaboradores
        public async Task<JsonResult> GetColaboradorList(string texto, string idtiporol = "", int pagina = 0, string ordenamiento = "")
        {
            Dictionary<string, object> query = await GetColaboradorSearch(texto, idtiporol, pagina, ordenamiento);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetColaboradorSearch(
             string texto, string idtiporol = "", int pagina = 0, string ordenamiento = "")
        {
            string url = "";
            url = string.Format("{0}?texto={1}&idtiporol={2}&pagina={3}&ordenamiento={4}", OEPERUApiName.ColaboradoresTiposRoles,
                texto, idtiporol, pagina, ordenamiento);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        public async Task<JsonResult> SavePrincipal([FromBody] PedidosPrincipal input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.Pedidos;
                Dictionary<string, object> response = null;


                if (string.IsNullOrEmpty(input.id))
                {
                    response = await _oeperuClient.PostAsync(url,
                    new
                    {
                        id = string.Empty,
                        input.estado,
                        input.idContenedor,
                        input.idUbigeo,
                        input.direccion,
                        input.referencia,
                        input.latitud,
                        input.longitud,
                        input.solicitante,
                        input.idTipoDocumento,
                        input.documento,
                        input.idCliente,
                        input.numeroSolicitud,
                        input.numeroGarantia,
                        input.esImpresion,
                        input.oficina,
                        input.oficinaDestino,
                        input.funcionario,
                        input.funcionarioDestino,
                        input.idTipoServicio,
                        input.idTipoTasacion,
                        input.idSubTipoTasacion,
                        input.idClienteProducto,
                        input.idClienteSubProducto,
                        input.idTipoBien,
                        input.idSubTipoBien,
                        input.idTipoVisita,
                        input.placa,
                        input.marca,
                        input.modelo,
                        input.idFormaPago,
                        input.montoCotizado,
                        input.pagoCuenta,
                        input.idFacturar,
                        input.razonSocialFacturacion,
                        input.rucFacturacion,
                        input.correoReceptor,
                        input.esCobroAnticipado,
                        input.idEstadoFacturacion,
                        input.contacto,
                        input.contactoTelefono,
                        input.contactoCorreo,
                        input.fechaInicio,
                        input.horaInicio,
                        input.horaFin,
                        input.esUrgente,
                        input.observacion,
                        input.equipo
                    }, HttpContext, urlApiAdministracion);

                }
                else
                {
                    response = await _oeperuClient.PutAsync(url,
                    new
                    {
                        id = input.id,
                        input.estado,
                        input.idContenedor,
                        input.idUbigeo,
                        input.direccion,
                        input.referencia,
                        input.latitud,
                        input.longitud,
                        input.solicitante,
                        input.idTipoDocumento,
                        input.documento,
                        input.idCliente,
                        input.numeroSolicitud,
                        input.numeroGarantia,
                        input.esImpresion,
                        input.oficina,
                        input.oficinaDestino,
                        input.funcionario,
                        input.funcionarioDestino,
                        input.idTipoServicio,
                        input.idTipoTasacion,
                        input.idSubTipoTasacion,
                        input.idClienteProducto,
                        input.idClienteSubProducto,
                        input.idTipoBien,
                        input.idSubTipoBien,
                        input.idTipoVisita,
                        input.placa,
                        input.marca,
                        input.modelo,
                        input.idFormaPago,
                        input.montoCotizado,
                        input.pagoCuenta,
                        input.idFacturar,
                        input.razonSocialFacturacion,
                        input.rucFacturacion,
                        input.correoReceptor,
                        input.esCobroAnticipado,
                        input.idEstadoFacturacion,
                        input.contacto,
                        input.contactoTelefono,
                        input.contactoCorreo,
                        input.fechaInicio,
                        input.horaInicio,
                        input.horaFin,
                        input.esUrgente,
                        input.observacion,
                        input.equipo
                    }, HttpContext, urlApiAdministracion);

                }

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        public async Task<JsonResult> Save([FromBody] PedidoEstado input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.PedidosAtributos;
                Dictionary<string, object> response = null;

                response = await _oeperuClient.PostAsync(url,
                new
                {
                    id = input.id,
                    input.atributo,
                    input.motivo,
                    input.estado

                }, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }
                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        public async Task<JsonResult> SaveBitacora([FromBody] PedidosBitacora input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.Pedidos;
                Dictionary<string, object> response = null;


                response = await _oeperuClient.PutAsync(url,
                    new
                    {
                        id = input.id,
                        input.idContenedor,
                        input.idPedidoBitacora,
                        input.comentarioPedidoBitacora

                    }, HttpContext, urlApiAdministracion);


                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }
                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        public async Task<JsonResult> SaveDocumentosAdjuntos([FromBody] PedidosDocumentosAdjuntos input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.Pedidos;
                Dictionary<string, object> response = null;


                response = await _oeperuClient.PutAsync(url,
                    new
                    {
                        id = input.id,
                        input.idContenedor,
                        input.archivos

                    }, HttpContext, urlApiAdministracion);


                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }
        public async Task<JsonResult> SaveGastos([FromBody] PedidosGastos input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.Pedidos;
                Dictionary<string, object> response = null;


                response = await _oeperuClient.PutAsync(url,
                    new
                    {
                        id = input.id,
                        input.idContenedor,
                        input.archivos

                    }, HttpContext, urlApiAdministracion);


                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        public async Task<JsonResult> SaveInspeccion([FromBody] PedidosInspeccion input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.Pedidos;
                Dictionary<string, object> response = null;


                response = await _oeperuClient.PutAsync(url,
                    new
                    {
                        id = input.id,
                        input.idContenedor,
                        input.esDireccionValida,
                        input.comentarioPedidoInspeccion,
                        input.estado,
                        input.detalle,

                    }, HttpContext, urlApiAdministracion);


                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }
        public async Task<JsonResult> SaveFlujoTrabajo([FromBody] PedidoFlujoTrabajo input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.PedidosEstado;
                Dictionary<string, object> response = null;


                url = string.Format("{0}", url);

                response = await _oeperuClient.PutAsync(url, new
                {
                    input.id,
                    // id = string.Empty,
                    input.estado,
                    input.check,
                }
                , HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> GetRolesNegocioContenedor()
        {
            string url = string.Format("{0}", OEPERUApiName.PedidosRolesNegocioContenedor);
            Dictionary<string, object> query = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);

            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }
        [HttpGet]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> GetRolesNegocioSeccion()
        {
            string url = string.Format("{0}", OEPERUApiName.PedidosRolesNegocioSeccion);
            Dictionary<string, object> query = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);

            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> GetPrincipalSingle(string id, int tipo)
        {
            string url = string.Format("{0}/{1}?tipo={2}", OEPERUApiName.Pedidos, id, tipo);
            Dictionary<string, object> query = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);

            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        [HttpDelete]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> DeleteBitacora(string id)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = string.Format(OEPERUApiName.ApiDelete,
                    OEPERUApiName.PedidosBitacoras, id);

                Dictionary<string, object> response = await _oeperuClient.DeleteAsync(url, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        [HttpDelete]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> DeleteList(string id)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = string.Format(OEPERUApiName.ApiDelete,
                    OEPERUApiName.Pedidos, id);

                Dictionary<string, object> response = await _oeperuClient.DeleteAsync(url, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        [HttpPost]
        public async Task<JsonResult> SaveArchivoDocumento([FromForm] PedidoFileInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.PedidoDocumentoArchivo;
                Dictionary<string, object> response = null;

                MultipartFormDataContent form = new MultipartFormDataContent
                {

                };

                if (input.archivo != null)
                {
                    Stream responseStream = input.archivo.OpenReadStream();
                    HttpContent content = new StringContent("fileToUpload");
                    content = new StreamContent(responseStream);
                    content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                    {
                        Name = "archivo",
                        FileName = input.archivo.FileName
                    };
                    form.Add(content);

                    StringContent idPedido = new StringContent(input.idPedido);
                    form.Add(idPedido, "idPedido");

                }

                response = await _oeperuClient.PostAsyncSave(url, form, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> DownloadDocumentoArchivo(string idArchivo)
        {
            string url = "";
            url = string.Format("{0}?idArchivo={1}",
            OEPERUApiName.PedidoDocumentoArchivoDownload,
            idArchivo
            );

            var response = await _oeperuClient.GetFileByteAsync(url, HttpContext, urlApiAdministracion);

            string fileName = response.nombre;
            string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;

            var cd = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = true,
            };

            Response.StatusCode = response.statusCode;
            Response.Headers.Add("Content-Disposition", cd.ToString());
            return File(response.archivoByte, fileType, fileName);
            /*
            using (Stream responseStream = response.stream)
            using (MemoryStream memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[1024];
                int bytesRead;
                do
                {
                    bytesRead = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, bytesRead);
                } while (bytesRead > 0);

                var filename = response.nombre;
                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                string fileName = filename;
                string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;
                Response.StatusCode = response.statusCode;
                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(memoryStream.ToArray(), fileType, fileName);
            }*/
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> DownloadDocumentoArchivoZip(string idPedido, string idArchivos)
        {
            string url = "";
            url = string.Format("{0}?idPedido={1}&idArchivos={2}",
            OEPERUApiName.PedidoDocumentoArchivoZipDownload,
            idPedido, idArchivos
            );

            var response = await _oeperuClient.GetFileByteAsync(url, HttpContext, urlApiAdministracion);

            string fileName = response.nombre;
            string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;

            var cd = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = true,
            };

            Response.StatusCode = response.statusCode;
            Response.Headers.Add("Content-Disposition", cd.ToString());
            return File(response.archivoByte, fileType, fileName);
            /*
            var response = await _oeperuClient.GetFileAsync(url, HttpContext, urlApiAdministracion);

            using (Stream responseStream = response.stream)
            using (MemoryStream memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[1024];
                int bytesRead;
                do
                {
                    bytesRead = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, bytesRead);
                } while (bytesRead > 0);

                var filename = response.nombre;
                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                string fileName = filename;
                string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;
                Response.StatusCode = response.statusCode;
                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(memoryStream.ToArray(), fileType, fileName);
            }
            */
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> DownloadDocumentoTipoArchivo(string idPedido, int idTipo)
        {
            string url = "";
            url = string.Format("{0}?idPedido={1}&idTipo={2}",
            OEPERUApiName.PedidoDocumentoArchivoTipoDownload,
            idPedido,idTipo
            );

            var response = await _oeperuClient.GetFileAsync(url, HttpContext, urlApiAdministracion);

            using (Stream responseStream = response.stream)
            using (MemoryStream memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[1024];
                int bytesRead;
                do
                {
                    bytesRead = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, bytesRead);
                } while (bytesRead > 0);

                var filename = response.nombre;
                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                string fileName = filename;
                string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;
                Response.StatusCode = response.statusCode;
                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(memoryStream.ToArray(), fileType, fileName);
            }
        }

        [HttpPost]
        public async Task<JsonResult> SaveArchivoGastos([FromForm] PedidoFileInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.PedidoGastoArchivo;
                Dictionary<string, object> response = null;

                MultipartFormDataContent form = new MultipartFormDataContent
                {

                };

                if (input.archivo != null)
                {
                    Stream responseStream = input.archivo.OpenReadStream();
                    HttpContent content = new StringContent("fileToUpload");
                    content = new StreamContent(responseStream);
                    content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                    {
                        Name = "archivo",
                        FileName = input.archivo.FileName
                    };
                    form.Add(content);

                    StringContent idPedido = new StringContent(input.idPedido);
                    form.Add(idPedido, "idPedido");
                }

                response = await _oeperuClient.PostAsyncSave(url, form, HttpContext, urlApiAdministracion);


                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusOutput(response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString());
                    }

                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }


        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> DownloadGastoArchivo(string idArchivo)
        {
            string url = "";
            url = string.Format("{0}?idArchivo={1}",
            OEPERUApiName.PedidoGastoArchivoDownload,
            idArchivo
            );

            var response = await _oeperuClient.GetFileAsync(url, HttpContext, urlApiAdministracion);

            using (Stream responseStream = response.stream)
            using (MemoryStream memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[1024];
                int bytesRead;
                do
                {
                    bytesRead = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, bytesRead);
                } while (bytesRead > 0);

                var filename = response.nombre;
                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                string fileName = filename;
                string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;
                Response.StatusCode = response.statusCode;
                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(memoryStream.ToArray(), fileType, fileName);
            }
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> DownloadGastoArchivoZip(string idPedido, string idArchivos)
        {
            string url = "";
            url = string.Format("{0}?idPedido={1}&idArchivos={2}",
            OEPERUApiName.PedidoGastoArchivoZipDownload,
            idPedido, idArchivos
            );

            var response = await _oeperuClient.GetFileAsync(url, HttpContext, urlApiAdministracion);

            using (Stream responseStream = response.stream)
            using (MemoryStream memoryStream = new MemoryStream())
            {
                byte[] buffer = new byte[1024];
                int bytesRead;
                do
                {
                    bytesRead = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, bytesRead);
                } while (bytesRead > 0);

                var filename = response.nombre;
                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                string fileName = filename;
                string fileType = System.Net.Mime.MediaTypeNames.Application.Octet;
                Response.StatusCode = response.statusCode;
                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(memoryStream.ToArray(), fileType, fileName);
            }
        }

        [AuthorizationFilter]
        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }

        [AuthorizationFilter]
        public IActionResult Create()
        {
            ViewBag.IdTipoTasacionComercial = idTipotasacionComercial;
            return View();
        }

        [AuthorizationFilter]
        public IActionResult Edit(string id)
        {
            ViewBag.Id = id;
            ViewBag.IdTipoTasacionComercial = idTipotasacionComercial;
            return View("Create");
        }


        [AuthorizationFilter]
        public IActionResult CalendarioTrabajo()
        {
            return View();
        }
    }
}
