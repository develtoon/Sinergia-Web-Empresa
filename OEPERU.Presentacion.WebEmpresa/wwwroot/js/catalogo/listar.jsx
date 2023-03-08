(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner, Dropdown } = ReactBootstrap
    const { CustomToggle, CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, AppContext, localSt } = Global
    const { useForm, Controller } = ReactHookForm;

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        const [text, setText] = useState('')
        const [rendered, setRendered] = useState(false)
        const [data, setData] = useState([])
        const [errorData, setErrorData] = useState('')
        const [l_data, setL_data] = useState(false)
        const [l_buscar, setL_buscar] = useState(false)
        const [order, setOrder] = useState('fechacreacion desc')


        const [pagination, setPagination] = useState({
            total: 0,
            currentPage: 1,
            // totalPages: 0,
            perPage: 10
        })

        const options = [
            { id: '0', text: 'Estado' },
            { id: '1', text: 'Activo' },
            { id: '2', text: 'Inactivo' }
        ]



        const setOrderDir = (_item) => {
            let o = order.split(' ')
            if (o[0] === _item) {
                setOrder(`${_item} ${o[1] === 'asc' ? 'desc' : 'asc'}`)
            } else {
                setOrder(_item + ' asc')
            }
        }

        const getOrderDir = (item) => {
            let o = order.split(' ')
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
            // e.target.name
            setText(e.target.value)
        }
        const handleBuscar = (e) => {
            buscar()
        }

        const buscar = () => {
            /*setL_data(true)
            setErrorData('')
            
            let params = {
                texto: text,
                ordenamiento: order,
                pagina: pagination.currentPage,
                tamanio: pagination.perPage
            }
            axios.get(smart.urlContext + smart.urlGetList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        setData(data.data)
                        setPagination({ ...pagination, total: data.total })
                        setL_data(false)

                        localSt.set("listRole", params)
                    }
                    else {
                        setData(data.data)
                        setErrorData(data.apiMensaje)
                        setL_data(false)

                        localSt.set("listRole", params)
                    }
                })
                .catch(() => {
                    console.log('error')
                })
                */
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
                                    setData(data.filter(r => r.id != _id))
                                }
                            })
                    }
                });
        }

        const handlePagination = (key, value) => {
            setPagination({ ...pagination, [key]: value })
            buscar()
        }


        useEffect(() => {
            if (rendered) buscar()
        }, [order])

        useEffect(() => {
            appContext.handleBreadcumb(true, [
                { url: '', name: "Administración" },
                { url: '', name: "Catalogo" }
            ]);

            setRendered(true)
        }, [])

        useEffect(() => {
            if (rendered) buscar()
        }, [rendered])

        return (
            <div className="o-container c-header__wrapper flex-column mt-4">
                <div className="row w-100 justify-space-between">
                    <div className="col-lg-8 d-md-flex gap-2 mb-3 p-0">
                        <CInput
                            mod="c-input--search col-lg-6 mb-3"
                            icon="search"
                            placeholder="Ingrese texto a buscar"
                        />
                        <CSelect placeholder="Estado" options={options} mod="col-md-3 mb-3" />
                        <CButton type="button">
                            <Icon h="24" className="mr-2" children="search" />
                            Buscar
                        </CButton>
                    </div>
                    <div className="d-flex justify-content-end col-lg-4 gap-2 p-0">
                        <CButton type='button' className="c-button--green">
                            <Icon h="24" className="mr-2" children="download" />
                            Exportar
                        </CButton>
                        <a className="c-link" href="/administracion/catalogo/create">
                            <CButton className="c-button--blue" type='button'>
                                <Icon h="24" className="mr-2" children="add_circle" />
                                Crear
                            </CButton>
                        </a>
                    </div>
                </div>
                
                <div className="c-table">

                    <div className="c-table__container mt-2">
                        <table className="c-table__container--content mb-2">
                            <thead>
                                <tr>
                                    <th scope="col">
                                    </th>
                                    <th scope="col">
                                        <div className="text-left u-text--bold">
                                            Nombre
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-center">
                                            Fecha Creación
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-left">
                                            Usuario Creación
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-center">
                                            Estado
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
                                        l_data ?
                                            <tr>
                                                <td colSpan="6">{errorData}</td>
                                            </tr>
                                            :
                                            data.map((item) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td className="text-center">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"/>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item eventKey="1">Editar</Dropdown.Item>
                                                                    <Dropdown.Item onClick={(ev) => handleDelete(ev, item.id)} eventKey="2">Eliminar</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                        <td className="text-left u-text--bold">{item.nombre}</td>
                                                        <td className="text-center u-text--regular">{item.fechacreacion}</td>
                                                        <td className="text-center u-text--regular">{item.usuariocreacion}</td>
                                                        <td className="text-center u-text--bold"><div className={`c-card--estado c-card--estado-${item.idestado==1?'active':'inactive'}`}>{item.estado}</div></td>
                                                    </tr>
                                                )
                                            })
                                }
                            </tbody>
                        </table>
                    </div>
                    <CPagination data={pagination} onChangePag={handlePagination} />

                </div>
            </div>
        )
    }
    Global.View = ViewIntl;
})()
