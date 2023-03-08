using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Areas.Pedidos.Models;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Filters;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    [Area("Proceso")]
    public class CalendarioTrabajoController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;
        string urlApiAdministracion = "";

        public CalendarioTrabajoController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
            urlApiAdministracion = _oeperuClient.getApiAdministracion();
        }


        // Obtener lista
        public async Task<JsonResult> 
            Getlist(
                string texto = "",
                string ordenamiento = "",
                int pagina = 0,
                string fechaInicio = "",
                string fechaFin = "",
                string idUsuarios = "",
                string idEstados = ""
            )
        {
            Dictionary<string, object> query = await GetlistSearch(texto, ordenamiento, pagina, fechaInicio, fechaFin, idUsuarios, idEstados);
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>>
            GetlistSearch(
                string texto = "",
                string ordenamiento = "",
                int pagina = 0,
                string fechaInicio = "",
                string fechaFin = "",
                string idUsuarios = "",
                string idEstados = ""
            )
        {
            string url = "";
            url = string.Format("{0}?texto={1}&ordenamiento={2}&pagina={3}&fechaInicio={4}&fechaFin={5}&idUsuarios={6}&idEstados={7}", OEPERUApiName.PedidosCalendarios, 
                texto,
                ordenamiento,
                pagina,
                fechaInicio,
                fechaFin,
                idUsuarios,
                idEstados
            );

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        // Obtener Colaboradores
        public async Task<JsonResult> GetColaboradorList(string texto, int idtiporol = 0, int pagina = 0, string ordenamiento = "")
        {
            Dictionary<string, object> query = await GetColaboradorSearch(texto, idtiporol, pagina, ordenamiento);
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>> GetColaboradorSearch(
             string texto, int idtiporol = 0, int pagina = 0, string ordenamiento = "")
        {
            string url = "";
            url = string.Format("{0}?texto={1}&idtiporol={2}&pagina={3}&ordenamiento={4}", OEPERUApiName.ColaboradoresTiposRoles,
                texto, idtiporol, pagina, ordenamiento);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }


        // Obtener listado estado
        public async Task<JsonResult> GetEstadosList(int idTipo = 2)
        {
            Dictionary<string, object> query = await GetEstadosListSearch(idTipo);
            // return Json(query);
            return new JsonResult(query);
        }

        private async Task<Dictionary<string, object>> GetEstadosListSearch(int idTipo = 2)
        {
            string url = "";
            url = string.Format("{0}?idTipo={1}", OEPERUApiName.PedidosCalendariosEstados, idTipo);

            Dictionary<string, object> response = await _oeperuClient.GetAsync(url, HttpContext, urlApiAdministracion);
            return response;
        }



        [AuthorizationFilter]
        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }
    }
}
