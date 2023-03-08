(function () {
    const { CInput, CAutoComplete, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CSwitch, CFlags, CPagination, handleError, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas, Row, Col } = ReactBootstrap;
    const { requiredMessage, patterns, minValueMessage, maxValueMessage } = Utils
    const { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = CChart;
    const { useForm, Controller } = ReactHookForm;

    //let ID = document.querySelector('#id').value;

    const CPrincipal = forwardRef(({ id, onSetId}, ref) => {

        const appContext = useContext(AppContext)

        const [allDisabled, setAllDisabled] = useState(false)

        let smart = {
            urlContext: '/Proceso/Trabajo',
            urlGetSingle: '/GetPrincipalSingle',
            urlGetUbigueoList: '/GetUbigueoList',
            urlGetDataList: '/GetDataList',
            urlGetCampoList: '/GetCampoList',
            urlGetClientList: '/GetClientList',
            urlGetProductosList: '/GetProductosList',
            urlGetSubProductosList: '/GetSubProductosList',
            urlGetTasacionList: '/GetTasacionList',
            urlGetTipoTasacionList: '/Administracion/TipoTasacion/GetTasacionList',
            urlGetSubTasacionList: '/GetSubTasacionList',
            urlGetTipoBienList: '/GetTipoBienList',
            urlGetSubTipoBienList: '/GetSubTipoBienList',
            urlGetColaboradorList: '/GetColaboradorList',
            urlGetRolesNegocioSeccion: '/GetRolesNegocioSeccion',
            urlSave: '/SavePrincipal'
        }

        const { register, formState: { errors }, handleSubmit, setValue, getValues, setError, clearErrors, control, watch } = useForm();

        const [render, setRender] = useState(false)
        const [renderDataMapa, setRenderDataMapa] = useState(false)
        const [renderPermiso, setRenderPermiso] = useState(false)
        const [renderSingle, setRenderSingle] = useState(false)

        const [listaSecciones, setListaSecciones] = useState([])

        const [codigo, setCodigo] = useState('')

        const [departamentos, setDepartamentos] = useState([])
        const [provincia, setProvincia] = useState([])
        const [distrito, setDistrito] = useState([])
        const [dataMapa, setDataMapa] = useState({})

        const [documento, setDocumento] = useState([])

        const [campos, setCampos] = useState([])

        const [dataTipoTasacion, setDataTipoTasacion] = useState([])
        const [dataSubTipoTasacion, setDataSubTipoTasacion] = useState([])

        const [clientes, setClientes] = useState([])
        const [productos, setProductos] = useState([])
        const [subProductos, setSubProductos] = useState([])
        const [tipoServicio, setTipoServicio] = useState([])
        const [tasacion, setTasacion] = useState([])
        const [subTasacion, setSubTasacion] = useState([])
        const [tipoBien, setTipoBien] = useState([])
        const [subTipoBien, setSubTipoBien] = useState([])
        const [tipoVisita, setTipoVisita] = useState([])
        const [formaPago, setFormaPago] = useState([])
        const [facturarA, setFacturarA] = useState([])
        const [colaboradores, setColaboradores] = useState([])

        const [esImpresion, setEsImpresion] = useState(false)
        const [esCobroAnticipado, setEsCobroAnticipado] = useState(false)
        const [estadoFacturacion, setEstadoFacturacion] = useState([])
        const [esUrgente, setEsUrgente] = useState(false)

        const [idEstado, setidEstado] = useState(1)

        const [mostrarCampoEspecial, setMostrarCampoEspecial] = useState(true)


        const [s_buttonSave, setS_buttonSave] = useState(false)

        const [l_save, setL_save] = useState(false)
        const [l_saveAsignar, setL_saveAsignar] = useState(false)

        const [changeData, setChangeData] = useState({
            idTipoDocumento: false,
            idTipoDocumento_value: 0
        })

        let IdTipoTasacionComercial = document.querySelector('#idTipoTasacionComercial').value;

        useImperativeHandle(ref, () => ({
            init() {

                setRender(false);
                setRenderPermiso(false);
                setS_buttonSave(false);

                //setDataMapa({ latitud: "-10.908975", longitud: "-76.130546" })

                if (render) {
                    setRender(false)
                } else {
                    let listarSeccion = listarSecciones()
                    let menuPermiso = appContext.menuPermiso("proceso/trabajo")

                    setRender(true);

                    axios.all([
                        listarSeccion,
                        menuPermiso
                    ]).then(response => {


                        let listarDepartamentos = buscarUbigeo(1, '');
                        let listarDocumento = listarPorCodigo('1000');
                        let listarCampos = campoBuscar('1,2');
                        let listarClientes = listarCliente();
                        let listarTipoServicio = listarPorCodigo('2700');
                        let listarTipoVisita = listarPorCodigo('2100');
                        let listarBienes = listarTipoBien()
                        let listarFormadePago = listarPorCodigo('2600');
                        let listarFacturarA = listarPorCodigo('2500');
                        let listarEstadoFacturacion = listarPorCodigo('1800');
                        let listarColaboradores = listarColaborador("1,5,6,2,7,8")
                        let listarTipoTasacion = tipoTasacionBuscar();

                        axios.all([
                            listarDepartamentos,
                            listarDocumento,
                            listarCampos,
                            listarClientes,
                            listarTipoServicio,
                            listarTipoVisita,
                            listarBienes,
                            listarFormadePago,
                            listarFacturarA,
                            listarEstadoFacturacion,
                            listarColaboradores,
                            listarTipoTasacion
                        ])
                            .then(response => {
                                setRenderPermiso(true)
                            }).
                            catch(error => {
                                setRenderPermiso(true);
                                console.log("error");
                            });
                    }).catch(error => {
                        console.log("error");
                    });
                }
            }
        }));

        useEffect(() => {
            if (renderPermiso) {
                if (id) {
                    setS_buttonSave(appContext.permisos.esUsuarioEditar)
                    getSingle(id)
                } else {
                    setS_buttonSave(appContext.permisos.esUsuarioConsultar)

                    if (!appContext.permisos.esUsuarioCrear) {
                        setAllDisabled(true);
                    }

                    setDataMapa({ latitud: "-10.908975", longitud: "-76.130546" })
                }
            }
        }, [renderPermiso])

        useEffect(() => {
            if (renderSingle) {
                setRenderSingle(false);
            }
        }, [renderSingle])


        const getSingle = (idPedido) => {
            let params = {
                id: idPedido,
                tipo: 2
            }

            let buscar = AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setAllDisabled(true);
                        }

                        if (!appContext.permisos.esUsuarioEditar) {
                            setAllDisabled(true);
                        }

                        let dataSetAllValues = data.data;

                        for (a in dataSetAllValues) {
                            if (
                                a === 'latitud' ||
                                a === 'longitud' ||
                                a === 'esImpresion' ||
                                a === 'idClienteProducto' ||
                                a === 'idClienteSubProducto' ||
                                a === 'idSubTipoBien' ||
                                a === 'esCobroAnticipado' ||
                                a === 'estadoFacturacion' ||
                                a === 'esUrgente' ||
                                a === 'tipoRol' ||
                                a === 'equipo'
                            ) {
                                ''
                            } else {

                                if (a === 'idTipoTasacion') {
                                    let dataSubTipoTasacionTemp = new Array();

                                    dataTipoTasacion
                                        .filter(tt => tt.id === dataSetAllValues[a])
                                        .map(tt => {
                                            tt.subTiposTasacion.map(stt => {
                                                dataSubTipoTasacionTemp.push({
                                                    ...stt, key: generateId()
                                                });
                                            })
                                        })

                                    setDataSubTipoTasacion(dataSubTipoTasacionTemp);
                                }

                                setValue(a, dataSetAllValues[a])
                            }
                        }

                        setCodigo(dataSetAllValues.registro)

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setValue("departamento", dataSetAllValues.departamento)
                            setValue("provincia", dataSetAllValues.provincia)
                            setValue("distrito", dataSetAllValues.distrito)

                        }
                        else {
                            buscarUbigeo(2, dataSetAllValues.idDepartamento, true, dataSetAllValues.idProvincia)
                            buscarUbigeo(3, dataSetAllValues.idProvincia, true, dataSetAllValues.idDistrito)
                        }



                        if (!(dataSetAllValues.latitudDatoInforme.length == 0 && dataSetAllValues.longitudDatoInforme.length == 0)) {
                            setDataMapa({ latitud: dataSetAllValues.latitudDatoInforme, longitud: dataSetAllValues.longitudDatoInforme })
                        }
                        else {
                            setDataMapa({ latitud: dataSetAllValues.latitud, longitud: dataSetAllValues.longitud })
                        }

                        setEsImpresion(dataSetAllValues.esImpresion)

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setValue("tipoServicio", dataSetAllValues.tipoServicio);
                            setValue("tipoTasacion", dataSetAllValues.tipoTasacion);
                            setValue("subTipoTasacion", dataSetAllValues.subTipoTasacion);
                            setValue("clienteProducto", dataSetAllValues.clienteProducto);
                            setValue("clienteSubProducto", dataSetAllValues.clienteSubProducto);

                            setValue("formaPago", dataSetAllValues.formaPago);
                            setValue("facturar", dataSetAllValues.facturar);
                        }
                        else {
                            if (dataSetAllValues.idTipoServicio == 1) {
                                //listarTasacion(dataSetAllValues.idCliente, true, dataSetAllValues.idTipoTasacion)
                                //listarSubTasacion(dataSetAllValues.idClienteProducto, dataSetAllValues.idTipoTasacion, true, dataSetAllValues.idSubTipoTasacion)

                                listarProductos(dataSetAllValues.idCliente, dataSetAllValues.idSubTipoTasacion, true, dataSetAllValues.idClienteProducto)
                                listarSubProductos(dataSetAllValues.idClienteProducto, true, dataSetAllValues.idClienteSubProducto)

                                listarSubTipoBien(dataSetAllValues.idTipoBien, true, dataSetAllValues.idSubTipoBien)

                                /*Veriticar si es Cliente Particular*/
                                let esParticular = false;
                                let mostrarCampoEspecial = true;

                                clientes.filter(cli => cli.id === dataSetAllValues.idCliente).forEach(cli => {
                                    esParticular = cli.esparticular;
                                });

                                if (esParticular) {
                                    mostrarCampoEspecial = false;
                                }

                                setMostrarCampoEspecial(mostrarCampoEspecial);
                            }
                        }

                        setEsCobroAnticipado(dataSetAllValues.esCobroAnticipado)

                        setValue('fechaInicio', moment(dataSetAllValues.fechaInicio, 'DD-MM-YYYY').format('YYYY-MM-DD'))

                        setEsUrgente(dataSetAllValues.esUrgente)

                        let equipo = dataSetAllValues.equipo

                        equipo.map(item => {
                            if (item.idTipo == 1) {
                                setValue('idInspector', item.idUsuario)
                                setValue('inspector', item.usuario)
                            }
                            if (item.idTipo == 2) {
                                setValue('idSegundoinspector', item.idUsuario)
                                setValue('segundoinspector', item.usuario)
                            }
                            if (item.idTipo == 3) {
                                setValue('idRevisor', item.idUsuario)
                                setValue('revisor', item.usuario)
                            }
                            if (item.idTipo == 4) {
                                setValue('idSegundorevisor', item.idUsuario)
                                setValue('segundorevisor', item.usuario)
                            }
                            if (item.idTipo == 5) {
                                setValue('idVisador', item.idUsuario)
                                setValue('visador', item.usuario)
                            }
                            if (item.idTipo == 6) {
                                setValue('idSeguimiento', item.idUsuario)
                                setValue('seguimiento', item.usuario)
                            }
                        })

                        let e = _data => _data ? true : false

                        setChangeData({
                            ...changeData,
                            idTipoDocumento: e(dataSetAllValues.idTipoDocumento),
                            idTipoDocumento_value: dataSetAllValues.idTipoDocumento
                        })

                        setidEstado(dataSetAllValues.idEstado)

                        if (!(dataSetAllValues.idTipoRol == 1 || dataSetAllValues.idTipoRol == 3)) {
                            if (dataSetAllValues.idEstado > 1) {
                                setAllDisabled(true);
                            }
                        }
                    }
                    else {
                        setAllDisabled(true);
                    }

                    setRenderSingle(true);

                }).catch((error) => {
                    setAllDisabled(true);
                    handleError(error);
                });

            return buscar
        }

        const listarSecciones = () => {

            let listarClientes = AXIOS.get(`${smart.urlContext}${smart.urlGetRolesNegocioSeccion}`)
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        let lista = data.data.map(item => {
                            return {
                                id: item.id,
                                nombre: item.nombre,
                                key: generateId()
                            }
                        })

                        setListaSecciones(lista)
                    }
                    else {
                        setListaSecciones([]);
                    }
                })
                .catch((error) => {
                    setListaSecciones([]);
                });

            return listarClientes;
        }

        const listarCliente = () => {

            let listarClientes = AXIOS.get(`${smart.urlContext}${smart.urlGetClientList}`)
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setClientes(data.data)
                    }
                    else {
                        setClientes(data.data)
                    }
                })
                .catch((error) => {
                    setClientes([])
                });

            return listarClientes;
        }

        const listarPorCodigo = (codigo) => {
            let params = {
                codigo: codigo
            };

            let listarPorCodigo =
                AXIOS.get(`${smart.urlContext}${smart.urlGetDataList}`, { params })
                    .then(({ data }) => {
                        if (data.apiEstado == "ok") {
                            if (codigo == '1000') { setDocumento(data.data) }
                            else if (codigo == '2100') { setTipoVisita(data.data) }
                            else if (codigo == '2700') { setTipoServicio(data.data) }
                            else if (codigo == '2500') { setFacturarA(data.data) }
                            else if (codigo == '1800') { setEstadoFacturacion(data.data) }
                            else if (codigo == '2600') { setFormaPago(data.data) }
                        }
                        else {
                            if (codigo == '1000') { setDocumento([]) }
                            else if (codigo == '2100') { setTipoVisita([]) }
                            else if (codigo == '2700') { setTipoServicio([]) }
                            else if (codigo == '2500') { setFacturarA([]) }
                            else if (codigo == '1800') { setEstadoFacturacion([]) }
                            else if (codigo == '2600') { setFormaPago([]) }
                        }
                    })
                    .catch((error) => {
                        if (codigo == '1000') { setDocumento([]) }
                        else if (codigo == '2100') { setTipoVisita([]) }
                        else if (codigo == '2700') { setTipoServicio([]) }
                        else if (codigo == '2500') { setFacturarA([]) }
                        else if (codigo == '1800') { setEstadoFacturacion([]) }
                        else if (codigo == '2600') { setFormaPago([]) }
                    });

            return listarPorCodigo;

        }

        const campoBuscar = (idTipos) => {
            let params = {
                idTipos: idTipos
            };

            let campoListar =
                AXIOS.get(`${smart.urlContext}${smart.urlGetCampoList}`, { params })
                    .then(({ data }) => {
                        if (data.apiEstado == "ok") {

                            let dataCampos = data.data.map(dt => {
                                return { ...dt, id: generateId(), label: dt.nombre }
                            })

                            setCampos(dataCampos);
                        }
                        else {
                            setCampos([]);
                        }
                    })
                    .catch((error) => {
                        setCampos([]);
                    });

            return campoListar;
        }

        const listarProductos = (_idcliente, _idtipotasacion, id, setValueCode) => {

            let params = {
                idcliente: _idcliente,
                idtipotasacion: _idtipotasacion
            };

            let listarProductos = AXIOS.get(`${smart.urlContext}${smart.urlGetProductosList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (id) {
                            setProductos(data.data)
                            setValue('idClienteProducto', setValueCode)
                        } else {
                            setProductos(data.data)
                        }
                    }
                    else {
                        setProductos([])
                    }
                })
                .catch((error) => {
                    setProductos([])
                });

            return listarProductos;
        }

        const listarSubProductos = (_idclienteproducto, id, setValueCode) => {

            let params = {
                idclienteproducto: _idclienteproducto

            };

            let listarSubProductos = AXIOS.get(`${smart.urlContext}${smart.urlGetSubProductosList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (id) {
                            setSubProductos(data.data)
                            setValue('idClienteSubProducto', setValueCode)
                        } else {
                            setSubProductos(data.data)
                        }
                    }
                    else {
                        setSubProductos([])
                    }
                })
                .catch((error) => {
                    setSubProductos([])
                });

            return listarSubProductos;
        }


        const tipoTasacionBuscar = () => {

            let params = {
                ordenamiento: 'tipotasacion asc',
                pagina: 0
            }

            let listarTipoTasacion = AXIOS.get(`${smart.urlGetTipoTasacionList}`, { params })
                .then(({ data: tasacion }) => {

                    if (tasacion.apiEstado == "ok") {
                        let tasacionClonada = tasacion.data.map(tt => {

                            let subTiposTasacion = tt.subTiposTasacion.map(stt => {

                                return {
                                    ...stt,
                                    seleccionado: false
                                }
                            })

                            return {
                                ...tt,
                                seleccionado: false,
                                subTiposTasacion: subTiposTasacion,
                                visible: false
                            }
                        })

                        setDataTipoTasacion(tasacionClonada)
                    }
                    else {
                        setDataTipoTasacion([])
                    }
                })
                .catch((error) => {
                    setDataTipoTasacion([])
                });

            return listarTipoTasacion;
        }

        const listarTasacion = (_idCliente, id, setValueCode) => {

            let params = {
                idCliente: _idCliente

            };

            let listartasa = AXIOS.get(`${smart.urlContext}${smart.urlGetTasacionList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (id) {
                            setTasacion(data.data)
                            setValue('idTipoTasacion', setValueCode)
                        } else {
                            setTasacion(data.data)
                        }
                    }
                    else {
                        setTasacion([])
                    }
                })
                .catch((error) => {
                    setTasacion([])
                });

            return listartasa;
        }

        const listarSubTasacion = (_idclienteproducto, _idtipotasacion, id, setValueCode) => {

            let params = {
                idclienteproducto: _idclienteproducto,
                idtipotasacion: _idtipotasacion,
            };

            let listarsubtasa = AXIOS.get(`${smart.urlContext}${smart.urlGetSubTasacionList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (id) {
                            setSubTasacion(data.data)
                            setValue('idSubTipoTasacion', setValueCode)
                        } else {
                            setSubTasacion(data.data)
                        }
                    }
                    else {
                        setSubTasacion([])
                    }
                })
                .catch((error) => {
                    setSubTasacion([])
                });

            return listarsubtasa;
        }

        const listarTipoBien = () => {

            let params = {
            };

            let listarbien = AXIOS.get(`${smart.urlContext}${smart.urlGetTipoBienList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setTipoBien(data.data)
                    }
                    else {
                        setTipoBien([])
                    }
                })
                .catch((error) => {
                    setTipoBien([])
                });

            return listarbien;
        }

        const listarSubTipoBien = (id, value, setValueCode) => {

            let params = {
                texto: '',
                id: id,
                ordenamiento: '',
                pagina: 0
            };

            let listarsubbien = AXIOS.get(`${smart.urlContext}${smart.urlGetSubTipoBienList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (value) {
                            setSubTipoBien(data.data)
                            setValue('idSubTipoBien', setValueCode)
                        } else {
                            setSubTipoBien(data.data)
                        }
                    }
                    else {
                        setSubTipoBien([])
                    }
                })
                .catch((error) => {
                    setSubTipoBien([])
                });

            return listarsubbien;
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
                        setColaboradores(data.data);
                    }
                    else {
                        setColaboradores([]);
                    }
                })
                .catch((error) => {
                    setColaboradores([]);
                });

            return listarColaboradores;
        }

        const buscarUbigeo = (tipo, codigo, id, setValueCode) => {

            let params = {
                tipo: tipo,
                codigo: codigo,
                ordenamiento: 'nombre asc'
            };

            let listarUbigeo = AXIOS.get(`${smart.urlContext}${smart.urlGetUbigueoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (id) {
                            if (tipo == 2) {
                                setProvincia(data.data)
                                setValue('idProvincia', setValueCode)
                            }
                            else if (tipo == 3) {
                                setDistrito(data.data)
                                setValue('idDistrito', setValueCode)
                            }
                        }
                        else {
                            if (tipo == 1) {
                                setDepartamentos(data.data)
                            }
                            else if (tipo == 2) {
                                setProvincia(data.data)
                            }
                            else if (tipo == 3) {
                                setDistrito(data.data)
                            }
                        }
                    }
                    else {
                        if (tipo == 1) { setDepartamentos([]) }
                        else if (tipo == 2) { setProvincia([]) }
                        else if (tipo == 3) { setDistrito([]) }
                    }
                })
                .catch((error) => {
                    if (tipo == 1) { setDepartamentos([]) }
                    else if (tipo == 2) { setProvincia([]) }
                    else if (tipo == 3) { setDistrito([]) }
                });

            return listarUbigeo;
        };

        const handleSave = (data, e) => {
            // console.log(data.fechaInicio, moment(data.fechaInicio, 'YYYY-MM-DD').format("DD/MM/YYYY"))
            // console.log("envío", moment(dataFecha).format("DD/MM/YYYY"))

            let estado = e.target.id
            let fecha = moment(data.fechaInicio, 'YYYY-MM-DD').format("DD/MM/YYYY")

            let oData = {
                id: id,
                estado: estado ? 2 : 1,
                idContenedor: 2,
                idUbigeo: data.idDistrito,
                direccion: data.direccion,
                referencia: data.referencia,
                latitud: dataMapa.latitud,
                longitud: dataMapa.longitud,
                solicitante: data.solicitante,
                idTipoDocumento: data.idTipoDocumento,
                documento: data.documento,
                idCliente: data.idCliente,
                numeroSolicitud: data.numeroSolicitud,
                numeroGarantia: data.numeroGarantia,
                esImpresion: esImpresion,
                oficina: data.oficina,
                oficinaDestino: data.oficinaDestino,
                funcionario: data.funcionario,
                funcionarioDestino: data.funcionarioDestino,
                idTipoServicio: data.idTipoServicio,
                idTipoTasacion: data.idTipoTasacion,
                idSubTipoTasacion: data.idSubTipoTasacion,
                idClienteProducto: data.idClienteProducto,
                idClienteSubProducto: data.idClienteSubProducto,
                idTipoBien: data.idTipoBien,
                idSubTipoBien: data.idSubTipoBien,
                idTipoVisita: data.idTipoVisita,
                placa: "",
                marca: "",
                modelo: "",
                idFormaPago: data.idFormaPago,
                montoCotizado: data.montoCotizado ? data.montoCotizado : '0',
                pagoCuenta: data.pagoCuenta ? data.pagoCuenta : '0',
                idFacturar: data.idFacturar,
                razonSocialFacturacion: data.razonSocialFacturacion,
                rucFacturacion: data.rucFacturacion,
                correoReceptor: data.correoReceptor,
                esCobroAnticipado: esCobroAnticipado,
                idEstadoFacturacion: data.idEstadoFacturacion,
                contacto: data.contacto,
                contactoCorreo: data.contactoCorreo,
                contactoTelefono: data.contactoTelefono,
                fechaInicio: fecha,
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                esUrgente: esUrgente,
                observacion: data.observacion,
                equipo:
                    [
                        {
                            idUsuario: data.idInspector ? data.idInspector : '',
                            idTipo: 1
                        },
                        {
                            idUsuario: data.idSegundoinspector ? data.idSegundoinspector : '',
                            idTipo: 2
                        },
                        {
                            idUsuario: data.idRevisor ? data.idRevisor : '',
                            idTipo: 3
                        },
                        {
                            idUsuario: data.idSegundorevisor ? data.idSegundorevisor : '',
                            idTipo: 4
                        },
                        {
                            idUsuario: data.idVisador ? data.idVisador : '',
                            idTipo: 5
                        },
                        {
                            idUsuario: data.idSeguimiento ? data.idSeguimiento : '',
                            idTipo: 6
                        }
                    ]
            }

            if (!estado) {
                setL_save(true)
                save(oData, estado)
            } else {
                setL_saveAsignar(true)
                swal({
                    title: "¿Desea guardar y asignar?",
                    icon: "info",
                    buttons: true,
                    dangerMode: true
                }).then((willDelete) => {
                    if (willDelete) {
                        save(oData, estado)
                    } else {
                        setL_saveAsignar(false)
                    }
                }).catch(error => {

                })
            }
        }

        const save = (_oData, estado) => {
            AXIOS.post(smart.urlContext + smart.urlSave, _oData)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })

                        let idPedido = id;

                        if (!id) {
                            setCodigo(data.codigo)
                            //ID = data.id
                            onSetId(data.id);
                            idPedido = data.id;
                        }


                        estado ? setL_saveAsignar(false) : setL_save(false)

                        getSingle(idPedido);

                    } else {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })
                        estado ? setL_saveAsignar(false) : setL_save(false)
                    }
                })
                .catch(error => {
                    handleError(error);
                    estado ? setL_saveAsignar(false) : setL_save(false)
                })
        }

        const handleShow = (e) => {

            let nombre = e.target.name

            if (nombre == 'esImpresion') {
                setEsImpresion(!esImpresion)
                setValue('oficinaDestino', '')
                setValue('funcionarioDestino', '')
            } else if (nombre == 'esCobroAnticipado') {
                setEsCobroAnticipado(!esCobroAnticipado)
            } else if (nombre == 'esUrgente') {
                setEsUrgente(!esUrgente)
            }

        }

        const selectAutocomplete = (e, name) => {
            value = e;
            setValue(name, value);
        }

        const handleChangeDataMap = ({ x, y, lat, lng, event }) => {
            let pushData = { ...dataMapa, longitud: lng.toString(), latitud: lat.toString() }


            setDataMapa(pushData)
        }


        const MarkerComponent = () => (
            <div style={{
                color: 'white',
                display: 'inline-flex',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '100%',
                transform: 'translate(-50%, -100%)'
            }}>
                <svg width="19" height="34" viewBox="0 0 19 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.9234 28.8584C8.90198 25.0532 5.85357 20.1701 4.03309 17.6C3.73325 17.1788 3.37629 16.729 2.91939 16.2007C2.59099 15.8223 2.29114 15.4154 2.03413 14.9942L1.96988 14.8871C1.18458 13.5521 0.770508 12.0243 0.770508 10.468C0.770508 5.6562 4.68989 1.73682 9.50167 1.73682C9.65873 1.73682 9.82293 1.74396 9.98713 1.75109C14.5205 1.99383 18.14 5.74187 18.2328 10.2824C18.2685 11.9029 17.8545 13.5021 17.0335 14.8871L16.9692 14.9942C16.6408 15.5296 16.2553 16.0365 15.8198 16.4934C15.4129 16.9218 15.0702 17.3215 14.7775 17.7213C12.8999 20.27 9.7444 25.1032 9.73012 28.8584H8.9234ZM9.50167 6.78419C7.85967 6.78419 6.52465 8.1192 6.52465 9.7612C6.52465 11.4032 7.85967 12.7382 9.50167 12.7382C11.1437 12.7382 12.4787 11.4032 12.4787 9.7612C12.4787 8.1192 11.1437 6.78419 9.50167 6.78419Z" fill="#FB003A" />
                    <path d="M9.50186 2.13631C9.65178 2.13631 9.80884 2.14345 9.95877 2.15059C14.2851 2.38618 17.7333 5.95575 17.8261 10.2892C17.8618 11.8955 17.4406 13.4019 16.6838 14.6798C16.3554 15.2366 15.9699 15.7435 15.5344 16.2075C15.1489 16.6073 14.7848 17.0285 14.4564 17.4712C12.3004 20.3982 9.3448 25.0815 9.33052 28.851C9.30911 25.0387 6.43203 20.284 4.36882 17.3641C4.01901 16.8643 3.62635 16.3932 3.22656 15.9363C2.89102 15.5507 2.58404 15.1295 2.32703 14.6869C1.59884 13.4518 1.18477 12.0097 1.18477 10.4677C1.17049 5.87008 4.90426 2.13631 9.50186 2.13631ZM9.50186 13.1377C11.3652 13.1377 12.8787 11.6242 12.8787 9.76091C12.8787 7.89759 11.3652 6.3841 9.50186 6.3841C7.63855 6.3841 6.12505 7.89759 6.12505 9.76091C6.12505 11.6242 7.63855 13.1377 9.50186 13.1377ZM9.50186 1.32959C7.06028 1.32959 4.76862 2.27909 3.04095 4.00677C1.32041 5.73444 0.36377 8.0261 0.36377 10.4677C0.36377 12.0954 0.799257 13.6946 1.62026 15.0938L1.74162 15.3009H1.74876C2.00577 15.7078 2.29848 16.1005 2.6126 16.4646C3.06236 16.9857 3.41218 17.4212 3.70489 17.8281C5.49681 20.3697 8.50238 25.1672 8.5238 28.8581H10.1301C10.1444 26.1595 11.9078 22.283 15.0989 17.9566C15.3774 17.5783 15.7129 17.1856 16.1056 16.7715C16.5339 16.3218 16.9194 15.8292 17.2478 15.3009H17.255L17.3763 15.0938C18.233 13.6375 18.6685 11.974 18.6328 10.2749C18.5329 5.5274 14.742 1.60088 10.0016 1.35101C9.8374 1.33673 9.66606 1.32959 9.50186 1.32959ZM9.50186 12.331C8.08117 12.331 6.93177 11.1745 6.93177 9.76091C6.93177 8.34022 8.08831 7.19082 9.50186 7.19082C10.9226 7.19082 12.072 8.34736 12.072 9.76091C12.072 11.1816 10.9226 12.331 9.50186 12.331Z" fill="black" />
                    <path d="M18.9972 10.2671C18.8973 5.31972 14.9565 1.24327 10.0233 0.979122C9.85201 0.971983 9.67353 0.964844 9.50219 0.964844C4.26206 0.964844 0 5.22691 0 10.467C0 12.1661 0.449765 13.8224 1.30646 15.2788L1.38499 15.4073L1.39213 15.4145C1.67056 15.8714 1.99182 16.3068 2.34164 16.7138C2.78426 17.2207 3.12694 17.649 3.41251 18.0488C6.37525 22.2395 8.05294 25.9804 8.15289 28.629C8.16003 28.8503 8.17431 29.0716 8.19573 29.2929L8.48843 32.7483C8.52413 33.2052 8.90964 33.555 9.36655 33.555C9.60214 33.555 9.80917 33.4622 9.96623 33.3194C10.1233 33.1695 10.2304 32.9696 10.2447 32.734L10.5088 28.8646C10.5231 26.2374 12.2579 22.4465 15.4063 18.1773C15.6775 17.8132 15.9988 17.4348 16.3843 17.0279C16.8555 16.5353 17.2696 15.9927 17.6194 15.4145L17.6265 15.4073L17.7051 15.2788C18.5832 13.7653 19.0401 12.0305 18.9972 10.2671ZM16.6842 14.6863C16.3558 15.2431 15.9702 15.7571 15.5276 16.214C15.1421 16.6138 14.778 17.035 14.4496 17.4777C12.2936 20.4047 9.33799 25.088 9.32371 28.8574C9.30229 25.0451 6.42522 20.2905 4.36201 17.3706C4.01219 16.8708 3.61954 16.3997 3.21975 15.9428C2.88421 15.5572 2.57723 15.136 2.32022 14.6934C1.59203 13.4583 1.17796 12.0162 1.17796 10.4742C1.17796 5.87657 4.91172 2.1428 9.50933 2.1428C9.65925 2.1428 9.81631 2.14994 9.96623 2.15708C14.2925 2.39267 17.7408 5.96224 17.8336 10.2957C17.8621 11.8949 17.4409 13.4012 16.6842 14.6863Z" fill="black" />
                </svg>
            </div>
        );




        const inputValidator = (v, _case) => {
            switch (_case) {
                case 'documentoDNI':
                    if (changeData.idTipoDocumento_value == 1 && v.length != 8) {
                        return false
                    }
                    break
                case 'documentoRUC':
                    if (changeData.idTipoDocumento_value == 2 && v.length != 11) {
                        return false
                    }
                    break
                case 'documentoCEX':
                    if (changeData.idTipoDocumento_value == 3 && v.length != 12) {
                        return false
                    }
                    break
            }
        }

        const hourValidator = (horaFin, horaInicio) => {

            let inicio = moment(horaInicio, 'HH:mm')
            let fin = moment(horaFin, 'HH:mm')

            if (fin.diff(inicio) < 0) {
                return false
            } else {
                return true
            }

        }

        const dateValidator = (fecha) => {
            let now = moment();
            let date = moment(fecha)
            let difference = now.diff(date, 'days')

            if (idEstado == 1) {
                if (difference <= 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }

        }

        const timeValidator = (hora) => {

            let minTime = moment('7:00', 'h:mm');
            let maxTime = moment('20:00', 'h:mm');
            let currentTime = moment(hora, 'h:mm');

            let isValid = true;

            if (idEstado == 1) {
                if (currentTime.isBefore(minTime)) {
                    isValid = false;
                }

                if (currentTime.isAfter(maxTime)) {
                    isValid = false;
                }
            }

            return isValid;
        };

        return (
            <form onSubmit={handleSubmit(handleSave)}>
                <Row>
                    <Col lg="4" md="12" sm="12" className="flex align-center gap-2 mb-4">
                        <span className="u-text--gray-60">N° Trabajo</span>
                        <CInput maxLength="50" value={codigo} placeholder="Autogenerado" disabled={true}></CInput>
                    </Col>
                    <Col lg="8" md="12" sm="12" className="flex justify-flex-end gap-2 mb-4">
                        <a className="c-link" href="/Proceso/Trabajo">
                            <CButton type="button" className="c-button--red">
                                <Icon children="arrow_back" h="24" className="mr-2" />
                                Volver
                            </CButton>
                        </a>

                        {s_buttonSave && <CButton
                            disabled={allDisabled}
                            isLoading={l_save} type="submit" className="c-button">
                            <Icon children="save" h="24" className="mr-2" />
                            Guardar
                        </CButton>}

                        {s_buttonSave && <CButton
                            disabled={allDisabled}
                            id="segundo" isLoading={l_saveAsignar} onClick={handleSubmit(handleSave)} type="button" className="c-button--green">
                            <Icon children="check" h="24" className="mr-2" />
                            Guardar y Asignar
                        </CButton>}
                    </Col>
                </Row>
                <div>
                    {
                        listaSecciones.filter(item => item.id == 1).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{item.nombre}</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row className="mb-4">
                                    <Col lg="6" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ? (<CInput
                                            name="departamento"
                                            disabled={allDisabled}
                                            {...register("departamento", { required: false })}
                                            label="$Departamento"
                                        />) : (<CSelect
                                            mod="mb-2"
                                            label='Departamento'
                                            name="idDepartamento"
                                            {...register("idDepartamento", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Departamento es requerido'
                                                },
                                                onChange: (e => {
                                                    buscarUbigeo(2, e.target.value);
                                                    setValue('idProvincia', '')
                                                    setDistrito([])
                                                }),
                                                disabled: allDisabled,
                                            })}
                                            requerido="1"
                                            error={errors.idDepartamento?.message}
                                            options={[{ id: '', text: 'Seleccione' }, ...departamentos.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                        />)}

                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="provincia"
                                                disabled={allDisabled}
                                                {...register("provincia", { required: false })}
                                                label="Provincia"
                                            />)
                                            : (
                                                <CSelect
                                                    mod="mb-2"
                                                    label='Provincia'
                                                    name="idProvincia"
                                                    {...register("idProvincia", {
                                                        required: {
                                                            value: true,
                                                            message: 'El campo Provincia es requerido'
                                                        },
                                                        deps: ['idDepartamento'],
                                                        onChange: (e => {

                                                            buscarUbigeo(3, e.target.value);
                                                            setValue('idDistrito', '')
                                                            setDistrito([])
                                                        }),
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    error={errors.idProvincia?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...provincia.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                                />
                                            )
                                        }
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="distrito"
                                                disabled={allDisabled}
                                                {...register("distrito", { required: false })}
                                                label="Distrito"
                                            />)
                                            : (
                                                <CSelect
                                                    mod="mb-2"
                                                    label='Distrito'
                                                    name="idDistrito"
                                                    {...register("idDistrito", {
                                                        required: {
                                                            value: true, message: 'El campo Distrito es requerido'
                                                        },
                                                        deps: ['idProvincia'],
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    error={errors.idDistrito?.type === 'required' && "El campo Distrito es requerido"}
                                                    options={[{ id: '', text: 'Seleccione' }, ...distrito.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                                />
                                            )
                                        }


                                        <CInput
                                            mod="mb-2"
                                            label='Dirección'
                                            name="direccion"
                                            {...register("direccion", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Direccion es requerido'
                                                },
                                                maxLength: {
                                                    value: 120,
                                                    message: maxValueMessage('maxlength', 120)
                                                },
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.direccion?.message}
                                            maxlength="120"
                                        />
                                        <CInput
                                            label='Referencia'
                                            name="referencia"
                                            {...register("referencia", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Referencia es requerido'
                                                },
                                                maxLength: {
                                                    value: 120,
                                                    message: maxValueMessage('maxlength', 120)
                                                },
                                                disabled: allDisabled
                                            })}
                                            error={errors.referencia?.message}
                                            maxLength="120"
                                        />
                                    </Col>
                                    <Col lg="6" md="12" sm="12" style={{ height: '350px' }}>
                                        {dataMapa.latitud ? (<>
                                            <GoogleMapReact
                                                onClick={handleChangeDataMap}
                                                bootstrapURLKeys={{ key: 'AIzaSyBA4H51ZoEeWOmGbjXhwI3wj40J4_vi1p8' }}
                                                defaultCenter={dataMapa ? { lat: Number(dataMapa.latitud), lng: Number(dataMapa.longitud) } : '0'}
                                                defaultZoom={id ? 14 : 6}
                                            >
                                                <MarkerComponent
                                                    lat={dataMapa.latitud}
                                                    lng={dataMapa.longitud}
                                                />
                                            </GoogleMapReact>
                                        </>) : null}
                                    </Col>
                                </Row>
                            </div>
                        ))
                    }

                    {
                        listaSecciones.filter(item => item.id == 2).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{item.nombre}</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row className="mb-2">
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <CInput
                                            label="Razón Social"
                                            name="solicitante"
                                            {...register("solicitante", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Razón Social es requerido'
                                                },
                                                maxLength: {
                                                    value: 250,
                                                    message: maxValueMessage('maxlength', 250)
                                                },
                                                onChange: (e => {
                                                    let value = e.target.value;

                                                    let idFacturar = getValues("idFacturar");

                                                    if (idFacturar == 1) {
                                                        setValue('razonSocialFacturacion', value)
                                                    }
                                                }),
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.solicitante?.message}
                                            maxLength="50"
                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="tipoDocumento"
                                                disabled={allDisabled}
                                                {...register("tipoDocumento", { required: false })}
                                                label="Tipo de Documento"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Tipo de Documento"
                                                    name="idTipoDocumento"
                                                    {...register("idTipoDocumento", {
                                                        required: {
                                                            value: false,
                                                            message: 'El campo Tipo Documento es requerido '
                                                        },
                                                        onChange: (e => {
                                                            let pushData = {
                                                                ...changeData,
                                                                [e.target.name]: e.target.value == 0 ? false : true,
                                                                [`${e.target.name}_value`]: e.target.value
                                                            }
                                                            setChangeData(pushData)
                                                            setValue('documento', '')
                                                            clearErrors(['documento'])

                                                            let idFacturar = getValues("idFacturar");

                                                            if (idFacturar == 1) {
                                                                setValue('rucFacturacion', "")
                                                            }
                                                        }),
                                                        disabled: allDisabled
                                                    })}
                                                    options={[
                                                        { id: 0, text: 'S/N' },
                                                        ...documento.map(el => ({ id: el.id, text: el.nombre }))
                                                    ]}
                                                    error={errors.idTipoDocumento?.message}
                                                />
                                            )
                                        }

                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <CInput
                                            label="N° de Documento"
                                            nombre="documento"
                                            {...register("documento", {
                                                required: {
                                                    value: watch('idTipoDocumento') == 0 ? false : true,
                                                    message: 'El campo N° de Documento es requerido'
                                                },
                                                validate: {
                                                    typeOne: v => inputValidator(v, 'documentoDNI'),
                                                    typeTwo: v => inputValidator(v, 'documentoRUC'),
                                                    typeThree: v => inputValidator(v, 'documentoCEX'),
                                                },
                                                pattern: {
                                                    value: patterns('onlyNumberArabic'),
                                                    message: 'Sólo se permiten Números'
                                                },
                                                onChange: (e => {
                                                    let value = e.target.value;

                                                    let idFacturar = getValues("idFacturar");

                                                    if (idFacturar == 1) {
                                                        setValue('rucFacturacion', value)
                                                    }
                                                }),
                                                disabled: allDisabled
                                            })}
                                            error={
                                                errors.documento?.type == 'typeOne' ? 'Ingrese un número de DNI válido' :
                                                    errors.documento?.type == 'typeTwo' ? 'Ingrese un número de RUC válido' :
                                                        errors.documento?.type == 'typeThree' ? 'Ingrese un número de CEX válido' :
                                                            errors.documento?.message

                                            }
                                            requerido={watch('idTipoDocumento') == 0 ? '' : '1'}
                                            cRegex="integer"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))
                    }

                    {
                        listaSecciones.filter(item => item.id == 3).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">Datos del Solicitante</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row className="mb-4">
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="cliente"
                                                disabled={allDisabled}
                                                {...register("cliente", { required: false })}
                                                label="Solicitante"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Solicitante"
                                                    name="idCliente"
                                                    {...register("idCliente", {
                                                        required: {
                                                            value: true,
                                                            message: 'El campo Solicitante es requerido'
                                                        },
                                                        onChange: (e => {

                                                            let value = e.target.value;

                                                            if (value == '') {
                                                                setProductos([])
                                                                setSubProductos([])
                                                                //setTasacion([])
                                                                //setSubTasacion([])
                                                                setValue("idTipoTasacion", '');
                                                                setValue("idSubTipoTasacion", '');
                                                                setDataSubTipoTasacion([]);

                                                                setMostrarCampoEspecial(true);
                                                            } else {
                                                                setProductos([])
                                                                setSubProductos([])
                                                                //setTasacion([])
                                                                //setSubTasacion([])
                                                                setValue("idTipoTasacion", '');
                                                                setValue("idSubTipoTasacion", '');
                                                                setDataSubTipoTasacion([]);

                                                                let esParticular = false;
                                                                let mostrarCampoEspecial = true;

                                                                clientes.filter(cli => cli.id === value).forEach(cli => {
                                                                    esParticular = cli.esparticular;
                                                                });

                                                                if (esParticular) {
                                                                    mostrarCampoEspecial = false;
                                                                    setValue("idTipoServicio", 1);
                                                                    setValue("idTipoTasacion", IdTipoTasacionComercial);
                                                                    //listarTasacion(value, true, IdTipoTasacionComercial);

                                                                    let dataSubTipoTasacionTemp = new Array();

                                                                    dataTipoTasacion
                                                                        .filter(tt => tt.id === IdTipoTasacionComercial)
                                                                        .map(tt => {
                                                                            tt.subTiposTasacion.map(stt => {
                                                                                dataSubTipoTasacionTemp.push({
                                                                                    ...stt, key: generateId()
                                                                                });
                                                                            })
                                                                        })

                                                                    setDataSubTipoTasacion(dataSubTipoTasacionTemp);

                                                                }
                                                                else {
                                                                    //listarTasacion(value)
                                                                }

                                                                setMostrarCampoEspecial(mostrarCampoEspecial);
                                                            }

                                                            clearErrors([
                                                                'numeroSolicitud',
                                                                'numeroGarantia',
                                                                'oficina',
                                                                'oficinaDestino',
                                                                'funcionario',
                                                                'funcionarioDestino',
                                                                'tipotasacion',
                                                                'idClienteProducto',
                                                                'idSubTipoTasacion',
                                                                'idClienteSubProducto',
                                                                'idTipoBien',
                                                                'idSubTipoBien',
                                                                'idTipoVisita'
                                                            ])

                                                            let idFacturar = getValues("idFacturar");

                                                            if (idFacturar == 2) {

                                                                let razonSocialFacturacion = "";
                                                                let rucFacturacion = "";

                                                                let idCliente = value;

                                                                let cliente = "";
                                                                let documento = "";

                                                                clientes.filter(cli => cli.id === idCliente).forEach(cli => {
                                                                    cliente = cli.nombre;
                                                                    documento = cli.documento;
                                                                });

                                                                razonSocialFacturacion = cliente;
                                                                rucFacturacion = documento;

                                                                setValue('razonSocialFacturacion', razonSocialFacturacion)
                                                                setValue('rucFacturacion', rucFacturacion)
                                                            }

                                                        }),
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    error={errors.idCliente?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...clientes.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        <CInput
                                            label="N° Solicitud"
                                            name="numeroSolicitud"
                                            {...register("numeroSolicitud", {
                                                required: { value: false, message: 'El campo N° Solicitud es requerido' },
                                                // minLength: {value:1, message: 'El valor mínimo es de tanto'},
                                                maxLength: {
                                                    value: 50,
                                                    message: maxValueMessage('maxlength', 50)
                                                },
                                                /*pattern: {
                                                    value: patterns('onlyNumberArabic'),
                                                    message: 'Sólo se permiten Números'
                                                },*/
                                                disabled: allDisabled
                                            })}
                                            error={errors.numeroSolicitud?.message}
                                            maxLength="50"
                                            cRegex="integer"
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        <CInput
                                            label="N° Garantía"
                                            name="numeroGarantia"
                                            {...register("numeroGarantia", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo N° Garantía es requerido'
                                                },
                                                maxLength: {
                                                    value: 50, message: maxValueMessage('maxlength', 50)
                                                },
                                                disabled: allDisabled
                                            })}
                                            error={errors.numeroGarantia?.message}
                                            maxLength="50"
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        <CSwitch
                                            label="Se imprime y envía físicamente"
                                            name="esImpresion"
                                            onChange={e => handleShow(e)}
                                            defaultChecked={esImpresion}
                                            disabled={allDisabled}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col lg="3" md="12" sm="12">
                                        <Controller
                                            name="oficina"
                                            control={control}
                                            render={({ field }) => (<CAutoComplete
                                                label="Oficina Origen"
                                                {...register("oficina", {
                                                    required: {
                                                        value: false,
                                                        message: 'El campo Oficina Origen es requerido'
                                                    },
                                                    maxLength: {
                                                        value: 120,
                                                        message: maxValueMessage('maxlength', 120)
                                                    },
                                                    disabled: allDisabled
                                                })}
                                                onChange={field.onChange}
                                                onSelect={e => selectAutocomplete(e, 'oficina')}
                                                value={field.value}
                                                error={errors.oficina?.message}
                                                items={campos.filter(cm => cm.idtipo == 1)}
                                                maxLength="120"
                                                ref={ref}
                                            />)}
                                        />
                                    </Col>

                                    <Col lg="3" md="12" sm="12">
                                        <Controller
                                            name="oficinaDestino"
                                            control={control}
                                            render={({ field }) => (<CAutoComplete
                                                label="Oficina Destino"
                                                {...register("oficinaDestino", {
                                                    required: {
                                                        value: esImpresion,
                                                        message: 'El campo Oficina Destino es requerido'
                                                    },
                                                    disabled: allDisabled || !esImpresion,
                                                    maxLength: { value: 120, message: () => maxValueMessage('maxlength', 120) }
                                                })}
                                                requerido={esImpresion ? '1' : ''}
                                                onChange={field.onChange}
                                                onSelect={e => selectAutocomplete(e, 'oficinaDestino')}
                                                value={field.value}
                                                error={errors.oficinaDestino?.message}
                                                items={campos.filter(cm => cm.idtipo == 1)}
                                                maxLength="120"
                                                ref={ref}
                                            />)}
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        <Controller
                                            name="funcionario"
                                            control={control}
                                            render={({ field }) => (<CAutoComplete
                                                label="Funcionario Origen"
                                                name="funcionario"
                                                {...register("funcionario", {
                                                    required: false,
                                                    maxLength: {
                                                        value: 120,
                                                        message: maxValueMessage('maxlength', 120)
                                                    },
                                                    disabled: allDisabled
                                                })}
                                                onChange={field.onChange}
                                                onSelect={e => selectAutocomplete(e, 'funcionario')}
                                                value={field.value}
                                                error={errors.funcionario?.message}
                                                items={campos.filter(cm => cm.idtipo == 2)}
                                                maxLength="120"
                                                ref={ref}
                                            />)}
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        <Controller
                                            name="funcionarioDestino"
                                            control={control}
                                            render={({ field }) => (<CAutoComplete
                                                label="Funcionario Destino"
                                                {...register("funcionarioDestino", {
                                                    required: {
                                                        value: esImpresion,
                                                        message: 'El campo Oficina Destino es requerido'
                                                    },
                                                    disabled: allDisabled || !esImpresion,
                                                    maxLength: { value: 120, message: () => maxValueMessage('maxlength', 120) }
                                                })}
                                                requerido={esImpresion ? '1' : ''}
                                                onChange={field.onChange}
                                                onSelect={e => selectAutocomplete(e, 'funcionarioDestino')}
                                                value={field.value}
                                                error={errors.funcionarioDestino?.message}
                                                items={campos.filter(cm => cm.idtipo == 2)}
                                                maxLength="120"
                                                ref={ref}
                                            />)}
                                        />

                                    </Col>
                                </Row>
                                {/*<Row className="mb-4">
                                    <Col lg="3" md="12" sm="12">
                                        <CAutoComplete
                                            disabled={allDisabled}
                                            {...register("funcionarioPrueba", {
                                                required: false
                                            })}
                                            label="Funcionario Prueba"
                                            name="funcionarioPrueba"
                                            onChange={e => handleOficina(e)}
                                            onSelect={e => selecAutocomplete(e)}
                                            value={funcionarioPrueba}
                                            error={errors.funcionarioPrueba?.message}
                                            items={campos.filter(cm => cm.idtipo == 2)}
                                        />
                                    </Col>
                                </Row>*/}

                                <Row className="mb-4">
                                    <Col lg="4" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="tipoServicio"
                                                disabled={allDisabled}
                                                {...register("tipoServicio", { required: false })}
                                                label="Tipo de Servicio"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Tipo de Servicio"
                                                    name="idTipoServicio"
                                                    {...register("idTipoServicio", {
                                                        required: {
                                                            value: true,
                                                            message: 'El campo Tipo de Servicio es requerido'
                                                        },
                                                        onChange: (e => {

                                                            let value = e.target.value;

                                                            let mostrarCampoEspecial = true;

                                                            if (value != '') {
                                                                mostrarCampoEspecial = true;
                                                            } else {
                                                                if (value != 1) {
                                                                    mostrarCampoEspecial = false;
                                                                }
                                                            }

                                                            setMostrarCampoEspecial(mostrarCampoEspecial);

                                                            setProductos([])
                                                            setSubProductos([])
                                                            //setSubTasacion([])

                                                            setValue('idTipoTasacion', '')
                                                            setValue('idClienteProducto', '')
                                                            setValue('idSubTipoTasacion', '')
                                                            setValue('idClienteSubProducto', '')
                                                            setValue('idTipoBien', '')
                                                            setValue('idSubTipoBien', '')
                                                            setValue('idTipoVisita', '')
                                                        }),
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    error={errors.idTipoServicio?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...tipoServicio.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="tipoTasacion"
                                                disabled={allDisabled}
                                                {...register("tipoTasacion", { required: false })}
                                                label="Tipo de Tasación"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Tipo de Tasación"
                                                    name="idTipoTasacion"
                                                    {...register("idTipoTasacion", {
                                                        required: {
                                                            disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true)),
                                                            message: 'El campo Tipo de Tasación es requerido'
                                                        },
                                                        onChange: (e => {

                                                            let value = e.target.value;

                                                            setValue('idSubTipoTasacion', '')
                                                            setValue('idClienteProducto', '')
                                                            setValue('idClienteSubProducto', '')

                                                            if (value == '') {
                                                                setProductos([])
                                                                setSubProductos([])
                                                                setDataSubTipoTasacion([])
                                                                //setSubTasacion([])
                                                            } else {
                                                                setProductos([])
                                                                setSubProductos([])
                                                                //setSubTasacion([])

                                                                let dataSubTipoTasacionTemp = new Array();

                                                                dataTipoTasacion
                                                                    .filter(tt => tt.id === value)
                                                                    .map(tt => {
                                                                        tt.subTiposTasacion.map(stt => {
                                                                            dataSubTipoTasacionTemp.push({
                                                                                ...stt, key: generateId()
                                                                            });
                                                                        })
                                                                    })

                                                                setDataSubTipoTasacion(dataSubTipoTasacionTemp);

                                                                //listarProductos(watch('idCliente'), e.target.value)
                                                            }
                                                        }),
                                                        disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                    })}
                                                    requerido="1"
                                                    error={errors.idTipoTasacion?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...dataTipoTasacion.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                    {mostrarCampoEspecial &&
                                        <Col lg="4" md="12" sm="12">
                                            {appContext.permisos.esUsuarioSoloConsultar ?
                                                (<CInput
                                                    name="subTipoTasacion"
                                                    disabled={allDisabled}
                                                    {...register("subTipoTasacion", { required: false })}
                                                    label="Subtipo de Tasación"
                                                />)
                                                : (
                                                    <CSelect
                                                        label="Subtipo de Tasación"
                                                        name="idSubTipoTasacion"
                                                        {...register("idSubTipoTasacion", {
                                                            required: {
                                                                value: false,
                                                                message: "El campo Tipo de Sub Tasación es requerido"
                                                            },
                                                            onChange: (e => {

                                                                let value = e.target.value;

                                                                setValue('idClienteProducto', '')
                                                                setValue('idClienteSubProducto', '')

                                                                if (value == '') {
                                                                    setProductos([])
                                                                    setSubProductos([])
                                                                } else {
                                                                    setProductos([])
                                                                    setSubProductos([])

                                                                    listarProductos(watch('idCliente'), value)
                                                                }
                                                            }),

                                                            disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                        })}
                                                        error={errors.idSubTipoTasacion?.message}
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataSubTipoTasacion.map(el => ({ id: el.id, text: el.nombre }))]}
                                                    />
                                                )
                                            }

                                        </Col>
                                    }
                                </Row>
                                {mostrarCampoEspecial &&
                                    <Row className="mb-2">

                                        <Col lg="4" md="12" sm="12">
                                            {appContext.permisos.esUsuarioSoloConsultar ?
                                                (<CInput
                                                    name="clienteProducto"
                                                    disabled={allDisabled}
                                                    {...register("clienteProducto", { required: false })}
                                                    label="Producto"
                                                />)
                                                : (
                                                    <CSelect
                                                        label="Producto"
                                                        name="idClienteProducto"
                                                        {...register("idClienteProducto", {
                                                            required: {
                                                                value: false,
                                                                message: 'El campo Producto es requerido'
                                                            },
                                                            onChange: (e => {
                                                                setSubProductos([])
                                                                //setSubTasacion([])
                                                                //listarSubTasacion(e.target.value, watch('idTipoTasacion'))
                                                                listarSubProductos(e.target.value)
                                                            }),
                                                            disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                        })}
                                                        requerido={''}
                                                        error={errors.idClienteProducto?.message}
                                                        options={[{ id: '', text: 'Seleccione' }, ...productos.map(el => ({ id: el.id, text: el.nombre }))]}
                                                    />
                                                )
                                            }
                                        </Col>


                                        <Col lg="4" md="12" sm="12">
                                            {appContext.permisos.esUsuarioSoloConsultar ?
                                                (<CInput
                                                    name="clienteSubProducto"
                                                    disabled={allDisabled}
                                                    {...register("clienteSubProducto", { required: false })}
                                                    label="SubProducto"
                                                />)
                                                : (
                                                    <CSelect
                                                        label="SubProducto"
                                                        name="idClienteSubProducto"
                                                        {...register("idClienteSubProducto", {
                                                            required: {
                                                                value: false,
                                                                message: "El campo Sub Producto es requerido"
                                                            },
                                                            disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                        })}
                                                        error={errors.idClienteSubProducto?.message}
                                                        options={[{ id: '', text: 'Seleccione' }, ...subProductos.map(el => ({ id: el.id, text: el.nombre }))]}
                                                    />
                                                )
                                            }

                                        </Col>
                                    </Row>
                                }
                                <Row className="mb-2">
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="tipoBien"
                                                disabled={allDisabled}
                                                {...register("tipoBien", { required: false })}
                                                label="Tipo de Bien"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Tipo de Bien"
                                                    name="idTipoBien"
                                                    {...register("idTipoBien", {
                                                        required: {
                                                            value: (watch('idTipoServicio') == 1 ? (true) : (false)),
                                                            message: "El campo Tipo de Bien es requerido"
                                                        },
                                                        onChange: (e => {
                                                            if (e.target.value === '') {
                                                                setSubTipoBien([])
                                                            } else {
                                                                listarSubTipoBien(e.target.value)
                                                            }
                                                        }),
                                                        disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                    })}
                                                    requerido={watch('idTipoServicio') == 1 ? ('1') : ('')}
                                                    error={errors.idTipoBien?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...tipoBien.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="subTipoBien"
                                                disabled={allDisabled}
                                                {...register("subTipoBien", { required: false })}
                                                label="Subtipo de Bien"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Subtipo de Bien"
                                                    name="idSubTipoBien"
                                                    {...register("idSubTipoBien", {
                                                        required: {
                                                            value: (watch('idTipoServicio') == 1 ? (true) : (false)),
                                                            message: 'El campo Subtipo de Bien es requerido'
                                                        },
                                                        disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                    })}
                                                    requerido={watch('idTipoServicio') == 1 ? ('1') : ('')}
                                                    error={errors.idSubTipoBien?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...subTipoBien.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>

                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="tipoVisita"
                                                disabled={allDisabled}
                                                {...register("tipoVisita", { required: false })}
                                                label="Tipo de Visita"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Tipo de Visita"
                                                    name="idTipoVisita"
                                                    {...register("idTipoVisita", {
                                                        required: {
                                                            value: (watch('idTipoServicio') == 1 ? (true) : (false)),
                                                            message: 'El campo Tipo de Visita es requerido'
                                                        },
                                                        disabled: allDisabled ? (true) : (watch('idTipoServicio') == 1 ? (false) : (true))
                                                    })}
                                                    requerido={watch('idTipoServicio') == 1 ? ('1') : ('')}
                                                    error={errors.idTipoVisita?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...tipoVisita.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                </Row>
                            </div>
                        ))
                    }

                    {
                        listaSecciones.filter(item => item.id == 5).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{item.nombre}</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row className="mb-4">
                                    <Col lg="4" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="formaPago"
                                                disabled={allDisabled}
                                                {...register("formaPago", { required: false })}
                                                label="Forma de Pago"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Forma de Pago"
                                                    name="idFormaPago"
                                                    {...register("idFormaPago", {
                                                        required: {
                                                            value: false,
                                                            message: 'El campo Forma de Pago es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    error={errors.idFormaPago?.message}
                                                    options={[{ id: 0, text: 'Seleccione' }, ...formaPago.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        <CInput
                                            label="Monto Cotizado"
                                            name="montoCotizado"
                                            {...register("montoCotizado", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Monto Cotizado es requerido'
                                                },
                                                maxLength: {
                                                    value: 8,
                                                    message: maxValueMessage('maxlength', 8)
                                                },
                                                min: {
                                                    value: 0,
                                                    message: 'El monto mímino es 0'
                                                },
                                                disabled: allDisabled
                                                // validate:{
                                                //     minValue: e => e > 0 || 'Ingrese un número válido'
                                                // }
                                            })}
                                            min="0"
                                            type="number"
                                            placeholder="0.00"
                                            step="0.01"
                                            error={errors.montoCotizado?.message}
                                            cRegex="integer"
                                            maxLength="6"
                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        <CInput
                                            label="Pago a Cuenta"
                                            name="pagoCuenta"
                                            {...register("pagoCuenta", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Pago a Cuenta es requerido'
                                                },
                                                maxLength: {
                                                    value: 6,
                                                    message: maxValueMessage('maxlength', 6)
                                                },
                                                min: {
                                                    value: 0,
                                                    message: 'El pago a cuenta mímino es 0'
                                                },
                                                disabled: allDisabled
                                                // validate:{
                                                //     minValue: e => e > 0 || 'Ingrese un número válido'
                                                // }
                                            })}
                                            min="0"
                                            type="number"
                                            placeholder="0.00"
                                            step="0.01"
                                            error={errors.pagoCuenta?.message}
                                            cRegex="integer"
                                            maxLength="6"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col lg="4" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="facturar"
                                                disabled={allDisabled}
                                                {...register("facturar", { required: false })}
                                                label="Facturar a:"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Facturar a:"
                                                    name="idFacturar"
                                                    {...register("idFacturar", {
                                                        required: false,
                                                        onChange: (e => {

                                                            let value = e.target.value;

                                                            let razonSocialFacturacion = "";
                                                            let rucFacturacion = "";

                                                            if (value == 1) {
                                                                razonSocialFacturacion = getValues("solicitante")
                                                                rucFacturacion = getValues("documento")
                                                            }
                                                            else if (value == 2) {

                                                                let idCliente = getValues("idCliente");

                                                                let cliente = "";
                                                                let documento = "";

                                                                clientes.filter(cli => cli.id === idCliente).forEach(cli => {
                                                                    cliente = cli.nombre;
                                                                    documento = cli.documento;
                                                                });

                                                                razonSocialFacturacion = cliente;
                                                                rucFacturacion = documento;
                                                            }

                                                            setValue('razonSocialFacturacion', razonSocialFacturacion)
                                                            setValue('rucFacturacion', rucFacturacion)
                                                        }),
                                                        disabled: allDisabled
                                                    })}
                                                    error={errors.idFacturar?.type === 'required' && "El campo Facturar a es requerido"}
                                                    options={[{ id: 0, text: 'Seleccione' }, ...facturarA.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        <CInput
                                            label="Razón Social"
                                            name="razonSocialFacturacion"
                                            {...register("razonSocialFacturacion", {
                                                required: {
                                                    value: watch('idFacturar') == 3 ? true : false,
                                                    message: 'El campo Razón Social es requerido'
                                                },
                                                maxLength: {
                                                    value: 50,
                                                    message: maxValueMessage('maxlength', 50)
                                                },
                                                disabled: allDisabled ? true : (watch('idFacturar') == 3 ? false : true)
                                            })}
                                            requerido={watch('idFacturar') == 3 ? '1' : ''}
                                            error={errors.razonSocialFacturacion?.message}
                                            maxLength="50"
                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        <CInput
                                            label="RUC"
                                            name="rucFacturacion"
                                            {...register("rucFacturacion", {
                                                required: {
                                                    value: watch('idFacturar') == 3 ? true : false,
                                                    message: 'El campo RUC es requerido'
                                                },
                                                maxLength: {
                                                    value: 11,
                                                    message: maxValueMessage('maxlength', 11)
                                                },
                                                disabled: allDisabled ? true : (watch('idFacturar') == 3 ? false : true)
                                            })}
                                            requerido={watch('idFacturar') == 3 ? '1' : ''}
                                            error={errors.rucFacturacion?.message}
                                            cRegex="integer"
                                            maxLength="11"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col lg="4" md="12" sm="12">
                                        <CInput
                                            label="Correo Receptor de Factura"
                                            name="correoReceptor"
                                            {...register("correoReceptor", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Correo Receptor de Factura es requerido'
                                                },
                                                maxLength: {
                                                    value: 80,
                                                    message: maxValueMessage('maxlength', 80)
                                                },
                                                disabled: allDisabled
                                            })}
                                            error={errors.correoReceptor?.message}
                                            cRegex="email"
                                            maxLength="80"

                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        <CSwitch
                                            label="Cobrar antes de envío"
                                            name="esCobroAnticipado"
                                            onChange={e => handleShow(e)}
                                            defaultChecked={esCobroAnticipado}
                                            disabled={allDisabled}
                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="facturar"
                                                disabled={allDisabled}
                                                {...register("facturar", { required: false })}
                                                label="Facturar a:"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Estado de Facturación:"
                                                    name="idEstadoFacturacion"
                                                    {...register("idEstadoFacturacion", {
                                                        required: false,
                                                        disabled: allDisabled
                                                    })}
                                                    error={errors.idFacturar?.type === 'required' && "El campo Estado de Facturación a es requerido"}
                                                    options={[{ id: 0, text: 'Seleccione' }, ...estadoFacturacion.map(el => ({ id: el.id, text: el.nombre }))]}
                                                />
                                            )
                                        }

                                    </Col>

                                </Row>
                            </div>
                        ))
                    }

                    {
                        listaSecciones.filter(item => item.id == 6).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{item.nombre}</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row className="mb-4">
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <CInput
                                            label="Nombres"
                                            name="contacto"
                                            {...register("contacto", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Nombres es requerido'
                                                },
                                                maxLength: {
                                                    value: 200,
                                                    message: maxValueMessage('maxlength', 200)
                                                },
                                                disabled: allDisabled
                                            })}
                                            requerido="0"
                                            error={errors.contacto?.message}
                                            maxLength="200"
                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <CInput
                                            label="Teléfono"
                                            name="contactoTelefono"
                                            {
                                            ...register("contactoTelefono",
                                                {
                                                    required: {
                                                        value: false,
                                                        message: 'El campo Teléfono es requerido'
                                                    },
                                                    minLength: {
                                                        value: 8,
                                                        message: minValueMessage('minLength', 8)
                                                    },
                                                    maxLength: {
                                                        value: 9,
                                                        message: maxValueMessage('maxlength', 9)
                                                    },
                                                    pattern: patterns.integer,
                                                    disabled: allDisabled
                                                })

                                            }
                                            requerido="0"
                                            cRegex="integer"
                                            error={errors.contactoTelefono?.message}
                                            maxLength="9"
                                        />
                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <CInput
                                            label="Correo"
                                            name="contactoCorreo"
                                            {...register("contactoCorreo", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Correo es requerido'
                                                },
                                                maxLength: {
                                                    value: 80,
                                                    message: maxValueMessage('maxlength', 80)
                                                },
                                                pattern: patterns.email,
                                                disabled: allDisabled
                                            })}
                                            requerido="0"
                                            cRegex="email"
                                            maxLength="80"
                                            error={errors.contactoCorreo?.message}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))
                    }

                    {
                        listaSecciones.filter(item => item.id == 7).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{item.nombre}</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row>
                                    <Col lg="3" md="12" sm="12" className="mb-4">
                                        <CInput
                                            type="date"
                                            label="Fecha"
                                            name="fechaInicio"
                                            {...register("fechaInicio", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Fecha es requerido'
                                                },
                                                validate: {
                                                    minDate: v => dateValidator(v) || 'La fecha debe ser igual o mayor a la actual'
                                                },
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.fechaInicio?.message}
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12" className="mb-4">
                                        <CInput
                                            type="time"
                                            label="Hora Inicio"
                                            name="horaInicio"
                                            {...register("horaInicio", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Hora Inicio es requerido'
                                                },
                                                validate: {
                                                    minTime: v => timeValidator(v) || 'La hora inicio debe estar en el rango de 7:00 a 20:00.'
                                                },
                                                onChange: (e => {
                                                    let valor = e.target.value;
                                                    let horaFin = moment(valor, 'HH:mm').add(1, 'hours').add(30, 'minutes');

                                                    setValue("horaFin", horaFin.format('HH:mm'));

                                                }),
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.horaInicio?.message}
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12" className="mb-4">
                                        <CInput
                                            type="time"
                                            label="Hora Fin"
                                            name="horaFin"
                                            {...register("horaFin", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Hora Fin es requerido'
                                                },
                                                validate: {
                                                    minHour: v => hourValidator(v, watch('horaInicio')) || 'La hora fin debe ser mayor a la hora inicio.',
                                                    minTime: v => timeValidator(v, watch('horaInicio')) || 'La hora fin debe estar en el rango de 7:00 a 20:00.'
                                                },
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.horaFin?.message}
                                        />
                                    </Col>
                                    <Col lg="3" md="12" sm="12" className="mb-4">
                                        <CSwitch
                                            label="Es Urgente"
                                            name="esUrgente"
                                            onChange={e => handleShow(e)}
                                            defaultChecked={esUrgente}
                                            disabled={allDisabled}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col>
                                        <CTextArea
                                            label="Observación"
                                            name="observacion"
                                            {...register("observacion", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo Observación es requerido'
                                                },
                                                maxLength: {
                                                    value: 500,
                                                    message: maxValueMessage('maxlength', 500)
                                                },
                                                disabled: allDisabled
                                            })}
                                            error={errors.observacion?.message}
                                            maxLength="500"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))
                    }
                    {
                        listaSecciones.filter(item => item.id == 8).map(item => (
                            <div key={item.key}>
                                <div className="flex">
                                    <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{item.nombre}</span>
                                    <hr className=" flex-grow-1 u-text--gray-60" />
                                </div>
                                <Row className="mb-4">
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="inspector"
                                                disabled={allDisabled}
                                                {...register("inspector", { required: false })}
                                                label="Inspector"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Inspector"
                                                    name="idInspector"
                                                    {...register("idInspector", {
                                                        required: {
                                                            value: true,
                                                            message: 'El campo Inspector es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    isOptionState={true}
                                                    error={errors.idInspector?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...colaboradores.filter(el => el.idtiporol == 5 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador, idestado: el.idestado }))]}
                                                />
                                            )
                                        }
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="segundoinspector"
                                                disabled={allDisabled}
                                                {...register("segundoinspector", { required: false })}
                                                label="Inspector 2"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Inspector 2"
                                                    name="idSegundoinspector"
                                                    {...register("idSegundoinspector", {
                                                        required: {
                                                            value: false,
                                                            message: 'El campo Inspector 2 es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    isOptionState={true}
                                                    error={errors.idSegundoinspector?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...colaboradores.filter(el => el.idtiporol == 5 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador, idestado: el.idestado }))]}
                                                />
                                            )
                                        }
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="revisor"
                                                disabled={allDisabled}
                                                {...register("revisor", { required: false })}
                                                label="Revisor"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Revisor"
                                                    name="idRevisor"
                                                    {...register("idRevisor", {
                                                        required: {
                                                            value: false,
                                                            message: 'El campo Revisor es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    isOptionState={true}
                                                    error={errors.idRevisor?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...colaboradores.filter(el => (el.idtiporol == 6 || el.idtiporol == 7 || el.idtiporol == 1)).map(el => ({ id: el.id, text: el.colaborador, idestado: el.idestado }))]}
                                                />
                                            )
                                        }
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="segundorevisor"
                                                disabled={allDisabled}
                                                {...register("segundorevisor", { required: false })}
                                                label="Revisor 2"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Revisor 2"
                                                    name="idSegundorevisor"
                                                    {...register("idSegundorevisor", {
                                                        required: {
                                                            value: false,
                                                            message: 'El campo Revisor 2 es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    isOptionState={true}
                                                    error={errors.idSegundorevisor?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...colaboradores.filter(el => (el.idtiporol == 6 || el.idtiporol == 7 || el.idtiporol == 1)).map(el => ({ id: el.id, text: el.colaborador, idestado: el.idestado }))]}
                                                />
                                            )
                                        }
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="visador"
                                                disabled={allDisabled}
                                                {...register("visador", { required: false })}
                                                label="Visador"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Visador"
                                                    name="idVisador"
                                                    {...register("idVisador", {
                                                        required: {
                                                            value: true,
                                                            message: 'El campo Visador es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    isOptionState={true}
                                                    error={errors.idVisador?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...colaboradores.filter(el => el.idtiporol == 2 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador, idestado: el.idestado }))]}
                                                />
                                            )
                                        }
                                    </Col>
                                    <Col lg="3" md="12" sm="12">
                                        {appContext.permisos.esUsuarioSoloConsultar ?
                                            (<CInput
                                                name="seguimiento"
                                                disabled={allDisabled}
                                                {...register("seguimiento", { required: false })}
                                                label="Seguimiento"
                                            />)
                                            : (
                                                <CSelect
                                                    label="Seguimiento"
                                                    name="idSeguimiento"
                                                    {...register("idSeguimiento", {
                                                        required: {
                                                            value: true,
                                                            message: 'El campo Seguimiento es requerido'
                                                        },
                                                        disabled: allDisabled
                                                    })}
                                                    requerido="1"
                                                    isOptionState={true}
                                                    error={errors.idSeguimiento?.message}
                                                    options={[{ id: '', text: 'Seleccione' }, ...colaboradores.filter(el => el.idtiporol == 8 || el.idtiporol == 1).map(el => ({ id: el.id, text: el.colaborador, idestado: el.idestado }))]}
                                                />
                                            )
                                        }
                                    </Col>
                                </Row>
                            </div>
                        ))
                    }

                    <Row>
                        <Col lg="12" className="flex justify-flex-end gap-2">
                            <a className="c-link" href="/Proceso/Trabajo">
                                <CButton type="button" className="c-button--red">
                                    <Icon children="arrow_back" h="24" className="mr-2" />
                                    Volver
                                </CButton>
                            </a>
                            {s_buttonSave && <CButton
                                disabled={allDisabled}
                                isLoading={l_save} type="submit" className="c-button">
                                <Icon children="save" h="24" className="mr-2" />
                                Guardar
                            </CButton>}

                            {s_buttonSave && <CButton
                                disabled={allDisabled}
                                id="segundo" isLoading={l_saveAsignar} onClick={handleSubmit(handleSave)} type="button" className="c-button--green">
                                <Icon children="check" h="24" className="mr-2" />
                                Guardar y Asignar
                            </CButton>}
                        </Col>
                    </Row>
                </div>
            </form>
        )

    })

    CPrincipal.propTypes = {
        data: PropTypes.object
    };

    // colocar como global
    window.Principal = {
        CPrincipal
    }
})()
