using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Filters
{
    public class AuthorizationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session == null ||
                      !filterContext.HttpContext.Session.TryGetValue(SessionName.SessionKeyPersona, out byte[] val))
            {
                filterContext.Result =
                     new RedirectToRouteResult(new RouteValueDictionary(new
                     {
                         area = "",
                         controller = "Login",
                         action = "Index"
                     }));
            }
            else
            {

                var usuario = filterContext.HttpContext.Session.Get<LoginOutput>(SessionName.SessionKeyPersona);

                //validar permisos de pagina
                string url = filterContext.HttpContext.Request.Path;
                string[] urls = { "/", "/home", "/home/logout", "error/404", "error/500", "/miperfil" };
                if (!urls.Contains(url.ToLower()))
                {

                    int fin = url.Length;
                    if (url.ToLower().Contains("/create"))
                    {
                        fin = url.ToLower().IndexOf("/create");
                    }

                    if (url.ToLower().Contains("/edit"))
                    {
                        fin = url.ToLower().IndexOf("/edit");
                    }

                    if (url.ToLower().Contains("/view"))
                    {
                        fin = url.ToLower().IndexOf("/view");
                    }


                    url = url.Substring(0, fin);

                    if (!usuario.menus.SelectMany(p => p.subMenus).Where(p => url.ToLower().Contains(p.enlace.ToLower())).Any())
                    {
                        filterContext.Result =
                              new RedirectToRouteResult(new RouteValueDictionary(new
                              {
                                  area = "",
                                  controller = "Error",
                                  action = "NoAutorizado"
                              }));
                    }
                }
            }

            base.OnActionExecuting(filterContext);
        }
    }
}