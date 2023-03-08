(function () {
    const { useState, useEffect, Fragment, useContext } = React;

    const { requiredMessage, patterns, minValueMessage, maxValueMessage, formatMonedaNumber, tryParseNumber } = Utils
    const { Col, Row, Spinner, Dropdown, Offcanvas, Popover, OverlayTrigger, Accordion, useAccordionButton, ExpandButtom } = ReactBootstrap
    const { CInput, CustomToggle, CSelect, CBreadcrumbs, CButton, Icon, CFlags, COPagination, CPagination, CPaginationCustom, handleError, AppContext, localSt, CSwitch, generateId, validateXSS, validateSql, validateCharacters } = Global
    const { useForm, Controller } = ReactHookForm;


    let smart = {
        urlContext: '/EstudioMercado/ConsultaBien',
        urlGetList: '/GetList',
        urlExportXLS: '/ExportXLS',
        urlSingleExportXLS: '/SingleExportXLS',
        urlDelete: '/Delete',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
        urlGetTipoBienList: '/Administracion/TipoBien/GetTipoBienList',
        urlGetSubTipoBienList: '/Administracion/TipoBien/GetSubTipoBienList',
        urlGetSubTipoBienAtributoList: '/Administracion/TipoBien/GetSubTipoBienAtributoList',
        urlGetUbigeoGetList: '/Administracion/Ubigeo/GetList',
    }

    let polygonMap = null;
    let circleMap = null;
    let rectangleMap = null;
    let mapGeneral = null;
    let drawingManager = null;
    let elementsMap = [];
    let elementSelected = null;
    let idElementSelected = null;

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);
        const [dataEstado, setDataEstado] = useState([])
        const [rendered, setRendered] = useState(false)
        const [searchRendered, setSearchRendered] = useState(false)
        const [data, setData] = useState([])
        const [errorData, setErrorData] = useState('')
        const [l_data, setL_data] = useState(false)

        const [dataTipoBien, setDataTipoBien] = useState([]);
        const [dataSubTipoBien, setDataSubTipoBien] = useState([]);
        const [dataAtributo, setDataAtributo] = useState([]);

        const [dataDepartamento, setDataDepartamento] = useState([])
        const [dataProvincia, setDataProvincia] = useState([])
        const [dataDistrito, setDataDistrito] = useState([])

        const [showList, setshowList] = useState(true)
        const [checkGeneral, setCheckGeneral] = useState(false)

        const [accordion, setAccordion] = useState([])


        const { register, formState: { errors }, handleSubmit, setValue, watch, clearErrors } = useForm();

        const [pagination, setPagination] = useState({
            texto: '',
            total: 0,
            currentPage: 1,
            order: 'fechacreacion desc',
            // totalPages: 0,
            perPage: 10
        })

        const [dataFilter, setDataFilter] = useState({
            idTipoBien: '',
            idSubTipoBien: '',
            idDepartamento: '',
            idProvincia: '',
            idDistrito: '',
            direccion: '',
            neLat: '',
            neLng: '',
            swLat: '',
            swLng: ''
        })

        const handleApiLoaded = (map, maps) => {

            drawingManager = new google.maps.drawing.DrawingManager({
                //drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.CIRCLE,
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.RECTANGLE,
                    ],
                },
                circleOptions: {
                    strokeColor: "#2880D9",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#DDEBFB",
                    fillOpacity: 0.35,
                    draggable: true,
                    //clickable: false,
                    editable: true,
                    zIndex: 1,
                },
                polygonOptions:
                {
                    strokeColor: "#2880D9",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#DDEBFB",
                    fillOpacity: 0.35,
                    draggable: true,
                    //clickable: false,
                    editable: true,
                    zIndex: 1,
                },
                rectangleOptions:
                {
                    strokeColor: "#2880D9",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#DDEBFB",
                    fillOpacity: 0.35,
                    draggable: true,
                    //clickable: false,
                    editable: true,
                    zIndex: 1,
                }
            });

            drawingManager.setMap(map);

            mapGeneral = map;

            /*events Map*/
            google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
            google.maps.event.addListener(map, 'click', clearSelection);
            /*fin events Map*/

            google.maps.event.addListener(drawingManager, "circlecomplete", (circle) => {

                deleteSelectedShapeWithoutUpdate();

                let idElement = generateId();

                circleObj = {
                    id: idElement,
                    elemento: circle,
                    tipo: 2
                }

                let clone = [...elementsMap];

                clone.push(circleObj)
                elementsMap = clone;

                setSelection(circle, idElement);

                ubicacionCoincidenciaActualizar();

                google.maps.event.addListener(circle, 'mousedown', function () {
                    setSelection(circle, idElement);
                });

                let isDragEvent = false;

                google.maps.event.addListener(circle, "dragstart", function () {
                    isDragEvent = true;
                });

                google.maps.event.addListener(circle, "dragend", function () {
                    if (isDragEvent) {
                        isDragEvent = false;
                        ubicacionCoincidenciaActualizar();
                    }
                });

                google.maps.event.addListener(circle, "radius_changed", function () {
                    if (!isDragEvent) {
                        ubicacionCoincidenciaActualizar();
                    }

                });

                google.maps.event.addListener(circle, "center_changed", function () {
                    if (!isDragEvent) {
                        ubicacionCoincidenciaActualizar();
                    }
                });
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {

            });

            google.maps.event.addListener(drawingManager, "polygoncomplete", (polygon) => {

                deleteSelectedShapeWithoutUpdate();

                let idElement = generateId();

                polygonObj = {
                    id: idElement,
                    elemento: polygon,
                    tipo: 1
                }

                let clone = [...elementsMap];

                clone.push(polygonObj)
                elementsMap = clone;

                setSelection(polygon, idElement);

                ubicacionCoincidenciaActualizar();

                google.maps.event.addListener(polygon, 'mousedown', function () {
                    setSelection(polygon, idElement);
                });

                let isDragEvent = false;

                google.maps.event.addListener(polygon, "dragstart", function () {
                    isDragEvent = true;
                });

                google.maps.event.addListener(polygon, "dragend", function () {
                    if (isDragEvent) {
                        isDragEvent = false;
                        ubicacionCoincidenciaActualizar();
                    }
                });

                google.maps.event.addListener(polygon.getPath(), "set_at", function () {
                    if (!isDragEvent) {
                        ubicacionCoincidenciaActualizar();
                    }
                });

                google.maps.event.addListener(polygon.getPath(), "insert_at", function () {
                    if (!isDragEvent) {
                        ubicacionCoincidenciaActualizar();
                    }
                });
            });


            google.maps.event.addListener(drawingManager, "rectanglecomplete", (rectangle) => {

                deleteSelectedShapeWithoutUpdate();

                let idElement = generateId();

                rectangleObj = {
                    id: idElement,
                    elemento: rectangle,
                    tipo: 3
                }

                let clone = [...elementsMap];

                clone.push(rectangleObj)
                elementsMap = clone;

                setSelection(rectangle, idElement);

                ubicacionCoincidenciaActualizar();

                google.maps.event.addListener(rectangle, 'mousedown', function () {
                    setSelection(rectangle, idElement);
                });

                let isDragEvent = false;

                google.maps.event.addListener(rectangle, "dragstart", function () {
                    isDragEvent = true;
                });

                google.maps.event.addListener(rectangle, "dragend", function () {
                    if (isDragEvent) {
                        isDragEvent = false;
                        ubicacionCoincidenciaActualizar();
                    }
                });

                google.maps.event.addListener(rectangle, "bounds_changed", function () {
                    if (!isDragEvent) {
                        ubicacionCoincidenciaActualizar();
                    }
                });
            });

            // Create the DIV to hold the control and call the CustomControl() constructor passing in this DIV.
            var customControlDiv = document.createElement('div');
            var customControl = new CustomControl(customControlDiv, map);

            customControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv);

            /*
            const triangleCoords = [
                { lat: 25.774, lng: -80.19 },
                { lat: 18.466, lng: -66.118 },
                { lat: 32.321, lng: -64.757 },
                { lat: 25.774, lng: -80.19 }
            ];
            
            polygonMap = new maps.Polygon({
                paths: triangleCoords,
                strokeColor: "#2880D9",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#DDEBFB",
                fillOpacity: 0.35,
                draggable: true,
                geodesic: false,
                editable: true,
            });

            circleMap = new google.maps.Circle({
                strokeColor: "#2880D9",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#DDEBFB",
                fillOpacity: 0.35,
                draggable: true,
                geodesic: false,
                editable: true,
                map,
                center: { lat: 37.09, lng: -95.712 },
                radius: 250000,
            });

            rectangleMap = new google.maps.Rectangle({
                strokeColor: "#2880D9",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#DDEBFB",
                fillOpacity: 0.35,
                map,
                bounds: {
                    north: 33.685,
                    south: 43.971,
                    east: -117.434,
                    west: -125.551,
                },
                draggable: true,
                geodesic: false,
                editable: true,
            });

            polygonMap.setMap(map);
            circleMap.setMap(map);
            rectangleMap.setMap(map);
            */


            // listen to changes/*
            /*
            ["set_at", "insert_at", "bounds_changed", "dragstart", "drag", "dragend"].forEach((eventName) => {
                polygonMap.addListener(eventName, () => {

                    let vertices = polygonMap.getPath();

                    for (let i = 0; i < vertices.getLength(); i++) {
                        const xy = vertices.getAt(i);

                        console.log("Coordinate " + i + ":<br>" + xy.lat() + "," + xy.lng());
                    }

                });
            });
            */

            function clearSelection() {
                if (elementSelected) {
                    elementSelected.setOptions({ fillColor: "#DDEBFB" });
                    elementSelected.setEditable(false);
                    idElementSelected = null;
                    elementSelected = null;
                }
            }

            function setSelection(shape, id) {
                clearSelection();
                elementSelected = shape;
                elementSelected.setEditable(true);
                idElementSelected = id;
                elementSelected.setOptions({ fillColor: "#1560bd" });
            }

            function deleteSelectedShape() {
                if (elementSelected) {
                    elementSelected.setMap(null);
                }

                if (idElementSelected) {
                    let clone = [...elementsMap]
                    let pos = clone.findIndex(item => item.id === idElementSelected)
                    clone.splice(pos, 1);
                    elementsMap = clone;

                    ubicacionCoincidenciaActualizar();
                }
            }

            function deleteSelectedShapeWithoutUpdate() {

                elementsMap.forEach(elmp => {
                    elmp.elemento.setMap(null);
                });

                elementsMap = [];
            }

            function CustomControl(controlDiv, map) {

                // Set CSS for the control border
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = '#ffff99';
                controlUI.style.borderStyle = 'solid';
                controlUI.style.borderWidth = '1px';
                controlUI.style.borderColor = '#ccc';
                controlUI.style.marginTop = '4px';
                controlUI.style.marginLeft = '-6px';
                controlUI.style.cursor = 'pointer';
                controlUI.style.textAlign = 'center';
                controlDiv.appendChild(controlUI);

                // Set CSS for the control interior
                let buttonDelete = document.createElement('button');
                buttonDelete.title = "Eliminar elemento seleccionado";
                buttonDelete.style.background = "none padding-box rgb(255, 255, 255)";
                buttonDelete.style.display = "block";
                buttonDelete.style.border = "0px";
                buttonDelete.style.margin = "0px";
                buttonDelete.style.padding = "4px";
                buttonDelete.style.textTransform = "none";
                buttonDelete.style.appearance = "none";
                buttonDelete.style.position = "relative";
                buttonDelete.style.cursor = "pointer";
                buttonDelete.style.userSelect = "none";
                buttonDelete.style.direction = "ltr";
                buttonDelete.style.overflow = "hidden";
                buttonDelete.style.textAlign = "left";
                buttonDelete.style.color = "rgb(86, 86, 86)";
                buttonDelete.style.direction = "ltr";
                buttonDelete.style.fontFamily = 'Roboto, Arial, sans-serif';
                buttonDelete.style.fontSize = '11px';
                buttonDelete.style.borderBottomRightRadius = '2px';
                buttonDelete.style.borderTopRightRadius = '2px';
                buttonDelete.style.boxShadow = 'rgb(0 0 0 / 30%) 0px 1px 4px -1px';
                buttonDelete.innerHTML = '';

                let spanDelete = document.createElement("span");
                spanDelete.style.display = "inline-block";

                let divInside = document.createElement("div");
                divInside.style.width = "16px";
                divInside.style.height = "16px";
                divInside.style.overflow = "hidden";
                divInside.style.position = "relative";

                let iDelete = document.createElement("i");
                iDelete.className = "material-icons"
                iDelete.style.fontSize = "16px";
                iDelete.innerHTML = "delete";

                divInside.appendChild(iDelete);

                spanDelete.appendChild(divInside);
                buttonDelete.appendChild(spanDelete);

                controlUI.appendChild(buttonDelete);

                // Setup the click event listeners
                google.maps.event.addDomListener(controlUI, 'click', deleteSelectedShape);
            }
        }

        useEffect(() => {

            let menuPermiso = appContext.menuPermiso("estudiomercado/consultabien")

            axios.all([menuPermiso]).
                then(response => {

                    setAccordion([{
                        key: generateId(),
                        idTipo: 1,
                        open: false,
                        titulo: "Datos Generales"
                    }, {
                        key: generateId(),
                        idTipo: 2,
                        open: false,
                        titulo: "Datos Específicos"
                    }, {
                        key: generateId(),
                        idTipo: 3,
                        open: false,
                        titulo: "Ubigeo"
                    }
                    ])

                    let ubigeo = buscarUbigeo(1)
                    let listarEstado = catalogoEstadoBuscar(11102);
                    let listarTipoBien = tipoBienBuscar('', 1);

                    axios.all([ubigeo, listarEstado, listarTipoBien]).
                        then(response => {
                            appContext.handleBreadcumb(true, [
                                { url: '', name: "Estudio de Mercado" },
                                { url: '/estudiomercado/consultabien', name: "Consulta de Bienes" }
                            ]);

                            //setRendered(true);
                        }).
                        catch(error => {
                            console.log("error");
                        });
                }).
                catch(error => {
                    //setRendered(true)
                    console.log("error")
                })

            appContext.handleBreadcumb(true, [
                { url: '', name: "Estudio de Mercado" },
                { url: '', name: "Consulta de Bienes" }
            ]);

        }, [])

        const catalogoEstadoBuscar = (_codigo) => {

            let params = {
                codigo: _codigo
            };

            let listarCatalogoEstado = AXIOS.get(`${smart.urlGetCatalogoEstadoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setDataEstado(data.data)
                    }
                    else {
                        setDataEstado([])
                    }
                })
                .catch((error) => {
                    setDataEstado([])
                    console.log('error')
                });

            return listarCatalogoEstado;
        }

        const tipoBienBuscar = (_id, _tipo) => {

            let params = {
                id: '',
                pagina: 0,
                ordenamiento: 'nombre asc'
            };
            let url = "";

            if (_tipo == 1) {
                url = smart.urlGetTipoBienList;
            }
            else if (_tipo == 2) {
                params.id = _id;
                url = smart.urlGetSubTipoBienList;
            }

            let listarTipoBien = AXIOS.get(url, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        if (_tipo == 1) {
                            setDataTipoBien(data.data);
                        }
                        else if (_tipo == 2) {
                            setDataSubTipoBien(data.data);
                        }
                    }
                    else {
                        if (_tipo == 1) {
                            setDataTipoBien(data.data);
                        }
                        else if (_tipo == 2) {
                            setDataSubTipoBien(data.data);
                        }
                    }
                })
                .catch((error) => {
                    if (_tipo == 1) {
                        setDataTipoBien([]);
                    }
                    else if (_tipo == 2) {
                        setDataSubTipoBien([]);
                    }
                    console.log('error')
                });

            return listarTipoBien;
        }

        const subTipoBienAtributoBuscar = (_id) => {

            dataAtributo.forEach(dtatr => {

                if (dtatr.idtipo == 2) {
                    setValue(`input_${dtatr.id}`, 0);
                }
                else if (dtatr.idtipo == 4) {
                    setValue(`select_${dtatr.id}`, 0);
                }
                else {
                    setValue(`input_${dtatr.id}`, '');
                }
            })

            let params = {
                id: _id,
                pagina: 0,
                ordenamiento: 'orden asc'
            };
            let url = "";

            url = smart.urlGetSubTipoBienAtributoList;

            let atributoListar = AXIOS.get(url, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        let dataResult = data.data.map(dt => {

                            let valor = "";

                            if (dt.idtipo == 2 || dt.idtipo == 4) {
                                valor = "0"
                            }

                            return { ...dt, key: generateId(), listado: JSON.parse(dt.listado), valor: valor }
                        })

                        setDataAtributo(dataResult);

                    }
                    else {

                        setDataAtributo([]);
                    }
                })
                .catch((error) => {
                    setDataAtributo([]);
                    console.log('error')
                });

            return atributoListar;
        }

        const buscarUbigeo = (_tipo, _codigo) => {

            let params = {
                tipo: _tipo,
                codigo: _codigo,
                ordenamiento: "nombre asc"

            };

            let listarUbigeo = AXIOS.get(`${smart.urlGetUbigeoGetList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (_tipo == 1) {
                            setDataDepartamento(data.data)
                        }
                        else if (_tipo == 2) {
                            setDataProvincia(data.data)
                        }
                        else if (_tipo == 3) {
                            setDataDistrito(data.data)
                        }
                    }
                    else {
                        if (_tipo == 1) { setDataDepartamento([]) }
                        else if (_tipo == 2) { setDataProvincia([]) }
                        else if (_tipo == 3) { setDataDistrito([]) }
                    }
                })
                .catch((error) => {
                    if (_tipo == 1) { setDataDepartamento([]) }
                    else if (_tipo == 2) { setDataProvincia([]) }
                    else if (_tipo == 3) { setDataDistrito([]) }
                });

            return listarUbigeo;
        };

        useEffect(() => {
            if (searchRendered) {
                ubicacionCoincidenciaActualizar();
                setSearchRendered(false);
            }
        }, [searchRendered])


        useEffect(() => {
            if (rendered) buscar();
        }, [rendered, pagination.currentPage, pagination.perPage, pagination.order])


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

        const ubicacionCoincidenciaActualizar = () => {

            let tipoBusqueda = 1;

            if (!showList) {
                tipoBusqueda = 2;
            }

            if (tipoBusqueda == 2) {

                let clone = [...data];

                if (elementsMap.length == 0) {

                    clone.map(cl => { cl.visible = true })

                    setData(clone);
                }
                else {
                    clone.map(cl => {
                        let position = new google.maps.LatLng(cl.latitud, cl.longitud);

                        let mostrar = false;

                        elementsMap.forEach(elm => {

                            if (elm.tipo == 1) {
                                if (google.maps.geometry.poly.containsLocation(
                                    position,
                                    elm.elemento
                                )) {
                                    mostrar = true;
                                }
                            }
                            else if (elm.tipo == 2) {
                                if (google.maps.geometry.spherical.computeDistanceBetween(
                                    position, elm.elemento.getCenter()) <= elm.elemento.getRadius()) {
                                    mostrar = true;
                                }
                            }
                            else if (elm.tipo == 3) {
                                if (elm.elemento.getBounds().contains(position)) {
                                    mostrar = true;
                                }
                            }

                        })

                        cl.visible = mostrar;
                    })

                    setData(clone);
                }
            }
        }

        const buscar = (newDataFilter) => {
            setL_data(true)
            setErrorData('')
            setCheckGeneral(false);

            let params = {};

            let tipoBusqueda = 1;

            if (!showList) {

                tipoBusqueda = 2;
            }

            let atributos = new Array();

            dataAtributo.forEach(datr => {

                let agregar = true;

                if (datr.idtipo == 2 || datr.idtipo == 4) {
                    if (datr.valor == 0) {
                        agregar = false
                    }
                }
                else {
                    if (datr.valor === "") {
                        agregar = false
                    }
                }

                if (agregar) {
                    let objAtributo = {
                        "id": datr.id,
                        "valor": datr.valor
                    }

                    atributos.push(objAtributo);
                }
            });

            if (newDataFilter == null) {
                if (tipoBusqueda == 2) {
                    let bounds = mapGeneral.getBounds();

                    let ne = bounds.getNorthEast();
                    let sw = bounds.getSouthWest();

                    params = {
                        ...dataFilter, neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng(),
                        tipoBusqueda: tipoBusqueda,
                        atributos: atributos,
                        texto: pagination.text,
                        ordenamiento: pagination.order,
                        //pagina: pagination.currentPage,
                        pagina: 0,
                        tamanio: pagination.perPage
                    }
                }
                else {
                    params = {
                        ...dataFilter,
                        tipoBusqueda: tipoBusqueda,
                        atributos: atributos,
                        texto: pagination.text,
                        ordenamiento: pagination.order,
                        pagina: pagination.currentPage,
                        tamanio: pagination.perPage
                    }
                }
            }
            else {
                params = {
                    ...newDataFilter, tipoBusqueda: tipoBusqueda,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    atributos: atributos,
                };
            }

            AXIOS.post(smart.urlContext + smart.urlGetList, params)
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        let dataResult = data.data.map(dt => {
                            return { ...dt, visible: 1, seleccionado: false }
                        })

                        setData(dataResult)
                        setPagination({ ...pagination, total: data.total })
                        setL_data(false)
                    }
                    else {
                        setData(data.data)
                        setPagination({ ...pagination, total: data.total })
                        setErrorData(data.apiMensaje)
                        setL_data(false)
                    }

                    setSearchRendered(true);
                })
                .catch((error) => {

                    let status = error.response.status;

                    if (status == 404) {
                        setErrorData(error.response.data.apiMensaje)
                        handleError(error);
                    }
                    else if (status == 401) {
                        setErrorData(error.response.data.apiMensaje);
                        handleError(error);
                    }

                    setData([]);
                    setL_data(false);
                    setPagination({ ...pagination, total: 0 })

                    setSearchRendered(true);
                })

        }

        const handleSingleExportar = (event, _id) => {
            setErrorData('')

            let params = {
                id: _id
            };

            let date = new Date()
            let filename =
                "Bien_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".xlsx"

            AXIOS({
                url: smart.urlContext + smart.urlSingleExportXLS, // Interface name
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
                    console.error('Error ocurrido', error);
                })
        }

        const exportar = () => {
            //setL_data(true)
            setErrorData('')

            let params = {};

            let tipoBusqueda = 1;

            if (!showList) {

                tipoBusqueda = 2;
            }

            let atributos = new Array();

            dataAtributo.forEach(datr => {

                let agregar = true;

                if (datr.idtipo == 2 || datr.idtipo == 4) {
                    if (datr.valor == 0) {
                        agregar = false
                    }
                }
                else {
                    if (datr.valor === "") {
                        agregar = false
                    }
                }

                if (agregar) {
                    let objAtributo = {
                        "id": datr.id,
                        "valor": datr.valor
                    }

                    atributos.push(objAtributo);
                }
            });

            if (tipoBusqueda == 2) {
                let bounds = mapGeneral.getBounds();

                let ne = bounds.getNorthEast();
                let sw = bounds.getSouthWest();

                let centerLatLng = mapGeneral.getCenter();

                let centerLat = centerLatLng.lat();
                let centerLng = centerLatLng.lng();
                let zoom = mapGeneral.getZoom();

                //console.log("centerLat", centerLat);
                //console.log("centerLng", centerLng);
                //console.log("zoom", zoom);

                let idsBien = "";
                idsBien = data.filter(dt => dt.visible == true).map(dt => dt.id).join(",");

                params = {
                    ...dataFilter, neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng(),
                    centerLat: centerLat, centerLng: centerLng, zoom: zoom,
                    idsBien: idsBien,
                    tipoBusqueda: tipoBusqueda,
                    atributos: atributos,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    //pagina: pagination.currentPage,
                    pagina: 0,
                    tamanio: pagination.perPage
                }
            }
            else {

                let idsBien = "";
                idsBien = data.filter(dt => dt.seleccionado == true).map(dt => dt.id).join(",");

                params = {
                    ...dataFilter,
                    idsBien: idsBien,
                    tipoBusqueda: tipoBusqueda,
                    atributos: atributos,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    pagina: pagination.currentPage,
                    tamanio: pagination.perPage
                }
            }

            let date = new Date()
            let filename =
                "Bien_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".xlsx"

            AXIOS({
                url: smart.urlContext + smart.urlExportXLS, // Interface name
                method: 'post',
                responseType: "blob",
                data: params
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

                    console.log("error", error)

                    handleError(error);
                    //console.error('Error ocurrido', error);
                })

        }


        // --------- section Handlers ------------

        const handleChange = (e) => {
            let name = e.target.name;
            let value = e.target.value;

            if (name === "texto") {
                setPagination({ ...pagination, texto: value });
            }
            if (name === "checkGeneral") {
                let checked = e.target.checked;
                setCheckGeneral(checked);

                let clone = [...data];
                clone.map(cl => { cl.seleccionado = checked })
                setData(clone);
            }
            else {

                let dataPush = {
                    ...dataFilter,
                    [name]: value
                }

                if (name === "idTipoBien") {
                    if (value === "") {
                        setDataSubTipoBien([])
                        setDataAtributo([])
                        dataPush.idSubTipoBien = '';
                    }
                    else {
                        setDataSubTipoBien([])
                        setDataAtributo([])
                        dataPush.idSubTipoBien = '';
                        tipoBienBuscar(value, 2);
                    }
                }
                else if (name === "idSubTipoBien") {
                    if (value === "") {
                        setDataAtributo([])
                    }
                    else {
                        subTipoBienAtributoBuscar(value);
                    }
                }
                else if (name == 'idDepartamento') {
                    setDataProvincia([])
                    setDataDistrito([])
                    buscarUbigeo(2, value)
                }
                else if (name == 'idProvincia') {
                    setDataDistrito([])
                    buscarUbigeo(3, value)
                }
                else if (name === "estado") {

                }

                setDataFilter(dataPush)
            }

        }

        const handleCleanFilter = () => {

            /*
            let vertices = polygonMap.getPath();

            for (let i = 0; i < vertices.getLength(); i++) {
                const xy = vertices.getAt(i);

                console.log("Coordinate " + i + ":<br>" + xy.lat() + "," + xy.lng());
            }

            console.log("-------------")

            let ne = rectangleMap.getBounds().getNorthEast();
            let sw = rectangleMap.getBounds().getSouthWest();

            console.log(`ne: { ${ne.lat()} ${ne.lng()} }`);
            console.log("bound", `sw: { ${sw.lat()} ${sw.lng()} }`);
            */

            let params = {
                ...dataFilter,
                idTipoBien: '',
                idSubTipoBien: '',
                idDepartamento: '',
                idProvincia: '',
                idDistrito: '',
                direccion: ''
            }

            setDataProvincia([]);
            setDataDistrito([]);
            setDataFilter(params)
        }

        const handleBuscar = (e) => {
            if (pagination.currentPage == 1) {
                buscar()
            }
            else {
                setPagination({ ...pagination, currentPage: 1 })
            }

        }

        const handleExportar = (e) => {
            exportar()
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
                                    // NOTE: aqui eliminamos del arrar de datos mas no llamamos la busqueda otra vez
                                    buscar()
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

        /*Fin Filtro*/

        /*Atributo*/

        const handleCheck = (id, e) => {

            let checked = e.target.checked;
            let newArrayBienes = [...data];
            let pos = newArrayBienes.findIndex((item) => item.id === id)

            newArrayBienes[pos].seleccionado = checked;
            setData(newArrayBienes);

            let checkedGeneral = true;

            if (data.filter(dt => !dt.seleccionado).length != 0) {
                checkedGeneral = false;
            }

            setCheckGeneral(checkedGeneral);
        }

        const handleChangeAtributo = (e, _idAtributo, _tipo, _forma) => {
            e.preventDefault()
            let name = e.target.name;
            let value = e.target.value;
            let re = /^[0-9]+$/;

            let newArrayAtributo = [...dataAtributo]

            let pos = newArrayAtributo.findIndex((item) => item.id === _idAtributo);

            if (_tipo == 2) {

                let cantidadDecimal = 0;

                if (_forma == 2) {
                    cantidadDecimal = 2;
                    re = /^[0-9.]+$/;
                }

                let valor = newArrayAtributo[pos].valor;

                if (value == '' || re.test(value)) {
                    if (tryParseNumber(value, cantidadDecimal) !== false) {
                        valor = value;
                        newArrayAtributo[pos].valor = valor;
                    }
                }

                setValue(name, valor)
                newArrayAtributo[pos].valor = valor;
            }
            else if (_tipo == 1) {
                setValue(name, valor)
                newArrayAtributo[pos].valor = value;
            }
            else {
                newArrayAtributo[pos].valor = value;
            }

            setDataAtributo(newArrayAtributo)
        }

        const handleBlurAtributo = (e, _idAtributo, _tipo, _forma) => {
            e.preventDefault()
            let name = e.target.name;
            let value = e.target.value;
            let re = /^[0-9.]+$/;

            let newArrayAtributo = [...dataAtributo]

            let pos = newArrayAtributo.findIndex((item) => item.id === _idAtributo);

            let valor = 0;

            let cantidadDecimal = 0;

            if (_forma == 2) {
                cantidadDecimal = 2;
            }

            if (value == '' || re.test(value)) {
                if (tryParseNumber(value, cantidadDecimal) !== false) {

                    if (value == '.') {
                        valor = 0;
                    } else {
                        valor = Number(value);
                    }
                }
            }

            setValue(name, valor)
            newArrayAtributo[pos].valor = valor;

            setDataAtributo(newArrayAtributo)
        }

        /*Fin Atributo*/
        /*Mapa*/

        const handleShowList = (e) => {
            let value = e.target.checked;
            setshowList(!showList)
        }

        const handleChangeDataMap = ({ center, zoom, bounds }) => {

            let ne = bounds.ne;
            let sw = bounds.sw;
            let newDataFilter = { ...dataFilter, neLat: ne.lat, neLng: ne.lng, swLat: sw.lat, swLng: sw.lng }

            buscar(newDataFilter);
        }



        const MarkerComponent = ({ codigo, ubigeo, direccion, tipoBien, precio, precioUnitario, color }) => (
            <OverlayTrigger
                trigger="hover"
                placement="top"
                overlay={(
                    <Popover id="c-map-popover">
                        <Popover.Body>
                            <span className="u-text--gray-90 paragraph--14 mb-1"><b>{codigo}</b></span>
                            <div>
                                <span className="u-text--gray-90 paragraph--14">{ubigeo}</span>
                            </div>
                            <div>
                                <span className="u-text--gray-90 paragraph--14">{direccion}</span>
                            </div>
                            <div>
                                <span className="u-text--gray-90 paragraph--14">{tipoBien}</span>
                            </div>
                            <div>
                                <span className="u-text--gray-90 paragraph--14">Precio: {precio}</span>
                            </div>
                            <div>
                                <span className="u-text--gray-90 paragraph--14">Precio unitario: {precioUnitario}</span>
                            </div>
                        </Popover.Body>
                    </Popover>
                )}>

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
                        <path d="M8.9234 28.8584C8.90198 25.0532 5.85357 20.1701 4.03309 17.6C3.73325 17.1788 3.37629 16.729 2.91939 16.2007C2.59099 15.8223 2.29114 15.4154 2.03413 14.9942L1.96988 14.8871C1.18458 13.5521 0.770508 12.0243 0.770508 10.468C0.770508 5.6562 4.68989 1.73682 9.50167 1.73682C9.65873 1.73682 9.82293 1.74396 9.98713 1.75109C14.5205 1.99383 18.14 5.74187 18.2328 10.2824C18.2685 11.9029 17.8545 13.5021 17.0335 14.8871L16.9692 14.9942C16.6408 15.5296 16.2553 16.0365 15.8198 16.4934C15.4129 16.9218 15.0702 17.3215 14.7775 17.7213C12.8999 20.27 9.7444 25.1032 9.73012 28.8584H8.9234ZM9.50167 6.78419C7.85967 6.78419 6.52465 8.1192 6.52465 9.7612C6.52465 11.4032 7.85967 12.7382 9.50167 12.7382C11.1437 12.7382 12.4787 11.4032 12.4787 9.7612C12.4787 8.1192 11.1437 6.78419 9.50167 6.78419Z" fill={color} />
                        <path d="M9.50186 2.13631C9.65178 2.13631 9.80884 2.14345 9.95877 2.15059C14.2851 2.38618 17.7333 5.95575 17.8261 10.2892C17.8618 11.8955 17.4406 13.4019 16.6838 14.6798C16.3554 15.2366 15.9699 15.7435 15.5344 16.2075C15.1489 16.6073 14.7848 17.0285 14.4564 17.4712C12.3004 20.3982 9.3448 25.0815 9.33052 28.851C9.30911 25.0387 6.43203 20.284 4.36882 17.3641C4.01901 16.8643 3.62635 16.3932 3.22656 15.9363C2.89102 15.5507 2.58404 15.1295 2.32703 14.6869C1.59884 13.4518 1.18477 12.0097 1.18477 10.4677C1.17049 5.87008 4.90426 2.13631 9.50186 2.13631ZM9.50186 13.1377C11.3652 13.1377 12.8787 11.6242 12.8787 9.76091C12.8787 7.89759 11.3652 6.3841 9.50186 6.3841C7.63855 6.3841 6.12505 7.89759 6.12505 9.76091C6.12505 11.6242 7.63855 13.1377 9.50186 13.1377ZM9.50186 1.32959C7.06028 1.32959 4.76862 2.27909 3.04095 4.00677C1.32041 5.73444 0.36377 8.0261 0.36377 10.4677C0.36377 12.0954 0.799257 13.6946 1.62026 15.0938L1.74162 15.3009H1.74876C2.00577 15.7078 2.29848 16.1005 2.6126 16.4646C3.06236 16.9857 3.41218 17.4212 3.70489 17.8281C5.49681 20.3697 8.50238 25.1672 8.5238 28.8581H10.1301C10.1444 26.1595 11.9078 22.283 15.0989 17.9566C15.3774 17.5783 15.7129 17.1856 16.1056 16.7715C16.5339 16.3218 16.9194 15.8292 17.2478 15.3009H17.255L17.3763 15.0938C18.233 13.6375 18.6685 11.974 18.6328 10.2749C18.5329 5.5274 14.742 1.60088 10.0016 1.35101C9.8374 1.33673 9.66606 1.32959 9.50186 1.32959ZM9.50186 12.331C8.08117 12.331 6.93177 11.1745 6.93177 9.76091C6.93177 8.34022 8.08831 7.19082 9.50186 7.19082C10.9226 7.19082 12.072 8.34736 12.072 9.76091C12.072 11.1816 10.9226 12.331 9.50186 12.331Z" fill="black" />
                        <path d="M18.9972 10.2671C18.8973 5.31972 14.9565 1.24327 10.0233 0.979122C9.85201 0.971983 9.67353 0.964844 9.50219 0.964844C4.26206 0.964844 0 5.22691 0 10.467C0 12.1661 0.449765 13.8224 1.30646 15.2788L1.38499 15.4073L1.39213 15.4145C1.67056 15.8714 1.99182 16.3068 2.34164 16.7138C2.78426 17.2207 3.12694 17.649 3.41251 18.0488C6.37525 22.2395 8.05294 25.9804 8.15289 28.629C8.16003 28.8503 8.17431 29.0716 8.19573 29.2929L8.48843 32.7483C8.52413 33.2052 8.90964 33.555 9.36655 33.555C9.60214 33.555 9.80917 33.4622 9.96623 33.3194C10.1233 33.1695 10.2304 32.9696 10.2447 32.734L10.5088 28.8646C10.5231 26.2374 12.2579 22.4465 15.4063 18.1773C15.6775 17.8132 15.9988 17.4348 16.3843 17.0279C16.8555 16.5353 17.2696 15.9927 17.6194 15.4145L17.6265 15.4073L17.7051 15.2788C18.5832 13.7653 19.0401 12.0305 18.9972 10.2671ZM16.6842 14.6863C16.3558 15.2431 15.9702 15.7571 15.5276 16.214C15.1421 16.6138 14.778 17.035 14.4496 17.4777C12.2936 20.4047 9.33799 25.088 9.32371 28.8574C9.30229 25.0451 6.42522 20.2905 4.36201 17.3706C4.01219 16.8708 3.61954 16.3997 3.21975 15.9428C2.88421 15.5572 2.57723 15.136 2.32022 14.6934C1.59203 13.4583 1.17796 12.0162 1.17796 10.4742C1.17796 5.87657 4.91172 2.1428 9.50933 2.1428C9.65925 2.1428 9.81631 2.14994 9.96623 2.15708C14.2925 2.39267 17.7408 5.96224 17.8336 10.2957C17.8621 11.8949 17.4409 13.4012 16.6842 14.6863Z" fill="black" />
                    </svg>
                </div>
            </OverlayTrigger>
        );
        /*Fin Mapa*/

        const ExpandButtom = ({ eventKey, arrow, titulo }) => {

            const decoratedOnClick = useAccordionButton(eventKey, () => {

                let clone = [...accordion]
                let data = clone.map(item => {
                    return {
                        ...item,
                        open: item.key !== eventKey ? false : !item.open
                    }
                })

                setAccordion(data)
            });

            return (
                <div className="c-accordion-header" onClick={decoratedOnClick}>
                    <div className="c-accordion-header-left">
                        <span className=" u-text--gray-90">{titulo}</span>
                    </div>
                    <div className="c-accordion-header-right">
                        <Icon children={arrow ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} className="c-accordion-header-toggle u-text--gray-90" h="25" />
                    </div>
                </div>
            );
        }


        return (
            <div className="o-container c-header__wrapper row mt-4" style={{ height: 'auto', alignItems: 'flex-start', marginBottom: '80px' }}>
                <div className="col-lg-3 p-0 pe-lg-2 col-sm-12 mb-2">
                    <form onSubmit={handleSubmit(handleBuscar)}  >
                        <div className="c-filter">
                            <span className="title--20 u-text--bold u-text--gray-90">Filtros de búsqueda</span>
                            <hr className="mt-2 mb-0 u-text--gray-60" />

                        </div>
                        <Accordion defaultActiveKey={1}>
                            {
                                accordion.map((item) => (
                                    <div className="c-accordion-item" key={item.key}>

                                        <ExpandButtom eventKey={item.key} onClick={item.onOpen} arrow={item.open} titulo={item.titulo} />

                                        <Accordion.Collapse eventKey={item.key}>
                                            <div className="c-accordion-body">
                                                {item.idTipo == 1 && <div className="mb-2">

                                                    <CSelect
                                                        value={dataFilter.idTipoBien}
                                                        name="idTipoBien"
                                                        label="Tipo de Bien"
                                                        placeholder="Tipo Bien"
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataTipoBien.map(it => ({ id: it.id, text: it.nombre }))]}
                                                        onChange={e => handleChange(e)}
                                                        mod="col-md-12 col-sm-12 mb-3"
                                                    />
                                                    <CSelect
                                                        value={dataFilter.idSubTipoBien}
                                                        name="idSubTipoBien"
                                                        label="Sub Tipo de Bien"
                                                        placeholder="Sub Tipo Bien"
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataSubTipoBien.map(it => ({ id: it.id, text: it.nombre }))]}
                                                        onChange={e => handleChange(e)} mod="col-md-12 col-sm-12 mb-3"
                                                    />
                                                </div>}
                                                {item.idTipo == 2 && <div className="mb-2 c-accordion-item-3">

                                                    {
                                                        dataAtributo.map(dtatr => (
                                                            <Col key={dtatr.key} sm={12} md={12} lg={12} className="mb-2">

                                                                {dtatr.idtipo == 1 && <CInput
                                                                    mod="mb-2"
                                                                    label={dtatr.nombre}
                                                                    name={`input_${dtatr.id}`}
                                                                    onChange={(e) => handleChangeAtributo(e, dtatr.id)}
                                                                    value={dtatr.valor}
                                                                    maxLength="200"
                                                                />}

                                                                {dtatr.idtipo == 4 && <CSelect
                                                                    label={dtatr.nombre}
                                                                    name={`select_${dtatr.id}`}
                                                                    onChange={(e) => handleChangeAtributo(e, dtatr.id)}
                                                                    options={[
                                                                        { id: 0, text: 'Seleccione' },
                                                                        ...dtatr.listado.map(el => ({ id: el.id, text: el.nombre }))
                                                                    ]}
                                                                    value={dtatr.valor}
                                                                />}

                                                                {dtatr.idtipo == 2 && <CInput
                                                                    label={dtatr.nombre}
                                                                    name={`input_${dtatr.id}`}
                                                                    onChange={(e) => handleChangeAtributo(e, dtatr.id, dtatr.idtipo, dtatr.idforma)}
                                                                    onBlur={(e) => handleBlurAtributo(e, dtatr.id, dtatr.idtipo, dtatr.idforma)}
                                                                    modInput="text-end"
                                                                    placeholder={dtatr.idforma == 2 ? ("0.00") : ("0")}
                                                                    maxLength="18"
                                                                    value={dtatr.valor}
                                                                />}
                                                            </Col>
                                                        ))
                                                    }
                                                </div>}
                                                {item.idTipo == 3 && <div className="mb-2">


                                                    <CSelect
                                                        value={dataFilter.idDepartamento}
                                                        onChange={e => handleChange(e)}
                                                        name="idDepartamento"
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataDepartamento.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                                        label="Departamento"
                                                        mod="mb-3"
                                                    />
                                                    <CSelect
                                                        value={dataFilter.idProvincia}
                                                        onChange={e => handleChange(e)}
                                                        name="idProvincia"
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataProvincia.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                                        label="Provincia"
                                                        mod="mb-3"
                                                    />
                                                    <CSelect
                                                        value={dataFilter.idDistrito}
                                                        onChange={e => handleChange(e)}
                                                        name="idDistrito"
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataDistrito.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                                        label="Distrito"
                                                        mod="mb-3"
                                                    />

                                                </div>}
                                            </div>
                                        </Accordion.Collapse>
                                    </div>
                                ))
                            }
                        </Accordion>
                        <div className="c-filter d-flex justify-content-center gap-2">
                            <CButton onClick={handleCleanFilter} type="reset" className="">
                                <Icon h="24" className="mr-2" children="restart_alt" />
                                    Limpiar
                                </CButton>

                            {appContext.permisos.esUsuarioConsultar && <CButton type="submit" className="c-button--blue">
                                <Icon children="search" className="mr-2" h="24" />
                                        Buscar
                                    </CButton>}

                        </div>
                    </form>
                </div>
                <div className="c-filter col-lg-9 ps-lg-2 col-sm-12 c-filter">
                    <span className="title--20 u-text--bold u-text--gray-90">Resultados de búsqueda</span>
                    <hr className="mt-2 mb-3 u-text--gray-60" />
                    <div className='col-lg-12 ps-lg-2 col-sm-12'>

                        <div className="d-md-flex justify-content-between mb-3">
                            <div onSubmit={handleSubmit(handleBuscar)} className="flex gap-2 px-2 w-100">

                                <div className="d-flex justify-content-end col-lg-12 gap-2 p-0">

                                    {appContext.permisos.esUsuarioExportar && <CButton type="button" className="c-button--green" onClick={handleExportar}>
                                        <Icon children="download" className="mr-2" h="24" />
                                        Exportar
                                    </CButton>}

                                    <CSwitch
                                        onChange={e => handleShowList(e)}
                                        mapa
                                    />
                                </div>
                            </div>
                        </div>

                        {showList && <div className="c-table c-table-nowraped">

                            <div className="c-table__container c-table__container--nowrapper">
                                <table className="c-table__container--content mb-2">
                                    <thead>
                                        <tr>
                                            <th scope="c-table__options">

                                            </th>
                                            <th scope="col">
                                                <label className="c-checkbox justify-content-center">
                                                    <input name="checkGeneral" className=" c-checkbox__input"
                                                        type="checkbox"
                                                        checked={checkGeneral}
                                                        onChange={(e) => handleChange(e)} />
                                                    <span className="c-checkbox__icon"></span>
                                                </label>
                                            </th>
                                            <th scope="col">
                                                <div className="text-center u-text--bold flex align-center justify-center" onClick={() => { setOrderDir('codigo') }}>
                                                    Código
                                            {getOrderDir('codigo')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-center" onClick={() => { setOrderDir('tipobien') }}>
                                                    Tipo Bien
                                            {getOrderDir('tipobien')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-left" onClick={() => { setOrderDir('subtipobien') }}>
                                                    Sub Tipo Bien
                                            {getOrderDir('subtipobien')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-left" onClick={() => { setOrderDir('direccion') }}>
                                                    Dirección
                                            {getOrderDir('direccion')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-left" onClick={() => { setOrderDir('departamento') }}>
                                                    Departamento
                                            {getOrderDir('departamento')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-left" onClick={() => { setOrderDir('provincia') }}>
                                                    Provincia
                                            {getOrderDir('provincia')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-left" onClick={() => { setOrderDir('distrito') }}>
                                                    Distrito
                                            {getOrderDir('distrito')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-end align-right" onClick={() => { setOrderDir('precio') }}>
                                                    Precio
                                            {getOrderDir('precio')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-end align-right" onClick={() => { setOrderDir('preciounitario') }}>
                                                    Precio Unitario
                                            {getOrderDir('preciounitario')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-center flex align-center justify-center" onClick={() => { setOrderDir('fechacreacion') }}>
                                                    Fecha Creación
                                            {getOrderDir('fechacreacion')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-left flex align-center" onClick={() => { setOrderDir('usuariocreacion') }}>
                                                    Usuario Creación
                                            {getOrderDir('usuariocrecion')}
                                                </div>
                                            </th>
                                            <th scope="col">
                                                <div className="text-center flex align-center justify-center" onClick={() => { setOrderDir('estado') }}>
                                                    Estado
                                            {getOrderDir('estado')}
                                                </div>
                                            </th>

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
                                                    data.map((item) => {
                                                        return (
                                                            <tr key={item.id}>
                                                                <td className="c-table__options text-centers">
                                                                    <Dropdown drop="up">
                                                                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
                                                                        <Dropdown.Menu>
                                                                            {appContext.permisos.esUsuarioExportar && <Dropdown.Item onClick={(ev) => handleSingleExportar(ev, item.id)} eventKey="1">Exportar</Dropdown.Item>}
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </td>
                                                                <td className="c-table__options text-centers">
                                                                    <label className="c-checkbox justify-content-center">
                                                                        <input name="selectMenu" className=" c-checkbox__input"
                                                                            type="checkbox"
                                                                            checked={item.seleccionado}
                                                                            onChange={(e) => handleCheck(item.id, e)} />
                                                                        <span className="c-checkbox__icon"></span>
                                                                    </label>
                                                                </td>
                                                                <td className="text-center u-text--regular u-text--bold" style={{ width: "80px" }}>{item.codigo}</td>
                                                                <td className="text-left">{item.tipobien}</td>
                                                                <td className="text-left">{item.subtipobien}</td>

                                                                <td className="text-left">{item.direccion}</td>
                                                                <td className="text-left">{item.departamento}</td>
                                                                <td className="text-left">{item.provincia}</td>
                                                                <td className="text-left">{item.distrito}</td>
                                                                <td className="text-end text-nowrap">{`${item.monedaabreviatura} ${formatMonedaNumber(item.precio, 2)}`}</td>
                                                                <td className="text-end text-nowrap">{`${item.monedaabreviatura} ${formatMonedaNumber(item.preciounitario, 2)}`}</td>
                                                                <td className="text-center u-text--regular">{item.fechacreacion}</td>
                                                                <td className="text-left u-text--regular">{item.usuariocreacion}</td>
                                                                <td className="text-center " style={{ width: "150px" }}><div className={`c-card--estado c-card--estado-${item.idestado == 1 ? 'active' : 'inactive'}`}>{item.estado}</div></td>
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

                        {showList == false && <div className="c-map">
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyBA4H51ZoEeWOmGbjXhwI3wj40J4_vi1p8' }}
                                // defaultCenter={dataMapa ? {lat: Number(dataMapa.latitud), lng: Number(dataMapa.longitud)} : '0'}
                                defaultCenter={{ lat: -9.9795706, lng: -74.070984 }}
                                onChange={handleChangeDataMap}
                                // defaultZoom={ID ? 15 : 6}
                                defaultZoom={5}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            >
                                {
                                    data.map(item => (
                                        item.visible && <MarkerComponent
                                            lat={item.latitud}
                                            lng={item.longitud}
                                            codigo={item.codigo}
                                            ubigeo={`${item.departamento}, ${item.provincia}, ${item.distrito}`}
                                            tipoBien={`${item.tipobien}, ${item.subtipobien}`}
                                            precio={`${item.monedaabreviatura} ${formatMonedaNumber(item.precio, 2)}`}
                                            precioUnitario={`${item.monedaabreviatura} ${formatMonedaNumber(item.preciounitario, 2)}`}
                                            color={item.colormarcador}
                                        />)
                                    )
                                }

                            </GoogleMapReact>
                            <div className="text-end u-text--gray-90 paragraph--14 u-tex--bold">Se encontraron {pagination.total} resultados</div>
                        </div>}
                    </div>
                    <div>
                    </div>
                </div>

            </div>
        )
    }
    Global.View = ViewIntl;
})()
