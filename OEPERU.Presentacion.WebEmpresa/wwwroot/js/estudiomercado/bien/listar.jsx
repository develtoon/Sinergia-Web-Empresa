(function () {
    const { useState, useEffect, Fragment, useContext } = React;

    const { requiredMessage, patterns, minValueMessage, maxValueMessage, formatMonedaNumber } = Utils
    const { Col, Row, Spinner, Dropdown, Offcanvas, Popover, OverlayTrigger } = ReactBootstrap
    const { CInput, CustomToggle, CSelect, CBreadcrumbs, CButton, Icon, CFlags, COPagination, CPagination, CPaginationCustom, handleError, AppContext, localSt, CSwitch, validateXSS, validateSql, validateCharacters } = Global
    const { useForm, Controller } = ReactHookForm;


    let smart = {
        urlContext: '/EstudioMercado/Bien',
        urlGetList: '/GetList',
        urlExportXLS: '/ExportXLS',
        urlDelete: '/Delete',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
        urlGetTipoBienList: '/Administracion/TipoBien/GetTipoBienList',
        urlGetSubTipoBienList: '/Administracion/TipoBien/GetSubTipoBienList',
        urlGetCategoriaSubTipoBienList: '/Administracion/TipoBien/GetCategoriaSubTipoBienList',
        urlGetUbigeoGetList: '/Administracion/Ubigeo/GetList',
    }


    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);
        const [dataEstado, setDataEstado] = useState([])
        const [rendered, setRendered] = useState(false)
        const [data, setData] = useState([])
        const [errorData, setErrorData] = useState('')
        const [l_data, setL_data] = useState(false)

        const [dataTipoBien, setDataTipoBien] = useState([]);
        const [dataSubTipoBien, setDataSubTipoBien] = useState([]);
        const [dataCategoriaSubTipoBien, setDataCategoriaSubTipoBien] = useState([]);

        const [dataDepartamento, setDataDepartamento] = useState([])
        const [dataProvincia, setDataProvincia] = useState([])
        const [dataDistrito, setDataDistrito] = useState([])

        const [showList, setshowList] = useState(true)
        const [showFilter, setShowFilter] = useState(false)

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
            idEstado: 0,
            fechaInicio: '',
            fechafin: '',
            idCategoriaSubTipoBien: '',
            idDepartamento: '',
            idProvincia: '',
            idDistrito: '',
            direccion: '',
            neLat: '',
            neLng: '',
            swLat: '',
            swLng: ''
        })

        useEffect(() => {

            let menuPermiso = appContext.menuPermiso("estudiomercado/bien")

            axios.all([menuPermiso]).
                then(response => {

                    let ubigueo = buscarUbigeo(1)
                    let listarEstado = catalogoEstadoBuscar(11102);
                    let listarTipoBien = tipoBienBuscar('', 1);

                    axios.all([ubigueo, listarEstado, listarTipoBien]).
                        then(response => {

                            appContext.handleBreadcumb(true, [
                                { url: '', name: "Estudio de Mercado" },
                                { url: '/estudiomercado/bien', name: "Gestión de Bienes" }
                            ]);

                            setRendered(true);
                        }).
                        catch(error => {
                            console.log("error");
                        });
                }).
                catch(error => {
                    setRendered(true)
                    console.log("error")
                })

            appContext.handleBreadcumb(true, [
                { url: '', name: "Estudio de Mercado" },
                { url: '', name: "Gestión de Bienes" }
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
            else if (_tipo == 3) {
                params.id = _id;
                url = smart.urlGetCategoriaSubTipoBienList;
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
                        else if (_tipo == 3) {
                            setDataCategoriaSubTipoBien(data.data);
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

        const buscar = (newDataFilter) => {
            setL_data(true)
            setErrorData('')

            let params = {};

            let tipoBusqueda = 1;

            if (!showList) {
                tipoBusqueda = 2;
            }

            if (newDataFilter == null) {
                params = {
                    ...dataFilter,
                    tipoBusqueda: tipoBusqueda,
                    texto: pagination.text,
                    ordenamiento: pagination.order,
                    pagina: pagination.currentPage,
                    tamanio: pagination.perPage
                }
            }
            else {
                params = {
                    ...newDataFilter, tipoBusqueda: tipoBusqueda
                };
            }

            AXIOS.get(smart.urlContext + smart.urlGetList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setData(data.data)
                        setPagination({ ...pagination, total: data.total })
                        setL_data(false)
                    }
                    else {
                        setData(data.data)
                        setPagination({ ...pagination, total: data.total })
                        setErrorData(data.apiMensaje)
                        setL_data(false)
                    }
                })
                .catch((error) => {

                    let status = error.response.status;

                    if (status == 404) {
                        setErrorData(error.response.data.apiMensaje)
                    }
                    else if (status == 401) {
                        setErrorData(error.response.data.apiMensaje);
                        handleError(error);
                    }

                    setData([]);
                    setL_data(false);
                    setPagination({ ...pagination, total: 0 })
                })

        }

        const exportar = () => {
            //setL_data(true)
            setErrorData('')

            let params = {
                ...dataFilter,
                texto: pagination.text,
                ordenamiento: pagination.order,
                pagina: pagination.currentPage,
                tamanio: pagination.perPage
            }

            let date = new Date()
            let filename =
                "Gestión_Bien_" +
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
                    console.error('Error ocurrido', error);
                })

        }


        // --------- section Handlers ------------

        const handleChange = (e) => {
            let name = e.target.name;
            let value = e.target.value;

            if (name === "texto") {
                setPagination({ ...pagination, texto: value });
            }
            else {
                if (name === "idTipoBien") {
                    if (value === "") {
                        setDataSubTipoBien([])
                        setDataFilter({ ...dataFilter, idTipoBien: '', idSubTipoBien: '' })
                    }
                    else {
                        tipoBienBuscar(value, 2);
                    }
                }
                else if (name === "idSubTipoBien") {
                    if (value === "") {
                        setDataSubTipoBien([])
                        setDataCategoriaSubTipoBien([])
                        setDataFilter({ ...dataFilter, idSubTipoBien: '', idCategoriaSubTipoBien: '' })
                    }
                    else {
                        tipoBienBuscar(value, 3);
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
                let dataPush = {
                    ...dataFilter,
                    [name]: value
                }

                setDataFilter(dataPush)
            }

        }

        const handleCleanFilter = () => {

            let params = {
                ...dataFilter,
                idTipoBien: '',
                idSubTipoBien: '',
                estado: 0,
                fechaInicio: '',
                fechafin: '',
                idCategoriaSubTipoBien: '',
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

        /*Filtro*/
        const handleShowFilter = () => {
            setShowFilter(!showFilter)
        }

        const handleClose = () => {
            setShowFilter(false)
        }


        /*Fin Filtro*/
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



        const MarkerComponent = ({ codigo, ubigeo, direccion, tipoBien, precio, color }) => (
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
                                <span className="u-text--gray-90 paragraph--14">{precio}</span>
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

        return (
            <div className="o-container c-header__wrapper flex-column mt-4" style={{ height: 'auto', marginBottom: '80px' }}>

                <div className='col-lg-12 p-0  col-sm-12'>
                    <div className="row w-100 justify-space-between">
                        <form onSubmit={handleSubmit(handleBuscar)} className="gap-2 px-2">
                            <div className="d-flex justify-space-between col-lg-12 gap-2 p-0">
                                <CInput
                                    name="texto"
                                    {...register("texto", {
                                        validate: {
                                            valXSS: value => validateXSS(value) || 'Búsqueda inválida',
                                            valSql: value => validateSql(value) || 'Búsqueda inválida',
                                            valCha: value => validateCharacters(value) || 'Búsqueda inválida'
                                        }
                                    })}
                                    error={errors.texto?.message}
                                    mod="c-input--search col-md-4 col-sm-8 mb-3"
                                    icon="search"
                                    placeholder="Ingrese texto a buscar"
                                    onChange={e => handleChange(e)}
                                />

                                <CSelect name="idTipoBien" placeholder="Tipo Bien"
                                    options={[{ id: '', text: 'Todos' }, ...dataTipoBien.map(it => ({ id: it.id, text: it.nombre }))]}
                                    onChange={e => handleChange(e)}
                                    mod="col-md-3 col-sm-4 mb-3"
                                />
                                <CSelect name="idSubTipoBien" placeholder="Sub Tipo Bien"
                                    options={[{ id: '', text: 'Todos' }, ...dataSubTipoBien.map(it => ({ id: it.id, text: it.nombre }))]}
                                    onChange={e => handleChange(e)} mod="col-md-3 col-sm-4 mb-3"
                                />
                                <CSelect name="idEstado" placeholder="Estado"
                                    options={[{ id: '', text: 'Todos' }, ...dataEstado.map(it => ({ id: it.id, text: it.nombre }))]}
                                    onChange={e => handleChange(e)} mod="col-md-2 col-sm-4 mb-3"
                                />
                            </div>
                            <div className="d-flex justify-content-end col-lg-12 gap-2 p-0">
                                {appContext.permisos.esUsuarioConsultar && <CButton type="submit">
                                    <Icon children="search" className="mr-2" h="24" />
                                        Buscar
                                    </CButton>}
                                {appContext.permisos.esUsuarioConsultar && <CButton type="button" className="c-button--red" onClick={handleShowFilter}>
                                    <Icon children="filter_alt" className="mr-2" h="24" />
                                        Filtrar
                                    </CButton>}
                                {appContext.permisos.esUsuarioExportar && <CButton type="button" className="c-button--green" onClick={handleExportar}>
                                    <Icon children="download" className="mr-2" h="24" />
                                        Exportar
                                    </CButton>}
                                {appContext.permisos.esUsuarioCrear && <a className="c-link" href="/EstudioMercado/Bien/Create">
                                    <CButton type="button" className="c-button--blue">
                                        <Icon children="add_circle" className="mr-2" h="24" />
                                            Agregar
                                        </CButton>
                                </a>}
                                <CSwitch
                                    onChange={e => handleShowList(e)}
                                    mapa
                                />
                            </div>
                        </form>
                    </div>

                    {showList && <div className="c-table c-table-nowraped">

                        <div className="c-table__container c-table__container--nowrapper">
                            <table className="c-table__container--content mb-2">
                                <thead>
                                    <tr>
                                        <th scope="c-table__options">
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
                                            <div className="text-left flex align-left" onClick={() => { setOrderDir('categoriasubtipobien') }}>
                                                Categoría
                                            {getOrderDir('categoriasubtipobien')}
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
                                            <div className="text-end flex align-left" onClick={() => { setOrderDir('precio') }}>
                                                Precio
                                            {getOrderDir('precio')}
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
                                                                        <Dropdown.Item href={`/EstudioMercado/Bien/Edit/${item.id}`} eventKey="1">{appContext.permisos.esUsuarioEditar ? 'Editar' : 'Ver'}</Dropdown.Item>
                                                                        {appContext.permisos.esUsuarioEliminar && <Dropdown.Item onClick={(ev) => handleDelete(ev, item.id)} eventKey="2">Eliminar</Dropdown.Item>}
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </td>
                                                            <td className="text-center u-text--regular" style={{ width: "80px" }}>{item.codigo}</td>
                                                            <td className="text-left u-text--bold">{item.tipobien}</td>
                                                            <td className="text-left u-text--bold">{item.subtipobien}</td>
                                                            <td className="text-left u-text--bold">{item.categoriasubtipobien}</td>
                                                            <td className="text-left u-text--bold">{item.direccion}</td>
                                                            <td className="text-left u-text--bold">{item.departamento}</td>
                                                            <td className="text-left u-text--bold">{item.provincia}</td>
                                                            <td className="text-left u-text--bold">{item.distrito}</td>
                                                            <td className="text-end u-text--bold">{`${item.monedaabreviatura} ${formatMonedaNumber(item.precio, 2)}`}</td>
                                                            <td className="text-center u-text--regular">{item.fechacreacion}</td>
                                                            <td className="text-left u-text--regular">{item.usuariocreacion}</td>
                                                            <td className="text-center u-text--bold" style={{ width: "150px" }}><div className={`c-card--estado c-card--estado-${item.idestado == 1 ? 'active' : 'inactive'}`}>{item.estado}</div></td>
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
                        >
                            {
                                data.map(item => (
                                    <MarkerComponent
                                        lat={item.latitud}
                                        lng={item.longitud}
                                        codigo={item.codigo}
                                        ubigeo={`${item.departamento}, ${item.provincia}, ${item.distrito}`}
                                        tipoBien={`${item.tipobien}, ${item.subtipobien}${item.categoriasubtipobien == '' ? '' : ','} ${item.categoriasubtipobien}`}
                                        precio={`${item.monedaabreviatura} ${formatMonedaNumber(item.precio, 2)}`}
                                        color={item.colormarcador}
                                    />
                                ))
                            }
                        </GoogleMapReact>
                    </div>}
                </div>
                <Offcanvas placement={'end'} show={showFilter} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="title--30 u-text--gray-90 u-text--bold">Filtros</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="u-text--gray-60 m-0" />
                    <Offcanvas.Body className="px-3 paragraph--16 u-text--gray-90">
                        <CInput
                            value={dataFilter.fechaInicio}
                            name="fechaInicio"
                            label="Desde:"
                            type="date"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        />
                        <CInput
                            value={dataFilter.fechafin}
                            name="fechafin"
                            label="Hasta:"
                            type="date"
                            mod="mb-2"
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            value={dataFilter.idCategoriaSubTipoBien}
                            name="idCategoriaSubTipoBien"
                            label="Categoría"
                            options={[{ id: '', text: 'Seleccione' }, ...dataCategoriaSubTipoBien.map(el => ({ id: el.id, text: el.nombre }))]}
                            onChange={e => handleChange(e)}
                        />
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
                        <CInput
                            value={dataFilter.direccion}
                            onChange={e => handleChange(e)}
                            name="direccion"
                            label="direccion"
                            mod="mb-3" />

                        <div className="flex justify-content-between">
                            <CButton onClick={handleCleanFilter} type="reset">
                                <Icon h="24" className="mr-2" children="restart_alt" />
                                    Limpiar
                                </CButton>
                            {appContext.permisos["esUsuarioConsultar"] && <CButton onClick={handleBuscar} className="c-button--blue" type='button'>
                                <Icon h="24" className="mr-2" children="filter_alt" />
                                    Aplicar
                                </CButton>}
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        )
    }
    Global.View = ViewIntl;
})()
