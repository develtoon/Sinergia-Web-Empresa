(function () {
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, handleError, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas, Row, Col } = ReactBootstrap;
    const { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = CChart;


    let smart = {
        urlContext: '/Proceso/Trabajo',
        urlGetSingle: '/GetPrincipalSingle',

    }

    const CDatosInformes = forwardRef(({ id }, ref) => {

        const appContext = useContext(AppContext)

        const [render, setRender] = useState(false)
        const [renderPermiso, setRenderPermiso] = useState(false)
        const [dataSingle, setDataSingle] = useState([])

        //let ID = document.querySelector('#id').value;

        useImperativeHandle(ref, () => ({
            init() {
                setRender(false);
                setRenderPermiso(false);

                if (render) {
                    setRender(false)
                } else {
                    setRender(true)

                    let menuPermiso = appContext.menuPermiso("proceso/trabajo")

                    axios.all([
                        menuPermiso
                    ]).then(response => {
                        setRenderPermiso(true);
                    }).catch(error => {
                        console.log("error");
                    });
                }
            }
        }))

        useEffect(() => {
            if (renderPermiso) {
                buscar()
            }
        }, [renderPermiso])

        const buscar = () => {

            let params = {
                id: id,
                tipo: 8
            }

            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {
                        let arraySingle = data.data.detalles

                        let campo1 = arraySingle.filter((filterId) => { return filterId.idTipo >= 1 && filterId.idTipo <= 8 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })
                        let campo2 = arraySingle.filter((filterId) => { return filterId.idTipo >= 9 && filterId.idTipo <= 31 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })
                        let campo3 = arraySingle.filter((filterId) => { return filterId.idTipo >= 32 && filterId.idTipo <= 36 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })
                        let campo4 = arraySingle.filter((filterId) => { return filterId.idTipo >= 37 && filterId.idTipo <= 39 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })
                        let campo5 = arraySingle.filter((filterId) => { return filterId.idTipo >= 40 && filterId.idTipo <= 44 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })
                        let campo6 = arraySingle.filter((filterId) => { return filterId.idTipo >= 45 && filterId.idTipo <= 51 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })
                        let campo7 = arraySingle.filter((filterId) => { return filterId.idTipo >= 52 && filterId.idTipo <= 53 }).map((item) => { return { id: item.idTipo, titulo: item.tipo, valor: item.valor } })

                        let pushData = [
                            {
                                idSeccionGeneral: generateId(),
                                titulo: 'Características del Bien',
                                secciones: [
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Datos Generales',
                                        campos: campo1
                                    },
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Características del Inmueble',
                                        campos: campo2
                                    },
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Características del Terreno',
                                        campos: campo3
                                    },
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Condiciones Urbanísticas',
                                        campos: campo4
                                    }
                                ]
                            }, {
                                idSeccionGeneral: generateId(),
                                titulo: 'Cuadro de Valoración',
                                secciones: [
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Valores Generales',
                                        campos: campo5
                                    },
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Método de Reposición',
                                        campos: campo6
                                    },
                                    {
                                        idSeccion: generateId(),
                                        titulo: 'Método de Mercado',
                                        campos: campo7
                                    }
                                ]
                            }
                        ]

                        setDataSingle(pushData)
                    }
                })
                .catch((error) => {
                    handleError(error);
                })
        }

        const returnWidth = (_id) =>{
            
            
            if(_id == 1){ return 3 } else if(_id == 2){ return 9 }
            else if(_id == 3){ return 4 }
            else if(_id == 4){ return 4 }
            else if(_id == 5){ return 4 }
            else if(_id == 6){ return 12 }
            else if(_id == 7){ return 4 }
            else if(_id == 8){ return 4 }
            else if(_id == 9){ return 6 }
            else if(_id == 10){ return 3 }
            else if(_id == 11){ return 3 }
            else if(_id == 12){ return 6 }
            else if(_id == 13){ return 6 }
            else if(_id == 14){ return 6 }
            else if(_id == 15){ return 3 }
            else if(_id == 16){ return 3 }
            else if(_id == 17){ return 3 }
            else if(_id == 18){ return 3 }
            else if(_id == 19){ return 3 }
            else if(_id == 20){ return 3 }
            else if(_id == 21){ return 3 }
            else if(_id == 22){ return 3 }
            else if(_id == 23){ return 3 }
            else if(_id == 24){ return 3 }
            else if(_id == 25){ return 3 }
            else if(_id == 26){ return 3 }
            else if(_id == 27){ return 3 }
            else if(_id == 28){ return 3 }
            else if(_id == 29){ return 6 }
            else if(_id == 30){ return 6 }
            else if(_id == 31){ return 3 }
            else if(_id == 32){ return 3 }
            else if(_id == 33){ return 3 }
            else if(_id == 34){ return 3 }
            else if(_id == 35){ return 3 }
            else if(_id == 36){ return 3 }
            else if(_id == 37){ return 6 }
            else if(_id == 38){ return 6 }
            else if(_id == 39){ return 6 }
            else if(_id == 41){ return 6 }
            else if(_id == 42){ return 3 }
            else if(_id == 43){ return 3 }
            else if(_id == 44){ return 3 }
            else if(_id == 45){ return 3 }
            else if(_id == 46){ return 3 }
            else if(_id == 47){ return 3 }
            else if(_id == 48){ return 3 }
            else if(_id == 49){ return 3 }
            else if(_id == 50){ return 3 }
            else if(_id == 51){ return 3 }
            else if(_id == 52){ return 3 }
            else if(_id == 53){ return 3 }
            
        }
        
        return (
            <>

            {
                dataSingle.map(GeneralSection => (
                    <div className="p-2 section-accordion">
                        <span className="section-accordion--title u-text--gray-80 u-text--bold">{GeneralSection.titulo}</span>
                        {
                            GeneralSection.secciones.map((Section) => (
                                <div>
                                    <div className="flex">
                                        <span className="paragraph--14 u-text--gray-80 u-text--bold mr-4">{Section.titulo}</span>
                                        <hr className=" flex-grow-1 u-text--gray-60" />
                                    </div>
                                    <Row className="mb-4">
                                    {
                                        Section.campos.map(Input => (
                                            <Col sm={12} md={12} lg={returnWidth(Input.id)} className="mb-4">
                                                <CInput label={Input.titulo} disabled={true} value={Input.valor}/>
                                            </Col>
                                        ))
                                    }
                                    </Row>
                                </div>
                            ))
                        }
                    </div>
                ))
            }

            </>
        )

    })

    // colocar como global
    window.DatosInforme = {
        CDatosInformes
    }
})()
