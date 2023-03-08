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
    public class LoginController : Controller
    {
        private readonly OEPERUApiClient _oeperuApiCliente;
        private readonly IHttpContextAccessor _accessor;

        public LoginController(OEPERUApiClient oeperuApiCliente,
            IHttpContextAccessor accessor)
        {
            _oeperuApiCliente = oeperuApiCliente;
            _accessor = accessor;
        }

        [HttpGet]
        public IActionResult Index()
        {
            if (HttpContext.Session.TryGetValue(SessionName.SessionKeyPersona, out byte[] val))
            {
                return RedirectToAction("", "Home");

            }
            return View();
        }
        [HttpPost]
        [HttpPost]
        // [AllowAnonymous]
        // [ValidateAntiForgeryToken]ç
        public async Task<JsonResult> Index([FromBody] LoginInput input)
        {

            CheckStatusOutput checkStatus = new CheckStatusOutput();
            var status = 404;
            Dictionary<string, object> response = null;
            if (ModelState.IsValid)
            {

                // llamar al api
                response = await _oeperuApiCliente.PostAsync(
                    OEPERUApiName.Login,
                    new
                    {
                        correo = input.correo,
                        contrasenia = input.contrasenia,
                    }
                    , HttpContext
                );
                if (response != null)
                {
                    if (response[OEPERUApiName.ApiEstado].Equals(OEPERUApiName.Ok))
                    {
                        string token = response[OEPERUApiName.Token].ToString();
                        LoginOutput usuarioOutput = new LoginOutput(response);
                        checkStatus = new CheckStatusOutput(response);

                        //crear session
                        HttpContext.Session.Set<LoginOutput>(SessionName.SessionKeyPersona, usuarioOutput);
                        HttpContext.Session.Set(SessionName.SessionKeyAcceso, token);
                        status = 200;
                    }
                    else
                    {
                        status = 401;
                        ViewData[Variables.MensajeError] = response[OEPERUApiName.ApiMensaje];
                        checkStatus = new CheckStatusOutput(
                            response[OEPERUApiName.ApiEstado].ToString(),
                            response[OEPERUApiName.ApiMensaje].ToString()
                        );
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

            return new JsonResult(response) { StatusCode = status };
        }

    }
}
