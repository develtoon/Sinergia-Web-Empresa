(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner, Dropdown, DropdownButton } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, CPaginationCustom, handleError, AppContext, localSt, CustomToggle, validateXSS, validateSql, validateCharacters } = Global
    const { useForm, Controller } = ReactHookForm;


    let smart = {
        urlContext: '/Administracion/Cliente',
        urlGetList: '/GetList',
        urlExportXLS: '/ExportXLS',
        urlDelete: '/Delete',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
    }

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        const [estado, setEstado] = useState(0)
        const [rendered, setRendered] = useState(false)
        const [data, setData] = useState([])
        const [estados, setEstados] = useState([])
        const [errorData, setErrorData] = useState('')
        const [l_data, setL_data] = useState(false)
        const [l_buscar, setL_buscar] = useState(false)

        const { register, formState: { errors }, handleSubmit, setValue, watch, clearErrors } = useForm();
        const [pagination, setPagination] = useState({
            text: '',
            total: 0,
            currentPage: 1,
            order: 'fechacreacion desc',
            // totalPages: 0,
            perPage: 10
        })


        useEffect(() => {

            appContext.handleBreadcumb(true, [
                { url: '', name: "Administración" },
                { url: '', name: "Clientes" }
            ]);

            //estados
            let menuPermiso = appContext.menuPermiso("administracion/cliente")

            axios.all([menuPermiso])
                .then(response => {
                    let catalogoListar = catalogoEstadoBuscar(11300);

                    axios.all([catalogoListar])
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
            if (rendered) buscar()
        }, [rendered, pagination.currentPage, pagination.perPage, pagination.order])


        const catalogoEstadoBuscar = (_codigo) => {

            let params = {
                codigo: _codigo
            };

            let estadoListar = AXIOS.get(`${smart.urlGetCatalogoEstadoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setEstados(data.data)
                    }
                    else {
                        setEstados([])
                    }
                })
                .catch((error) => {
                    setEstados([])
                });

            return estadoListar;
        }

        const buscar = () => {
            setL_data(true)
            setL_buscar(true);
            setErrorData('')

            let params = {
                texto: pagination.text,
                estado: estado,
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
                        setL_buscar(false)

                    }
                    else {
                        setData(data.data)
                        setPagination({ ...pagination, total: data.total })
                        setErrorData(data.apiMensaje)
                        setL_data(false)
                        setL_buscar(false)

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
                    setL_buscar(false)
                    setPagination({ ...pagination, total: 0 })
                })
        }

        const exportar = () => {
            //setL_data(true)
            setErrorData('')

            let params = {
                texto: pagination.text,
                estado: estado,
                ordenamiento: pagination.order,
                pagina: pagination.currentPage,
                tamanio: pagination.perPage
            }

            let date = new Date()
            var filename =
                "Empresa_Cliente_" +
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

        const handleChange = (e) => {
            var name = e.target.name;
            var value = e.target.value;

            if (name === "texto") {
                setPagination({ ...pagination, text: value });
            }
            else if (name === "estado") {
                setEstado(value);
            }
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



        return (
            <div className="o-container c-header__wrapper flex-column mt-4" style={{ height: 'auto', marginBottom: '80px' }}>
                <div className="row w-100 justify-space-between">
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
                            mod="c-input--search col-lg-6 mb-3"
                            icon="search"
                            placeholder="Ingrese texto a buscar"
                            onChange={e => handleChange(e)}
                        />
                        <CSelect
                            name="estado"
                            placeholder="Estado"
                            options={[{ id: '', text: 'Todos (Estado)' }, ...estados.map(it => ({ id: it.id, text: it.nombre }))]}
                            onChange={handleChange}
                            mod="col-md-3 mb-3"
                        />
                        {appContext.permisos.esUsuarioConsultar && <CButton type="submit" isLoading={l_buscar}>
                            <Icon h="24" className="mr-2" children="search" />
                            Buscar
                        </CButton>}
                    </form>
                    <div className="d-flex justify-content-end col-lg-4 gap-2 p-0">
                        {appContext.permisos.esUsuarioExportar && <CButton type='button' className="c-button--green" onClick={handleExportar}>
                            <Icon h="24" className="mr-2" children="download" />
                            Exportar
                        </CButton>}
                        {appContext.permisos.esUsuarioCrear && <a className="c-link" href="/administracion/cliente/create">
                            <CButton className="c-button--blue" type='button'>
                                <Icon h="24" className="mr-2" children="add_circle" />
                                Crear
                            </CButton>
                        </a>}
                    </div>
                </div>
                <div className="c-table">
                    <div className="c-table__container mt-2">
                        <table className="c-table__container--content mb-2">
                            <thead>
                                <tr>
                                    <th scope="c-table__options text-center">
                                    </th>
                                    <th scope="col">
                                        <div className="text-center flex align-center justify-center" onClick={() => { setOrderDir('codigo') }}>
                                            Código
                                            {getOrderDir('codigo')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-left flex align-center" onClick={() => { setOrderDir('nombre') }}>
                                            Nombre
                                            {getOrderDir('nombre')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-left flex align-center" onClick={() => { setOrderDir('abreviatura') }}>
                                            Abreviatura
                                            {getOrderDir('abreviatura')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-left flex align-center" onClick={() => { setOrderDir('tipodocumento') }}>
                                            Tipo de Documento
                                            {getOrderDir('tipodocumento')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-left flex align-center" onClick={() => { setOrderDir('documento') }}>
                                            Documento
                                            {getOrderDir('documento')}
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
                                            {getOrderDir('usuariocreacion')}
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
                                                        <td className="c-table__options text-center">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item eventKey="1" href={`/Administracion/Cliente/Edit/${item.id}`}>{appContext.permisos.esUsuarioEditar ? 'Editar' : 'Ver'}</Dropdown.Item>
                                                                    {appContext.permisos.esUsuarioEliminar && <Dropdown.Item onClick={(ev) => handleDelete(ev, item.id)} eventKey="2">Eliminar</Dropdown.Item>}
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                        <td className="text-center u-text--regular u-text--bold" style={{ width: "80px" }}>{item.codigo}</td>
                                                        <td className="text-left u-text--regular">{item.nombre}</td>
                                                        <td className="text-left u-text--regular">{item.abreviatura}</td>
                                                        <td className="text-left u-text--regular">{item.tipodocumento}</td>
                                                        <td className="text-left u-text--regular">{item.documento}</td>
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
            </div>
        )
    }
    Global.View = ViewIntl;
})()
