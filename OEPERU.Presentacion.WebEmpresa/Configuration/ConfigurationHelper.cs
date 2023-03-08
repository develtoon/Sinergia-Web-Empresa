using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OEPERU.Presentacion.WebEmpresa.Configuration
{
    public class ConfigurationHelper
    {
        public static IConfigurationRoot GetConfiguration(string path, string environmentName = null, bool addUserSecrets = false)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false);

            if (!String.IsNullOrWhiteSpace(environmentName))
            {
                builder = builder.AddJsonFile($"appsettings.{environmentName}.json", optional: true,
                    reloadOnChange: false);
            }

            return builder.Build();
        }
    }
}
