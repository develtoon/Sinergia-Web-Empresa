using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Seguridad.Controllers
{
    [Area("Seguridad")]
    public class MenuController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;

        public MenuController(OEPERUApiClient oeperuClient,
            IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
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
            string texto = "", int estado = 0, string ordenamiento = "id", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}?tipo=2&estado={1}&texto={2}&pagina={3}&ordenamiento={4}&tamanio={5}", OEPERUApiName.Menu,
                estado, texto, pagina, ordenamiento, tamanio);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext);
            return response;
        }
    }
}
