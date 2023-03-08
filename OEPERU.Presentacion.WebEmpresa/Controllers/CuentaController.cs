using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    public class CuentaController : Controller
    {
        // GET: /<controller>/
        private readonly OEPERUApiClient _oeperuApiClient;
        private readonly IHttpContextAccessor _accessor;

        public CuentaController(OEPERUApiClient oeperuApiClient,
            IHttpContextAccessor accessor)
        {
            _oeperuApiClient = oeperuApiClient;
            _accessor = accessor;
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> getMenus()
        {
            /*CheckStatusOutput checkStatus = new CheckStatusOutput();*/
            var status = 404;
            Dictionary<string, object> response = null;

            if (ModelState.IsValid)
            {
                var usuarioOutput = HttpContext.Session.Get<LoginOutput>(SessionName.SessionKeyPersona);

                // llamar al api
                response = await _oeperuApiClient.PostAsync(
                    OEPERUApiName.LoginToken,
                    new
                    {
                        token = usuarioOutput.token
                    }
                    , HttpContext
                );

                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        usuarioOutput = new LoginOutput(response);
                        /*checkStatus = new CheckStatusOutput(response);*/

                        //crear session
                        HttpContext.Session.Set<LoginOutput>(SessionName.SessionKeyPersona, usuarioOutput);

                        response = new Dictionary<string, object>()
                        {
                            { "menus", usuarioOutput.menus },
                            { "usuario", usuarioOutput.usuario },
                            { "persona", usuarioOutput.persona },
                            { "rol", usuarioOutput.rol },
                        };

                        status = 200;
                    }
                    else
                    {
                        status = 401;
                        ViewData[Variables.MensajeError] = response[OEPERUApiName.ApiMensaje];
                        /*checkStatus = new CheckStatusOutput(
                            response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString()
                        );*/
                    }
                }
                else
                {
                    status = 404;
                    // ViewData[Variables.MensajeError] = "Error, servidor no encontrado.";
                }
            }
            else
            {
                status = 500;
            }
            // return Json(checkStatus);

            /*Dictionary<string, object> response = new Dictionary<string, object>()
            {
                { "menus", usuarioOutput.menus },
                { "usuario", usuarioOutput.usuario },
                { "persona", usuarioOutput.persona },
                { "rol", usuarioOutput.rol },
            };*/

            return new JsonResult(response) { StatusCode = status };

        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> getMenuInd(string url)
        {
            string urlGet = string.Format("{0}/menus?url={1}&plataforma={2}", OEPERUApiName.Cuenta, url, 2);
            Dictionary<string, object> response = await _oeperuApiClient.GetAsync(urlGet, HttpContext);
            return Json(response);
        }
    }
}
