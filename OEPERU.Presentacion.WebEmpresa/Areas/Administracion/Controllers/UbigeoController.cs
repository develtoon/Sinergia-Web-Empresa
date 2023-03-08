using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Administracion.Controllers
{
    [Area("Administracion")]
    public class UbigeoController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public UbigeoController(OEPERUApiClient oeperuClient,
            IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetList(int tipo = 1, string codigo = "", string ordenamiento = "", int pagina = 0)
        {
            Dictionary<string, object> query = await GetSearch(tipo, codigo, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSearch(int tipo = 1, string codigo = "", string ordenamiento = "", int pagina = 0)
        {
            string url = "";
            url = string.Format("{0}?tipo={1}&codigo={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.Ubigueos, tipo, codigo, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
    }
}
