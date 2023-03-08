using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OEPERU.Presentacion.WebEmpresa.Extensions;
using OEPERU.Presentacion.WebEmpresa.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using OEPERU.Presentacion.WebEmpresa.ApiClient;
using OEPERU.Presentacion.WebEmpresa.Models;

namespace OEPERU.Presentacion.WebEmpresa.ApiClient
{
    public class OEPERUApiClient
    {
        private readonly HttpClient _client;
        private IConfigurationRoot Configuration { get; } = ConfigurationHelper.GetConfiguration(Directory.GetCurrentDirectory());

        public OEPERUApiClient()
        {

        }

        public OEPERUApiClient(HttpClient httpClient)
        {
            httpClient.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);

            _client = httpClient;
        }

        public async Task<Dictionary<string, object>> GetAsync(string urlEndPoint, HttpContext httpContent,
           string urlBase = "", bool esBase = true)
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (esBase)
                {
                    if (string.IsNullOrEmpty(urlBase))
                    {
                        _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                    }
                    else
                    {
                        _client.BaseAddress = new Uri(urlBase);
                    }
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {

                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }

                using (HttpResponseMessage response = await _client.GetAsync(urlEndPoint))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                    }
                    else
                    {
                        if ((response.StatusCode == System.Net.HttpStatusCode.NotFound ||
                                response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                        {
                            var stringResult = await response.Content.ReadAsStringAsync();
                            resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                            resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                        }
                        else
                        {
                            //error en el api no contemplado                        
                        }
                    }

                    response.Dispose();
                }
            }
            catch (HttpRequestException)
            {
                //Exception
            }

            if (resultado.Count == 0)
            {
                //resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
                resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            }

