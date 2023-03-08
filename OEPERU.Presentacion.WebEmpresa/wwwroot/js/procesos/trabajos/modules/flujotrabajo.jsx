(function () {
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, CCheckBox, AppContext, localSt, generateId, CNotification } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas, Row, Col } = ReactBootstrap;
    const { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = CChart;

    let smart = {
        urlContext: '/Proceso/Trabajo',
        urlGetSingle: '/GetPrincipalSingle',
        urlGetDataList: '/GetDataList',
        urlSaveFlujoTrabajo: '/SaveFlujoTrabajo',

    }

    //let ID = document.querySelector('#id').value;

    const CFlujoTrabajo = forwardRef(({id}, ref) => {
        const [render, setRender] = useState(false)
        const [l_data, setL_data]=useState(false)
        const [dataEstados, setDataEstados] = useState([])
        const [dataFlujoTrabajo, setDataFlujoTrabajo] = useState([])
        const [dataChart, setDataChart] = useState({})
        

        useImperativeHandle(ref, () => ({
            init() {
                if(render){
                    setRender(false)
                }else{
                    buscar()
                    setRender(true)
                }
                
                

            }
        }))

        useEffect(()=> {
            setTimeout(
                setL_data(false),
                5000
            ) 
        },[l_data])

        const buscar = () => {
            

            let params = {
                id: id,
                tipo: 1
            }
            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                .then(({ data }) => {

                    let _dataEstados = data.data.estados
                    let porcentajeData = data.data.porcentaje


                    let dataChartPush = {
                        porcentaje: porcentajeData.toFixed(2),
                        porcentajeColor: '#318E2F',
                        restante: 100 - porcentajeData.toFixed(2),
                        restanteColor: '#DDEBFB'
                    }

                    setDataChart(dataChartPush)
                    setDataFlujoTrabajo(data.data)
                    setDataEstados(_dataEstados)
                })
                .catch((error) => {
                    let dataChartPush = {
                        porcentaje: 0,
                        porcentajeColor: '#318E2F',
                        restante: 100 - 0,
                        restanteColor: '#DDEBFB'
                    }
                    setDataChart(dataChartPush)
                })        
        }


        const handleChange = (e, _id) => {

            let value = e.target.checked

            if (_id > 7) {

                let changeCheck = dataEstados.map(item => {
                    if (item.idEstadoPedido == _id) {
                        return {
                            ...item,
                            idEstado: item.idEstado == 1 ? 0 : 1,
                        }
                    }
                    return item
                })

                setDataEstados(changeCheck)

                let oData = {
                    id: id,
                    estado: _id,
                    check: value
                }

                let params = {
                    id: id,
                    tipo: 1
                }


                swal({
                    title: "¿Desea asignar este valor al flujo de trabajo?",
                    icon: "info",
                    buttons: true,
                    dangerMode: true
                }).then((willDelete) => {
                    if (willDelete) {

                        AXIOS.post(smart.urlContext + smart.urlSaveFlujoTrabajo, oData)
                            .then(({ data }) => {
                                if (data.apiEstado === 'ok') {

                                    swal({
                                        title: data.apiMensaje,
                                        icon: "success",
                                    });

                                    AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                                        .then(({ data }) => {

                                            let dataChartPush = {
                                                porcentaje: data.data.porcentaje,
                                                porcentajeColor: '#318E2F',
                                                restante: 100 - data.data.porcentaje,
                                                restanteColor: '#DDEBFB'
                                            }

                                            setDataChart(dataChartPush)
                                        })

                                } else {
                                    swal({
                                        title: data.apiMensaje,
                                        icon: "error",
                                    });
                                }
                            }).catch((err) => {
                                console.error(err)
                            })
                    }else{
                        e.target.checked=false
                        buscar()
                    }
            
                }).catch((error)=>{
                    console.log(error)
                })
            }


        }

        const data = {
            // labels: [dataChart.porcentaje],
            datasets: [
                {
                    data: [dataChart.porcentaje, dataChart.restante],
                    backgroundColor: [dataChart.porcentajeColor, dataChart.restanteColor],
                    borderColor: [dataChart.porcentajeColor, dataChart.restanteColor],
                    borderWidth: 1,
                },
            ],
        };


        const counter = {
            id: 'counter',
            beforeDraw(chart, args, options) {
                const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
                ctx.save();
                ctx.fillStyle = options.fontColor;
                ctx.font = options.fontSize + ' ' + options.fontFamily;
                ctx.textAlign = 'center';
                ctx.fillText(options.value + '%', width / 2, top + (height / 2));
            }
        }

        return (
            
            <Row>
                {
                l_data ? <span className="u-text--gray-80 paragraph--14">Cargando...</span> :
                <>
                    <Col lg="3" className="mb-4">
                        <CChart.Doughnut
                            data={data}
                            options={{
                                cutout: '80%',
                                plugins: {
                                    tooltip: {
                                        enabled: false
                                    },
                                    counter: {
                                        value: dataChart.porcentaje,
                                        fontSize: '40px',
                                        fontFamily: 'Open Sans, Arial, sans-serif',
                                        fontColor: dataChart.porcentajeColor
                                    }
                                }
                            }}
                            plugins={[counter]}
                        >
                        </CChart.Doughnut>
                    </Col>
                    <Col lg="5">
                        <div className="row">
                            <Col xs="6">
                                {
                                    dataEstados.filter(data => data.idEstadoPedido <= 6).map(tipo => {
                                        return (
                                            <div className="mb-3" key={tipo.idEstadoPedido}>
                                                <label className="c-checkbox">
                                                    <input
                                                        name={`item${tipo.id}`}
                                                        defaultChecked={tipo.idEstado == 1 ? 'checked' : ''}
                                                        checked={tipo.idEstadoPedido <= 7 && tipo.idEstado == 1 ? 'checked' : tipo.idEstado == 1 ? 'checked' : ''}
                                                        onChange={e => handleChange(e, tipo.idEstadoPedido)}
                                                        className=" c-checkbox__input"
                                                        type="checkbox"
                                                    />
                                                    <span
                                                        className={`c-checkbox__icon mr-3`}
                                                        style={
                                                            {
                                                                border: `2px solid ${tipo.colorEstadoPedido}`,
                                                                backgroundColor: tipo.idEstado == 1 ? tipo.colorEstadoPedido : 'white'
                                                            }
                                                        }
                                                    />
                                                    <span className="c-input__label u-text--gray-90">{tipo.estadoPedido}</span>
                                                </label>
                                                <hr className=" u-text--gray-60" />
                                            </div>
                                        )
                                    })
                                }
                            </Col>
                            <Col xs="6">
                                {

                                    dataEstados.filter(data => data.idEstadoPedido > 6).map(tipo => {
                                        return (
                                            <div className="mb-3" key={tipo.idEstadoPedido}>
                                                <label className="c-checkbox">
                                                    <input
                                                        name={`item${tipo.id}`}
                                                        defaultChecked={tipo.idEstado == 1 ? 'checked' : ''}
                                                        checked={tipo.idEstadoPedido <= 7 && tipo.idEstado == 1 ? 'checked' : tipo.idEstado == 1 ? 'checked' : ''}
                                                        onChange={e => handleChange(e, tipo.idEstadoPedido)}
                                                        className=" c-checkbox__input"
                                                        type="checkbox"
                                                    />
                                                    <span
                                                        className={`c-checkbox__icon mr-3`}
                                                        style={
                                                            {
                                                                border: `2px solid ${tipo.colorEstadoPedido}`,
                                                                backgroundColor: tipo.idEstado == 1 ? tipo.colorEstadoPedido : 'white'
                                                            }
                                                        }
                                                    />
                                                    <span className="c-input__label u-text--gray-90">{tipo.estadoPedido}</span>
                                                </label>
                                                <hr className=" u-text--gray-60" />
                                            </div>
                                        )
                                    })

                                }
                            </Col>
                        </div>
                    </Col>
                    <Col lg="4" className="mb-4">
                        {
                            <CNotification
                                icon={dataFlujoTrabajo.esDocumentoPendiente ? 'access_time' : 'check'}
                                children={dataFlujoTrabajo.documentoPendiente}
                                className={`mb-2 ${dataFlujoTrabajo.esDocumentoPendiente ? 'c-notification-red' : 'c-notification-green'}`} />
                        }
                        {
                            <CNotification
                                icon={dataFlujoTrabajo.esInspeccionConforme ? 'check' : 'access_time'}
                                children={dataFlujoTrabajo.inspeccionConforme}
                                className={`mb-2 ${dataFlujoTrabajo.esInspeccionConforme ? 'c-notification-green' : 'c-notification-red'}`} />
                        }
                        {
                            dataFlujoTrabajo.esReproceso &&
                            <CNotification
                                icon={dataFlujoTrabajo.esReproceso ? 'priority_high' : 'check'}
                                children={dataFlujoTrabajo.reproceso}
                                iconClassName={dataFlujoTrabajo.esReproceso ? 'u-text--red' : 'u-text--green'}
                            />
                        }

                    </Col>
                </>
                }
            </Row>
        )

    })

    // colocar como global
    window.FlujoTrabajo = {
        CFlujoTrabajo
    }
})()
