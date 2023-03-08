// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.
var MAX_PAGE = 7;
var paginationRendered = false
var paginationTotalFilas = 0

let urlLeftAndRightImagen = {}



BI = {
    AjaxGetHtml: function (url, loading = true) {
        loading = typeof loading !== 'undefined' ? loading : true;
        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN-HEADERNAME', $('input[name="AntiforgeryFieldname"]').val())
                if (loading === true) {
                    $("#divLoading").show();
                }
            },
            complete: function () {
                if (loading === true) {
                    $("#divLoading").css('display', 'none');
                }
            }
        });

        var rsp = null;
        $.ajax({
            type: "get",
            url: url,
            contentType: "application/json;charset=utf-8",
            dataType: "html",
            success: function (response) {
                rsp = response;
            },
            error: function (request, status, error) {
                alert(request.statusText);
                console.error(request.responseText);
            }
        });
        return rsp;
    },

    AjaxHtml: function (url, exito, error, loading = true) {
        loading = typeof loading !== 'undefined' ? loading : true;

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN-HEADERNAME', $('input[name="AntiforgeryFieldname"]').val())
                if (loading === true) {
                    $("#divLoading").show();
                }
            },
            complete: function () {
                if (loading === true) {
                    $("#divLoading").css('display', 'none');
                }
            }
        });

        //var rsp = null;
        $.ajax({
            type: "get",
            url: url,
            contentType: "application/json;charset=utf-8",
            dataType: "html",
            success: exito,
            error: error
        });
        //return rsp;
    },

    AjaxJson: function (type, url, parameters, async, exito, error, loading = true) {
        loading = typeof loading !== 'undefined' ? loading : true;

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN-HEADERNAME', $('input[name="AntiforgeryFieldname"]').val())
                if (async == true) {
                    if (loading === true) {
                        $("#divLoading").show();
                    }
                }
            },
            complete: function () {
                if (async == true) {
                    if (loading === true) {
                        $("#divLoading").css('display', 'none');
                    }
                }
            }
        });

        $.ajax({
            type: type,
            url: url,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: async,
            data: JSON.stringify(parameters),

            statusCode: {
                401: function (entidad) {

                    errorbatuta(entidad.responseJSON.apiMensaje);

                    //swal({
                    //    title: "Error",
                    //    text: entidad.responseJSON.apiMensaje,
                    //    icon: "error"
                    //});

                },
                422: function (entidad) {

                    //console.log(entidad.responseJSON.apiMensaje);
                    var arreglo = Array();
                    arreglo = entidad.responseJSON.apiMensaje.split(".");
                    let texto = "";
                    arreglo.forEach(function (elemento) {
                        if (elemento.length != 0) {
                            texto += '<li class="text-left">' + elemento + '.</li>';
                        }
                    });
                    const wrapper = document.createElement('ul');
                    wrapper.innerHTML = texto;

                    errorbatuta(wrapper);
                    //swal({
                    //    title: "Error",
                    //    content: wrapper,
                    //    icon: "error"
                    //});

                },
                500: function (entidad) {
                    ////console.log(entidad.responseJSON.apiMensaje);
                    //errobatuta("Comuniquse con Soporte Técnico");
                    swal({
                        title: "Error",
                        text: "Comuniquese con Soporte Técnico",
                        icon: "error"
                    });
                }
                // 404: function () { alert("404"); },
                // 200: function () { alert("200"); },
                // 201: function () { alert("201"); },
                // 202: function () { alert("202"); }
            },

            success: exito,
            error: error
        });

    },

    AjaxFormData: function (url, formData, exito, error, loading = true) {
        loading = typeof loading !== 'undefined' ? loading : true;

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN-HEADERNAME', $('input[name="AntiforgeryFieldname"]').val())
                if (loading === true) {
                    $("#divLoading").show();
                }
            },
            complete: function () {
                if (loading === true) {
                    $("#divLoading").css('display', 'none');
                }
            }
        });

        $.ajax({
            type: "POST",
            url: url,
            data: formData,

            statusCode: {
                401: function (entidad) {

                    //console.log(entidad.responseJSON.apiMensaje);
                    errorbatuta(entidad.responseJSON.apiMensaje);

                    //swal({
                    //    title: "Error",
                    //    text: entidad.responseJSON.apiMensaje,
                    //    icon: "error"
                    //});

                },
                422: function (entidad) {

                    let arrErrores = entidad.responseJSON.apiMensaje.split('.');

                    if (arrErrores.length > 1) {
                        let erroresConVinietas = document.createElement('ul');
                        for (let i in arrErrores) {
                            if (arrErrores[i] != '' && i < 10) {
                                let li = document.createElement('li');
                                li.innerHTML = arrErrores[i];
                                li.classList.add('text-left');
                                erroresConVinietas.appendChild(li);
                            }
                        }
                        errorbatuta(erroresConVinietas);
                    } else {
                        errorbatuta(entidad.responseJSON.apiMensaje);
                    }

                    //console.log(entidad.responseJSON.apiMensaje);
                    //errorbatuta(entidad.responseJSON.apiMensaje);
                    //swal({
                    //    title: "Error",
                    //    text: entidad.responseJSON.apiMensaje,
                    //    icon: "error"
                    //});

                },
                500: function (entidad) {

                    //console.log(entidad.responseJSON.apiMensaje);
                    errorbatuta(entidad.responseJSON.apiMensaje);
                    //swal({
                    //    title: "Error",
                    //    text: "Comuniquese con Soporte Técnico",
                    //    icon: "error"
                    //});
                }
                // 404: function () { alert("404"); },
                // 200: function () { alert("200"); },
                // 201: function () { alert("201"); },
                // 202: function () { alert("202"); }
            },


            //dataType: 'json',
            contentType: false,
            processData: false,
            success: exito,
            error: error
        }).done(function (data) {
            //console.log('');
        });


    },

    borderErrorSelect2: function (ctl, estado) {
        if (estado) {
            ctl.parent()
                .find('.select2-container .select2-selection')
                .attr("style", "border: 1px solid #ff0000 !important;");

        } else {
            ctl.parent()
                .find('.select2-container .select2-selection')
                .attr("style", "border: 1px solid #009A3C !important;");

        }

    },

    OcultarMensajeOk: function () {
        $("#MensajeOk").hide();
    },

    OcultarMensajeError: function () {
        $("#MensajeError").hide();
    },

    MostrarMensajeOk: function (mensaje = '') {
        $("#MensajeOk").show();
        $("#MensajeOkContenido").html(mensaje);
    },

    MostrarMensajeError: function (mensaje = '') {
        $("#MensajeError").show();
        $("#MensajeErrorContenido").html(mensaje);
    },

    MostrarPopupError: function (mensaje = '') {
        var arreglo = Array();
        arreglo = mensaje.split(".");
        let texto = "";
        arreglo.forEach(function (elemento) {
            if (elemento.length != 0) {
                texto += '<li class="text-left">' + elemento + '.</li>';
            }
        });
        const wrapper = document.createElement('ul');
        wrapper.innerHTML = texto;
        errorbatuta(wrapper);
        //swal({
        //    title: 'Error',
        //    icon: "error",
        //    content: wrapper,
        //});
        BI.MostrarMensajeError(texto);
    },
    ConvertirTextoHtml: function (mensaje = '') {
        var arreglo = Array();
        arreglo = mensaje.split(".");
        let texto = "";
        arreglo.forEach(function (elemento) {
            if (elemento.length != 0) {
                texto += '<li class="text-left">' + elemento + '.</li>';
            }
        });
        texto = "<ul>" + texto + "</ul>";
        return texto;
    },

    mostrarMasPaginas: function (paginacion, element) {
        var pagSigPos1, pagSigPos2, pagSigPos3;
        pagSigPos1 = paginacion.pagSel;
        pagSigPos2 = paginacion.pagSel + 1;
        pagSigPos3 = paginacion.pagSel + 2;
        if (pagSigPos1 !== paginacion.totalPaginas && pagSigPos2 !== paginacion.totalPaginas && pagSigPos3 !== paginacion.totalPaginas) {
            $(".more").show();
        }
        else {
            element.hide();
        }
    },

    agregarPaginacion: function (totalPagina) {
        BI.getStaticImages({
            p_estructuraDataImages: [
                {
                    name: 'left.png',
                    elemento: '',
                    tipo: 4
                },
                {
                    name: 'right.png',
                    elemento: '',
                    tipo: 4
                },
            ],
            p_callback: (data) => {
                urlLeftAndRightImagen = data
            }
        })

        $('#lstPaginacion').empty();
        $('#lstPaginacion')
            .append($('<li>')
                .append($('<a href="#" id="lnkAnterior" class="outline">')
                    .append($(`<img style="vertical-align: top" src="${urlLeftAndRightImagen.data[0].url}" alt="Anterior" width="12px">`))));
        $('#lstPaginacion').append($('<li id="moreAnt" style="display:none;" class="more">').text('...'));

        var limite = totalPagina > 3 ? 3 : totalPagina;
        for (var i = 1; i <= limite; i++) {
            $('#lstPaginacion').append($('<li>').append($('<a id="item' + i + '" data-pag="' + i + '" href="#" class="' + (i == 1 ? 'active' : '') + '"></a>').text(i)))
        }
        if (totalPagina > 3) {
            $('#lstPaginacion').append($('<li id="moreSgt" class="more">').text('...'));
        }

        $('#lstPaginacion')
            .append($('<li>')
                .append($('<a href="#" id="lnkSiguiente" class="outline">')
                    .append($(`<img style="vertical-align: top;" src="${urlLeftAndRightImagen.data[1].url}" alt="Anterior" width="12px">`))));

    },

    sgtPagina: function (paginacion) {

        if (paginacion.pagSel < paginacion.totalPaginas) {
            paginacion.pagSel += 1;
        }
        else {
            return;
        }
        if (paginacion.pagSel > 3) {

        }

        if (parseInt($('#item1').text(), 10) === paginacion.pagSel) {
            $('#item1').attr("class", "active");
            $('#item2').attr("class", "");
            $('#item3').attr("class", "");
        }
        else if (parseInt($('#item2').text(), 10) === paginacion.pagSel) {
            $('#item1').attr("class", "");
            $('#item2').attr("class", "active");
            $('#item3').attr("class", "");
        }
        else if (parseInt($('#item3').text(), 10) === paginacion.pagSel) {
            $('#item1').attr("class", "");
            $('#item2').attr("class", "");
            $('#item3').attr("class", "active");
        }

        else {
            if (paginacion.pagSel <= paginacion.totalPaginas) {
                $('#item1').attr("class", "active");
                $('#item2').attr("class", "");
                $('#item3').attr("class", "");
                var pagSigPos1, pagSigPos2, pagSigPos3;
                pagSigPos1 = paginacion.pagSel;
                pagSigPos2 = paginacion.pagSel + 1;
                pagSigPos3 = paginacion.pagSel + 2;

                if (pagSigPos1 <= paginacion.totalPaginas) {
                    $("#item1").text(pagSigPos1);
                    $("#item1").attr('data-pag', pagSigPos1);
                }
                if (pagSigPos2 <= paginacion.totalPaginas) {
                    $("#item2").text(pagSigPos2);
                    $("#item2").attr('data-pag', pagSigPos2);
                    $("#item2").show();
                }
                else {
                    $("#item2").text("0");
                    $("#item2").hide();
                }
                if (pagSigPos3 <= paginacion.totalPaginas) {
                    $("#item3").text(pagSigPos3);
                    $("#item3").attr('data-pag', pagSigPos3);
                    $("#item3").show();
                }
                else {
                    $("#item3").text("0");
                    $("#item3").hide();
                }
                if (pagSigPos1 !== paginacion.totalPaginas && pagSigPos2 !== paginacion.totalPaginas && pagSigPos3 !== paginacion.totalPaginas) {
                    $("#moreSgt").show();
                }
                else {
                    $("#moreSgt").hide();
                }
            }



            $("#moreAnt").show();

        }





    },

    antPagina: function (paginacion) {

        if (paginacion.pagSel > 1) {
            paginacion.pagSel -= 1;
        }
        else {
            paginacion.pagSel = 1;
        }


        if (parseInt($('#item1').text(), 10) === paginacion.pagSel) {
            $('#item1').attr("class", "active");
            $('#item2').attr("class", "");
            $('#item3').attr("class", "");
        }
        else if (parseInt($('#item2').text(), 10) === paginacion.pagSel) {
            $('#item1').attr("class", "");
            $('#item2').attr("class", "active");
            $('#item3').attr("class", "");
        }
        else if (parseInt($('#item3').text(), 10) === paginacion.pagSel) {
            $('#item1').attr("class", "");
            $('#item2').attr("class", "");
            $('#item3').attr("class", "active");
        }
        else {
            if (paginacion.pagSel >= 1) {
                $('#item1').attr("class", "");
                $('#item2').attr("class", "");
                $('#item3').attr("class", "active");
                var pagSigPos1 = paginacion.pagSel - 2;
                var pagSigPos2 = paginacion.pagSel - 1;
                var pagSigPos3 = paginacion.pagSel;

                if (pagSigPos1 <= paginacion.totalPaginas) {
                    $("#item1").text(pagSigPos1);
                    $("#item1").attr('data-pag', pagSigPos1);
                    $("#item1").show();
                }
                if (pagSigPos2 <= paginacion.totalPaginas) {
                    $("#item2").text(pagSigPos2);
                    $("#item2").attr('data-pag', pagSigPos2);
                    $("#item2").show();
                }
                if (pagSigPos3 <= paginacion.totalPaginas) {
                    $("#item3").text(pagSigPos3);
                    $("#item3").attr('data-pag', pagSigPos3);
                    $("#item3").show();
                }
                //if (pagSigPos1 !== paginacion.totalPaginas && pagSigPos2 !== paginacion.totalPaginas && pagSigPos3 !== paginacion.totalPaginas) {
                //    $(".more").show();
                //}
                //else {
                //    $(".more").hide();
                //}
                $("#moreSgt").show();
            }
        }

        if (parseInt($('#item1').text(), 10) === 1) {
            $("#moreAnt").hide();
        }
        else {
            $("#moreAnt").show();
        }






    },
    cardHeaderInit: function (titulo, parrafo, urlImagen, classimg) {
        titulo = titulo || 'Titulo';
        parrafo = parrafo || '';
        urlImagen = urlImagen || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        $('#cardHeaderTitulo').html(titulo);
        $('#cardHeaderParrafo').html(parrafo);
        $('#cardHeaderImagen').attr('src', urlImagen);

        if (classimg != '') {
            $('#cardHeaderImagen').addClass(classimg);
        }
    },
    configureUrl: function () {
        var route = '';
        this.baseUrl = window.location.protocol + '//' + window.location.host + route;
    },
    loadDefaultCombo: function (id, defaultValue, defaultText) {
        var cbo = document.getElementById(id);
        defaultValue = defaultValue || '';
        defaultText = defaultText || 'Seleccione';

        if (cbo) {
            cbo.innerHTML = '';
            cbo.options.add(new Option(defaultText, defaultValue));
        }
    },
    loadCombo: function (id, data, display, value, defaultValue) {
        var cbo = document.getElementById(id);
        if (!cbo) return;

        cbo.innerHTML = "";

        if (defaultValue !== undefined) {
            cbo.options.add(new Option("Seleccione", defaultValue));
        }

        data.forEach(function (obj) {
            cbo.options.add(new Option(obj[display], obj[value]));
        });
    },
    loadComboPersonalizado: function (id, data, display, value, datasetId, defaultText, defaultValue) {
        var cbo = document.getElementById(id);
        if (!cbo) return;

        cbo.innerHTML = "";

        if (defaultValue !== undefined) {
            cbo.options.add(new Option(defaultText, defaultValue));
            cbo.options[0].setAttribute('disabled', true)
        }

        data.forEach(function (obj) {
            cbo.options.add(new Option(obj[display], obj[value]));
            cbo.options[cbo.options.length - 1].dataset['id'] = obj[datasetId]
        });
    },
    loadEstado: function (id, defaultValue, defaultText) {
        var cbo = document.getElementById(id);
        defaultValue = defaultValue || '';
        defaultText = defaultText || 'Seleccione';

        if (cbo) {
            cbo.innerHTML = '';
            cbo.options.add(new Option(defaultText, defaultValue));
            cbo.options.add(new Option("Activo", 1));
            cbo.options.add(new Option("Inactivo", 2));
        }
    },
    generarTabla: function (controller, body, data, schema, pagina, totalFilas, limite, tienePagina = true) {
        $('#' + body).empty();
        var tbody = document.getElementById(body);
        if (data.length !== 0) {
            data.forEach(function (element, index) {
                var row = document.createElement('TR');
                row.setAttribute("data-id", element.id);
                schema.columnas.forEach(function (column) {
                    var html = "";
                    var cell = document.createElement('TD');
                    cell.className = column._class;
                    if (column.render) {
                        html = column.render(element);
                        $(cell).append(html);
                    } else if (column.data === "numeroFila") {
                        cell.innerText = Number(index) + 1;
                    } else {
                        html = element[column.data] ?? "";
                        cell.innerText = html;
                    }

                    row.appendChild(cell);
                });

                tbody.appendChild(row);
            });
        }
        if (tienePagina) {
            this.renderPaginacion(controller, pagina, totalFilas, limite);
        }

    },
    renderPaginacion: function (controller, pagina, totalFilas, limite) {

        var pagination = $('.c-table__actions');
        if (pagination) {
            $('.js-pagination__count-start').text(((pagina - 1) * limite) + 1)
            $('.js-pagination__count-end').text(pagina * limite > totalFilas ? totalFilas : pagina * limite)
            paginationTotalFilas = totalFilas

            pagination.find(".js-pagination__page").text(pagina)
            pagination.find(".js-pagination__total").text(totalFilas)
            pagination.find(".js-pagination__rows").val(limite)
        }

        if (!pagination || paginationRendered) return
        paginationRendered = true
        var me = this;

        pagination.find(".js-pagination__prev").on('click', function (ev) {
            ev.preventDefault();
            if (controller.listParams.paginacion.pagina === 1) return
            controller.listParams.paginacion.pagina -= 1;
            pagination.find(".js-pagination__page").text(controller.listParams.paginacion.pagina)
            controller.buscar(controller.listParams.paginacion.pagina);
        })

        pagination.find(".js-pagination__rows").on('change', function (ev) {
            controller.listParams.paginacion.limite = ev.currentTarget.value
            controller.listParams.paginacion.pagina = 1;
            pagination.find(".js-pagination__page").text(controller.listParams.paginacion.pagina)
            controller.buscar(controller.listParams.paginacion.pagina);
        })

        pagination.find(".js-pagination__next").on('click', function (ev) {
            ev.preventDefault();
            if (controller.listParams.paginacion.pagina + 1 > Math.ceil(paginationTotalFilas / controller.listParams.paginacion.limite)) return
            controller.listParams.paginacion.pagina += 1;
            pagination.find(".js-pagination__page").text(controller.listParams.paginacion.pagina)
            controller.buscar(controller.listParams.paginacion.pagina);
        })

        // if (totalFilas === 0) {
        //     divPagination.hide();
        //     return;
        // }
        // var me = this;
        // me.configPaginacion(pagina, totalFilas, limite);

        // $('#totalFilas').text(totalFilas);

        // $('.paginate_button a').unbind('click');
        // $('.paginate_button a').on('click', function (ev) {
        //     ev.preventDefault();
        //     //if (this.className.indexOf('disabled') > -1 || this.parentNode.className.indexOf('active') > -1) return;
        //     if (this.className.indexOf('disabled') > -1) return;
        //     var newPagina = me.getPagina(ev, totalFilas, limite);

        //     controller.listParams.paginacion.pagina = newPagina;
        //     controller.buscar(newPagina);
        // });

        // var batutaPagination = document.getElementById('ctrlPaginacion');
        // batutaPagination.style.display = 'inline-block';
    },

    toggleDotPage: function (elem, page) {
        if (!page) {
            $(elem).empty().append('<a href="#" class="disabled">...</a>');
        } else {
            $(elem).empty().append('<a href="#" class="page-link" data-page="' + page + '">' + page + '</a>');
        }
    },

    getPagina: function (ev, totalFilas, limite) {
        var newPage = 0
        var dataPage = "0"
        var totalPaginas = Math.ceil(totalFilas / limite)
        var styles = [
            "first",
            "second",
            "third",
            "fourth",
            "fifth",
            "sixth",
            "last",
        ]
        var target = ev.currentTarget
        dataPage = target.attributes["data-page"].value

        var currentPage = null
 

        if (dataPage === "p" && currentPage !== "1") {
            currentPage = $(".paginate_button.active a")[0].attributes["data-page"]
                .value
            newPage = parseInt(currentPage) - 1

            $(".paginate_button").removeClass("active")
            $(".paginate_button").removeClass("disabled")

            if (totalPaginas >= MAX_PAGE) {
                if (newPage < 5 || newPage + 3 >= totalPaginas) {
                    var selector =
                        '.paginate_button a[data-page="' +
                        (newPage === 4 ? newPage + 1 : newPage) +
                        '"]'
                    var paginateButton = $(selector)
                    paginateButton.parent().addClass("active")
                }
            } else {
                $(".paginate_button." + styles[newPage - 1])[0].className =
                    $(".paginate_button." + styles[newPage - 1])[0].className + " active"
            }

            target.parentNode.focus()
            if (newPage === 1)
                target.parentNode.className = target.parentNode.className + " disabled"
        }
        else {
            if (dataPage === "n" && currentPage !== totalPaginas.toString()) {
                currentPage = $(".paginate_button.active a")[0].attributes["data-page"]
                    .value
                newPage = parseInt(currentPage) + 1

                $(".paginate_button").removeClass("active")
                $(".paginate_button").removeClass("disabled")

                if (totalPaginas >= MAX_PAGE) {
                    if (newPage < 5 || newPage + 3 >= totalPaginas) {
                        var selector =
                            '.paginate_button a[data-page="' +
                            (newPage === 12 ? newPage - 1 : newPage) +
                            '"]'
                        var paginateButton = $(selector)
                        paginateButton.parent().addClass("active")
                    }
                } else {
                    $(".paginate_button." + styles[newPage - 1])[0].className =
                        $(".paginate_button." + styles[newPage - 1])[0].className +
                        " active"
                }

                target.parentNode.focus()
                if (newPage === totalPaginas)
                    target.parentNode.className =
                        target.parentNode.className + " disabled"
            }
            else {
                $(".paginate_button").removeClass("active")
                $(".paginate_button").removeClass("disabled")

                newPage = parseInt(dataPage)

                if (totalPaginas >= MAX_PAGE) {
                    if (newPage <= 4 || newPage + 3 >= totalPaginas) {
                        target.parentNode.className =
                            target.parentNode.className + " active"
                    }

                    if (newPage + 3 >= totalPaginas) {
                        target.parentNode.className =
                            target.parentNode.className + " active"
                    }
                } else {
                    target.parentNode.className = target.parentNode.className + " active"
                }

                if (newPage === 1) {
                    $(".paginate_button.previous").addClass("disabled")
                }

                if (newPage === totalPaginas) {
                    $(".paginate_button.next").addClass("disabled")
                }
            }
        }


        if (totalPaginas >= MAX_PAGE) {
            if (MAX_PAGE - newPage < 3 && totalPaginas - newPage > 3) {
                this.toggleDotPage(".pagination .second")
                this.toggleDotPage(".pagination .sixth")

                $(".pagination .third a")
                    .empty()
                    .append(newPage - 1)
                this.toggleDotPage(".pagination .third", newPage - 1)

                $(".pagination .fourth").addClass(" active")
                $(".pagination .fourth a").empty().append(newPage)
                this.toggleDotPage(".pagination .fourth", newPage)

                $(".pagination .fifth a")
                    .empty()
                    .append(newPage + 1)
                this.toggleDotPage(".pagination .fifth", newPage + 1)
            } else {
                if (newPage <= 4) {
                    this.toggleDotPage(".pagination .second", 2)
                    $(".pagination .second a").empty().append(2)

                    this.toggleDotPage(".pagination .third", 3)
                    $(".pagination .third a").empty().append(3)

                    this.toggleDotPage(".pagination .fourth", 4)
                    $(".pagination .fourth a").empty().append(4)

                    this.toggleDotPage(".pagination .fifth", 5)
                    $(".pagination .fifth a").empty().append(5)
                }

                if (newPage + 3 >= totalPaginas) {
                    this.toggleDotPage(".pagination .third", totalPaginas - 4)
                    $(".pagination .third a")
                        .empty()
                        .append(totalPaginas - 4)

                    this.toggleDotPage(".pagination .fourth", totalPaginas - 3)
                    $(".pagination .fourth a")
                        .empty()
                        .append(totalPaginas - 3)

                    this.toggleDotPage(".pagination .fifth", totalPaginas - 2)
                    $(".pagination .fifth a")
                        .empty()
                        .append(totalPaginas - 2)

                    this.toggleDotPage(".pagination .sixth", totalPaginas - 1)
                    $(".pagination .sixth a")
                        .empty()
                        .append(totalPaginas - 1)
                }
            }
        }

        return newPage
    },

    configPaginacion: function (pagina, totalFilas, limite) {
        var totalPaginas = Math.ceil(totalFilas / limite);
        var pages = [
            $('.pagination .first'),
            $('.pagination .second'),
            $('.pagination .third'),
            $('.pagination .fourth'),
            $('.pagination .fifth'),
            $('.pagination .sixth'),
            $('.pagination .last')
        ];

        $('.page-link[data-page]').parent().removeClass('active')
        var p1, p2, p3, p4, p5, p6, p7;

        for (i = 0; i < pages.length; i++) {
            if (i + 1 <= totalPaginas) {
                pages[i].show();
            } else {
                pages[i].hide();
            }
        }

        if (totalPaginas >= MAX_PAGE) {
            
            this.toggleDotPage('.pagination .last', totalPaginas);

            if (pagina + 3 >= totalPaginas) {
                this.toggleDotPage('.pagination .second');
            }

            if (pagina + 3 < totalPaginas) {
                this.toggleDotPage('.pagination .sixth');
            }
        }
        $('[data-page=' + pagina + ']').parent().addClass('active')
    },

    ordenar: function (ev, ordenamiento, controller) {
        ev.preventDefault();
        controller.listParams.paginacion.pagina = 1;
        var me = this;

        $('thead span').empty('');
        //$('thead span').append("&#9660;");
        var newOrder = ev.currentTarget.attributes["data-order"].value;

        try {
            if (ordenamiento === newOrder + ' asc') {
                ordenamiento = newOrder + ' desc';
                ev.currentTarget.firstElementChild.innerHTML = "&#9660;";//↓
            } else {
                ordenamiento = newOrder + ' asc';
                ev.currentTarget.firstElementChild.innerHTML = "&#9650;";//↑
            }

            controller.listParams.ordenamiento = ordenamiento;
        } catch (err) {
            BI.logError(err);
        }

        $('.paginate_button.page-item.first a').click();

        return ordenamiento;
    },

    resetPagination: function () {
        $('.paginate_button').removeClass('disabled');
        $('.paginate_button').removeClass('active');
        $('.paginate_button.page-item.first').addClass('active');
        $('.paginate_button.page-item.previous').addClass('disabled');

        var disableNext = $('.paginate_button.page-item:visible').length == 3;

        if (disableNext) {
            $('.paginate_button.page-item.next').addClass('disabled');
        }
    },

    logError: function (err) {
        console.log({ error: err });
    },
    defaultSuccess: function (rpta) {
        if (rpta.apiEstado === 'ok') {
            swal({
                title: rpta.apiMensaje,//"OK",
                //text: rpta.apiMensaje,
                icon: "/assets/img/Iconos/globales/imagenOk.svg"
            });
        } else if (rpta.apiEstado === 'error') {
            swal({
                title: "Error",
                text: rpta.apiMensaje,
                icon: "error"
            });
        }
    },
    defaultError: function (err) {
        swal({
            title: "Error",
            text: "Comuniquese con Soporte Técnico",
            icon: "error"
        });
        $("#divLoading").show();
    },
    buttonWait2: function (id, status) {
        if (id.substr(0, 1) === '.') {
            pref = '';
        } else {
            pref = '#'
        }

        if (status === false) {
            $(pref + id + ' .spinner-border').css('display', 'none');
            $(pref + id)[0].removeAttribute('disabled');
        } else {
            $(pref + id + ' .spinner-border').css('display', 'inline-block');
            $(pref + id)[0].setAttribute('disabled', 'disabled');
        }
    },
    buttonWait: function (id, status) {
        if (id.substr(0, 1) === '.') {
            pref = '';
        } else {
            pref = '#'
        }

        var parent = $(pref + id);
        if (parent.length === 0) return;

        var spinner = $(pref + id + ' .spinner-border');
        if (spinner.length === 0) {
            var html = parent.html();
            html = '<span class="spinner-border spinner-border-sm spinner-wait" role="status" aria-hidden="true"></span> ' + html;
            parent.empty().append(html);
        }

        if (status === false) {
            $(pref + id + ' .spinner-border').css('display', 'none');
            $(pref + id)[0].removeAttribute('disabled');
            $(pref + id)[0].setAttribute('style', 'opacity:1');
        } else {
            $(pref + id + ' .spinner-border').css('display', 'inline-block');
            $(pref + id)[0].setAttribute('disabled', 'disabled');
            $(pref + id)[0].setAttribute('style', 'opacity:0.7');
        }
    },
    Mensajes: {
        ConfirmaEliminar: function (ent) {
            return "\u00bfEst\u00e1 seguro de eliminar " + ent + "?";
        },
        ApiError: function (msg) {
            msg = msg || '';
            var text = msg;

            if (msg.indexOf('.') > -1) {
                var msgs = msg.split('.');
                text = '';
                for (i = 0; i < msgs.length; i++) {
                    if (msgs[i].length > 0) text += msgs[i] + "\r\n";
                }
            }

            return text;
        },
        Error: function (msg, separator) {
            msg = msg || '';
            var text = msg;

            if (msg.indexOf(separator) > -1) {
                var msgs = msg.split(separator);
                text = '';
                for (i = 0; i < msgs.length; i++) {
                    if (msgs[i].length > 0) text += "-" + msgs[i] + "\r\n";
                }
            }

            return text;
        }
    },
    defaultTable: function (id, error) {
        try {
            $('#' + id + ' tbody').empty().append('<tr><td colspan="' + $('#' + id + ' th').length + '" class="center">' + error + '</td></tr>');
        } catch (err) {
            lg(err);
        }
    },
    loadDia: function (id, text, value, defaultText, defaultValue) {
        var cbo = document.getElementById(id);
        if (!cbo) return;
        var dias = [];

        var start = 1, end = 31;

        for (i = start; i <= end; i++) {
            dias.push({
                index: i,
                number: i.toString().length == 1 ? "0" + i.toString() : i.toString(),
                name: i
            });
        }
        //lg(dias);
        //alert(dias.length);
        cbo.innerHTML = "";

        cbo.options.add(new Option(defaultText || "D\u00eda", defaultValue || ""));
        i = 0;
        start = 0;
        end = 30;
        for (i = start; i <= end; i++) {
            cbo.options.add(new Option(dias[i][text], dias[i][value]));
        }
    },
    loadMes: function (id, text, value, defaultText, defaultValue) {
        var cbo = document.getElementById(id);
        if (!cbo) return;

        var meses = [
            { index: 1, number: "01", name: "Enero" },
            { index: 2, number: "02", name: "Febrero" },
            { index: 3, number: "03", name: "Marzo" },
            { index: 4, number: "04", name: "Abril" },
            { index: 5, number: "05", name: "Mayo" },
            { index: 6, number: "06", name: "Junio" },
            { index: 7, number: "07", name: "Julio" },
            { index: 8, number: "08", name: "Agosto" },
            { index: 9, number: "09", name: "Septiembre" },
            { index: 10, number: "10", name: "Octubre" },
            { index: 11, number: "11", name: "Noviembre" },
            { index: 12, number: "12", name: "Diciembre" }
        ];

        cbo.innerHTML = "";
        cbo.options.add(new Option(defaultText || "Mes", defaultValue || ""));
        var i;
        for (i = 0; i < meses.length; i++) {
            cbo.options.add(new Option(meses[i][text], meses[i][value]));
        }
    },
    loadAnio: function (id, text, value, defaultText, defaultValue) {
        var cbo = document.getElementById(id);
        if (!cbo) return;

        cbo.innerHTML = "";

        var currentYear = new Date().getFullYear();
        var firstYear = currentYear - 100;

        cbo.options.add(new Option(defaultText || "A\u00f1o", defaultValue || ""));

        for (i = currentYear; i >= firstYear; i--) {
            cbo.options.add(new Option(i, i));
        }
    },
    esFechaValida: function (day, month, year) {

        day = Number(day);
        month = Number(month) - 1; //bloody 0-indexed month
        year = Number(year);

        let d = new Date(year, month, day);

        let yearMatches = d.getUTCFullYear() === year;
        let monthMatches = d.getUTCMonth() === month;
        let dayMatches = d.getUTCDate() === day;

        return yearMatches && monthMatches && dayMatches;
    },
    mySwal: function () {
        swal(arguments[0]);
        if (arguments[0].showCloseButton) {
            closeButton = document.createElement('button');
            closeButton.className = 'swal2-close';
            closeButton.onclick = function () { swal.close(); };
            closeButton.textContent = '×';
            modal = document.querySelector('.swal-modal');
            modal.appendChild(closeButton);
        }
    }
};

var lg = function (s) {
    console.log(s);
}
var clr = function () {
    console.clear();
}
BI.configureUrl();
//$.fn.select2.defaults.set("language", "es");
/**
 * Caracteres especiales
 * *********************
 * á=\u00e1
 * e=\u00e9
 * í=\u00ed
 * ó=\u00f3
 * ú=\u00fa
 * ñ=\u00f1
 */
