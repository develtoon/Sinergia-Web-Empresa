(function () {
    const { useState, useEffect, Fragment, useContext, useCallback, useRef } = React;
    const { Col, Row, Tooltip, Popover, Overlay } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, CCheckbox, AppContext, localSt, CustomToggle, CSwitch, generateId } = Global
    const { useForm, Controller } = ReactHookForm;
    const { Calendar, momentLocalizer } = ReactBigCalendar

    const ViewIntl = ({ intl }) => {

        let smart = {
            urlContext: '/Proceso/CalendarioTrabajo',
            urlGetList: '/GetList',
            urlGetColaboradorList: '/GetColaboradorList',
            urlGetEstadosList: '/GetEstadosList'
        }

        const [eventsCalendar, setEventsCalendar] = useState([])
        const [colaborador, setColaborador] = useState([])
        const [estados, setEstados] = useState([])

        const [filterData, setFilterData] = useState({
            texto: '',
            ordenamiento: '',
            pagina: 1,
            fechaInicio: '',
            fechaFin: '',
            idUsuarios: '',
            idEstados: ''
        })

        const appContext = useContext(AppContext);

        useEffect(() => {

            appContext.handleBreadcumb(true, [
                { url: '', name: "Proceso" },
                { url: '', name: "Calendario de Trabajo" }
            ])

            var listarColaborador = colaboradorBuscar(5)
            var listarCatalogo = catalogoEstadoBuscar();
            let menuPermiso = appContext.menuPermiso("administracion/cliente")

            axios.all([listarColaborador, listarCatalogo, menuPermiso])
                .then(response => {

                    let params = {
                        ...filterData
                    }
                    calendarioBuscar(params)

                }).catch(error => {
                    console.log("error");
                });

        }, [])
        
        const calendarioBuscar = (filter) => {

            let params = {
                ...filter
            }

            let listarDataCalendario = AXIOS.get(smart.urlContext + smart.urlGetList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        let objetos = data.data

                        let dataPush =
                            objetos.map(item => {
                                return {
                                    id: item.id,
                                    title: item.registro,
                                    start: new Date(item.fechainspeccioninicio),
                                    end: new Date(item.fechainspeccionfin),
                                    resources: {
                                        nombreUsuario: item.inspector,
                                        fechainspeccion: item.fechainspeccion,
                                        colorEstado: item.estadocolor,
                                        estado: item.estado,
                                        descripcion: item.descripcion,
                                    }
                                }
                            })


                        setEventsCalendar(dataPush)

                    } else {
                        setEventsCalendar(data.data)
                    }
                }).catch(error => {
                    console.log(error)
                })

            return listarDataCalendario

        }

        const catalogoEstadoBuscar = (_tipo) => {

            let listarEstados = AXIOS.get(smart.urlContext + smart.urlGetEstadosList)
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        let pushData = data.data.map(data => {
                            return {
                                ...data,
                                checked: false
                            }
                        })

                        setEstados(pushData)

                    } else {
                        setEstados([])
                    }
                }).catch(error => {
                    console.log(error)
                })

            return listarEstados
        }

        const colaboradorBuscar = (idrol) => {

            let params = {
                texto: '',
                idtiporol: idrol,
                pagina: 0,
                ordenamiento: '',
            };

            let listarColaboradores = AXIOS.get(`${smart.urlContext}${smart.urlGetColaboradorList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        setColaborador(data.data)

                    }
                    else {

                        setColaborador([])

                    }
                })
                .catch((error) => {
                    console.log(error)
                });

            return listarColaboradores;
        }


        const localizer = momentLocalizer(moment);


        const eventPropGetter = (event, start, end, isSelected) => ({
            className: 'rbc-event-custom',
            style: {
                backgroundColor: `rgba(${event.resources.colorEstado}, .2)`,
                border: 'none',
                color: event.resources.colorEstado,
                fontWeight: 'bold',
                borderLeft: `5px solid ${event.resources.colorEstado}`
            }
        })


        const TooltipContent = ({ onClose, event }) => {
            let start = event.event.start
            let end = event.event.end

            let data = {
                diaFecha: moment(start).format('dddd, DD'),
                mes: moment(start).format('MMMM'),
                horaInicio: moment(start).format('HH'),
                minutoInicio: moment(start).format('mm'),
                horaFinal: moment(end).format('HH'),
                minutoFinal: moment(end).format('mm'),
            }

            let descripcion = event.event.resources.descripcion

            return (
                <div className="rbc-event-pop">
                    <div className="flex align-center mb-3">
                        <div className={`rbc-event-state`} style={{ backgroundColor: event.event.resources.colorEstado }}></div>
                        <span className=" paragraph--16 u-text--bold u-text--gray-60">{event.event.resources.estado}</span>
                    </div>
                    <div className="flex flex-column align-flex-start justify-flex-start mb-2">
                        <a href={`/proceso/trabajo/edit/${event.event.id}`} className="c-link">
                            <span className=" paragraph--24 u-tewxt--bold u-text--gray-90">{event.title}</span>
                        </a>
                        <span className=" paragraph--14 u-text--gray-90">{event.event.resources.nombreUsuario}</span>
                    </div>
                    <div className="flex align-center mb-4">
                        <span className=" paragraph--16 u-text--bold u-text--gray-90 mr-3">{event.event.resources.fechainspeccion}</span>
                    </div>
                    <div className="rbc-event-pop-content" style={{ borderLeft: `2px solid #51bf97` }}>
                        <span className=" paragraph--16 u-text--gray-90">{descripcion ? descripcion.length >= 120 ? `${descripcion.substr(0, 120)}...` : descripcion : 'No hay observación.'}</span>
                    </div>
                </div>
            );
        }

        const Event = (event) => {
            const [showTooltip, setShowTooltip] = useState(false);

            const closeTooltip = () => {
                setShowTooltip(false);
            };

            const openTooltip = () => {
                setShowTooltip(true);
            }
            const ref = useRef(null);

            const getTarget = () => {
                return ReactDOM.findDOMNode(ref.current);
            };

            return (
                <div ref={ref} onClick={openTooltip}
                    style={{
                        height: '120%',
                        margin: '-20px 0px',
                        paddingTop: '20px'
                    }}>
                    <span>{event.title}</span>
                    <Overlay
                        rootClose
                        target={getTarget}
                        show={showTooltip}
                        placement="left"
                        onHide={closeTooltip}
                    >
                        <Popover>
                            <Popover.Body>
                                {/* <strong>Holy guacamole!</strong> Check this info. */}
                                <TooltipContent event={event} onClose={closeTooltip} />
                            </Popover.Body>
                        </Popover>
                        {/* <Tooltip id="test"> */}
                        {/* </Tooltip> */}
                    </Overlay>
                </div>
            );
        }


        const onSelectEvent = (event) => {
        }

        const dayPropGetter = (date) => {

        }

        const [arrayColaboradores, setArrayColaboradores] = useState([])
        const handleChangeColaborador = (e, _id) => {


            let checked = e.target.checked

            let clone = []

            if (checked) {
                clone = [...arrayColaboradores]
                clone.push(_id)
                setArrayColaboradores(clone)
            } else {
                clone = [...arrayColaboradores]
                pos = clone.findIndex(item => item == _id)
                clone.splice(pos, 1)
                setArrayColaboradores(clone)
            }

            let params = {
                ...filterData,
                idUsuarios: clone.toString()
            }

            calendarioBuscar(params)
            setFilterData(params)


        }


        const [arrayEstado, setArrayEstado] = useState([])
        const handleChangeEstado = (e, _id) => {

            let check = e.target.checked

            let clone = []

            if (check) {
                clone = [...arrayEstado]
                clone.push(_id)
                setArrayEstado(clone)
            } else {
                clone = [...arrayEstado]
                pos = clone.findIndex(item => item == _id)
                clone.splice(pos, 1)
                setArrayEstado(clone)
            }

            let params = {
                ...filterData,
                idEstados: clone.toString()
            }

            let updateState = estados.map(item => {
                if (item.id == _id) {
                    return {
                        ...item,
                        checked: !item.checked
                    }
                }
                return item
            })
            setEstados(updateState)

            calendarioBuscar(params)
            setFilterData(params)


        }
        const today = new Date();

        return (
            <div className="o-container c-header__wrapper row mt-4" style={{ height: 'auto', alignItems: 'flex-start', marginBottom: '80px' }}>
                <Col lg="3" md="12" className="ps-0 pe-0 pe-lg-3">
                    <div className="c-filter mb-4">
                        <span className="title--20 u-text--bold u-text--gray-90">Inspectores</span>
                        <hr className="mt-2 mb-3 u-text--gray-60" />
                        {
                            colaborador.map(item => (
                                <div className="flex gap-2 mb-2 align-center" key={item.id}>
                                    <label className="c-checkbox">
                                        <input
                                            name={`insp-${item.id}`}
                                            onChange={(e) => handleChangeColaborador(e, item.id)}
                                            className=" c-checkbox__input"
                                            type="checkbox" />
                                        <span className="c-checkbox__icon mr-3"></span>
                                        <span className="c-input__label u-text--gray-90"></span>
                                        <span className=" u-text--gray-90 paragraph--16">{item.colaborador}</span>
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <div className="c-filter">
                        <span className="title--20 u-text--bold u-text--gray-90">Estados</span>
                        <hr className="mt-2 mb-3 u-text--gray-60" />
                        {
                            estados.map(item => (
                                <div className="flex gap-2 mb-2 align-center" key={item.id}>
                                    <label className="c-checkbox">
                                        <input
                                            name={`estado-${item.id}`}
                                            onChange={(e) => handleChangeEstado(e, item.id)}
                                            className=" c-checkbox__input"
                                            type="checkbox" />
                                        <span
                                            className="c-checkbox__icon mr-3"
                                            style={{ border: `2px solid ${item.valor}`, backgroundColor: item.checked ? item.valor : 'white' }}
                                        ></span>
                                        <span className="c-input__label u-text--gray-90"></span>
                                        <span className="u-text--gray-90 paragraph--16">{item.nombre}</span>
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </Col>
                <Col lg="9" md="12">

                    <Calendar
                        localizer={localizer}
                        events={eventsCalendar}
                        components={{ event: Event }}
                        view={'week'}
                        style={{ height: '80vh' }}
                        defaultDate={moment()}
                        min={
                            new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate(),
                                7
                            )
                        }
                        max={
                            new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate(),
                                20
                            )
                        }
                        eventPropGetter={eventPropGetter}
                        // dayPropGetter={dayPropGetter}
                        step="30"
                        timeslots="2"
                        messages={{
                            next: "Siguiente",
                            previous: "Anterior",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día"
                        }}
                    />
                </Col>
            </div>


        )
    }
    Global.View = ViewIntl;
})()
