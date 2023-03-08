using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Areas.Seguridad.Models;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    [Area("Seguridad")]
    public class RolController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";
        string menuTrabajo = "";
        public RolController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
            menuTrabajo = _oeperuClient.getMenuTrabajo();
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetList(string texto, string ordenamiento = "", int pagina = 1, int estado = 0, int tamanio = 0)
        {
            Dictionary<string, object> query = await GetSearch(texto, estado, ordenamiento, pagina, tamanio);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSearch(
            string texto = "", int estado = 0, string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}?estado={1}&texto={2}&pagina={3}&ordenamiento={4}&tamanio={5}", OEPERUApiName.EmpresaRol,
                estado, texto, pagina, ordenamiento, tamanio);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> ExportXLS(string texto = "", int estado = 0, string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}/exportar?estado={1}&texto={2}&pagina={3}&ordenamiento={4}&tamanio={5}", OEPERUApiName.EmpresaRol,
                estado, texto, pagina, ordenamiento, tamanio);


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

                var filename = $"Empresa_Rol_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
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
        public async Task<JsonResult> GetSingle(string id)
        {
            string url = string.Format("{0}/{1}", OEPERUApiName.EmpresaRol, id);
            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            var status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
            response.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(response) { StatusCode = status };
        }



        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> Save([FromBody] RolInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.EmpresaRol;
                Dictionary<string, object> response = null;

                if (string.IsNullOrEmpty(input.id))
                {
                    response = await _oeperuClient.PostAsync(url,
                        new
                        {
                            id = string.Empty,
                            input.nombre,
                            input.estado,
                            input.idTipoRol,
                            input.menus,
                            input.secciones
                        }, HttpContext, urlApiAdministracion);
                }
                else
                {
                    url = string.Format("{0}/{1}", url, input.id);
                    response = await _oeperuClient.PutAsync(url, new
                    {
                        input.id,
                        input.nombre,
                        input.estado,
                        input.idTipoRol,
                        input.menus,
                        input.secciones
                    }
                    , HttpContext, urlApiAdministracion);
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

        [HttpDelete]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> Delete(string id)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            string url = "";
            url = string.Format(OEPERUApiName.ApiDelete,
                OEPERUApiName.EmpresaRol, id);

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
            else
            {
                status = (int)HttpStatusCode.InternalServerError;
            }

            return new JsonResult(checkStatus) { StatusCode = status };
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
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

        [AuthorizationFilter]
        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }


        [AuthorizationFilter]
        public IActionResult Create()
        {
            ViewBag.MenuTrabajo = menuTrabajo;
            return View();
        }


        [AuthorizationFilter]
        public IActionResult Edit(string id)
        {
            ViewBag.Id = id;
            ViewBag.MenuTrabajo = menuTrabajo;
            return View("Create");
        }
    }
}
