using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Models;
using OEPERU.Presentacion.WebEmpresa.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Controllers
{
    [Area("EstudioMercado")]
    public class ConsultaBienController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";
        public ConsultaBienController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        [HttpPost]
        public async Task<JsonResult> GetList([FromBody] ConsultaBienQueryInput input)
        {
            Dictionary<string, object> response = null;
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.ConsultaBienes;

                response = await _oeperuClient.PostListAsync(url,
                    new
                    {
                        input.idsBien,
                        input.idTipoBien,
                        input.idSubTipoBien,
                        input.idCategoriaSubTipoBien,
                        input.fechaFin,
                        input.idDepartamento,
                        input.idProvincia,
                        input.idDistrito,
                        input.direccion,
                        input.tipoBusqueda,
                        input.neLat,
                        input.neLng,
                        input.swLat,
                        input.swLng,
                        input.idEstado,
                        input.atributos
                    }, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
                    response.Remove(OEPERUApiName.StatusCode);
                }
            }
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(response) { StatusCode = status };
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> ExportXLS([FromBody] ConsultaBienQueryInput input)
        {
            string url = "";
            url = $"{OEPERUApiName.ConsultaBienes}/exportar";

            var response = await _oeperuClient.PostFileAsync(url,
                new
                {
                    input.idsBien,
                    input.idTipoBien,
                    input.idSubTipoBien,
                    input.idCategoriaSubTipoBien,
                    input.fechaFin,
                    input.idDepartamento,
                    input.idProvincia,
                    input.idDistrito,
                    input.direccion,
                    input.tipoBusqueda,
                    input.centerLat,
                    input.centerLng,
                    input.zoom,
                    input.neLat,
                    input.neLng,
                    input.swLat,
                    input.swLng,
                    input.idEstado,
                    input.atributos
                }, HttpContext, urlApiAdministracion);

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

                var filename = $"Bien_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
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

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> SingleExportXLS(string id = "")
        {
            string url = "";
            url = string.Format("{0}/exportar/{1}", OEPERUApiName.ConsultaBienes,
                id);

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

                var filename = $"Gestión_Bien_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
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
        [AuthorizationFilter]
        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }
    }
}