            return resultado;
        }

        public async Task<Dictionary<string, object>> PostListAsync<T>(string urlEndPoint, T parametros, HttpContext httpContent,
           string urlBase = "", bool esBase = true)
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (esBase)
                {
                    if (string.IsNullOrEmpty(urlBase))
                    {
                        _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                    }
                    else
                    {
                        _client.BaseAddress = new Uri(urlBase);
                    }
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {

                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }
                var dataAsString = JsonConvert.SerializeObject(parametros);
                var content = new StringContent(dataAsString);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                using (HttpResponseMessage response = await _client.PostAsync(urlEndPoint, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                    }
                    else
                    {
                        if ((response.StatusCode == System.Net.HttpStatusCode.NotFound ||
                                response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                        {
                            var stringResult = await response.Content.ReadAsStringAsync();
                            resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                            resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                        }
                        else
                        {
                            //error en el api no contemplado                        
                        }
                    }

                    response.Dispose();
                }
            }
            catch (HttpRequestException)
            {
                //Exception
            }

            if (resultado.Count == 0)
            {
                //resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
                resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            }

            return resultado;
        }


        public async Task<Dictionary<string, object>> PostAsync<T>(
            string urlEndPoint, T parametros,
            HttpContext httpContent,
            string urlBase = "", bool esBase = true)
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (esBase)
                {
                    if (string.IsNullOrEmpty(urlBase))
                    {
                        _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                    }
                    else
                    {
                        _client.BaseAddress = new Uri(urlBase);
                    }
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {
                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                        = new AuthenticationHeaderValue("Bearer", token);
                }

                var dataAsString = JsonConvert.SerializeObject(parametros);
                var content = new StringContent(dataAsString);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (HttpResponseMessage response = await _client.PostAsync(urlEndPoint, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                    }
                    else
                    {
                        if ((response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity ||
                                response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                        {
                            var stringResult = await response.Content.ReadAsStringAsync();
                            resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                            resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                        }
                        else
                        {
                            //error en el api no contemplado                        
                        }
                    }
                    response.Dispose();
                }
            }
            catch (HttpRequestException)
            {

            }
            catch (Exception)
            {

            }


            // if (resultado.Count == 0)
            // {
            //     resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
            //     resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            // }

            return resultado;
        }

        public async Task<Dictionary<string, object>> PostAsyncSave(string url, MultipartFormDataContent form, HttpContext httpContent,
        string urlBase = "")
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {
                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }

                var response = await _client.PostAsync(url, form);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();
                    resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                    resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                }
                else
                {
                    if ((response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity ||
                            response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                    }
                    else
                    {
                        //error en el api no contemplado                        
                    }
                }
            }
            catch (HttpRequestException)
            {

            }

            if (resultado.Count == 0)
            {
                resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
                resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            }


            return resultado;
        }


        public async Task<Dictionary<string, object>> PutAsyncSave(string url, MultipartFormDataContent form, HttpContext httpContent, string urlBase = "")
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {
                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }

                var response = await _client.PutAsync(url, form);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();
                    resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                    resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                }
                else
                {
                    if ((response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity ||
                            response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                    }
                    else
                    {
                        //error en el api no contemplado                        
                    }
                }
            }
            catch (HttpRequestException)
            {

            }

            if (resultado.Count == 0)
            {
                resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
                resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            }

            return resultado;
        }

        public async Task<Dictionary<string, object>> PutAsync<T>(
           string urlEndPoint, T parametros,
           HttpContext httpContent,
            string urlBase = "", bool esBase = true)
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (esBase)
                {
                    if (string.IsNullOrEmpty(urlBase))
                    {
                        _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                    }
                    else
                    {
                        _client.BaseAddress = new Uri(urlBase);
                    }
                }
                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {
                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                        = new AuthenticationHeaderValue("Bearer", token);
                }

                var dataAsString = JsonConvert.SerializeObject(parametros);
                var content = new StringContent(dataAsString);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (HttpResponseMessage response = await _client.PutAsync(urlEndPoint, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, ((int)response.StatusCode));

                    }
                    else
                    {
                        if ((response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity ||
                                response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                        {
                            var stringResult = await response.Content.ReadAsStringAsync();
                            resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                            resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                        }
                        else
                        {
                            //error en el api no contemplado                        
                        }
                    }

                    response.Dispose();
                }
            }
            catch (HttpRequestException)
            {

            }

            if (resultado.Count == 0)
            {
                resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
                resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            }

            return resultado;
        }

        public async Task<Dictionary<string, object>> DeleteAsync(
          string urlEndPoint, HttpContext httpContent,
            string urlBase = "")
        {
            Dictionary<string, object> resultado = new Dictionary<string, object>();
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {
                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                            = new AuthenticationHeaderValue("Bearer", token);
                }

                using (HttpResponseMessage response = await _client.DeleteAsync(urlEndPoint))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var stringResult = await response.Content.ReadAsStringAsync();
                        resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                        resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                    }
                    else
                    {
                        if ((response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity ||
                                response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                        {
                            var stringResult = await response.Content.ReadAsStringAsync();
                            resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                            resultado.Add(OEPERUApiName.StatusCode, (int)response.StatusCode);
                        }
                        else
                        {
                            //error en el api no contemplado                        
                        }
                    }
                    response.Dispose();
                }
            }
            catch (HttpRequestException)
            {

            }

            if (resultado.Count == 0)
            {
                resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>("");
                resultado.Add(OEPERUApiName.StatusCode, (int)HttpStatusCode.InternalServerError);
            }


            return resultado;
        }

        public async Task<Stream> GetFile(string url, HttpContext httpContent, string urlBase = "")
        {
            Stream stream = null;
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {

                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }
                var response = await _client.GetAsync(url);

                if (response != null)
                {
                    var stringResult = await response.Content.ReadAsStreamAsync();
                    stream = stringResult;

                }

            }
            catch (HttpRequestException)
            {

            }

            return stream;
        }

        public async Task<FileResultOutput> GetFileAsync(string url, HttpContext httpContent, string urlBase = "")
        {
            FileResultOutput fileResult = new FileResultOutput();

            Stream stream = null;
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {

                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }
                var response = await _client.GetAsync(url);

                if (response != null)
                {
                    var stringResult = await response.Content.ReadAsStreamAsync();
                    stream = stringResult;

                    if (response.StatusCode.Equals(HttpStatusCode.OK))
                    {
                        fileResult.nombre = response.Content.Headers.ContentDisposition.FileName;
                    }

                    fileResult.statusCode = (int)response.StatusCode;
                }

            }
            catch (HttpRequestException httpRequestException)
            {

            }

            fileResult.stream = stream;

            return fileResult;
        }

        public async Task<FileResultByteOutput> GetFileByteAsync(string url, HttpContext httpContent, string urlBase = "")
        {
            FileResultByteOutput fileByteResult = new FileResultByteOutput();

            byte[] archivoByte = null;
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {

                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }
                var response = await _client.GetAsync(url);

                if (response != null)
                {
                    var byteResult = await response.Content.ReadAsByteArrayAsync();
                    archivoByte = byteResult;

                    if (response.StatusCode.Equals(HttpStatusCode.OK))
                    {
                        fileByteResult.nombre = response.Content.Headers.ContentDisposition.FileName;
                    }

                    fileByteResult.statusCode = (int)response.StatusCode;
                }

            }
            catch (HttpRequestException httpRequestException)
            {

            }

            fileByteResult.archivoByte = archivoByte;

            return fileByteResult;
        }

        public async Task<FileResultOutput> PostFileAsync<T>(string url, T parametros, HttpContext httpContent, string urlBase = "")
        {
            FileResultOutput fileResult = new FileResultOutput();

            Stream stream = null;
            try
            {
                if (string.IsNullOrEmpty(urlBase))
                {
                    _client.BaseAddress = new Uri(Configuration.GetSection("ApiClient")["OEPERU-Seguridad"]);
                }
                else
                {
                    _client.BaseAddress = new Uri(urlBase);
                }

                //validar token/session             
                if (httpContent.Session.TryGetValue(SessionName.SessionKeyAcceso, out byte[] val))
                {

                    string token = httpContent.Session.Get<string>(SessionName.SessionKeyAcceso);
                    _client.DefaultRequestHeaders.Authorization
                         = new AuthenticationHeaderValue("Bearer", token);
                }

                var dataAsString = JsonConvert.SerializeObject(parametros);
                var content = new StringContent(dataAsString);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                var response = await _client.PostAsync(url, content);

                if (response != null)
                {
                    var streamResult = await response.Content.ReadAsStreamAsync();
                    stream = streamResult;
                    if (response.StatusCode.Equals(HttpStatusCode.OK))
                    {                        
                        fileResult.nombre = response.Content.Headers.ContentDisposition.FileName;
                    }
                    else{

                        if ((response.StatusCode == System.Net.HttpStatusCode.NotFound ||
                                response.StatusCode == System.Net.HttpStatusCode.Unauthorized))
                        {
                            var stringResult = await response.Content.ReadAsStringAsync();
                            var resultado = JsonConvert.DeserializeObject<Dictionary<string, object>>(stringResult);

                            fileResult.apiEstado = resultado[OEPERUApiName.ApiEstado].ToString();
                            fileResult.apiMensaje = resultado[OEPERUApiName.ApiMensaje].ToString();
                        }
                    }

                    fileResult.statusCode = (int)response.StatusCode;
                }

            }
            catch (HttpRequestException httpRequestException)
            {

            }

            fileResult.stream = stream;

            return fileResult;
        }

        /*Apis*/
        public string getApiSeguridad()
        {
            return Configuration.GetSection("ApiClient")["OEPERU-Seguridad"];
        }
        public string getApiAdministracion()
        {
            return Configuration.GetSection("ApiClient")["OEPERU-Administracion"];
        }

        /*Menús*/
        public string getMenuTrabajo()
        {
            return Configuration.GetSection("Menus")["Trabajo"];
        }
        public string getIdTipoTasacionComercial()
        {
            return Configuration.GetSection("TiposTasacion")["Comercial"];
        }


    }
}
