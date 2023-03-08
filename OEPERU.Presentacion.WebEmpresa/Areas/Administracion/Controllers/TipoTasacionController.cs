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
    public class TipoTasacionController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public TipoTasacionController(OEPERUApiClient oeperuClient,
            IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }

        [ValidateAntiForgeryToken]
        [AuthorizationApiFilter]
        public async Task<JsonResult> GetTasacionList(string texto, int estado = 0, string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            Dictionary<string, object> query = await GetTasacion(texto, estado, ordenamiento, pagina, tamanio);
            var status = int.Parse(query[OEPERUApiName.StatusCode].ToString());
            query.Remove(OEPERUApiName.StatusCode);

            return new JsonResult(query) { StatusCode = status };
        }

        private async Task<Dictionary<string, object>> GetTasacion(
             string texto = "", int estado = 0, string ordenamiento = "", int pagina = 1, int tamanio = 0)
        {
            string url = "";
            url = string.Format("{0}?estado={1}&texto={2}&pagina={3}&ordenamiento={4}&tamanio={5}", OEPERUApiName.TipoTasacion,
                estado, texto, pagina, ordenamiento, tamanio);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }

    }
}
