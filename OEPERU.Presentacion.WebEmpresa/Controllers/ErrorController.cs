using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult NoAutorizado()
        {
            ViewBag.Title = "No Autorizado";
            return View();
        }
    }
}
