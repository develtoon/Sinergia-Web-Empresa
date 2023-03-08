
(function () {
    const { useState, useEffect, Fragment, useContext, useRef } = React;
    const { Col, Row, Spinner, Dropdown, Offcanvas, Modal, Popover, OverlayTrigger, Tooltip } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, CPaginationCustom, handleError, CCheckbox, AppContext, localSt, CustomToggle, CSwitch, generateId, validateXSS, validateSql, validateCharacters } = Global
    const { useForm, Controller } = ReactHookForm;
    const optionsZoom = {
        minZoom: 4,
        maxZoom: 20,
    }

    let mapGeneral = null;
    let clustererGeneral = null;

    const ViewIntl = ({ intl }) => {

        let smart = {
            urlContext: '/Proceso/Trabajo',
            urlGetList: '/GetList',
            urlExportXLS: '/ExportXLS',
            urlGetColaboradorList: '/GetColaboradorList',
            urlGetClientList: '/GetClientList',
            urlGetCatalogoEstadoList: '/GetCatalogoEstadoList',
            urlDownloadDocumentoTipoArchivo: '/DownloadDocumentoTipoArchivo',
            urlDelete: '/DeleteList',
            urlSave: '/Save',
            urlClonar: '/Clonar',
        }


        const [dataTrabajos, setDataTrabajos] = useState({
            data: [],
            dataEstados: [],
            dataAtributos: []
        })

        const { register, formState: { errors }, handleSubmit, setValue, watch, clearErrors } = useForm();

        const [showFilter, setShowFilter] = useState(false)

        const [pagination, setPagination] = useState({
            text: '',
            total: 0,
            currentPage: 1,
            order: 'tiposemaforo desc',
            // totalPages: 0,
            perPage: 10
        })

        const [filterMapa, setFilterMapa] = useState({
            neLat: 0, neLng: 0, swLat: 0, swLng: 0
        })
        const [filterData, setFilterData] = useState({

            fechaInicio: '',
            fechaFin: '',
            idCliente: '',
            solicitante: '',
            funcionario: '',
            estado: 0,
            esDocumentoPendiente: false,
            esDesestimado: false,
            esInspeccionConforme: false,
            esStandBy: false,
            esReproceso: false,
            numeroSolicitud: '',
            direccion: '',
            idCoordinador: '',
            idInspector: '',
            idRevisor: '',
            idVisador: '',
            idSeguimiento: '',
        })

        const [colaboradores, setColaboradores] = useState([])
        const [clientes, setClientes] = useState([])

        const [showModal, setShowModal] = useState(false)
        const [idModalData, setIdModalData] = useState(0)
        const [id, setId] = useState('')
        const [esDesestimado, setEsDesestimado] = useState(false)
        const [esStandBy, setEsStandBy] = useState(false)
        const [comentario, setComentario] = useState('')
        const [estadoReproceso, setEstadoReproceso] = useState(0)
        const [catalogoEstado, setCatalogoEstado] = useState([])
        const dataModal = [
            {
                id: 3,
                tit: 'Desestimar',
                alt: 'Deshacer desestimación',
                cont: '¿Desea desestimar el pedido?',
                alt_cont: '¿Desea deshacer la desestimación?',
                boton: ''
            },
            {
                id: 4,
                tit: 'Poner en pausa',
                alt_tit: 'Continuar',
                cont: <CInput onChange={e => standByChange(e)} label="Ingrese un comentario" />,
                alt_cont: '¿Continuar con el proceso?', boton: ''
            },
            {
                id: 5,
                tit: 'Enviar a Reproceso',
                alt_tit: '',
                cont:
                    <>
                        <CSelect onChange={e => reprocesoChange(e)} label="Seleccione el estado" options={[{ id: '0', text: 'Seleccione' }, ...catalogoEstado.map(el => ({ id: el.id, text: el.nombre }))]} />
                        <CInput onChange={e => standByChange(e)} label="Ingrese un comentario" />
                    </>,
                alt_cont: '',
                boton: ''
            },
        ]

        const [showMapa, setShowMapa] = useState(true)
        const [l_data, setL_data] = useState(false)
        const [errorData, setErrorData] = useState('')
        const [rendered, setRendered] = useState(false)
        const [renderedMap, setRenderedMap] = useState(false)

        const appContext = useContext(AppContext);

        const handleApiLoaded = (map, maps) => {

            mapGeneral = map;

            let markersInit = [];

            // Add a marker clusterer to manage the markers.
            clustererGeneral = new markerClusterer.MarkerClusterer({ markersInit, map });

            /*
            let clusterer = new markerClusterer.MarkerClusterer({ markersInit, map });

            const infoWindow = new google.maps.InfoWindow({
                content: "",
                disableAutoPan: true,
            });
            */

            map.addListener('idle', function () {

                let bounds = map.getBounds();

                let ne = bounds.getNorthEast();
                let sw = bounds.getSouthWest();

                setFilterMapa({ neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng() })

                /*
                clusterer.clearMarkers();
                let bounds = map.getBounds();

                let ne = bounds.getNorthEast();
                let sw = bounds.getSouthWest();

                let newDataFilter = { ...filterData, neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng() }

                let trabajoListar = buscar(newDataFilter);


                axios.all([trabajoListar])
                    .then(response => {
                        // Add some markers to the map.
                        let indexMarker = 1;
                        const markers = dataTrabajos.data.map((dt, i) => {

                            let position = { lat: Number(dt.latitud), lng: Number(dt.longitud) };

                            const marker = new google.maps.Marker({
                                position,
                                zIndex: indexMarker
                            });

                            indexMarker++;

                            let labelInfo = "";
                            
                            labelInfo += `<span class="u-text--gray-90 paragraph--14 mb-1"><b>${dt.registro}</b></span>`
                            labelInfo += `<div class="flex align-items-center">`
                            labelInfo += `<span class="state mr-2" style="background: ${dt.estadocolor}"></span>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14">${dt.estado}</span>`
                            labelInfo += `</div>`
    
                            if ((dt.idtiporol == 1 || dt.idtiporol == 3 || dt.idtiporol == 4)) {
                                labelInfo += `<div>`
                                labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Inspector:</b> ${dt.inspector}</span>`
                                labelInfo += `</div>`
                            }
    
                            labelInfo += `<div>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Tipo Bien:</b> ${dt.tipobien}</span>`
                            labelInfo += `</div>`
                            labelInfo += `<div>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Sub Tipo Bien:</b> ${dt.subtipobien}</span>`
                            labelInfo += `</div>`
    
                            if (dt.datosinforme.length != 0) {
                                JSON.parse(dt.datosinforme).map(di => {
                                    labelInfo += `<div>`
                                    labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>${di.nombre}:</b> ${di.valor}</span>`
                                    labelInfo += `<div>`
                                })
                            }
    
                            labelInfo += `<div>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Dir:</b> ${dt.direccion}</span>    `
                            labelInfo += `</div>`
                            labelInfo += `<div>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Fecha:</b> ${dt.fechainspeccion}</span>`
                            labelInfo += `</div>`
                            if ((dt.idestado == 7 && (dt.idtiporol == 1 || dt.idtiporol == 2 || dt.idtiporol == 6 || dt.idtiporol == 7))) {
                                labelInfo += `<div>`
                                labelInfo += `<button title="Descargar informe sellado" `
                                labelInfo += `type="button" class="c-button--rounded c-button--rounded--p-3 u-text--white u-bg--green float-end m-2" `
                                labelInfo += `onClick="(ev) => downloadTipoArchivo(ev, ${dt.id})">`
                                //labelInfo += `<Icon h="21">cloud_download</Icon>`
                                labelInfo += `<i class="material-icons" style="font-size: 21px">cloud_download</i>`
                                labelInfo += `</button>`
                                labelInfo += `</div>`
                            }
    
                            marker.addListener("click", () => {
                                infoWindow.setContent(labelInfo);
                               infoWindow.open(map, marker);
                            });

                            return marker;
                        });

                        console.log("indexMarker", indexMarker);

                        clusterer.addMarkers(markers, false);
                        //new markerClusterer.MarkerClusterer({ markers, map });

                    }).catch(error => {
                        console.log(error);
                    })
                
                */
            })

        }

        useEffect(() => {
            appContext.handleBreadcumb(true, [
                { url: '', name: "Proceso" },
                { url: '', name: "Trabajos" }
            ]);

            let paramsPaginationLS = localSt.get("listTrabajoPagination")
            let paramsFilterDetaLS = localSt.get("listTrabajoFilterData")

            let paramsFilterDatada = {}
            let paramsPagination = { ...pagination }

            if (paramsFilterDetaLS) {

                let fechaInicioValor = "";
                let fechaFinValor = "";

                if (paramsFilterDetaLS.fechaInicio !== '') {
                    fechaInicioValor = (moment(paramsFilterDetaLS.fechaInicio, 'DD/MM/YYYY').format('YYYY-MM-DD'));
                }
                if (paramsFilterDetaLS.fechaFin !== '') {
                    fechaFinValor = (moment(paramsFilterDetaLS.fechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD'));
                }

                paramsFilterDatada = {
                    ...filterData,
                    fechaInicio: paramsFilterDetaLS.fechaInicio,
                    fechaFin: paramsFilterDetaLS.fechaFin,
                    idCliente: paramsFilterDetaLS.idCliente,
                    solicitante: paramsFilterDetaLS.solicitante,
                    funcionario: paramsFilterDetaLS.funcionario,
                    estado: paramsFilterDetaLS.estado,
                    esDocumentoPendiente: paramsFilterDetaLS.esDocumentoPendiente,
                    esDesestimado: paramsFilterDetaLS.esDesestimado,
                    esInspeccionConforme: paramsFilterDetaLS.esInspeccionConforme,
                    esStandBy: paramsFilterDetaLS.esStandBy,
                    esReproceso: paramsFilterDetaLS.esReproceso,
                    numeroSolicitud: paramsFilterDetaLS.numeroSolicitud,
                    direccion: paramsFilterDetaLS.direccion,
                    idCoordinador: paramsFilterDetaLS.idCoordinador,
                    idInspector: paramsFilterDetaLS.idInspector,
                    idRevisor: paramsFilterDetaLS.idRevisor,
                    idVisador: paramsFilterDetaLS.idVisador,
                    idSeguimiento: paramsFilterDetaLS.idSeguimiento,
                }

                setValue("fechaInicio", fechaInicioValor)
                setValue("fechaFin", fechaFinValor)
            }
            else {

                let fechaInicio = moment().add(-2, 'months');
                let fechaFin = moment().add(15, 'days');

                paramsFilterDatada = {
                    ...filterData,
                    fechaInicio: fechaInicio.format("DD/MM/YYYY"),
                    fechaFin: fechaFin.format("DD/MM/YYYY"),
                }

                setValue("fechaInicio", fechaInicio.format('YYYY-MM-DD'))
                setValue("fechaFin", fechaFin.format('YYYY-MM-DD'))
            }

            if (paramsPaginationLS) {

                paramsPagination = {
                    ...pagination,
                    currentPage: paramsPaginationLS.currentPage,
                    text: paramsPaginationLS.text
                }
                setValue("texto", paramsPaginationLS.text)
            }


            setFilterData(paramsFilterDatada);
            setPagination(paramsPagination);

            let menuPermiso = appContext.menuPermiso("proceso/trabajo")

            axios.all([menuPermiso])
                .then(response => {

                    let colaboradores = listarColaborador("1,4,5,6,2,8")
                    let clientes = listarCliente();
                    let estadosReproceso = listarCatalogoEstado('12011')

                    axios.all([colaboradores, clientes, estadosReproceso])
                        .then(response => {
                            setRendered(true);
                        }).
                        catch(error => {
                            console.log("error");
                        });

                }).
                catch(error => {
                    setRendered(true);
                    console.log("error");
                });

        }, [])

        useEffect(() => {


            if (rendered) {

                let params = { ...filterData }

                let trabajoListar = buscar(params);

                axios.all([trabajoListar])
                    .then(response => {
                        if (!showMapa) {
                            setRenderedMap(true);
                        }
                    });
            }

        }, [rendered, pagination.currentPage, pagination.perPage, pagination.order])

        useEffect(() => {

            if (renderedMap) {

                clustererGeneral.clearMarkers();

                const infoWindow = new google.maps.InfoWindow({
                    content: "",
                    disableAutoPan: true,
                });

                let indexContador = 1;

                // Add some markers to the map.
                const markers = dataTrabajos.data.map((dt, i) => {

                    let position = { lat: Number(dt.latitud), lng: Number(dt.longitud) };

                    const label = "";
                    const marker = new google.maps.Marker({
                        position,
                        zIndex: indexContador
                    });

                    indexContador++;

                    let labelInfo = "";


                    labelInfo += `<span class="u-text--gray-90 paragraph--14 mb-1"><b>${dt.registro}</b></span>`
                    labelInfo += `<div class="flex align-items-center">`
                    labelInfo += `<span class="state mr-2" style="background: ${dt.estadocolor}"></span>`
                    labelInfo += `<span class="u-text--gray-90 paragraph--14">${dt.estado}</span>`
                    labelInfo += `</div>`

                    if ((dt.idtiporol == 1 || dt.idtiporol == 3 || dt.idtiporol == 4)) {
                        labelInfo += `<div>`
                        labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Inspector:</b> ${dt.inspector}</span>`
                        labelInfo += `</div>`
                    }

                    labelInfo += `<div>`
                    labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Tipo Bien:</b> ${dt.tipobien}</span>`
                    labelInfo += `</div>`
                    labelInfo += `<div>`
                    labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Sub Tipo Bien:</b> ${dt.subtipobien}</span>`
                    labelInfo += `</div>`

                    if (dt.datosinforme.length != 0) {
                        JSON.parse(dt.datosinforme).map(di => {
                            labelInfo += `<div>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>${di.nombre}:</b> ${di.valor}</span>`
                            labelInfo += `<div>`
                        })
                    }

                    labelInfo += `<div>`
                    labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Dir:</b> ${dt.direccion}</span>    `
                    labelInfo += `</div>`
                    labelInfo += `<div>`
                    labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Fecha:</b> ${dt.fechainspeccion}</span>`
                    labelInfo += `</div>`

                    if ((dt.idestado == 7 && (dt.idtiporol == 1 || dt.idtiporol == 2 || dt.idtiporol == 6 || dt.idtiporol == 7))) {
                        labelInfo += `<div>`
                        labelInfo += `<button title="Descargar informe sellado" `
                        labelInfo += `type="button" class="c-button--rounded c-button--rounded--p-3 u-text--white u-bg--green float-end m-2" `
                        labelInfo += `onClick="(ev) => downloadTipoArchivo(ev, ${dt.id})">`
                        //labelInfo += `<Icon h="21">cloud_download</Icon>`
                        labelInfo += `<i class="material-icons" style="font-size: 21px">cloud_download</i>`
                        labelInfo += `</button>`
                        labelInfo += `</div>`
                    }

                    //labelInfo = "A";

                    marker.addListener("click", () => {
                        infoWindow.setContent(labelInfo);
                        //infoWindow.open(mapGeneral, marker);
                        infoWindow.open(mapGeneral, marker);
                    });

                    return marker;
                });

                clustererGeneral.addMarkers(markers, false);

                setRenderedMap(false);
            }

        }, [renderedMap])

        const setOrderDir = (_item) => {

            let o = pagination.order.split(' ')
            if (o[0] === _item) {
                setPagination({ ...pagination, order: `${_item} ${o[1] === 'asc' ? 'desc' : 'asc'}` });
            } else {
                setPagination({ ...pagination, order: _item + ' asc' });
            }
        }

        const getOrderDir = (item) => {
            let o = pagination.order.split(' ')
            return (
                <Icon h="22">
                    {
                        o[0] === item ?
                            o[1] === 'asc' ?
                                'arrow_drop_up'
                                :
                                'arrow_drop_down'
                            :
                            false
                    }
                </Icon>
            )
        }

        const listarCatalogoEstado = (_codigo) => {

            let params = {
                id: _codigo
            };

            let listarColaboradores = AXIOS.get(`${smart.urlContext}${smart.urlGetCatalogoEstadoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setCatalogoEstado(data.data)
                    }
                    else {
                        setCatalogoEstado([])
                    }
                })
                .catch((error) => {
                    setCatalogoEstado([])
                });

            return listarColaboradores;
        }

        const listarCliente = () => {

            let params = {
                texto: '',
                ordenamiento: '',
                pagina: 0,
            }

            let listarClientes = AXIOS.get(`/Administracion/Cliente/GetList`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setClientes(data.data)
                    }
                    else {
                        setClientes([])
                    }
                })
                .catch(() => {
                    setClientes([])
                });

            return listarClientes;
        }

        const listarColaborador = (idrol) => {

            let params = {
                texto: '',
                idtiporol: idrol,
                pagina: 0,
                ordenamiento: 'colaborador asc',
            };

            let listarColaboradores = AXIOS.get(`${smart.urlContext}${smart.urlGetColaboradorList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setColaboradores(data.data)
                    }
                    else {
                        setColaboradores([])
                    }
                })
                .catch(() => {
                    setColaboradores([])
                });

            return listarColaboradores;
        }

        const buscar = (filtro) => {

            setErrorData('');
            setL_data(true)

            let params = {};

            let tipoBusqueda = 1;

            if (!showMapa) {
                tipoBusqueda = 2;
            }

            if (filtro == null) {

                if (tipoBusqueda == 2) {
                    let bounds = mapGeneral.getBounds();

                    let ne = bounds.getNorthEast();
                    let sw = bounds.getSouthWest();

                    params = {
                        ...filtro, neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng(),
                        tipoBusqueda: tipoBusqueda,
                        texto: pagination.text,
                        ordenamiento: pagination.order,
                        //pagina: pagination.currentPage,
                        pagina: 0,
                        tamanio: pagination.perPage
                    }
                }
                else {
                    params = {
                        ...filtro,
                        tipoBusqueda: tipoBusqueda,
                        texto: pagination.text,
                        ordenamiento: pagination.order,
                        pagina: pagination.currentPage,
                        tamanio: pagination.perPage
                    }
                }
            }
            else {

                let pagina = 0;

                if (tipoBusqueda == 1) {
                    pagina = pagination.currentPage
                }

                params = {
                    ...filtro, tipoBusqueda: tipoBusqueda,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    pagina: pagina,
                    tamanio: pagination.perPage
                };
            }

            let trabajoListar = AXIOS.get(smart.urlContext + smart.urlGetList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        //setData(data.data)

                        let estados = data.dataEstados
                        let atributos = data.dataAtributos
                        let trabajos = data.data

                        let dataTrabajosPush = trabajos.map(item => {
                            return {
                                ...item
                            }
                        })

                        let dataEstadosPush = estados.map(item => {

                            let checked = false;

                            if (item.id == filtro.estado) {
                                checked = true;
                            }

                            return {
                                ...item,
                                isChecked: checked
                            }
                        })

                        let dataAtributosPush = atributos.map(item => {

                            let checked = false;

                            if (item.id == 1 && filtro.esDocumentoPendiente == true) {
                                checked = true;
                            }
                            else if (item.id == 2 && filtro.esInspeccionConforme == true) {
                                checked = true;
                            }
                            else if (item.id == 3 && filtro.esDesestimado == true) {
                                checked = true;
                            }
                            else if (item.id == 4 && filtro.esStandBy == true) {
                                checked = true;
                            }
                            else if (item.id == 5 && filtro.esReproceso == true) {
                                checked = true;
                            }

                            return {
                                ...item,
                                isChecked: checked
                            }
                        })

                        setDataTrabajos({ data: dataTrabajosPush, dataEstados: dataEstadosPush, dataAtributos: dataAtributosPush })
                        //setDataAtributos(dataAtributosPush)
                        //setData(dataTrabajos)

                        setPagination({ ...pagination, total: data.total })
                        setFilterData(filtro);
                        setL_data(false)

                        localSt.set("listTrabajoPagination", { ...pagination })
                        localSt.set("listTrabajoFilterData", { ...filtro })
                    }
                    else {

                        let estados = data.dataEstados
                        let atributos = data.dataAtributos
                        let trabajos = data.data

                        let dataTrabajosPush = trabajos.map(item => {
                            return {
                                ...item
                            }
                        })


                        let dataEstadosPush = estados.map(item => {

                            let checked = false;

                            if (item.id == filtro.estado) {
                                checked = true;
                            }

                            return {
                                ...item,
                                isChecked: checked
                            }
                        })

                        let dataAtributosPush = atributos.map(item => {

                            let checked = false;

                            if (item.id == 1 && filtro.esDocumentoPendiente == true) {
                                checked = true;
                            }
                            else if (item.id == 2 && filtro.esInspeccionConforme == true) {
                                checked = true;
                            }
                            else if (item.id == 3 && filtro.esDesestimado == true) {
                                checked = true;
                            }
                            else if (item.id == 4 && filtro.esStandBy == true) {
                                checked = true;
                            }
                            else if (item.id == 5 && filtro.esReproceso == true) {
                                checked = true;
                            }

                            return {
                                ...item,
                                isChecked: checked
                            }
                        })

                        setDataTrabajos({ data: dataTrabajosPush, dataEstados: dataEstadosPush, dataAtributos: dataAtributosPush })
                        setErrorData(data.apiMensaje);
                        setL_data(false);
                        setPagination({ ...pagination, total: data.total })
                        setFilterData(filtro);

                        localSt.set("listTrabajoPagination", { ...pagination })
                        localSt.set("listTrabajoFilterData", { ...filtro })
                    }
                })
                .catch((error) => {

                    let dataTrabajosPush = [];
                    let dataEstadosPush = [];
                    let dataAtributosPush = [];

                    let status = error.response.status;

                    if (status == 404) {
                        let estados = error.response.data.dataEstados
                        let atributos = error.response.data.dataAtributos
                        let trabajos = error.response.data.data

                        dataTrabajosPush = trabajos.map(item => {
                            return {
                                ...item
                            }
                        })

                        dataEstadosPush = estados.map(item => {

                            let checked = false;

                            if (item.id == filtro.estado) {
                                checked = true;
                            }

                            return {
                                ...item,
                                isChecked: checked
                            }
                        })

                        dataAtributosPush = atributos.map(item => {

                            let checked = false;

                            if (item.id == 1 && filtro.esDocumentoPendiente == true) {
                                checked = true;
                            }
                            else if (item.id == 2 && filtro.esInspeccionConforme == true) {
                                checked = true;
                            }
                            else if (item.id == 3 && filtro.esDesestimado == true) {
                                checked = true;
                            }
                            else if (item.id == 4 && filtro.esStandBy == true) {
                                checked = true;
                            }
                            else if (item.id == 5 && filtro.esReproceso == true) {
                                checked = true;
                            }

                            return {
                                ...item,
                                isChecked: checked
                            }
                        })

                        setErrorData(error.response.data.apiMensaje);
                    }
                    else if (status == 401) {
                        setErrorData(error.response.data.apiMensaje);
                        handleError(error);
                    }

                    setDataTrabajos({ data: dataTrabajosPush, dataEstados: dataEstadosPush, dataAtributos: dataAtributosPush })
                    setL_data(false);
                    setPagination({ ...pagination, total: 0 })
                    setFilterData(filtro);

                    localSt.set("listTrabajoPagination", { ...pagination })
                    localSt.set("listTrabajoFilterData", { ...filtro })


                })

            return trabajoListar;
        }


        // ------------------------------------------------------------------------
        // ---------------------- Seccion Filtros ---------------------------------
        // ------------------------------------------------------------------------

        const handleShowFilter = () => {
            setShowFilter(!showFilter)
        }

        const handleClose = () => {
            setShowFilter(false)
        }

        const handleCleanState = (e, _tipo) => {

            let params = {};

            if (_tipo == 1) {

                params = {
                    ...filterData,
                    estado: 0
                }
            }
            else {
                params = {
                    ...filterData,
                    esDocumentoPendiente: false,
                    esDesestimado: false,
                    esInspeccionConforme: false,
                    esStandBy: false,
                    esReproceso: false,
                }
            }

            buscar(params)
        }


        const handleChangeState = (e, _id, _checked) => {

            /*let actualizarCheck = dataEstados.map((item) =>{
                if(item.isChecked) {
                    return {
                        ...item,
                        isChecked: false
                    }
                }
                if(item.id == _id) {
                    return {
                        ...item,
                        isChecked: !item.isChecked
                    }
                }
                return item
            })
            setDataEstados(actualizarCheck)
            */
            let params = {
                ...filterData,
                estado: _checked == false ? _id : 0,
            }

            buscar(params)
        }



        const handleDelete = (event, _id) => {
            swal({
                title: "¿Está seguro de eliminar?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            })
                .then((willDelete) => {
                    if (willDelete) {
                        AXIOS.delete(`${smart.urlContext}${smart.urlDelete}?id=${_id}`)
                            .then(({ data: res }) => {
                                if (res.apiEstado === 'ok') {
                                    swal({
                                        title: res.apiMensaje,
                                        icon: "success",
                                    });

                                    let params = {
                                        ...filterData,
                                        estado: _checked == false ? _id : 0,
                                    }
                                    buscar(params)
                                }
                                else {
                                    swal({
                                        title: res.apiMensaje,
                                        icon: "error",
                                    });
                                }
                            })
                            .catch((error) => {
                                handleError(error);
                            })
                    }
                });
        }

        const handleChangeAttrib = (e, _id, _checked) => {
            // let params = {}

            /*let actualizarCheck = dataTrabajos.dataAtributos.map((item) => {
                if(item.isChecked) {
                    return {
                        ...item,
                        isChecked: false
                    }
                }
                if(item.id == _id) {
                    return {
                        ...item,
                        isChecked: !item.isChecked
                    }
                }
                return item
            })
            setDataTrabajos(actualizarCheck)
            */

            if (_id == 1) {


                let esDocumentoPendiente = false;

                if (!_checked) {
                    esDocumentoPendiente = true;
                }


                var params = {
                    ...filterData,
                    esDocumentoPendiente: esDocumentoPendiente
                    //esInspeccionConforme: false,
                    //esDesestimado: false,
                    //esStandBy: false,
                    //esReproceso: false,
                }
            } else if (_id == 2) {
                var params = {
                    ...filterData,
                    //esDocumentoPendiente: false,
                    esInspeccionConforme: !_checked
                    //esDesestimado: false,
                    //esStandBy: false,
                    //esReproceso: false,
                }
            } else if (_id == 3) {
                var params = {
                    ...filterData,
                    //esDocumentoPendiente: false,
                    //esInspeccionConforme: false,
                    esDesestimado: !_checked,
                    //esStandBy: false,
                    //esReproceso: false,
                }
            } else if (_id == 4) {
                var params = {
                    ...filterData,
                    //esDocumentoPendiente: false,
                    //esInspeccionConforme: false,
                    //esDesestimado: false,
                    esStandBy: !_checked,
                    //esReproceso: false,
                }
            } else if (_id == 5) {
                var params = {
                    ...filterData,
                    //esDocumentoPendiente: false,
                    //esInspeccionConforme: false,
                    //esDesestimado: false,
                    //esStandBy: false,
                    esReproceso: !_checked,
                }
            }

            buscar(params)
        }

        const handleClonar = (event, _id) => {

            swal({
                title: "¿Está seguro de clonar este trabajo?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            })
                .then((willClone) => {

                    let params = {
                        id: _id
                    }

                    if (willClone) {
                        AXIOS.post(`${smart.urlContext}${smart.urlClonar}`, params)
                            .then(({ data: res }) => {
                                if (res.apiEstado === 'ok') {
                                    swal({
                                        title: res.apiMensaje,
                                        icon: "success",
                                    });

                                    let params = {
                                        ...filterData,
                                        estado: _checked == false ? _id : 0,
                                    }
                                    buscar(params)
                                }
                                else {
                                    swal({
                                        title: res.apiMensaje,
                                        icon: "error",
                                    });
                                }
                            })
                            .catch((error) => {
                                handleError(error);
                            })
                    }
                });

        }

        const handleExportar = (e) => {

            let params = {
                ...filterData
            }

            exportar(params)
        }

        const exportar = (filtro) => {
            //setL_data(true)
            //setErrorData('')  let params = {};

            let params = {};

            let tipoBusqueda = 1;

            if (!showMapa) {

                tipoBusqueda = 2;
            }

            if (tipoBusqueda == 2) {
                let bounds = mapGeneral.getBounds();

                let ne = bounds.getNorthEast();
                let sw = bounds.getSouthWest();

                params = {
                    ...filtro, neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng(),
                    tipoBusqueda: tipoBusqueda,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    //pagina: pagination.currentPage,
                    pagina: 0,
                    tamanio: pagination.perPage
                }
            }
            else {
                params = {
                    ...filtro,
                    tipoBusqueda: tipoBusqueda,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    pagina: pagination.currentPage,
                    tamanio: pagination.perPage
                }
            }

            let date = new Date()
            var filename =
                "Trabajo_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".xlsx"

            AXIOS({
                url: smart.urlContext + smart.urlExportXLS, // Interface name
                method: 'get',
                responseType: "blob",
                params: params
            })
                .then(function (response) {
                    const blob = new Blob(
                        [response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                    const aEle = document.createElement('a');     // Create a label
                    const href = window.URL.createObjectURL(blob);       // Create downloaded link
                    aEle.href = href;
                    aEle.download = filename;  // File name after download
                    document.body.appendChild(aEle);
                    aEle.click();     // Click to download
                    document.body.removeChild(aEle); // Download complete remove element
                    window.URL.revokeObjectURL(href) // Release blob object
                })
                .catch((error) => {
                    handleError(error);
                })

        }

        const downloadTipoArchivo = (event, idPedido) => {

            event.stopPropagation();
            //setL_data(true)
            //setErrorData('')

            let params = {
                idPedido: idPedido,
                idTipo: 12
            }

            let date = new Date()
            let filename =
                "Informe Sellado_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".xlsm";

            AXIOS({
                url: smart.urlContext + smart.urlDownloadDocumentoTipoArchivo, // Interface name
                method: 'get',
                responseType: "blob",
                params: params
            })
                .then(function (response) {

                    const blob = new Blob(
                        [response.data], { type: 'application/octet-stream' })
                    const aEle = document.createElement('a');     // Create a label
                    const href = window.URL.createObjectURL(blob);       // Create downloaded link
                    aEle.href = href;
                    aEle.download = filename;  // File name after download
                    document.body.appendChild(aEle);
                    aEle.click();     // Click to download
                    document.body.removeChild(aEle); // Download complete remove element
                    window.URL.revokeObjectURL(href) // Release blob object
                })
                .catch((error) => {
                    handleError(error);
                })

        }

        const handleChange = (e, _value) => {

            let nombre = e.target.name

            if (nombre === "texto") {
                setPagination({ ...pagination, text: e.target.value });
            }
            else {

                let value = ""

                if (nombre == "fechaInicio" || nombre == "fechaFin") {

                    value = (moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))

                } else {
                    value = e.target.value
                }

                let params = {
                    ...filterData,
                    [nombre]: value,
                }

                setFilterData(params)
            }
        }

        const handleCleanFilter = () => {

            let fechaInicio = moment().add(-2, 'months');
            let fechaFin = moment().add(15, 'days');

            let params = {
                ...filterData,
                fechaInicio: fechaInicio.format("DD/MM/YYYY"),
                fechaFin: fechaFin.format("DD/MM/YYYY"),
                idCliente: '',
                solicitante: '',
                funcionario: '',
                //estado: 0,
                //esDocumentoPendiente: false,
                //esDesestimado: false,
                //esInspeccionConforme: false,
                //esStandBy: false,
                //esReproceso: false,
                numeroSolicitud: '',
                direccion: '',
                idCoordinador: '',
                idInspector: '',
                idRevisor: '',
                idVisador: '',
                idSeguimiento: '',
            }

            setFilterData(params)

            setValue("fechaInicio", fechaInicio.format('YYYY-MM-DD'))
            setValue("fechaFin", fechaFin.format('YYYY-MM-DD'))

            setValue("solicitante", '')
            setValue("numeroSolicitud", '')
            setValue("direccion", '')
            setValue("funcionario", '')

        }

        const handleBuscar = (e) => {

            if (pagination.currentPage == 1) {
                let params = {
                    ...filterData
                }
                let trabajoListar = buscar(params)

                axios.all([trabajoListar])
                    .then(response => {
                        if (!showMapa) {
                            setRenderedMap(true);
                        }
                    });

            }
            else {
                setPagination({ ...pagination, currentPage: 1 })
            }
        }

        const handleOnPageChange = (page) => {
            setPagination({ ...pagination, currentPage: page })
        }

        const handleOnSizeChange = (size) => {
            if (pagination.currentPage == 1) {
                setPagination({ ...pagination, perPage: size })
            }
            else {
                setPagination({ ...pagination, perPage: size, currentPage: 1 })
            }
        }

        const header = [
            {
                name: '',
                className: '',
                nombre: ''
            },
            {
                name: 'tiposemaforo',
                className: '',
                nombre: ''
            },
            {
                name: 'idestado',
                className: '',
                nombre: 'Estado'
            },
            {
                name: 'solicitante',
                className: '',
                nombre: 'Cliente'
            },
            {
                name: 'cliente',
                className: '',
                nombre: 'Solicitante'
            },
            {
                name: 'registro',
                className: 'justify-center',
                nombre: 'N° Registro'
            },
            {
                name: 'codigo',
                className: 'justify-center',
                nombre: 'N° Informe'
            },
            {
                name: 'numerosolicitud',
                className: '',
                nombre: 'N° Solicitud'
            },
            {
                name: 'tiposervicio',
                className: '',
                nombre: 'Tipo Servicio'
            },
            {
                name: 'departamento',
                className: '',
                nombre: 'Departamento'
            },
            {
                name: 'provincia',
                className: '',
                nombre: 'Provincia'
            },
            {
                name: 'distrito',
                className: '',
                nombre: 'Distrito'
            },
            {
                name: 'direccion',
                className: '',
                nombre: 'Dirección'
            },
            {
                name: 'fechainspeccion',
                className: 'justify-center',
                nombre: 'F. Inspección'
            },
            {
                name: 'coordinador',
                className: '',
                nombre: 'Coordinador'
            },
            {
                name: 'inspector',
                className: '',
                nombre: 'Inspector'
            },
            {
                name: 'revisor',
                className: '',
                nombre: 'Revisor'
            },
            {
                name: 'visador',
                className: '',
                nombre: 'Visador'
            },
            {
                name: 'fechacreacion',
                className: 'justify-center',
                nombre: 'F. Creación'
            },
            {
                name: 'usuariocreacion',
                className: '',
                nombre: 'Usu. Creación'
            },
        ]
        // ------------------------------------------------------------------------
        // ---------------------- Seccion Mapa ---------------------------------
        // ------------------------------------------------------------------------

        const handleShowMap = (e) => {

            setShowMapa(!showMapa)

        }

        useEffect(() => {

            if (!showMapa) {

                let newFilterMapa = { ...filterMapa }

                let params = {
                    ...filterData,
                    neLat: newFilterMapa.neLat,
                    neLng: newFilterMapa.neLng,
                    swLat: newFilterMapa.swLat,
                    swLng: newFilterMapa.swLng
                }


                let trabajoListar = buscar(params);

                axios.all([trabajoListar])
                    .then(response => {
                        setRenderedMap(true);
                    });

            }

        }, [filterMapa])

        const handleIdleDataMap = (bounds) => {

            let ne = bounds.getNorthEast();
            let sw = bounds.getSouthWest();
            let newDataFilter = { ...filterData, neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng() }

            let trabajoListar = buscar(newDataFilter);

            axios.all([trabajoListar])
                .then(response => {
                    setRenderedMap(true);
                })
        }

        const handleChangeDataMap = ({ center, zoom, bounds }) => {

            let ne = bounds.ne;
            let sw = bounds.sw;
            let newDataFilter = { ...filterData, neLat: ne.lat, neLng: ne.lng, swLat: sw.lat, swLng: sw.lng }

            let trabajoListar = buscar(newDataFilter);

            axios.all([trabajoListar])
                .then(response => {

                    clustererGeneral.clearMarkers();

                    const infoWindow = new google.maps.InfoWindow({
                        content: "",
                        disableAutoPan: true,
                    });

                    let indexContador = 1;

                    // Add some markers to the map.
                    const markers = dataTrabajos.data.map((dt, i) => {

                        let position = { lat: Number(dt.latitud), lng: Number(dt.longitud) };

                        const label = "";
                        const marker = new google.maps.Marker({
                            position,
                            zIndex: indexContador
                        });

                        indexContador++;

                        let labelInfo = "";


                        labelInfo += `<span class="u-text--gray-90 paragraph--14 mb-1"><b>${dt.registro}</b></span>`
                        labelInfo += `<div class="flex align-items-center">`
                        labelInfo += `<span class="state mr-2" style="background: ${dt.estadocolor}"></span>`
                        labelInfo += `<span class="u-text--gray-90 paragraph--14">${dt.estado}</span>`
                        labelInfo += `</div>`

                        if ((dt.idtiporol == 1 || dt.idtiporol == 3 || dt.idtiporol == 4)) {
                            labelInfo += `<div>`
                            labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Inspector:</b> ${dt.inspector}</span>`
                            labelInfo += `</div>`
                        }

                        labelInfo += `<div>`
                        labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Tipo Bien:</b> ${dt.tipobien}</span>`
                        labelInfo += `</div>`
                        labelInfo += `<div>`
                        labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Sub Tipo Bien:</b> ${dt.subtipobien}</span>`
                        labelInfo += `</div>`

                        if (dt.datosinforme.length != 0) {
                            JSON.parse(dt.datosinforme).map(di => {
                                labelInfo += `<div>`
                                labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>${di.nombre}:</b> ${di.valor}</span>`
                                labelInfo += `<div>`
                            })
                        }

                        labelInfo += `<div>`
                        labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Dir:</b> ${dt.direccion}</span>    `
                        labelInfo += `</div>`
                        labelInfo += `<div>`
                        labelInfo += `<span class="u-text--gray-90 paragraph--14"><b>Fecha:</b> ${dt.fechainspeccion}</span>`
                        labelInfo += `</div>`

                        if ((dt.idestado == 7 && (dt.idtiporol == 1 || dt.idtiporol == 2 || dt.idtiporol == 6 || dt.idtiporol == 7))) {
                            labelInfo += `<div>`
                            labelInfo += `<button title="Descargar informe sellado" `
                            labelInfo += `type="button" class="c-button--rounded c-button--rounded--p-3 u-text--white u-bg--green float-end m-2" `
                            labelInfo += `onClick="(ev) => downloadTipoArchivo(ev, ${dt.id})">`
                            //labelInfo += `<Icon h="21">cloud_download</Icon>`
                            labelInfo += `<i class="material-icons" style="font-size: 21px">cloud_download</i>`
                            labelInfo += `</button>`
                            labelInfo += `</div>`
                        }

                        //labelInfo = "A";

                        marker.addListener("click", () => {
                            infoWindow.setContent(labelInfo);
                            //infoWindow.open(mapGeneral, marker);
                            infoWindow.open(mapGeneral, marker);
                        });

                        return marker;
                    });

                    clustererGeneral.addMarkers(markers, false);
                })
        }

        const MarkerComponent = ({ idPedido, estado, idEstado, color, registro, nombreInspector, idTipoRol, tipoBien, subTipoBien, datosInforme, direccion, fecha }) => (
            <OverlayTrigger
                trigger="click"
                placement="top"
                overlay={(
                    <Popover id="c-map-popover">
                        <Popover.Body>
                            <span className="u-text--gray-90 paragraph--14 mb-1"><b>{registro}</b></span>
                            <div className="flex align-items-center">
                                <span className="state mr-2" style={{ backgroundColor: color }}></span>
                                <span className="u-text--gray-90 paragraph--14">{estado}</span>
                            </div>
                            {(idTipoRol == 1 || idTipoRol == 3 || idTipoRol == 4) &&
                                <div>
                                    <span className="u-text--gray-90 paragraph--14"><b>Inspector:</b> {nombreInspector}</span>
                                </div>}
                            <div>
                                <span className="u-text--gray-90 paragraph--14"><b>Tipo Bien:</b> {tipoBien}</span>
                            </div>
                            <div>
                                <span className="u-text--gray-90 paragraph--14"><b>Sub Tipo Bien:</b> {subTipoBien}</span>
                            </div>
                            {datosInforme.map(di => {
                                return (<div>
                                    <span className="u-text--gray-90 paragraph--14"><b>{di.nombre}:</b> {di.valor}</span>
                                </div>)
                            })}
                            <div>
                                <span className="u-text--gray-90 paragraph--14"><b>Dir:</b> {direccion}</span>
                            </div>
                            <div>
                                <span className="u-text--gray-90 paragraph--14"><b>Fecha:</b> {fecha}</span>
                            </div>
                            {(idEstado == 7 && (idTipoRol == 1 || idTipoRol == 2 || idTipoRol == 6 || idTipoRol == 7)) && < div >
                                <button
                                    title="Descargar informe sellado"
                                    type="button" className="c-button--rounded c-button--rounded--p-3 u-text--white u-bg--green float-end m-2" onClick={(ev) => downloadTipoArchivo(ev, idPedido)}>
                                    <Icon h="21">cloud_download</Icon>
                                </button>
                            </div>}
                        </Popover.Body>
                    </Popover >
                )
                } >

                <div style={{
                    color: 'white',
                    display: 'inline-flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100%',
                    transform: 'translate(-50%, -100%)'
                }} >
                    <svg width="19" height="34" viewBox="0 0 19 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.9234 28.8584C8.90198 25.0532 5.85357 20.1701 4.03309 17.6C3.73325 17.1788 3.37629 16.729 2.91939 16.2007C2.59099 15.8223 2.29114 15.4154 2.03413 14.9942L1.96988 14.8871C1.18458 13.5521 0.770508 12.0243 0.770508 10.468C0.770508 5.6562 4.68989 1.73682 9.50167 1.73682C9.65873 1.73682 9.82293 1.74396 9.98713 1.75109C14.5205 1.99383 18.14 5.74187 18.2328 10.2824C18.2685 11.9029 17.8545 13.5021 17.0335 14.8871L16.9692 14.9942C16.6408 15.5296 16.2553 16.0365 15.8198 16.4934C15.4129 16.9218 15.0702 17.3215 14.7775 17.7213C12.8999 20.27 9.7444 25.1032 9.73012 28.8584H8.9234ZM9.50167 6.78419C7.85967 6.78419 6.52465 8.1192 6.52465 9.7612C6.52465 11.4032 7.85967 12.7382 9.50167 12.7382C11.1437 12.7382 12.4787 11.4032 12.4787 9.7612C12.4787 8.1192 11.1437 6.78419 9.50167 6.78419Z" fill="#FB003A" />
                        <path d="M9.50186 2.13631C9.65178 2.13631 9.80884 2.14345 9.95877 2.15059C14.2851 2.38618 17.7333 5.95575 17.8261 10.2892C17.8618 11.8955 17.4406 13.4019 16.6838 14.6798C16.3554 15.2366 15.9699 15.7435 15.5344 16.2075C15.1489 16.6073 14.7848 17.0285 14.4564 17.4712C12.3004 20.3982 9.3448 25.0815 9.33052 28.851C9.30911 25.0387 6.43203 20.284 4.36882 17.3641C4.01901 16.8643 3.62635 16.3932 3.22656 15.9363C2.89102 15.5507 2.58404 15.1295 2.32703 14.6869C1.59884 13.4518 1.18477 12.0097 1.18477 10.4677C1.17049 5.87008 4.90426 2.13631 9.50186 2.13631ZM9.50186 13.1377C11.3652 13.1377 12.8787 11.6242 12.8787 9.76091C12.8787 7.89759 11.3652 6.3841 9.50186 6.3841C7.63855 6.3841 6.12505 7.89759 6.12505 9.76091C6.12505 11.6242 7.63855 13.1377 9.50186 13.1377ZM9.50186 1.32959C7.06028 1.32959 4.76862 2.27909 3.04095 4.00677C1.32041 5.73444 0.36377 8.0261 0.36377 10.4677C0.36377 12.0954 0.799257 13.6946 1.62026 15.0938L1.74162 15.3009H1.74876C2.00577 15.7078 2.29848 16.1005 2.6126 16.4646C3.06236 16.9857 3.41218 17.4212 3.70489 17.8281C5.49681 20.3697 8.50238 25.1672 8.5238 28.8581H10.1301C10.1444 26.1595 11.9078 22.283 15.0989 17.9566C15.3774 17.5783 15.7129 17.1856 16.1056 16.7715C16.5339 16.3218 16.9194 15.8292 17.2478 15.3009H17.255L17.3763 15.0938C18.233 13.6375 18.6685 11.974 18.6328 10.2749C18.5329 5.5274 14.742 1.60088 10.0016 1.35101C9.8374 1.33673 9.66606 1.32959 9.50186 1.32959ZM9.50186 12.331C8.08117 12.331 6.93177 11.1745 6.93177 9.76091C6.93177 8.34022 8.08831 7.19082 9.50186 7.19082C10.9226 7.19082 12.072 8.34736 12.072 9.76091C12.072 11.1816 10.9226 12.331 9.50186 12.331Z" fill="black" />
                        <path d="M18.9972 10.2671C18.8973 5.31972 14.9565 1.24327 10.0233 0.979122C9.85201 0.971983 9.67353 0.964844 9.50219 0.964844C4.26206 0.964844 0 5.22691 0 10.467C0 12.1661 0.449765 13.8224 1.30646 15.2788L1.38499 15.4073L1.39213 15.4145C1.67056 15.8714 1.99182 16.3068 2.34164 16.7138C2.78426 17.2207 3.12694 17.649 3.41251 18.0488C6.37525 22.2395 8.05294 25.9804 8.15289 28.629C8.16003 28.8503 8.17431 29.0716 8.19573 29.2929L8.48843 32.7483C8.52413 33.2052 8.90964 33.555 9.36655 33.555C9.60214 33.555 9.80917 33.4622 9.96623 33.3194C10.1233 33.1695 10.2304 32.9696 10.2447 32.734L10.5088 28.8646C10.5231 26.2374 12.2579 22.4465 15.4063 18.1773C15.6775 17.8132 15.9988 17.4348 16.3843 17.0279C16.8555 16.5353 17.2696 15.9927 17.6194 15.4145L17.6265 15.4073L17.7051 15.2788C18.5832 13.7653 19.0401 12.0305 18.9972 10.2671ZM16.6842 14.6863C16.3558 15.2431 15.9702 15.7571 15.5276 16.214C15.1421 16.6138 14.778 17.035 14.4496 17.4777C12.2936 20.4047 9.33799 25.088 9.32371 28.8574C9.30229 25.0451 6.42522 20.2905 4.36201 17.3706C4.01219 16.8708 3.61954 16.3997 3.21975 15.9428C2.88421 15.5572 2.57723 15.136 2.32022 14.6934C1.59203 13.4583 1.17796 12.0162 1.17796 10.4742C1.17796 5.87657 4.91172 2.1428 9.50933 2.1428C9.65925 2.1428 9.81631 2.14994 9.96623 2.15708C14.2925 2.39267 17.7408 5.96224 17.8336 10.2957C17.8621 11.8949 17.4409 13.4012 16.6842 14.6863Z" fill="black" />
                    </svg>
                </div>
            </OverlayTrigger >
        );

        // const popover = (
        //     <Popover id="popover-basic">
        //       <Popover.Header as="h3"></Popover.Header>
        //       <Popover.Body>
        //       </Popover.Body>
        //     </Popover>
        // );


        // ------------------------------------------------------------------------
        // ---------------------- Seccion PopUp ---------------------------------
        // ------------------------------------------------------------------------

        const handleShowPopUp = (e, _id, _bool, _pedidoId) => {
            setShowModal(true)
            setIdModalData(_id)
            setId(_pedidoId)

            if (_id == 3) {
                setEsDesestimado(_bool)
            } else if (_id == 4) {
                setEsStandBy(_bool)
            }
        }

        const standByChange = (e) => {
            let value = e.target.value
            setComentario(value)
        }

        const reprocesoChange = (e) => {
            let value = e.target.value
            setEstadoReproceso(value)
        }

        const handleExcute = (e, _id, _atributo, _motivo, _estado) => {
            if (_atributo == 3) {
                var oData = {
                    id: _id,
                    atributo: _atributo,
                }
            } else if (_atributo == 4) {
                var oData = {
                    id: _id,
                    atributo: _atributo,
                    motivo: _motivo,
                }
            } else if (_atributo == 5) {
                var oData = {
                    id: _id,
                    atributo: _atributo,
                    estado: _estado,
                    motivo: _motivo,
                }
            }

            AXIOS.post(smart.urlContext + smart.urlSave, oData)
                .then(({ data }) => {

                    handleCloseModal()

                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })

                        let params = {
                            ...filterData
                        }
                        buscar(params)

                    } else {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })
                    }

                }).catch((error) => {
                    handleError(error);

                })
        }

        const handleCloseModal = () => {
            setShowModal(false)
        }






        return (
            <div className="o-container c-header__wrapper row mt-4" style={{ height: 'auto', alignItems: 'flex-start', marginBottom: '80px' }}>

                <div className={`${showMapa == false ? 'col-lg-12' : 'col-lg-12'} p-0  col-sm-12`}>
                    <div className="d-md-flex justify-content-between">
                        <div>
                            <CSwitch
                                onChange={e => handleShowMap(e)}
                                mapa
                            />
                        </div>
                        <form onSubmit={handleSubmit(handleBuscar)} className="flex gap-2 px-2 w-100">
                            <CInput
                                name="texto"
                                {...register("texto", {
                                    validate: {
                                        valXSS: value => validateXSS(value) || 'Búsqueda inválida',
                                        valSql: value => validateSql(value) || 'Búsqueda inválida',
                                        valCha: value => validateCharacters(value) || 'Búsqueda inválida'
                                    },
                                    onChange: (e => {
                                        let value = e.target.value;
                                        setPagination({ ...pagination, text: value });

                                    })
                                })}
                                //value={pagination.text}
                                error={errors.texto?.message}
                                mod="c-input--search w-75"
                                icon="search"
                                placeholder="Ingrese texto a buscar"
                            //onChange={e => handleChange(e)}
                            />
                            {appContext.permisos.esUsuarioConsultar && <CButton type="submit">
                                <Icon children="search" className="mr-2" h="24" />
                                Buscar
                            </CButton>}
                        </form>
                        <div className="flex gap-2">

                            {appContext.permisos.esUsuarioCrear && <a className="c-link" href="/Proceso/Trabajo/Create">
                                <CButton className="c-button--blue">
                                    <Icon children="add_circle" className="mr-2" h="24" />
                                    Agregar
                                </CButton>
                            </a>}

                            {appContext.permisos.esUsuarioConsultar && <CButton className="c-button--red" onClick={handleShowFilter}>
                                <Icon children="filter_alt" className="mr-2" h="24" />
                                Filtrar
                            </CButton>}

                            {appContext.permisos.esUsuarioExportar && <CButton className="c-button--green" onClick={handleExportar}>
                                <Icon children="download" className="mr-2" h="24" />
                                Exportar
                            </CButton>}
                        </div>
                    </div>

                    {showMapa && <div className="c-table c-table-nowraped centered pb-4">
                        <div className="c-table__container c-table__container--nowrapper mt-2">
                            <table className="c-table__container--content mb-2">
                                <thead>
                                    <tr>
                                        {
                                            header.map((item, index) => (
                                                <th scope="col" key={index + 1}>
                                                    {item.nombre &&
                                                        <div className={`flex align-center ${item.className}`} onClick={() => { setOrderDir(`${item.name}`) }}>
                                                            {item.nombre}
                                                            {getOrderDir(`${item.name}`)}
                                                        </div>
                                                    }
                                                </th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        l_data ?
                                            <tr>
                                                <td colSpan="6">
                                                    Cargando...
                                                </td>
                                            </tr>
                                            :
                                            errorData ?
                                                <tr>
                                                    <td colSpan="6">{errorData}</td>
                                                </tr>
                                                :
                                                dataTrabajos.data.map((item) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td className="c-table__options text-centers">
                                                                <Dropdown drop="up">
                                                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
                                                                    <Dropdown.Menu>
                                                                        {<Dropdown.Item href={`/proceso/trabajo/edit/${item.id}`} eventKey="1">{appContext.permisos.esUsuarioEditar ? 'Editar' : 'Ver'}</Dropdown.Item>}
                                                                        {appContext.permisos.esUsuarioEliminar && <Dropdown.Item onClick={(ev) => handleDelete(ev, item.id)} eventKey="2">Eliminar</Dropdown.Item>}
                                                                        {(appContext.permisos.esUsuarioConsultar && appContext.permisos.idTipoRol == 1) && <Dropdown.Item onClick={(ev) => handleClonar(ev, item.id)} eventKey="2">Clonar</Dropdown.Item>}
                                                                        <Dropdown.Divider />
                                                                        {item.idestado < 5 && <Dropdown.Item onClick={e => handleShowPopUp(e, 3, item.esDesestimado, item.id)} eventKey="3">{item.esdesestimado == false ? 'Desestimar' : 'Deshacer desestimación'}</Dropdown.Item>}
                                                                        {item.idestado < 8 && <Dropdown.Item onClick={e => handleShowPopUp(e, 4, item.esstandby, item.id)} eventKey="4">{item.esstandby == false ? 'Poner en pausa' : 'Continuar'}</Dropdown.Item>}
                                                                        {item.idestado >= 5 && <Dropdown.Item onClick={e => handleShowPopUp(e, 5, '', item.id)} eventKey="5">Enviar a Reproceso</Dropdown.Item>}
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </td>
                                                            <td className="text-center" style={{ height: '45px' }}>
                                                                <OverlayTrigger
                                                                    key={`timer_${item.id}`}
                                                                    placement="bottom"
                                                                    overlay={(item.tiposemaforoestado.length > 0
                                                                        //|| item.textotiempoproceso.length > 0
                                                                        || item.textotiemposemaforo.length > 0) ? (
                                                                        <Tooltip id={`tooltip-time-${item.id} `}>
                                                                            {item.tiposemaforoestado.length > 0 &&
                                                                                <>
                                                                                    <span>
                                                                                        {item.tiposemaforoestado}
                                                                                    </span>
                                                                                    <br></br>
                                                                                </>}
                                                                            {/*item.textotiempoproceso.length > 0 &&
                                                                                <>
                                                                                    <span>
                                                                                        {item.textotiempoproceso}
                                                                                    </span>
                                                                                    <br></br>
                                                                                </>*/}
                                                                            {item.textotiemposemaforo.length > 0 &&
                                                                                <>
                                                                                    <span>
                                                                                        {item.textotiemposemaforo}
                                                                                    </span>
                                                                                </>}
                                                                        </Tooltip>) : (<div></div>)
                                                                    }
                                                                >
                                                                    <div className="flex align-center">
                                                                        <Icon children="access_time" className={`u-text--timer u-text--color-time-state-${item.tiposemaforo}`} />
                                                                    </div>
                                                                </OverlayTrigger>
                                                            </td>
                                                            <td style={{ height: '45px' }}>
                                                                <OverlayTrigger
                                                                    key={item.id}
                                                                    placement="bottom"
                                                                    overlay={
                                                                        <Tooltip id={`tooltip-state-${item.id}`}>
                                                                            <div className="flex align-center gap-3">
                                                                                <div className={`mx-auto state`} style={{ backgroundColor: item.estadocolor }}></div>{item.estado}</div>
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <div className="flex align-center" style={{ height: '100%' }}>
                                                                        <div className={`mx-auto state`} style={{ backgroundColor: item.estadocolor }}></div>
                                                                    </div>
                                                                </OverlayTrigger>
                                                            </td>
                                                            <td className="text-left u-text--bold">{item.solicitante}</td>
                                                            <td className="text-left u-text--regular">{item.cliente}</td>
                                                            <td className="text-center u-text--regular"><a className="c-link u-text--bold s-link" href={`/proceso/trabajo/edit/${item.id}`}>{item.registro}</a></td>
                                                            <td className="text-center u-text--regular">{item.codigo}</td>
                                                            <td className="text-left u-text--regular">{item.numerosolicitud}</td>
                                                            <td className="text-left u-text--regular">{item.tiposervicio}</td>
                                                            <td className="text-left u-text--regular">{item.departamento}</td>
                                                            <td className="text-left u-text--regular">{item.provincia}</td>
                                                            <td className="text-left u-text--regular">{item.distrito}</td>
                                                            <td className="text-left u-text--regular">{item.direccion}</td>
                                                            <td className="text-center u-text--regular">{item.fechainspeccion}</td>
                                                            <td className="text-left u-text--regular">{item.coordinador}</td>
                                                            <td className="text-left u-text--regular">{item.inspector}</td>
                                                            <td className="text-left u-text--regular">{item.revisor}</td>
                                                            <td className="text-left u-text--regular">{item.visador}</td>
                                                            <td className="text-center u-text--regular">{item.fechacreacion}</td>
                                                            <td className="text-left u-text--regular">{item.usuariocreacion}</td>
                                                            {/* <td className="text-center u-text--bold"><div className={`c-card--estado c-card--estado-${item.idestado==1?'active':'inactive'}`}>{item.estado}</div></td> */}
                                                        </tr>
                                                    )
                                                })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <CPaginationCustom
                            totalCount={pagination.total}
                            currentPage={pagination.currentPage}
                            pageSize={pagination.perPage}
                            onPageChange={handleOnPageChange}
                            onSizeChange={handleOnSizeChange}
                        />
                    </div>

                    }
                    {/* {showMapa && <CPagination data={pagination} onChangePag={handlePagination} />} */}
                    {showMapa == false && <div className="c-map">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyBA4H51ZoEeWOmGbjXhwI3wj40J4_vi1p8' }}
                            // defaultCenter={dataMapa ? {lat: Number(dataMapa.latitud), lng: Number(dataMapa.longitud)} : '0'}
                            defaultCenter={{ lat: -12.046374, lng: -77.042793 }}

                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            //onBoundsChange={e => handleBoundsChanged(e)}
                            //onChange={handleChangeDataMap}
                            // defaultZoom={ID ? 15 : 6}
                            defaultZoom={8}
                            options={optionsZoom}
                        >
                            {/*
                                dataTrabajos.data.map(item => (
                                    <MarkerComponent
                                        lat={item.latitud}
                                        lng={item.longitud}
                                        titulo={item.titulo}
                                        idPedido={item.id}
                                        estado={item.estado}
                                        idEstado={item.idestado}
                                        color={item.estadocolor}
                                        registro={item.registro}
                                        nombreInspector={item.inspector}
                                        idTipoRol={item.idtiporol}
                                        tipoBien={item.tipobien}
                                        subTipoBien={item.subtipobien}
                                        datosInforme={JSON.parse(item.datosinforme)}
                                        direccion={item.direccion}
                                        fecha={item.fechainspeccion}
                                    />

                                ))
                            */}
                        </GoogleMapReact>
                    </div>}
                </div>

                {showMapa && <div className="col-lg-9 p-0 col-md-12  col-sm-12">
                    <div className="c-filter float-start">

                        <div className="flex align-center mb-2 mr-2">
                            <span className="title--20 u-text--bold u-text--gray-90">Estados del Pedido</span>
                            <span onClick={e => handleCleanState(e, 1)}
                                title="Limpiar Estados"
                                className="c-filter-icon title--14 u-text--bold u-bg--primary-skyblue ml-2">
                                <Icon h="24" children="restart_alt" />
                            </span>
                        </div>
                        <hr className="mt-2 mb-3 u-text--gray-60" />
                        {
                            dataTrabajos.dataEstados.map(item => (
                                <div className="float-start flex align-center mb-2 mr-2" key={item.id} >
                                    <span onClick={e => handleChangeState(e, item.id, item.isChecked)} className="c-filter-icon title--14 u-text--bold mr-2" style={{ backgroundColor: item.isChecked ? '' : item.valor }}>{item.cantidad}</span>
                                    <p className={`${item.isChecked ? 'u-text--bold c-filter-text' : ''}  paragraph--14 u-text--gray-90`}>{item.nombre}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>}

                {showMapa && <div className="col-lg-3 col-md-12 p-0 col-sm-12">
                    <div className="c-filter float-start">
                        <div className="flex align-center mb-2 mr-2">
                            <span className="title--20 u-text--bold u-text--gray-90">Atributos del Pedido</span>
                            <span onClick={e => handleCleanState(e, 2)}
                                title="Limpiar Atributos"
                                className="c-filter-icon title--14 u-text--bold u-bg--primary-skyblue ml-2">
                                <Icon h="24" children="restart_alt" />
                            </span>
                        </div>
                        <hr className="mt-2 mb-3 u-text--gray-60" />
                        {
                            dataTrabajos.dataAtributos.map(item => (
                                <div className="float-start  flex align-center mb-2 mr-2" key={item.id}>
                                    <span onClick={e => handleChangeAttrib(e, item.id, item.isChecked)} className="c-filter-icon title--14 u-text--bold mr-2" style={{ backgroundColor: item.isChecked ? '' : item.valor }}>{item.cantidad}</span>
                                    <p className={`${item.isChecked ? 'u-text--bold c-filter-text' : ''}  paragraph--14 u-text--gray-90`}>{item.nombre}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>}
                <Offcanvas placement={'end'} show={showFilter} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="title--30 u-text--gray-90 u-text--bold">Filtros</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="u-text--gray-60 m-0" />
                    <Offcanvas.Body className="px-3 paragraph--16 u-text--gray-90">
                        <CInput
                            //value={filterData.fechaInicio}
                            name="fechaInicio"
                            {...register("fechaInicio", {
                                required: {
                                    value: false,
                                    message: 'El campo Fecha Inicio es requerido'
                                },
                            })}
                            label="Desde:"
                            type="date"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        />
                        <CInput
                            name="fechaFin"
                            {...register("fechaFin", {
                                required: {
                                    value: false,
                                    message: 'El campo Fecha Fin es requerido'
                                },
                            })}
                            label="Hasta:"
                            type="date"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        />
                        {/* <CInput
                            value={filterData.numeroSolicitud}
                            name="numeroSolicitud"
                            label="N° Trabajo"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        /> */}
                        <CSelect
                            value={filterData.idCliente}
                            name="idCliente"
                            label="Solicitante"
                            options={[{ id: '', text: 'Seleccione' }, ...clientes.map(el => ({ id: el.id, text: el.nombre }))]}
                            onChange={e => handleChange(e)}
                        />
                        <CInput
                            value={filterData.solicitante}
                            name="solicitante"
                            {...register("solicitante", {
                                onChange: (e => {
                                    let value = e.target.value;
                                    setFilterData({ ...filterData, solicitante: value });

                                })
                            })}
                            name="solicitante"
                            label="Cliente"
                            mod="mb-2"
                        //onChange={e => handleChange(e)}
                        />
                        <CInput
                            value={filterData.numeroSolicitud}
                            name="numeroSolicitud"
                            {...register("numeroSolicitud")}
                            label="N° Solicitud"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        />
                        <CInput
                            value={filterData.direccion}
                            name="direccion"
                            {...register("direccion")}
                            label="Dirección Ocular"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            value={filterData.idCoordinador}
                            name="idCoordinador"
                            label="Coordinador"
                            options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 4 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador }))]}
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            value={filterData.idInspector}
                            name="idInspector"
                            label="Inspector"
                            options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 5 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador }))]}
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            value={filterData.idRevisor}
                            name="idRevisor"
                            label="Revisor"
                            options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 6 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador }))]}
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            value={filterData.idVisador}
                            name="idVisador"
                            label="Visador"
                            options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 2 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador }))]}
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            value={filterData.idSeguimiento}
                            name="idSeguimiento"
                            label="Seguimiento"
                            options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 8 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador }))]}
                            onChange={e => handleChange(e)}
                        />
                        <CInput
                            value={filterData.funcionario}
                            name="funcionario"
                            {...register("funcionario")}
                            label="Funcionario"
                            mod="mb-5"
                            onChange={e => handleChange(e)}
                        />
                        <div className="flex justify-content-between">
                            <CButton onClick={handleCleanFilter} type="button">
                                <Icon h="24" className="mr-2" children="restart_alt" />
                                Limpiar
                            </CButton>
                            {appContext.permisos.esUsuarioConsultar && <CButton onClick={e => handleBuscar()}>
                                <Icon h="24" className="mr-2" children="filter_alt"></Icon>
                                Filtrar
                            </CButton>}
                        </div>

                    </Offcanvas.Body>
                </Offcanvas>

                {
                    dataModal.filter(filterId => filterId.id == idModalData).map(item => (
                        <Modal show={showModal} onHide={handleCloseModal} centered>
                            <Modal.Header bsPrefix="c-modal-header" closeButton>
                                <Modal.Title >
                                    <span className="u-text--gray-90 title--30">{
                                        item.id == 3 ?
                                            esDesestimado == false ?
                                                item.tit : item.alt_tit
                                            :
                                            item.id == 4 ?
                                                esStandBy == false ?
                                                    item.tit : item.alt_tit
                                                :
                                                item.tit
                                    }</span>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <span className="u-text--gray-90 paragraph--16">
                                    {
                                        item.id == 3 ?
                                            esDesestimado == false ?
                                                item.cont : item.alt_cont
                                            :
                                            item.id == 4 ?
                                                esStandBy == false ?
                                                    item.cont : item.alt_cont
                                                :
                                                item.cont
                                    }
                                </span>
                            </Modal.Body>
                            <Modal.Footer bsPrefix="c-modal-footer">

                                <CButton onClick={e => handleExcute(e, id, item.id, comentario, estadoReproceso)}>
                                    <Icon children="send" className="mr-2" h="24" />
                                    Enviar
                                </CButton>
                            </Modal.Footer>
                        </Modal>
                    ))
                }

            </div >


        )
    }
    Global.View = ViewIntl;
})()
