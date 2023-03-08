using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Models;
using OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.EstudioMercado.Controllers
{
    [Area("EstudioMercado")]
    public class BienController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";
        public BienController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetList(string texto = "", int idEstado = 0,
            string idTipoBien = "", string idSubTipoBien = "", string idCategoriaSubTipoBien = "",
            string fechaInicio = "", string fechaFin = "",
            string idDepartamento = "", string idProvincia = "", string idDistrito = "", string direccion = "",
            int tipoBusqueda = 1, string neLat = "", string neLng = "", string swLat = "", string swLng = "",
            string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            Dictionary<string, object> query = await GetSearch(texto, idEstado, idTipoBien,
                idSubTipoBien, idCategoriaSubTipoBien, fechaInicio, fechaFin,
                idDepartamento, idProvincia, idDistrito, direccion,
                tipoBusqueda, neLat, neLng, swLat, swLng,
                ordenamiento, pagina, tamanio);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSearch(
            string texto = "", int idEstado = 0,
            string idTipoBien = "", string idSubTipoBien = "", string idCategoriaSubTipoBien = "",
            string fechaInicio = "", string fechaFin = "",
            string idDepartamento = "", string idProvincia = "", string idDistrito = "", string direccion = "",
            int tipoBusqueda=1,string neLat = "", string neLng = "", string swLat = "", string swLng = "",
            string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&idestado={2}" +
                "&idTipoBien={3}&idSubTipoBien={4}&idCategoriaSubTipoBien={5}&fechaInicio={6}&fechaFin={7}" +
                "&idDepartamento={8}&idProvincia={9}&idDistrito={10}&direccion={11}" +
                "&tipoBusqueda={12}&neLat={13}&neLng={14}&swLat={15}&swLng={16}" +
                "&pagina={17}&ordenamiento={18}&tamanio={19}", OEPERUApiName.Bienes,
                texto, idEstado, idTipoBien, idSubTipoBien, idCategoriaSubTipoBien, fechaInicio, fechaFin,
                idDepartamento, idProvincia, idDistrito, direccion,
                tipoBusqueda,neLat, neLng, swLat, swLng,
                pagina, ordenamiento, tamanio);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<FileResult> ExportXLS(string texto = "", int idEstado = 0,
            string idTipoBien = "", string idSubTipoBien = "", string idCategoriaSubTipoBien = "",
            string fechaInicio = "", string fechaFin = "",
            string idDepartamento = "", string idProvincia = "", string idDistrito = "", string direccion = "",
            int tipoBusqueda = 1, string neLat = "", string neLng = "", string swLat = "", string swLng = "",
            string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}/exportar?texto={1}&idestado={2}" +
                "&idTipoBien={3}&idSubTipoBien={4}&idCategoriaSubTipoBien={5}&fechaInicio={6}&fechaFin={7}" +
                "&idDepartamento={8}&idProvincia={9}&idDistrito={10}&direccion={11}" +
                "&tipoBusqueda={12}&neLat={13}&neLng={14}&swLat={15}&swLng={16}" +
                "&pagina={17}&ordenamiento={18}&tamanio={19}", OEPERUApiName.Bienes,
                texto, idEstado, idTipoBien, idSubTipoBien, idCategoriaSubTipoBien, fechaInicio, fechaFin,
                idDepartamento, idProvincia, idDistrito, direccion,
                tipoBusqueda, neLat, neLng, swLat, swLng,
                pagina, ordenamiento, tamanio);


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

        [HttpGet]
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetSingle(string id)
        {
            string url = string.Format("{0}/{1}", OEPERUApiName.Bienes, id);
            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            var status = int.Parse(response[OEPERUApiName.StatusCode].ToString());
            response.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(response) { StatusCode = status };
        }


        [HttpPost]
        public async Task<JsonResult> SaveArchivo([FromForm] FileInput input)
        {
            CheckStatusArchivoOutput checkStatus = new CheckStatusArchivoOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.BienesArchivo;
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
                }

                response = await _oeperuClient.PostAsyncSave(url, form, HttpContext, urlApiAdministracion);

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        checkStatus = new CheckStatusArchivoOutput(response);
                    }
                    else
                    {
                        checkStatus = new CheckStatusArchivoOutput(response[OEPERUApiName.ApiEstado].ToString(),
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
        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> Save([FromBody] BienInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 0;

            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.Bienes;
                Dictionary<string, object> response = null;

                if (string.IsNullOrEmpty(input.id))
                {
                    response = await _oeperuClient.PostAsync(url,
                        new
                        {
                            id = string.Empty,
                            input.idUbigeo,
                            input.latitud,
                            input.longitud,
                            input.direccion,
                            input.referencia,
                            input.idTipoFuente,
                            input.referenciaFuente,
                            input.fechaPublicacion,
                            input.contacto,
                            input.contactoTelefono,
                            input.idTipoBien,
                            input.idSubTipoBien,
                            input.idCategoriaSubTipoBien,
                            input.precio,
                            input.idEstado,
                            input.archivos
                        }, HttpContext, urlApiAdministracion);
                }
                else
                {
                    url = string.Format("{0}/{1}", url, input.id);
                    response = await _oeperuClient.PutAsync(url, new
                    {
                        input.id,
                        input.idUbigeo,
                        input.latitud,
                        input.longitud,
                        input.direccion,
                        input.referencia,
                        input.idTipoFuente,
                        input.referenciaFuente,
                        input.fechaPublicacion,
                        input.contacto,
                        input.contactoTelefono,
                        input.idTipoBien,
                        input.idSubTipoBien,
                        input.idCategoriaSubTipoBien,
                        input.precio,
                        input.idEstado,
                        input.archivos
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
                OEPERUApiName.Bienes, id);

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
