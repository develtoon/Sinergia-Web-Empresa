(function () {
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, handleError, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas, Row, Col } = ReactBootstrap;
    const { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = CChart;



    let smart = {
        urlContext: '/Proceso/Trabajo',
        urlGetSingle: '/GetPrincipalSingle',

    }

    const CControlCalidad = forwardRef(({ id }, ref) => {


        const [render, setRender] = useState(false)
        const [controlCalidad, setControlCalidad] = useState([])
        const [dataChart, setDataChart] = useState([])
        
        //let ID = document.querySelector('#id').value;

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

        // useEffect(() => {if(render) setRender(false)},[render])

        const buscar = () => {

            let params = {
                id: id,
                tipo: 7
            }

            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                .then(({ data }) => {

                    let porcentajeData = data.data.total

                    let dataChartPush = {
                        porcentaje: porcentajeData.toFixed(2),
                        porcentajeColor: '#318E2F',
                        restante: 100 - porcentajeData.toFixed(2),
                        restanteColor: '#DDEBFB'
                    }
                    
                    setDataChart(dataChartPush)                    

                    let arraySingle = data.data.detalles

                    let campo1 = arraySingle.filter((filterId) => {return filterId.idTipo >= 1 && filterId.idTipo <= 5}).map((item) =>{ return {id:item.idTipo, titulo:item.tipo, valor: item.valor, estado: item.estado}})
                    let campo2 = arraySingle.filter((filterId) => {return filterId.idTipo >= 6 && filterId.idTipo <= 13}).map((item) =>{ return {id:item.idTipo, titulo:item.tipo, valor: item.valor, estado: item.estado}})
                    let campo3 = arraySingle.filter((filterId) => {return filterId.idTipo >= 14 && filterId.idTipo <= 20}).map((item) =>{ return {id:item.idTipo, titulo:item.tipo, valor: item.valor, estado: item.estado}})
                    let campo4 = arraySingle.filter((filterId) => {return filterId.idTipo >= 21 && filterId.idTipo <= 22}).map((item) =>{ return {id:item.idTipo, titulo:item.tipo, valor: item.valor, estado: item.estado}})
                    let campo5 = arraySingle.filter((filterId) => {return filterId.idTipo >= 22 && filterId.idTipo <= 24}).map((item) =>{ return {id:item.idTipo, titulo:item.tipo, valor: item.valor, estado: item.estado}})
                    let campo6 = arraySingle.filter((filterId) => {return filterId.idTipo >= 25 && filterId.idTipo <= 27}).map((item) =>{ return {id:item.idTipo, titulo:item.tipo, valor: item.valor, estado: item.estado}})

                    let pushData = [
                        {
                        idGrupo:generateId(),
                        nombre:'HR y Hoja de Resultados',
                        tipos:campo1
                        },
                        {
                        idGrupo:generateId(),
                        nombre:'Datos',
                        tipos:campo2
                        },
                        {
                        idGrupo:generateId(),
                        nombre:'Áreas',
                        tipos:campo3
                        },
                        {
                        idGrupo:generateId(),
                        nombre:'Reposición',
                        tipos:campo4
                        },
                        {
                        idGrupo:generateId(),
                        nombre:'Comparación',
                        tipos:campo5
                        },
                        {
                        idGrupo:generateId(),
                        nombre:'Anexos',
                        tipos:campo6
                        },
                     ]

                    setControlCalidad(pushData)

                })
                .catch((error) => {
                    let dataChartPush = {
                        porcentaje: 0,
                        porcentajeColor: '#318E2F',
                        restante: 100,
                        restanteColor: '#DDEBFB'
                    }

                    setDataChart(dataChartPush)
                    handleError(error);
                })
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
            <div>
                {
                    controlCalidad.map(data => (
                        <div className="row mb-4" key={data.idGrupo}>
                            <div className="flex mb-3">
                                <span className="paragraph--16 u-text--gray-80 p-0 mr-4">{data.nombre}</span>
                                <hr className="flex-grow-1 u-text--gray-60" />
                            </div>
                            {data.tipos.map(tipo=>(
                                <div className="col-md-3 col-6 mb-3" key={tipo.idTipo}>
                                    <label className="c-checkbox">
                                        <input
                                        name={`${tipo.idTipo}`}
                                        disabled={tipo.estado == 0 ? true : false}
                                        readOnly
                                        checked={tipo.estado == 0 ? '' : 'checked'}
                                        //onChange={handleChange}
                                        className=" c-checkbox__input"
                                        type="checkbox"/>
                                        <span className="c-checkbox__icon mr-3"></span>
                                        <span className="c-input__label u-text--gray-90">{`${tipo.titulo}`} <b>{tipo.valor}%</b></span>
                                    </label>
                                </div>
                            ))}    
                        </div>
                    ))
                }
                <div className="flex justify-center">
                    <div style={{width:'300px'}}>
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
                    </div>
                </div>
            </div>
        )

    })

    // colocar como global
    window.ControlCalidad = {
        CControlCalidad
    }
})()
