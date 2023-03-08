using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    [Area("Administracion")]
    public class CatalogoController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public CatalogoController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }

        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }


        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetListValue(int codigo)
        {
            Dictionary<string, object> query = await GetValueSearch(codigo);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetValueSearch(int codigo = 0)
        {
            string url = "";
            url = string.Format("{0}?codigo={1}", OEPERUApiName.CatalogoValor,
                codigo);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
    }
}
