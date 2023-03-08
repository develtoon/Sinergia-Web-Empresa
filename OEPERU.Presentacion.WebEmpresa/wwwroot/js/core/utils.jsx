(function () {


    const patterns = (_pattern)=>{
        
        let patterns = {
            all: /^[.*]$/,
            numeric: /^[\d.]$/,
            date: /^[\d\/]$/,
            integer: /^[\d]$/,
            currency: /^[\d.,]$/, // only digots(no symbol)
            letter: /^[a-z\u00C0-\u00FF ]$/i, // include accents characters (áüñ)
            simple_text: /^[a-z\u00C0-\u00FF\s]$/i,
            alphanumeric: /^[ña-z\d]$/i,
            email: /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i,
            period: /^[\d-/\s]$/,
            text_number: /^[a-z0-9\u00C0-\u00FF\s]$/i,
            decimals: /^([0-9]{0,2})*(\.[0-9]{0,4})?$/,

            onlyNumberArabic:/^[0-9]+$/,
        }

        return patterns[_pattern]
    }

    const requiredMessage = (_message) => {
        
        const requiredMessage = {

            // Trabajos - Colaborador 
             

            // Trabajos - Sección principal
            idDepartamento : 'El campo Departamento es requerido',
            idProvincia : 'El campo Provincia es requerido',
            idDistrito : 'El campo Distrito es requerido',
            direccion : 'El campo Direccion es requerido',
            referencia : 'El campo Referencia es requerido',
            solicitante : 'El campo de Razón Social es requerido',
            idTipoDocumento : 'El campo de Tipo Documento es requerido',
            documento : 'El campo Documento es requerido',
            idCliente : 'El campo Solicitante es requerido',
            numeroSolicitud : 'El campo N° Solicitud es requerido',
            numeroGarantia : 'El campo N° Garantía es requerido',
            oficina : 'El campo Oficina Origen es requerido',
            oficinaDestino : 'El campo Oficina Destino es requerido',
            funcionario : 'El campo Funcionario Origen es requerido',
            funcionarioDestino : 'El campo Funcionario Destino es requerido',
            idTipoTasacion : 'El campo Tipo de Tasación es requerido',
            idClienteProducto : 'El campo Producto es requerido',
            idSubTipoTasacion : 'El campo Tipo de Sub Tasación es requerido',
            idClienteSubProducto : 'El campo Sub Producto es requerido',
            idTipoBien : 'El campo Tipo de Bien es requerido',
            idSubTipoBien : 'El campo SubTipo de Bien es requerido',
            idTipoVisita : 'El campo Tipo de Visita es requerido',
            idFormaPago : 'El campo Forma de Pago es requerido',
            montoCotizado : 'El campo Monto Cotizado es requerido',
            pagoCuenta : 'El campo Pago a Cuenta es requerido',
            idFacturar : 'El campo Facturar a es requerido',
            razonSocialFacturacion : 'El campo Razón Social es requerido',
            rucFacturacion : 'El campo RUC es requerido',
            correoReceptor : 'El campo Correo Receptor de Factura es requerido',
            contacto : 'El campo Nombre es requerido',
            contactoTelefono : 'El campo Teléfono es requerido',
            contactoCorreo : 'El campo Correo es requerido',
            fechaInicio : 'El campo Fecha es requerido',
            horaInicio : 'El campo Hora Inicio es requerido',
            horaFin : 'El campo Hora Fin es requerido',
            observacion : 'El campo Observación es requerido',
            inspector : 'El campo Inspector es requerido',
            segundoinspector : 'El campo Inspector 2 es requerido',
            revisor : 'El campo Revisor es requerido',
            segundorevisor : 'El campo Revisor 2 es requerido',
            visador : 'El campo Visador es requerido',
            seguimiento : 'El campo Seguimiento es requerido',
        }

        return 'el campo ' + requiredMessage[_message] + ' es requerido'
    }

    const tryParseNumber = (valor, decimal = 2, defaultValor = false) => {
        var retValue = defaultValor;
        if (valor !== null) {
            if (valor.length > 0) {
                if (!isNaN(valor)) {
                    retValue = parseFloat(valor);

                    if ((valor + "").split(".").length == 2) {

                        if ((valor + "").split(".")[1].length > decimal) {
                            retValue = defaultValor
                        }
                    }
                }
            } else {
                retValue = '';
            }
        }
        return retValue;
    }

    const minValueMessage = (_message, _characters) =>{
        
        let minValueMessage = {
            minLength: 'El valor mímino es de'
        }

        return minValueMessage[_message] + ' ' + _characters + ' ' + 'carácteres'
    }


    const maxValueMessage = (_message, _characters) =>{
        
        let maxValueMessage = {
            maxlength: 'El valor máximo es de'
        }

        return (maxValueMessage[_message] + ' ' + _characters + ' ' + 'caracteres')
    }

    const formatMonedaNumber = (number, digitos) => {
        return number.toLocaleString('en-US', { minimumFractionDigits: digitos, maximumFractionDigits: digitos })
    }

    // colocar como global
    window.Utils = {
        patterns,
        requiredMessage,
        minValueMessage,
        maxValueMessage,
        formatMonedaNumber,
        tryParseNumber
    }
})()
