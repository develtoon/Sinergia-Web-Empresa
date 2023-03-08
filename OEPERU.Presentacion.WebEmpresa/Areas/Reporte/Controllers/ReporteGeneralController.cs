using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    [Area("Reporte")]
    public class ReporteGeneralController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public ReporteGeneralController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }


        public async Task<JsonResult>
            GetList(
                string texto = "",
                string ordenamiento = "",
                int pagina = 1,
                int tamanio = 0,
                string fechaInicio = "",
                string fechaFin = "",
                string idCliente = "",
                string idClienteProducto = "",
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                string idDepartamento = "",
                string idProvincia = "",
                string idDistrito = "",
                string direccion = "",
                string idEstado = ""
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
                    idClienteProducto,
                    idCoordinador,
                    idInspector,
                    idRevisor,
                    idVisador,
                    idDepartamento,
                    idProvincia,
                    idDistrito,
                    direccion,
                    idEstado
                );
            // return Json(query);
            return new JsonResult(query);
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
                string idClienteProducto = "",
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                string idDepartamento = "",
                string idProvincia = "",
                string idDistrito = "",
                string direccion = "",
                string idEstado = ""
                )
        {
            string url = "";
            url = string.
                Format("{0}?" +
                "texto={1}&" +
                "ordenamiento={2}&" +
                "pagina={3}&" +
                "tamanio={4}&" +
                "fechaInicio={5}&" +
                "fechaFin={6}&" +
                "idCliente={7}&" +
                "idClienteProducto={8}&" +
                "idCoordinador={9}&" +
                "idInspector={10}&" +
                "idRevisor={11}&" +
                "idVisador={12}&" +
                "idDepartamento={13}&" +
                "idProvincia={14}&" +
                "idDistrito={15}&" +
                "direccion={16}&"+
                "idEstado={17}",
            OEPERUApiName.ReportesGenerales,
                texto,
                ordenamiento,
                pagina,
                tamanio,
                fechaInicio,
                fechaFin,
                idCliente,
                idClienteProducto,
                idCoordinador,
                idInspector,
                idRevisor,
                idVisador,
                idDepartamento,
                idProvincia,
                idDistrito,
                direccion,
                idEstado
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
                string idClienteProducto = "",
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                string idDepartamento = "",
                string idProvincia = "",
                string idDistrito = "",
                string direccion = "",
                string idEstado = ""
                )
        {
            string url = "";
            url = string.
                Format("{0}/exportar?" +
                "texto={1}&" +
                "ordenamiento={2}&" +
                "pagina={3}&" +
                "tamanio={4}&" +
                "fechaInicio={5}&" +
                "fechaFin={6}&" +
                "idCliente={7}&" +
                "idClienteProducto={8}&" +
                "idCoordinador={9}&" +
                "idInspector={10}&" +
                "idRevisor={11}&" +
                "idVisador={12}&" +
                "idDepartamento={13}&" +
                "idProvincia={14}&" +
                "idDistrito={15}&" +
                "direccion={16}&"+
                "idEstado={17}",
            OEPERUApiName.ReportesGenerales,
                texto,
                ordenamiento,
                pagina,
                tamanio,
                fechaInicio,
                fechaFin,
                idCliente,
                idClienteProducto,
                idCoordinador,
                idInspector,
                idRevisor,
                idVisador,
                idDepartamento,
                idProvincia,
                idDistrito,
                direccion,
                idEstado
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

                var filename = $"ReporteGeneral_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
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


        public async Task<JsonResult> GetProductosList(string idcliente = "")
        {
            Dictionary<string, object> query = await GetProductosSearch(idcliente);
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>> GetProductosSearch(string idcliente = "")
        {
            string url = "";
            url = string.Format("{0}?idcliente={1}", OEPERUApiName.PedidosClientesProductos, idcliente);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }



        // Obtener lista de Clientes
        public async Task<JsonResult> GetClientList()
        {
            Dictionary<string, object> query = await GetClientSearch();
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>> GetClientSearch()
        {
            string url = "";
            url = string.Format("{0}", OEPERUApiName.PedidosClientes);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }




        // Obtener Colaboradores
        public async Task<JsonResult> GetColaboradorList(string texto, string idtiporol = "", int pagina = 0, string ordenamiento = "")
        {
            Dictionary<string, object> query = await GetColaboradorSearch(texto, idtiporol, pagina, ordenamiento);
            // return Json(query);
            return new JsonResult(query);
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


        // Obtener valores de Ubigeo
        public async Task<JsonResult> GetUbigueoList(int tipo = 1, string codigo = "", string ordenamiento = "", int pagina = 0)
        {
            Dictionary<string, object> query = await GetUbigueoSearch(tipo, codigo, ordenamiento, pagina);
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>> GetUbigueoSearch(int tipo = 1, string codigo = "", string ordenamiento = "", int pagina = 0)
        {
            string url = "";
            url = string.Format("{0}?tipo={1}&codigo={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.Ubigueos, tipo, codigo, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }



        [AuthorizationFilter]

        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }
    }
}
