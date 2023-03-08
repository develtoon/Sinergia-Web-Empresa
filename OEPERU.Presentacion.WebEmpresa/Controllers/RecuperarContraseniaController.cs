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
    public class RecuperarContraseniaController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        public RecuperarContraseniaController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
        }

        public async Task<JsonResult> Save([FromBody] RecuperarContraseniaInput input)
        {
            CheckStatusOutput checkStatus = new CheckStatusOutput();
            if (ModelState.IsValid)
            {
                string url = "";
                url = OEPERUApiName.ApiCambiarContraseniaCorreo;
                Dictionary<string, object> response = null;

             
                    response = await _oeperuClient.PostAsync(url,
                        new
                        {
                            input.usuario,
                            tipo = 2
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




        public IActionResult Index()
        {
            return View();
        }
        
    }
}
