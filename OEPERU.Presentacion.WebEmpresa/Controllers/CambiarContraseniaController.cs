using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    public class CambiarContraseniaController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        public CambiarContraseniaController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
        }
        
        [HttpGet]
        public async Task<JsonResult> GetSingle(string id)
        {
            string url = string.Format("{0}/{1}", OEPERUApiName.ApiCambiarContrasenia, id);
            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext);
            return Json(response);
        }


        public async Task<JsonResult> Change([FromBody] CambiarContraseniaInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.ApiCambiarContrasenia;
                Dictionary<string, object> response = null;

             
                    response = await _oeperuClient.PostAsync(url,
                        new
                        {
                            input.contenido,
                            input.contrasenia,
                            input.repetircontrasenia,
                            tipo=2
                        }, HttpContext);
            

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
                }
            }

            return Json(checkStatus);
        }

        [Route("/cambiarcontrasenia/{id}")]
        public IActionResult Index(string id)
        {
            ViewBag.Id = id;
            return View();
        }
        
    }
}
