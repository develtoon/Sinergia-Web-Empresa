using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Areas.Proceso.Controllers
{
    [Area("Administracion")]
    public class TipoBienController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public TipoBienController(OEPERUApiClient oeperuClient,
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
        // Obtener valores de tipo de bien
        public async Task<JsonResult> GetTipoBienList(string texto, string ordenamiento = "", int pagina = 1)
        {
            Dictionary<string, object> query = await GetTipoBienSearch(texto, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetTipoBienSearch(string texto = "", string ordenamiento = "", int pagina = 1)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&ordenamiento={2}&pagina={3}", OEPERUApiName.TiposBienes, texto, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetSubTipoBienList(string texto, string id = "", string ordenamiento = "", int pagina = 1)
        {
            Dictionary<string, object> query = await GetSubTipoBienSearch(texto, id, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSubTipoBienSearch(string texto = "", string id = "", string ordenamiento = "", int pagina = 1)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&id={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.SubTiposBienes, texto, id, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetCategoriaSubTipoBienList(string texto, string id = "", string ordenamiento = "", int pagina = 1)
        {
            Dictionary<string, object> query = await GetCategoriaSubTipoBienSearch(texto, id, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetCategoriaSubTipoBienSearch(string texto = "", string id = "", string ordenamiento = "", int pagina = 1)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&id={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.CategoriasSubTiposBienes, texto, id, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }



        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetSubTipoBienAtributoList(string texto, string id = "", string ordenamiento = "", int pagina = 1)
        {
            Dictionary<string, object> query = await GetSubTipoBienAtributoSearch(texto, id, ordenamiento, pagina);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetSubTipoBienAtributoSearch(string texto = "", string id = "", string ordenamiento = "", int pagina = 1)
        {
            string url = "";
            url = string.Format("{0}?texto={1}&id={2}&ordenamiento={3}&pagina={4}", OEPERUApiName.SubTiposBienesAtributo, texto, id, ordenamiento, pagina);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }
    }
}
