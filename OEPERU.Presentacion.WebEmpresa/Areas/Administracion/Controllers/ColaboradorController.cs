using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Areas.Administracion.Models;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    [Area("Administracion")]
    public class ColaboradorController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public ColaboradorController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }





        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetClientList(string texto, int estado = 0, string idRol = "", string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            Dictionary<string, object> query = await GetClientSearch(texto, estado, idRol, ordenamiento, pagina, tamanio);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetClientSearch(
             string texto = "", int estado = 0, string idRol = "", string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}?estado={1}&idRol={2}&texto={3}&pagina={4}&ordenamiento={5}&tamanio={6}", OEPERUApiName.EmpresaClientes,
                estado, idRol, texto, pagina, ordenamiento, tamanio);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetList(string texto, int estado = 0, string idRol = "", string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            Dictionary<string, object> query = await GetSearch(texto, estado, idRol, ordenamiento, pagina, tamanio);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSearch(
             string texto = "", int estado = 0, string idRol = "", string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}?estado={1}&idRol={2}&texto={3}&pagina={4}&ordenamiento={5}&tamanio={6}", OEPERUApiName.EmpresaColaborador,
                estado, idRol, texto, pagina, ordenamiento, tamanio);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetSingle(string id)
        {
            string url = string.Format("{0}/{1}", OEPERUApiName.EmpresaColaborador, id);
            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            var status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
            response.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(response) { StatusCode = status };
        }


        // GET Rol
        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> Save([FromBody] ColaboradorInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.EmpresaColaborador;
                Dictionary<string, object> response = null;

                if (string.IsNullOrEmpty(input.id))
                {
                    response = await _oeperuClient.PostAsync(url,
                        new
                        {
                            id = string.Empty,
                            input.idEmpresa,
                            input.nombre,
                            input.apellido,
                            input.idRegion,
                            input.documento,
                            input.telefono,
                            input.correo,
                            input.contrasenia,
                            input.idRol,
                            input.estado,
                            input.clientes,
                        }, HttpContext, urlApiAdministracion);
                }
                else
                {
                    url = string.Format("{0}/{1}", url, input.id);
                    response = await _oeperuClient.PutAsync(url, new
                    {
                        input.id,
                        input.idEmpresa,
                        input.nombre,
                        input.apellido,
                        input.idRegion,
                        input.documento,
                        input.telefono,
                        input.correo,
                        input.cambiarContrasenia,
                        input.contrasenia,
                        input.idRol,
                        input.estado,
                        input.clientes,
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
                OEPERUApiName.EmpresaColaborador, id);

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

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> ExportXLS(string texto = "", int estado = 0, string idRol = "",
            string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}/exportar?estado={1}&idRol={2}&texto={3}&pagina={4}&ordenamiento={5}&tamanio={6}", OEPERUApiName.EmpresaColaborador,
             estado, idRol, texto, pagina, ordenamiento, tamanio);

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

                var filename = $"Empresa_Colaborador_{new DateTime().ToString("yyyyMMdd_HHmmss")}.xlsx";
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

        [AuthorizationFilter]
        public IActionResult Create()
        {
            return View();
        }

        [AuthorizationFilter]
        public IActionResult Edit(string id)
        {
            ViewBag.Id = id;
            return View("Create");
        }
    }
}
