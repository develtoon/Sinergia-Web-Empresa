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
    public class HomeController : Controller
    {
        private readonly OEPERUApiClient _oeperuClient;
        private readonly IHttpContextAccessor _accessor;

        public HomeController(OEPERUApiClient oeperuClient, IHttpContextAccessor accessor)
        {
            _oeperuClient = oeperuClient;
            _accessor = accessor;
        }

        [AuthorizationFilter]
        public IActionResult Index()
        {
            ViewBag.Title = "Index";
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }
        //[AuthorizationFilter]
        public IActionResult Demo()
        {
            return View();
        }
        
        //[AuthorizationFilter]
        public IActionResult Color()
        {
            return View();
        }


        public async Task<ActionResult> LogOutAsync()
        {
            HttpContext.Session.Remove(SessionName.SessionKeyPersona);
            HttpContext.Session.Remove(SessionName.SessionKeyAcceso);
            HttpContext.Session.Remove(SessionName.SessionKeyReCaptcha);
            return RedirectToAction("", "Login");
        }

    }
}
