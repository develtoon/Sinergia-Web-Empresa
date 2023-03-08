(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner, Dropdown, Offcanvas, OverlayTrigger, Tooltip } = ReactBootstrap
    const { CustomToggle, CInput, CSelect, CBreadcrumbs, CButton, CPaginationCustom, handleError, Icon, CFlags, CPagination, AppContext, localSt, validateXSS, validateSql, validateCharacters } = Global
    const { useForm, Controller } = ReactHookForm;


    let smart = {
        urlContext: '/Reporte/ReporteControl',
        urlGetList: '/GetList',
        urlExportXLS: '/ExportXLS',
        urlGetColaboradorList: '/GetColaboradorList',
        urlGetTimeList: '/GetTimeList',
        urlGetCatalogoValorList: '/Administracion/Catalogo/GetListValue',
    }


    const ViewIntl = ({ intl }) => {


        const appContext = useContext(AppContext);
        const [rendered, setRendered] = useState(false)

        const [data, setData] = useState([])
        const { register, formState: { errors }, handleSubmit, setValue, watch, clearErrors } = useForm();


        const [colaboradores, setColaboradores] = useState([])
        const [semaforo, setSemaforo] = useState([])
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
            idCoordinador: "",
            idInspector: "",
            idRevisor: "",
            idVisador: "",
            idSemaforo: 0,
            idEstado: 0,
        })

        useEffect(() => {
            appContext.handleBreadcumb(true, [
                { url: '', name: "Reporte" },
                { url: '', name: "Reportes de Control" }
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

            let menuPermiso = appContext.menuPermiso("reporte/reportecontrol")

            axios.all([menuPermiso]).
                then(response => {
                    setRendered(true)
                }).
                catch(error => {
                    setRendered(true)
                    console.log("error")
                })

        }, [])

        useEffect(() => {
            if (rendered) {
                let listarColaboradores = listarColaborador("4,5,6,2")
                let listarRelojes = listarReloj(12012)
                let listarEstados = catalogoValorBuscar(2200)

                axios.all([listarColaboradores, listarRelojes, listarEstados]).
                    then(response => {
                        buscar({ ...filterData })
                    }).
                    catch(error => {
                        console.log("error");
                    });

            }
        }, [rendered, pagination.currentPage, pagination.perPage, pagination.order])


        const buscar = (filter) => {
            setL_data(true)
            setErrorData('')

            let params = {
                ...filter,
                texto: pagination.text,
                ordenamiento: pagination.order,
                pagina: pagination.currentPage,
                tamanio: pagination.perPage
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
                .catch((e) => {
                    console.log('error')
                    console.log(e)
                })

        }


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
                "ReporteControl_" +
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
                idCoordinador: "",
                idInspector: "",
                idRevisor: "",
                idVisador: "",
                idSemaforo: 0,
                idEstado: 0
            }

            setFilterData(params)

            setValue("fechaInicio", fechaInicio.format('YYYY-MM-DD'))
            setValue("fechaFin", fechaFin.format('YYYY-MM-DD'))

        }

        const catalogoValorBuscar = (codigo) => {
            let params = {
                codigo: codigo
            };

            let listarPorCodigo =
                AXIOS.get(`${smart.urlGetCatalogoValorList}`, { params })
                    .then(({ data }) => {
                        if (data.apiEstado == "ok") {
                            if (codigo == '2200') { setEstados(data.data) }
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

        const listarReloj = (_id) => {

            let params = {
                id: _id
            };

            let listarColaboradores = AXIOS.get(`${smart.urlContext}${smart.urlGetTimeList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setSemaforo(data.data)
                    }
                    else {
                        setSemaforo([])
                    }
                })
                .catch(() => {
                    console.log('error')
                });

            return listarColaboradores;
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
                .catch(() => {
                    console.log('error')
                });

            return listarColaboradores;
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

        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);


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
            { name: '', className: '', nombre: '' },
            { name: 'idestado', className: 'justify-center', nombre: 'Estado' },
            { name: 'solicitante', className: '', nombre: 'Cliente' },
            { name: 'cliente', className: '', nombre: 'Solicitante' },
            { name: 'codigo', className: 'justify-center', nombre: 'N° Trabajo' },
            { name: 'numerosolicitud', className: '', nombre: 'N° Solicitud' },
            { name: 'departamento', className: '', nombre: 'Departamento' },
            { name: 'provincia', className: '', nombre: 'Provincia' },
            { name: 'distrito', className: '', nombre: 'Distrito' },
            { name: 'direccion', className: '', nombre: 'Dirección' },
            { name: 'coordinador', className: '', nombre: 'Coordinador' },
            { name: 'fechacoordinacion', className: 'justify-center', nombre: 'F. Coordinación' },
            { name: 'fechaasignacion', className: 'justify-center', nombre: 'F. Asignación' },
            { name: 'inspector', className: '', nombre: 'Inspector' },
            { name: 'fechainspeccion', className: 'justify-center', nombre: 'F. Inspección' },
            { name: 'fechainforme', className: 'justify-center', nombre: 'F. Informe' },
            { name: 'revisor', className: '', nombre: 'Revisor' },
            { name: 'fecharevision', className: 'justify-center', nombre: 'F. Informe Rev.' },
            { name: 'visador', className: '', nombre: 'Visador' },
            { name: 'fechavisado', className: 'justify-center', nombre: 'F. Informe Vis.' },
            { name: 'usuariocreacion', className: '', nombre: 'Usuario Creación' },
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
                        <CButton className="c-button--blue" type='button' onClick={handleShow}>
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
                                                            key={`timer_${item.id}`}
                                                            placement="bottom"
                                                            overlay={
                                                                item.tiposemaforoestado ?
                                                                    <Tooltip id={`tooltip-time-${item.id}`}>
                                                                        <span>
                                                                            {item.tiposemaforoestado}
                                                                        </span>
                                                                    </Tooltip>
                                                                    :
                                                                    <div></div>
                                                            }
                                                        >
                                                            <div className={`mx-auto state`}>
                                                                <Icon children="access_time" className={`u-text--timer u-text--color-time-state-${item.tiposemaforo}`} />
                                                            </div>
                                                        </OverlayTrigger>
                                                    </td>
                                                    <td className="text-center">
                                                        <OverlayTrigger
                                                            key={item.id}
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
                                                    <td className="text-left u-text--bold">{item.solicitante}</td>
                                                    <td className="text-left u-text--regular">{item.cliente}</td>
                                                    <td className="text-center u-text--regular">{item.codigo}</td>
                                                    <td className="text-left u-text--regular">{item.numerosolicitud}</td>
                                                    <td className="text-left u-text--regular">{item.departamento}</td>
                                                    <td className="text-left u-text--regular">{item.provincia}</td>
                                                    <td className="text-left u-text--regular">{item.distrito}</td>
                                                    <td className="text-left u-text--regular">{item.direccion}</td>
                                                    <td className="text-left u-text--regular">{item.coordinador}</td>
                                                    <td className="text-center u-text--regular">{item.fechacoordinacion}</td>
                                                    <td className="text-center u-text--regular">{item.fechaasignacion}</td>
                                                    <td className="text-left u-text--regular">{item.inspector}</td>
                                                    <td className="text-center u-text--regular">{item.fechainspeccion}</td>
                                                    <td className="text-center u-text--regular">{item.fechainforme}</td>
                                                    <td className="text-left u-text--regular">{item.revisor}</td>
                                                    <td className="text-center u-text--regular">{item.fecharevision}</td>
                                                    <td className="text-left u-text--regular">{item.visador}</td>
                                                    <td className="text-center u-text--regular">{item.fechavisado}</td>
                                                    <td className="text-left u-text--regular">{item.usuariocreacion}</td>
                                                    {/* <td className="text-left u-text--regular">FALTA EL FUNCIONARIO</td> */}
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
                        <form>

                            <CInput
                                //value={filterData.fechaInicio}
                                name="fechaInicio"
                                {...register("fechaInicio", {
                                    required: {
                                        value: false,
                                        message: 'El campo Fecha Inicio es requerido'
                                    },
                                })}
                                type="date"
                                label="Desde"
                                mod="mb-3"
                                onChange={e => handleChange(e)}
                            />

                            <CInput
                                //value={filterData.fechaFin}
                                name="fechaFin"
                                {...register("fechaFin", {
                                    required: {
                                        value: false,
                                        message: 'El campo Fecha Fin es requerido'
                                    },
                                })}
                                type="date"
                                label="Hasta"
                                mod="mb-3"
                                onChange={e => handleChange(e)}
                            />

                            <hr className="u-text--gray-60 m-0 mb-4" />

                            <CSelect
                                value={filterData.idEstado}
                                onChange={e => handleChange(e)}
                                name="idEstado"
                                options={[{ id: '0', text: 'Seleccionar' }, ...estados.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Estado"
                                mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idSemaforo}
                                onChange={e => handleChange(e)}
                                name="idSemaforo"
                                options={[{ id: '0', text: 'Seleccionar' }, ...semaforo.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Semáforo"
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
                                label="Revisor" mod="mb-3"
                            />
                            <CSelect
                                value={filterData.idVisador}
                                onChange={e => handleChange(e)}
                                name="idVisador"
                                options={[{ id: '', text: 'Seleccionar' }, ...colaboradores.filter(el => el.idtiporol == 2).map(el => ({ id: el.id, text: el.colaborador }))]}
                                label="Visador" mod="mb-3"
                            />


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
