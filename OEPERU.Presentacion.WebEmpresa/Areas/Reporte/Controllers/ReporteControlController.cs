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
    public class ReporteControlController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public ReporteControlController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
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
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                int idEstado = 0,
                int idSemaforo = 0
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
                    idCoordinador,
                    idInspector,
                    idRevisor,
                    idVisador,
                    idEstado,
                    idSemaforo
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
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                int idEstado = 0,
                int idSemaforo = 0
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
                "idCoordinador={7}&" +
                "idInspector={8}&" +
                "idRevisor={9}&" +
                "idVisador={10}&" +
                "idEstado={11}&"+
                "idSemaforo={12}",
            OEPERUApiName.ReportesControl,
                texto,
                ordenamiento,
                pagina,
                tamanio,
                fechaInicio,
                fechaFin,
                idCoordinador,
                idInspector,
                idRevisor,
                idVisador,
                idEstado,
                idSemaforo
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
                string idCoordinador = "",
                string idInspector = "",
                string idRevisor = "",
                string idVisador = "",
                int idEstado = 0,
                int idSemaforo = 0
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
                "idCoordinador={7}&" +
                "idInspector={8}&" +
                "idRevisor={9}&" +
                "idVisador={10}&" +
                "idEstado={11}&" +
                "idSemaforo={12}",
            OEPERUApiName.ReportesControl,
                texto,
                ordenamiento,
                pagina,
                tamanio,
                fechaInicio,
                fechaFin,
                idCoordinador,
                idInspector,
                idRevisor,
                idVisador,
                idEstado,
                idSemaforo
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

                var filename = $"ReporteControl_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
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




        // Obtener Colaboradores
        public async Task<JsonResult> GetTimeList(int id = 0)
        {
            Dictionary<string, object> query = await GetTimeListSearch(id);
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>> GetTimeListSearch(int id = 0)
        {
            string url = "";
            url = string.Format("{0}?id={1}", OEPERUApiName.CatalogoEstado, id);

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
