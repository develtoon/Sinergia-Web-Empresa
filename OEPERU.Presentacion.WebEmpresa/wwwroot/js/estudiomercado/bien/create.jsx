
(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner } = ReactBootstrap
    const { requiredMessage, patterns, minValueMessage, maxValueMessage } = Utils
    const { CInput, CSelect, CBreadcrumbs, CButton, CInputFile, Icon, CFlags, CPagination, handleError, AppContext, localSt, generateId, ErrorNotExistPage } = Global
    const { useForm, Controller } = ReactHookForm;

    let smart = {
        urlContext: '/EstudioMercado/Bien',
        urlSave: '/Save',
        urlSaveArchivo: '/SaveArchivo',
        urlGetSingle: '/GetSingle',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
        urlGetTipoBienList: '/Administracion/TipoBien/GetTipoBienList',
        urlGetSubTipoBienList: '/Administracion/TipoBien/GetSubTipoBienList',
        urlGetCategoriaSubTipoBienList: '/Administracion/TipoBien/GetCategoriaSubTipoBienList',
        urlGetUbigeoGetList: '/Administracion/Ubigeo/GetList',
    }

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        const [allDisabled, setAllDisabled] = useState(false)

        const [renderedArchivo, setRenderedArchivo] = useState(false)
        const [rendered, setRendered] = useState(false)
        const [renderedSingle, setRenderedSingle] = useState(false)

        const [dataEstado, setDataEstado] = useState([])
        const [errorData, setErrorData] = useState('')

        const [codigo, setCodigo] = useState('')
        const [dataArchivo, setDataArchivo] = useState([])
        const [l_save, setL_save] = useState(false)

        const [dataTipoFuente, setDataTipoFuente] = useState([])
        const [dataTipoBien, setDataTipoBien] = useState([]);
        const [dataSubTipoBien, setDataSubTipoBien] = useState([]);
        const [dataCategoriaSubTipoBien, setDataCategoriaSubTipoBien] = useState([]);

        const [dataMapa, setDataMapa] = useState({})

        const [dataDepartamento, setDataDepartamento] = useState([])
        const [dataProvincia, setDataProvincia] = useState([])
        const [dataDistrito, setDataDistrito] = useState([])

        const [s_buttonSave, setS_buttonSave] = useState(false)

        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();
        // --------- useEffect Seccion -----
        const [dataID, setDataID] = useState("")


        useEffect(() => {
            setDataID(document.querySelector('#id').value);

            let menuPermiso = appContext.menuPermiso("estudiomercado/bien")
            setDataMapa({ latitud: "-10.908975", longitud: "-76.130546" })

            axios.all([menuPermiso])
                .then(response => {

                    let estadoListar = buscarCatalogoEstado(12300, 1);
                    let tipoBienListar = tipoBienBuscar("", 1);
                    let tipoFuenteListar = buscarCatalogoEstado(12301, 2);
                    let departamentoListar = buscarUbigeo(1, '');

                    axios.all([estadoListar, tipoBienListar, tipoFuenteListar, departamentoListar])
                        .then(response => {
                            setRendered(true);
                        }).
                        catch(error => {
                            setRendered(true);
                        });

                }).
                catch(error => {
                    setRendered(true);
                    console.log("error");
                });

        }, [])

        useEffect(() => {
            if (rendered) {

                if (dataID) {
                    setS_buttonSave(appContext.permisos.esUsuarioEditar)

                    appContext.handleBreadcumb(true, [
                        { url: '', name: "Estudio de Mercado" },
                        { url: '/estudiomercado/bien/', name: "Gestión de Bien" },
                        { url: '', name: "Editar" },
                    ]);
                    getSingle(dataID);
                }
                else {

                    setS_buttonSave(appContext.permisos.esUsuarioCrear)

                    if (!appContext.permisos.esUsuarioCrear) {
                        setAllDisabled(true);
                    }

                    appContext.handleBreadcumb(true, [
                        { url: '', name: "Estudio de Mercado" },
                        { url: '/estudiomercado/bien/', name: "Gestión de Bien" },
                        { url: '', name: "Crear" },
                    ]);
                    setRenderedSingle(true);
                }

            }

        }, [rendered])

        useEffect(() => {
            if (renderedArchivo) {
                setRenderedArchivo(false);
            }
        }, [renderedArchivo])

        const getSingle = (id) => {
            setErrorData('')

            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, {
                params: { id: id }
            })
                .then(({ data: resSingle }) => {
                    if (resSingle.apiEstado === 'ok') {

                        setCodigo(resSingle.codigo)

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setValue("departamento", resSingle.departamento)
                            setValue("provincia", resSingle.provincia)
                            setValue("distrito", resSingle.distrito)

                        }
                        else {
                            setValue("idDepartamento", resSingle.idDepartamento)
                            buscarUbigeo(2, resSingle.idDepartamento, true, resSingle.idProvincia)
                            buscarUbigeo(3, resSingle.idProvincia, true, resSingle.idDistrito)
                        }

                        setDataMapa({ latitud: resSingle.latitud, longitud: resSingle.longitud })

                        setValue('direccion', resSingle.direccion)
                        setValue('referencia', resSingle.referencia)
                        setValue('idEstado', resSingle.idEstado)
                        setValue('tipoFuente', resSingle.tipoFuente)
                        setValue('idTipoFuente', resSingle.idTipoFuente)
                        setValue('referenciaFuente', resSingle.referenciaFuente)
                        setValue('contacto', resSingle.contacto)
                        setValue('contactoTelefono', resSingle.contactoTelefono)
                        setValue('tipoBien', resSingle.tipoBien)

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setValue("tipoBien", resSingle.tipoBien)
                            setValue("subTipoBien", resSingle.subTipoBien)
                            setValue("categoriaSubTipoBien", resSingle.categoriaSubTipoBien)

                        }
                        else {
                            setValue("idTipoBien", resSingle.idTipoBien)
                            tipoBienBuscar(resSingle.idTipoBien, 2, true, resSingle.idSubTipoBien)
                            tipoBienBuscar(resSingle.idSubTipoBien, 3, true, resSingle.idCategoriaSubTipoBien)
                        }

                        setValue('precio', resSingle.precio)

                        if (resSingle.fechaPublicacion == "") {
                            setValue('fechaPublicacion', resSingle.fechaPublicacion);
                        }
                        else {
                            setValue('fechaPublicacion', moment(resSingle.fechaPublicacion, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                        }

                        setDataArchivo(resSingle.archivos);


                        if (!appContext.permisos.esUsuarioEditar) {
                            setAllDisabled(true);
                        }
                        setRenderedSingle(true);
                    }
                })
                .catch(error => {
                    setAllDisabled(true);
                    setErrorData(handleError(error));
                })
        }

        const buscarCatalogoEstado = (codigo, tipo) => {
            let params = {
                codigo: codigo
            }
            let listarCatalogoEstado = AXIOS.get(smart.urlGetCatalogoEstadoList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        /*tipo:
                        1 Estados
                        2 Tipos de Fuente
                        */

                        if (tipo == 1) {
                            setDataEstado(data.data);
                            setValue('idEstado', 1)
                        }
                        else if (tipo == 2) {
                            setDataTipoFuente(data.data);
                        }
                    }
                    else {
                    }
                })
                .catch((error) => {
                    if (tipo == 1) {
                        setDataEstado([]);
                    }
                    else if (tipo == 2) {
                        setDataTipoFuente([]);
                    }

                    handleError(error, false);
                })

            return listarCatalogoEstado;
        }

        const tipoBienBuscar = (_id, _tipo, _valor, _setValueCode) => {

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
            else if (_tipo == 3) {
                params.id = _id;
                url = smart.urlGetCategoriaSubTipoBienList;
            }

            let listarTipoBien = AXIOS.get(url, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (_valor) {
                            if (_tipo == 2) {
                                setDataSubTipoBien(data.data)
                                setValue('idSubTipoBien', _setValueCode)
                            }
                            else if (_tipo == 3) {
                                setDataCategoriaSubTipoBien(data.data)
                                setValue('idCategoriaSubTipoBien', _setValueCode)
                            }
                        }
                        else {
                            if (_tipo == 1) {
                                setDataTipoBien(data.data);
                            }
                            else if (_tipo == 2) {
                                setDataSubTipoBien(data.data);
                            }
                            else if (_tipo == 3) {
                                setDataCategoriaSubTipoBien(data.data);
                            }
                        }
                    }
                    else {
                        if (_tipo == 1) {
                            setDataTipoBien(data.data);
                        }
                        else if (_tipo == 2) {
                            setDataSubTipoBien(data.data);
                        }
                        else if (_tipo == 3) {
                            setDataCategoriaSubTipoBien(data.data);
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
                    else if (_tipo == 3) {
                        setDataCategoriaSubTipoBien([]);
                    }
                    console.log('error')
                });

            return listarTipoBien;
        }

        const buscarUbigeo = (_tipo, _codigo, _id, _setValueCode) => {

            let params = {
                tipo: _tipo,
                codigo: _codigo,
                ordenamiento: 'nombre asc'
            };

            let listarUbigeo = AXIOS.get(`${smart.urlGetUbigeoGetList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (_id) {
                            if (_tipo == 2) {
                                setDataProvincia(data.data)
                                setValue('idProvincia', _setValueCode)
                            }
                            else if (_tipo == 3) {
                                setDataDistrito(data.data)
                                setValue('idDistrito', _setValueCode)
                            }
                        }
                        else {
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
                    }
                    else {
                        if (_tipo == 1) { setDataDepartamento([]) }
                        else if (_tipo == 2) { setDataProvincia([]) }
                        else if (_tipo == 3) { setDataDistrito([]) }
                    }
                })
                .catch((error) => {
                    if (_tipo == 1) { setDataDepartamentos([]) }
                    else if (_tipo == 2) { setDataProvincia([]) }
                    else if (_tipo == 3) { setDataDistrito([]) }
                });

            return listarUbigeo;
        };

        const handleAddDocument = (files) => {

            let listaArchivo = [...dataArchivo];
            let listaPromesas = new Array();
            let mensajeError = "";

            for (var i = 0; i < files.length; i++) {

                (function (file) {
                    let nombreArchivo = file.name;

                    if (file) {
                        let formData = new FormData();
                        formData.append("archivo", file);

                        let saveArchivo = AXIOS.post(smart.urlContext + smart.urlSaveArchivo, formData)
                            .then(({ data }) => {
                                if (data.apiEstado === 'ok') {

                                    let objArchivo = {
                                        "key": generateId(),
                                        "id": "",
                                        "idArchivo": data.id,
                                        "urlArchivo": data.urlArchivo,
                                        "urlArchivoMiniatura": data.urlArchivoMiniatura,
                                        "nombreOriginal": nombreArchivo
                                    }

                                    listaArchivo.push(objArchivo);

                                } else {
                                    swal({
                                        title: data.apiMensaje,
                                        // text: data.apiMensaje,
                                        icon: "error",
                                    })
                                }

                            })
                            .catch((error) => {
                                handleError(error);
                            })
                        listaPromesas.push(saveArchivo);
                    }

                })(event.target.files[i]);
            }

            axios.all(listaPromesas).then(result => {
                setDataArchivo(listaArchivo);
            })

        }


        const handleDeleteCliente = (event, _key) => {
            let clone = [...dataArchivo]
            let pos = clone.findIndex(item => item.key == _key)
            clone.splice(pos, 1)

            setDataArchivo(clone)
        }

        const handleSave = (data) => {
            if (l_save) return
            setL_save(true)

            let fecha = "";

            if (data.fechaPublicacion != "") {
                fecha = moment(data.fechaPublicacion, 'YYYY-MM-DD').format("DD/MM/YYYY")
            }

            let archivos = new Array();

            dataArchivo.forEach(da => {
                let objArchivo = {
                    "id": da.id,
                    "idArchivo": da.idArchivo
                }

                archivos.push(objArchivo);
            });

            let oBien = {
                "id": dataID,
                "idUbigeo": data.idDistrito,
                "latitud": dataMapa.latitud,
                "longitud": dataMapa.longitud,
                "direccion": data.direccion,
                "referencia": data.referencia,
                "idTipoFuente": data.idTipoFuente,
                "referenciaFuente": data.referenciaFuente,
                "fechaPublicacion": fecha,
                "contacto": data.contacto,
                "contactoTelefono": data.contactoTelefono,
                "idTipoBien": data.idTipoBien,
                "idSubTipoBien": data.idSubTipoBien,
                "idCategoriaSubTipoBien": data.idCategoriaSubTipoBien,
                "precio": data.precio ? data.precio : '0',
                "idEstado": data.idEstado,
                "archivos": archivos
            }

            AXIOS.post(smart.urlContext + smart.urlSave, oBien)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })

                        appContext.handleBreadcumb(true, [
                            { url: '', name: "Estudio de Mercado" },
                            { url: '/estudiomercado/bien/', name: "Gestión de Bien" },
                            { url: '', name: "Editar" },
                        ]);

                        if (!dataID) {
                            setCodigo(data.codigo)
                            setDataID(data.id);
                            getSingle(data.id);
                        }
                        else {
                            getSingle(dataID);
                        }


                    } else {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })
                    }

                    setL_save(false)
                })
                .catch(error => {
                    setL_save(false)
                    handleError(error);
                })

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


        return (
            <div className="o-container c-header__wrapper flex flex-column mt-3">
                <form className="w-100" onSubmit={handleSubmit(handleSave)}>
                    <div>
                        <Row>
                            <Col lg="4" md="12" sm="12" className="flex align-center gap-2 mb-2">
                                <span className="u-text--gray-60">Código</span>
                                <CInput maxLength="50" value={codigo} placeholder="Autogenerado" disabled={true}></CInput>
                            </Col>
                            <Col lg="8" md="12" sm="12" className="flex justify-flex-end gap-2 mb-2">
                                <a className="c-link" href="/EstudioMercado/Bien">
                                    <CButton type="button" className="c-button--red">
                                        <Icon children="arrow_back" h="24" className="mr-2" />
                                Volver
                            </CButton>
                                </a>

                                {s_buttonSave && <CButton disabled={allDisabled} type="submit" isLoading={l_save} children="Guardar" className="c-button--blue">
                                    <Icon children="save" h="24" className="mr-2" />
                                Guardar
                            </CButton>}
                            </Col>
                        </Row>
                        <div className="flex">
                            <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">Datos de Ubicación</span>
                            <hr className=" flex-grow-1 u-text--gray-60" />
                        </div>
                        <Row className="mb-4">
                            <Col lg="6" md="12" sm="12">

                                {appContext.permisos.esUsuarioSoloConsultar ? (<CInput
                                    name="departamento"
                                    disabled={allDisabled}
                                    {...register("departamento", { required: false })}
                                    label="Departamento"
                                />) : (<CSelect
                                    mod="mb-2"
                                    label='Departamento'
                                    name="idDepartamento"
                                    {...register("idDepartamento", {
                                        required: {
                                            value: true,
                                            message: 'El campo departamento es requerido'
                                        },
                                        onChange: (e => {
                                            buscarUbigeo(2, e.target.value);
                                            setValue('idProvincia', '')
                                            setDataDistrito([])
                                        }),
                                        disabled: allDisabled,
                                    })}
                                    requerido="1"
                                    error={errors.idDepartamento?.message}
                                    options={[{ id: '', text: 'Seleccione' }, ...dataDepartamento.map(el => ({ id: el.codigo, text: el.nombre }))]}
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
                                                    message: 'El campo provincia es requerido'
                                                },
                                                deps: ['idDepartamento'],
                                                onChange: (e => {
                                                    buscarUbigeo(3, e.target.value);
                                                    setValue('idDistrito', '')
                                                    setDataDistrito([])
                                                }),
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.idProvincia?.message}
                                            options={[{ id: '', text: 'Seleccione' }, ...dataProvincia.map(el => ({ id: el.codigo, text: el.nombre }))]}
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
                                                    value: true, message: 'El campo distrito es requerido'
                                                },
                                                deps: ['idProvincia'],
                                                disabled: allDisabled
                                            })}
                                            requerido="1"
                                            error={errors.idDistrito?.type === 'required' && "El campo distrito es requerido"}
                                            options={[{ id: '', text: 'Seleccione' }, ...dataDistrito.map(el => ({ id: el.codigo, text: el.nombre }))]}
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
                                            message: 'El campo direccion es requerido'
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
                                    mod="mb-2"
                                    label='Referencia'
                                    name="referencia"
                                    {...register("referencia", {
                                        required: {
                                            value: false,
                                            message: 'El campo referencia es requerido'
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
                                <CSelect
                                    mod="mb-2"
                                    disabled={allDisabled}
                                    name="idEstado"
                                    {...register("idEstado", { required: true })}
                                    label="Estado"
                                    requerido="1"
                                    error={errors.estado?.type === 'required' && "El campo estado es requerido"}
                                    options={[...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                                />
                            </Col>
                            <Col lg="6" md="12" sm="12" style={{ height: '440px' }}>
                                {renderedSingle &&
                                    <GoogleMapReact
                                        onClick={handleChangeDataMap}
                                    bootstrapURLKeys={{ key: 'AIzaSyBA4H51ZoEeWOmGbjXhwI3wj40J4_vi1p8' }}
                                        defaultCenter={dataMapa ? { lat: Number(dataMapa.latitud), lng: Number(dataMapa.longitud) } : '0'}
                                        defaultZoom={dataID ? 14 : 6}
                                    >
                                        <MarkerComponent
                                            lat={dataMapa.latitud}
                                            lng={dataMapa.longitud}
                                        />
                                    </GoogleMapReact>
                                }
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <div className="flex">
                            <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">Datos de Fuente</span>
                            <hr className=" flex-grow-1 u-text--gray-60" />
                        </div>
                        <Row className="mb-2">

                            <Col lg="4" md="12" sm="12" className="mb-4">
                                {appContext.permisos.esUsuarioSoloConsultar ?
                                    (<CInput
                                        name="tipoFuente"
                                        disabled={allDisabled}
                                        {...register("tipoFuente", { required: false })}
                                        label="Fuente"
                                    />)
                                    : (
                                        <CSelect
                                            label="Fuente"
                                            name="idTipoFuente"
                                            {...register("idTipoFuente", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo fuente requerido '
                                                },
                                                disabled: allDisabled
                                            })}
                                            options={[
                                                { id: 0, text: 'Seleccione' },
                                                ...dataTipoFuente.map(el => ({ id: el.id, text: el.nombre }))
                                            ]}
                                            error={errors.idTipoFuente?.message}
                                        />
                                    )
                                }

                            </Col>
                            <Col lg="4" md="12" sm="12" className="mb-4">
                                <CInput
                                    label="Referencia"
                                    name="referenciaFuente"
                                    {...register("referenciaFuente", {
                                        required: {
                                            value: false,
                                            message: 'El campo referencia es requerido'
                                        },
                                        maxLength: {
                                            value: 200,
                                            message: maxValueMessage('maxlength', 200)
                                        },
                                        disabled: allDisabled
                                    })}
                                    error={errors.solicitante?.message}
                                    maxLength="200"
                                />
                            </Col>
                            <Col lg="4" md="12" sm="12" className="mb-4">
                                <CInput
                                    type="date"
                                    label="Fecha de Publicación"
                                    name="fechaPublicacion"
                                    {...register("fechaPublicacion", {
                                        required: {
                                            value: false,
                                            message: 'El campo fecha de publicación es requerido'
                                        },
                                        disabled: allDisabled
                                    })}
                                    error={errors.fechaPublicacion?.message}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-2">

                            <Col lg="4" md="12" sm="12" className="mb-4">
                                <CInput
                                    label="Nombre de Contacto"
                                    name="contacto"
                                    {...register("contacto", {
                                        required: {
                                            value: false,
                                            message: 'El campo nombre de contacto es requerido'
                                        },
                                        maxLength: {
                                            value: 200,
                                            message: maxValueMessage('maxlength', 200)
                                        },
                                        disabled: allDisabled
                                    })}
                                    error={errors.contacto?.message}
                                    maxLength="200"
                                />
                            </Col>
                            <Col lg="4" md="12" sm="12" className="mb-4">
                                <CInput
                                    label="Teléfono de Contacto"
                                    name="contactoTelefono"
                                    {...register("contactoTelefono", {
                                        required: {
                                            value: false,
                                            message: 'El campo teléfono de contacto es requerido'
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: maxValueMessage('maxlength', 10)
                                        },
                                        disabled: allDisabled
                                    })}
                                    error={errors.contacto?.message}
                                    maxLength="10"
                                />
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <div className="flex">
                            <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">Datos de Bien</span>
                            <hr className=" flex-grow-1 u-text--gray-60" />
                        </div>
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
                                                    value: true,
                                                    message: 'El campo tipo de bien es requerido '
                                                },
                                                onChange: (e => {

                                                    let value = e.target.value;

                                                    if (value === "") {
                                                        setDataSubTipoBien([])
                                                        setDataFilter({ ...dataFilter, idTipoBien: '', idSubTipoBien: '' })
                                                    }
                                                    else {
                                                        tipoBienBuscar(value, 2);
                                                    }
                                                }),
                                                disabled: allDisabled
                                            })}
                                            options={[
                                                { id: '', text: 'Seleccione' },
                                                ...dataTipoBien.map(el => ({ id: el.id, text: el.nombre }))
                                            ]}
                                            requerido="1"
                                            error={errors.idTipoBien?.message}
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
                                        label="Sub Tipo de Bien"
                                    />)
                                    : (
                                        <CSelect
                                            label="Sub Tipo de Bien"
                                            name="idSubTipoBien"
                                            {...register("idSubTipoBien", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo sub tipo de bien es requerido '
                                                },
                                                onChange: (e => {

                                                    let value = e.target.value;

                                                    if (value === "") {
                                                        setDataSubTipoBien([])
                                                        setDataCategoriaSubTipoBien([])
                                                        setDataFilter({ ...dataFilter, idSubTipoBien: '', idCategoriaSubTipoBien: '' })
                                                    }
                                                    else {
                                                        tipoBienBuscar(value, 3);
                                                    }
                                                }),
                                                disabled: allDisabled
                                            })}
                                            options={[
                                                { id: '', text: 'Seleccione' },
                                                ...dataSubTipoBien.map(el => ({ id: el.id, text: el.nombre }))
                                            ]}
                                            requerido="1"
                                            error={errors.idSubTipoBien?.message}
                                        />
                                    )
                                }

                            </Col>
                            <Col lg="4" md="12" sm="12" className="mb-4">
                                {appContext.permisos.esUsuarioSoloConsultar ?
                                    (<CInput
                                        name="categoriaSubTipoBien"
                                        disabled={allDisabled}
                                        {...register("categoriaSubTipoBien", { required: false })}
                                        label="Categoría"
                                    />)
                                    : (
                                        <CSelect
                                            label="Categoría"
                                            name="idCategoriaSubTipoBien"
                                            {...register("idCategoriaSubTipoBien", {
                                                required: {
                                                    value: false,
                                                    message: 'El campo categoría es requerido '
                                                },
                                                disabled: allDisabled
                                            })}
                                            options={[
                                                { id: '', text: 'Seleccione' },
                                                ...dataCategoriaSubTipoBien.map(el => ({ id: el.id, text: el.nombre }))
                                            ]}
                                            error={errors.idCategoriaSubTipoBien?.message}
                                        />
                                    )
                                }

                            </Col>
                        </Row>

                        {/* end form 1 */}
                        <Row className="mb-2">
                            <div className="mt-2 flex gap-2 justify-space-between align-center w-100">
                                <span className=" title--20 u-text--gray-80 u-text--bold">Precio de Oferta</span>
                            </div>
                        </Row>
                        <hr className="u-text--gray-60 mb-2" />

                        <Row className="mb-2">
                            <Col lg="4" md="12" sm="12" className="mb-4"><CInput
                                label="Precio"
                                name="precio"
                                {...register("precio", {
                                    required: {
                                        value: false,
                                        message: 'El campo precio es requerido'
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: maxValueMessage('maxlength', 8)
                                    },
                                    min: {
                                        value: 0,
                                        message: 'El monto mímino es 0'
                                    },
                                    disabled: allDisabled
                                })}
                                min="0"
                                modInput="text-end"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                error={errors.montoCotizado?.message}
                                cRegex="integer"
                                maxLength="6"
                            />
                            </Col>

                        </Row>

                        <Row className="mb-2">
                            <div className="mt-2 flex gap-2 justify-space-between align-center w-100">
                                <span className=" title--20 u-text--gray-80 u-text--bold">Fotos</span>
                                {!appContext.permisos.esUsuarioSoloConsultar &&
                                    <CInputFile
                                        disabled={allDisabled}
                                        styleInputFile={{ justifyContent: 'center' }}
                                        type="file"
                                        name={`btnAgregarArchivo`}
                                        onChange={files => handleAddDocument(files)}
                                        children={'Agregar'}
                                        icon="add_circle"
                                        position="left"
                                        esMultiple={true}
                                        modAccept="image/png, image/jpg, image/jpeg"
                                        styleInput={{ width: '150px', justifyContent: 'center' }}
                                    />}
                            </div>
                        </Row>
                        <hr className="u-text--gray-60 mb-3" />
                        <div className="mb-2">
                            <Row className="c-card--2 u-shadow u-bg--white">
                                {dataArchivo.map(da => {
                                    return (
                                        <Col lg="2" sm="6" className="mb-3 mt-2" key={da.key} >
                                            <div className="c-file-card--1 c-file-card--responsive u-bg--white mb-2"
                                                style={{ backgroundImage: `url(${da.urlArchivoMiniatura})` }}
                                            >
                                                <button
                                                    disabled={allDisabled}
                                                    type="button" className="c-button--minimal u-text--red float-end m-1" onClick={(ev) => handleDeleteCliente(ev, da.key)}>
                                                    <Icon h="24">cancel</Icon>
                                                </button>

                                            </div>
                                            <p className="text-truncate u-text--gray-80 paragraph--14 u-text--bold" title={da.nombreOriginal}>
                                                {da.nombreOriginal}
                                            </p>

                                        </Col>)
                                })}
                            </Row>
                        </div>



                    </div>
                    <Row className="mb-2">
                        <div className="mt-2 flex justify-flex-end gap-4">
                            <a className="c-link" href="/EstudioMercado/Bien">
                                <CButton type="button" className="c-button--red">
                                    <Icon children="arrow_back" h="24" className="mr-2" />
                                Volver
                            </CButton>
                            </a>

                            {s_buttonSave && <CButton disabled={allDisabled} type="submit" isLoading={l_save} children="Guardar" className="c-button--blue">
                                <Icon children="save" h="24" className="mr-2" />
                                Guardar
                            </CButton>}
                        </div>
                    </Row>

                </form>
            </div>
        )
    }

    Global.View = ViewIntl;
})()
