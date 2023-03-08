(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner, Dropdown, Offcanvas, OverlayTrigger, Tooltip } = ReactBootstrap
    const { CustomToggle, CInput, CSelect, CBreadcrumbs, CButton, Icon, customStylesCbo, CFlags, CPagination, CPaginationCustom, handleError, AppContext, localSt, validateXSS, validateSql, validateCharacters } = Global
    const { useForm, Controller } = ReactHookForm;


    const ViewIntl = ({ intl }) => {

        let smart = {
            urlContext: '/Reporte/ReporteGeneral',
            urlGetUbigueoList: '/GetUbigueoList',
            urlGetList: '/GetList',
            urlExportXLS: '/ExportXLS',
            urlGetClientList: '/GetClientList',
            urlGetColaboradorList: '/GetColaboradorList',
            urlGetProductosList: '/GetProductosList',
            urlGetCatalogoValorList: '/Administracion/Catalogo/GetListValue',
            // urlSave: '/Save',
        }

        const appContext = useContext(AppContext);
        const { register, formState: { errors }, handleSubmit, setValue, getValues, control, watch, clearErrors } = useForm();

        const [rendered, setRendered] = useState(false)

        const [clientes, setClientes] = useState([])
        const [productos, setProductos] = useState([])

        const [colaboradores, setColaboradores] = useState([])

        const [departamento, setDepartamentos] = useState([])
        const [provincia, setProvincia] = useState([])
        const [distrito, setDistrito] = useState([])

        const [estados, setEstados] = useState([])


        const [errorData, setErrorData] = useState(false)
        const [l_data, setL_data] = useState(false)

        const [pagination, setPagination] = useState({
            text: '',
            total: 0,
            currentPage: 1,
            order: 'fechacreacion desc',
            // totalPages: 0,
            perPage: 10
        })

        const [filterData, setFilterData] = useState({
            fechaInicio: "",
            fechaFin: "",
            idCliente: "",
            idClienteProducto: "",
            idCoordinador: "",
            idInspector: "",
            idRevisor: "",
            idVisador: "",
            idDepartamento: "",
            idProvincia: "",
            idDistrito: "",
            direccion: "",
            //idEstado: 0
        })

        const [data, setData] = useState([])

        useEffect(() => {

            appContext.handleBreadcumb(true, [
                { url: '', name: "Reporte" },
                { url: '', name: "Reporte General de Pedidos" }
            ]);

            let fechaInicio = moment().add(-2, 'months');
            let fechaFin = moment().add(15, 'days');

            let params = {
                ...filterData,
                fechaInicio: fechaInicio.format("DD/MM/YYYY"),
                fechaFin: fechaFin.format("DD/MM/YYYY"),
            }

            setFilterData(params);

            setValue("fechaInicio", fechaInicio.format('YYYY-MM-DD'))
            setValue("fechaFin", fechaFin.format('YYYY-MM-DD'))

            let menuPermiso = appContext.menuPermiso("seguridad/rol")

            axios.all([menuPermiso]).
                then(response => {

                    let ubigueo = buscarUbigeo(1)
                    let cliente = listarCliente()
                    let colaborador = listarColaborador("4,5,6,2")
                    let estados = catalogoValorBuscar(2200)

                    axios.all([ubigueo, cliente, colaborador, estados])
                        .then(response => {
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


        }, [])

        useEffect(() => {
            if (rendered) {
                let params = { ...filterData }

                buscar({ ...params })

            }
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

        const buscarUbigeo = (_tipo, _codigo) => {

            let params = {
                tipo: _tipo,
                codigo: _codigo,
                ordenamiento: "nombre asc"

            };

            let listarUbigeo = AXIOS.get(`${smart.urlContext}${smart.urlGetUbigueoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        if (_tipo == 1) {
                            setDepartamentos(data.data)
                        }
                        else if (_tipo == 2) {
                            setProvincia(data.data)
                        }
                        else if (_tipo == 3) {
                            setDistrito(data.data)
                        }

                    }
                    else {
                        if (_tipo == 1) { setDepartamentos([]) }
                        else if (_tipo == 2) { setProvincia([]) }
                        else if (_tipo == 3) { setDistrito([]) }
                    }
                })
                .catch((error) => {
                    console.log(error)
                });

            return listarUbigeo;
        };

        const buscar = (filter) => {
            setL_data(true)
            setErrorData('')

            let params = {
                ...filter,
                idEstado: getValues("idEstado").map(item => item.value).toString(),
                texto: pagination.text,
                ordenamiento: pagination.order,
                pagina: pagination.currentPage,
                tamanio: pagination.perPage
            }

            axios.get(smart.urlContext + smart.urlGetList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setData(data.data)
                        setPagination({ ...pagination, total: data.total })
                        setL_data(false)
                    }
                    else {
                        setData([])
                        setPagination({ ...pagination, total: data.total })
                        setErrorData(data.apiMensaje)
                        setL_data(false)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })

        }


        const catalogoValorBuscar = (codigo) => {
            let params = {
                codigo: codigo
            };

            let listarPorCodigo =
                AXIOS.get(`${smart.urlGetCatalogoValorList}`, { params })
                    .then(({ data }) => {
                        if (data.apiEstado == "ok") {

                            if (codigo == '2200') {
                                setValue('idEstado', []);
                                setEstados(data.data)
                            }
                        }
                        else {
                            if (codigo == '2200') { setEstados([]) }
                        }
                    })
                    .catch(() => {
                        if (codigo == '2200') { setEstados([]) }
                    });

            return listarPorCodigo;

        }


        const listarColaborador = (idrol) => {

            let params = {
                texto: '',
                idtiporol: idrol,
                pagina: 0,
                ordenamiento: '',
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
                .catch((error) => {
                    console.log(error)
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
                .catch((error) => {
                    console.log(error)
                });

            return listarClientes;
        }

        const listarProductos = (_idcliente) => {

            let params = {
                idcliente: _idcliente,
            };

            let listarProductos = AXIOS.get(`${smart.urlContext}${smart.urlGetProductosList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setProductos(data.data)
                    }
                    else {
                        setProductos([])
                    }
                })
                .catch((error) => {
                    console.log(error)
                });

            return listarProductos;
        }


        const handleExportar = (e) => {

            let params = {
                ...filterData
            }

            exportar(params)
        }

        const exportar = (filtro) => {
            //setL_data(true)
            //setErrorData('')
            let params = {
                ...filtro,
                texto: pagination.text,
                ordenamiento: pagination.order,
                pagina: 0,
                tamanio: pagination.perPage
            }

            let date = new Date()
            var filename =
                "ReporteGeneral_" +
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

        const handleChangeLabel = (e, field) => {
            field.onChange(e)

            if (e) {
                let value = e.value

                if (value != '') {
                    clearErrors("idEstado")
                }
            }
        }

        const handleChange = (e) => {
            let nombre = e.target.name
            let value = e.target.value

            if (nombre === "texto") {
                setPagination({ ...pagination, text: e.target.value });
            }
            else {
                if (nombre == "fechaInicio" || nombre == "fechaFin") {
                    value = (moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                }

                if (nombre == "idCliente") {
                    listarProductos(value)
                }

                if (nombre == 'idDepartamento') {
                    setProvincia([])
                    setDistrito([])
                    buscarUbigeo(2, value)
                } else if (nombre == 'idProvincia') {
                    setDistrito([])
                    buscarUbigeo(3, value)
                }

                let dataPush = {
                    ...filterData,
                    [nombre]: value
                }

                setFilterData(dataPush)
            }
        }

        const handleCleanFilter = () => {

            let fechaInicio = moment().add(-2, 'months');
            let fechaFin = moment().add(15, 'days');

            let params = {
                fechaInicio: fechaInicio.format("DD/MM/YYYY"),
                fechaFin: fechaFin.format("DD/MM/YYYY"),
                idCliente: "",
                idClienteProducto: "",
                idCoordinador: "",
                idInspector: "",
                idRevisor: "",
                idVisador: "",
                idDepartamento: "",
                idProvincia: "",
                idDistrito: "",
                direccion: "",
                //idEstado: 0
            }

            setFilterData(params)

            setValue("fechaInicio", fechaInicio.format('YYYY-MM-DD'))
            setValue("fechaFin", fechaFin.format('YYYY-MM-DD'))
        }

        const handleBuscar = (e) => {
            if (pagination.currentPage == 1) {
                let params = {
                    ...filterData
                }

                buscar(params)
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


        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);



        const header = [
            { name: 'estado', className: '', nombre: 'Estado' },
            { name: 'codigo', className: 'justify-center', nombre: 'N° Informe' },
            { name: 'registro', className: 'justify-center', nombre: 'N° Registro' },
            { name: 'cliente', className: '', nombre: 'Solicitante' },
            { name: 'solicitante', className: '', nombre: 'Cliente' },
            { name: 'numerosolicitud', className: '', nombre: 'N° Solicitud' },
            { name: 'numerogarantia', className: '', nombre: 'N° Garantía' },
            { name: 'fechainicioinspeccion', className: 'justify-center', nombre: 'F Inspección' },
            { name: 'fechafininspeccion', className: 'justify-center', nombre: 'F. Culminación' },
            { name: 'tipotasacion', className: '', nombre: 'Tipo de Tasación' },
            { name: 'tipobien', className: '', nombre: 'Tipo de Bien' },
            { name: 'clienteproducto', className: '', nombre: 'Tipo de Producto' },
            { name: 'departamento', className: '', nombre: 'Departamento' },
            { name: 'provincia', className: '', nombre: 'Provincia' },
            { name: 'distrito', className: '', nombre: 'Distrito' },
            { name: 'direccion', className: '', nombre: 'Dirección' },
            { name: 'coordinador', className: '', nombre: 'Coordinador' },
            { name: 'inspector', className: '', nombre: 'Perito Inspector' },
            { name: 'revisor', className: '', nombre: 'Perito Revisor' },
            { name: 'visador', className: '', nombre: 'Perito Visador' },
            { name: 'funcionario', className: '', nombre: 'Funcionario' },
            { name: 'usuariocreacion', className: '', nombre: 'Usuario Creación' },
            { name: 'desestimado', className: 'justify-center', nombre: 'Desestimado' },
        ]

        return (
            <div className="o-container c-header__wrapper row mt-4" style={{ height: 'auto', alignItems: 'flex-start', marginBottom: '80px' }}>
                <div className="p-0 d-lg-flex w-100 justify-space-between">
                    <form onSubmit={handleSubmit(handleBuscar)} className="col-lg-8 d-md-flex gap-2 mb-3 p-0">
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
                            mod="c-input--search col-lg-8 col-md-10 mb-3"
                            icon="search"
                            placeholder="Ingrese texto a buscar"
                            onChange={e => handleChange(e)}
                        />
                        {appContext.permisos["esUsuarioConsultar"] && <CButton type="submit" isLoading={l_data}>
                            <Icon h="24" className="mr-2" children="search" />
                            Buscar
                        </CButton>}
                    </form>
                    <div className="d-flex justify-content-end col-lg-4 gap-2 p-0">
                        {appContext.permisos["esUsuarioExportar"] && <CButton type='button' className="c-button--green" onClick={handleExportar}>
                            <Icon h="24" className="mr-2" children="download" />
                            Exportar
                        </CButton>}
                        <CButton type="submit" className="c-button--blue" onClick={handleShow}>
                            <Icon h="24" className="mr-2" children="filter_alt" />
                            Filtrar
                        </CButton>
                    </div>
                </div>

                <div className="c-table c-table-nowraped" style={{ overflowX: 'scroll', overflowY: 'visible', paddingBottom: '20px', paddingLeft: '0px', paddingRight: '0px' }}>

                    <div className="c-table__container mt-2">
                        <table className="c-table__container--content mb-2">
                            <thead>
                                <tr>
                                    {
                                        header.map(item => (
                                            <th scope="col">
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
                                            data.map((item) =>
                                            (
                                                <tr key={item.id}>
                                                    <td className="text-center">
                                                        <OverlayTrigger
                                                            placement="bottom"
                                                            overlay={
                                                                <Tooltip id={`tooltip-${item.id}`}>
                                                                    <p className="flex align-center gap-3">
                                                                        <div className={`mx-auto state`} style={{ backgroundColor: item.estadocolor }}></div> {item.estado}
                                                                    </p>
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div className={`mx-auto state`} style={{ backgroundColor: item.estadocolor }}></div>
                                                        </OverlayTrigger>
                                                    </td>
                                                    <td className="text-center">{item.codigo}</td>
                                                    <td className="text-center u-text--bold">{item.registro}</td>
                                                    <td className="text-left u-text--regular">{item.cliente}</td>
                                                    <td className="text-left u-text--regular">{item.solicitante}</td>
                                                    <td className="text-left u-text--regular">{item.numerosolicitud}</td>
                                                    <td className="text-left u-text--regular">{item.numerogarantia}</td>
                                                    <td className="text-center u-text--regular">{item.fechainicioinspeccion}</td>
                                                    <td className="text-center u-text--regular">{item.fechafininspeccion}</td>
                                                    <td className="text-left u-text--regular">{item.tipotasacion}</td>
                                                    <td className="text-left u-text--regular">{item.tipobien}</td>
                                                    <td className="text-left u-text--regular">{item.clienteproducto}</td>
                                                    <td className="text-left u-text--regular">{item.departamento}</td>
                                                    <td className="text-left u-text--regular">{item.provincia}</td>
                                                    <td className="text-left u-text--regular">{item.distrito}</td>
                                                    <td className="text-left u-text--regular">{item.direccion}</td>
                                                    <td className="text-left u-text--regular">{item.coordinador}</td>
                                                    <td className="text-left u-text--regular">{item.inspector}</td>
                                                    <td className="text-left u-text--regular">{item.revisor}</td>
                                                    <td className="text-left u-text--regular">{item.visador}</td>
                                                    <td className="text-left u-text--regular">{item.funcionario}</td>
                                                    <td className="text-left u-text--regular">{item.usuariocreacion}</td>
                                                    <td className="text-center u-text--regular">{item.desestimado}</td>
                                                </tr>
                                            )
                                            )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <CPaginationCustom
                    totalCount={pagination.total}
                    currentPage={pagination.currentPage}
                    pageSize={pagination.perPage}
                    onPageChange={handleOnPageChange}
                    onSizeChange={handleOnSizeChange}
                />

                <Offcanvas show={show} placement="end" onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="title--30 u-text--gray-90 u-text--bold">Filtros</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="u-text--gray-60 m-0" />
                    <Offcanvas.Body className="px-3">
                        <span className="paragraph--14 u-text--gray-90">Fecha de envío de informe digital</span>
                        <form action="">
                            <CInput
                                name="fechaInicio"
                                {...register("fechaInicio", {
                                    required: {
                                        value: false,
                                        message: 'El campo Fecha Inicio es requerido'
                                    },
                                })}
                                //value={filterData.fechaInicio}
                                onChange={e => handleChange(e)}
                                type="date"
                                label="Desde"
                                mod="mb-3" />

                            <CInput
                                name="fechaFin"
                                {...register("fechaFin", {
                                    required: {
                                        value: false,
                                        message: 'El campo Fecha Fin es requerido'
                                    },
                                })}
                                //value={filterData.fechaFin}
                                onChange={e => handleChange(e)}
                                type="date"
                                label="Hasta"
                                mod="mb-3" />
                            <hr className="u-text--gray-60 m-0 mb-3" />

                            {/*
                                <CSelect
                                value={filterData.idEstado}
                                esMultiple={true}
                                onChange={e => handleChange(e)}
                                name="idEstado"
                                options={[{ id: 0, text: 'Seleccionar' }, ...estados.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Estado"
                                mod="mb-3"
                            />  */}

                            <Controller
                                name="idEstado"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) =>
                                    <>
                                        <label className="c-input__label u-text--regular u-text--gray-90" htmlFor={"id-estado"}>
                                            {"Estado"}
                                        </label>
                                        <Select
                                            id="id-estado"
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 2,
                                            })}
                                            styles={customStylesCbo}
                                            isClearable
                                            isMulti
                                            placeholder={'Seleccionar'}
                                            {...field}
                                            options={[...estados.map(el => ({ value: el.id, label: el.nombre }))]}
                                            onChange={(e) => { handleChangeLabel(e, field) }}
                                        />
                                    </>
                                } />
                            <CSelect
                                value={filterData.idCliente}
                                onChange={e => handleChange(e)}
                                name="idCliente"
                                options={[{ id: '', text: 'Seleccionar' }, ...clientes.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Solicitante"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idClienteProducto}
                                onChange={e => handleChange(e)}
                                name="idClienteProducto"
                                options={[{ id: '', text: 'Seleccionar' }, ...productos.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Tipo de producto"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idCoordinador}
                                onChange={e => handleChange(e)}
                                name="idCoordinador"
                                options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 4).map(el => ({ id: el.id, text: el.colaborador }))]}
                                label="Coordinador"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idInspector}
                                onChange={e => handleChange(e)}
                                name="idInspector"
                                options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 5).map(el => ({ id: el.id, text: el.colaborador }))]}
                                label="Inspector"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idRevisor}
                                onChange={e => handleChange(e)}
                                name="idRevisor"
                                options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 6).map(el => ({ id: el.id, text: el.colaborador }))]}
                                label="Revisor"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idVisador}
                                onChange={e => handleChange(e)}
                                name="idVisador"
                                options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 2).map(el => ({ id: el.id, text: el.colaborador }))]}
                                label="Visador"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idDepartamento}
                                onChange={e => handleChange(e)}
                                name="idDepartamento"
                                options={[{ id: '', text: 'Seleccione' }, ...departamento.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                label="Departamento"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idProvincia}
                                onChange={e => handleChange(e)}
                                name="idProvincia"
                                options={[{ id: '', text: 'Seleccione' }, ...provincia.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                label="Provincia"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idDistrito}
                                onChange={e => handleChange(e)}
                                name="idDistrito"
                                options={[{ id: '', text: 'Seleccione' }, ...distrito.map(el => ({ id: el.codigo, text: el.nombre }))]}
                                label="Distrito"
                                mod="mb-3"
                            />

                            <CInput value={filterData.direccion} onChange={e => handleChange(e)} name="direccion" label="direccion" mod="mb-3" />
                            <div className="flex justify-content-between">
                                <CButton onClick={handleCleanFilter} type="button">
                                    <Icon h="24" className="mr-2" children="restart_alt" />
                                    Limpiar
                                </CButton>
                                {appContext.permisos["esUsuarioConsultar"] && <CButton onClick={handleBuscar} className="c-button--blue" type='button'>
                                    <Icon h="24" className="mr-2" children="filter_alt" />
                                    Aplicar
                                </CButton>}
                            </div>
                        </form>
                    </Offcanvas.Body>
                </Offcanvas>

            </div>
        )
    }
    Global.View = ViewIntl;
})()
