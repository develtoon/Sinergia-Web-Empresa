(function () {
    const { useState, useEffect, Fragment, useContext, forwardRef, useRef } = React;
    const { Col, Row, Spinner, Accordion, useAccordionButton } = ReactBootstrap
    const { CInput, COPagination, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, CCheckBox, AppContext, localSt, generateId, ExpandButtom } = Global
    const { CInspeccion } = Inspeccion
    const { CGastos } = Gastos
    const { CFlujoTrabajo } = FlujoTrabajo
    const { CPrincipal } = Principal
    const { CAdjuntos } = DocumentosAdjuntos
    const { CDatosInformes } = DatosInforme
    const { CBitacora } = Bitacora
    const { CControlCalidad } = ControlCalidad
    const { useForm, Controller } = ReactHookForm;
    const { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = CChart;

    let smart = {
        urlContext: '/Proceso/Trabajo',
        urlGetRolesNegocioContenedor: '/GetRolesNegocioContenedor',
    }

    let ID = document.querySelector('#id').value;

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext)


        const childRef1 = useRef()
        const childRef2 = useRef()
        const childRef3 = useRef()
        const childRef4 = useRef()
        const childRef5 = useRef()
        const childRef6 = useRef()
        const childRef7 = useRef()
        const childRef8 = useRef()

        const initialExpand1 = useAccordionButton(childRef1, () => { childRef1.current.init() })
        const initialExpand2 = useAccordionButton(childRef2, () => { childRef2.current.init() })
        const initialExpand3 = useAccordionButton(childRef3, () => { childRef3.current.init() })
        const initialExpand4 = useAccordionButton(childRef4, () => { childRef4.current.init() })
        const initialExpand5 = useAccordionButton(childRef5, () => { childRef5.current.init() })
        const initialExpand6 = useAccordionButton(childRef6, () => { childRef6.current.init() })
        const initialExpand7 = useAccordionButton(childRef7, () => { childRef7.current.init() })
        const initialExpand8 = useAccordionButton(childRef8, () => { childRef8.current.init() })

        const [render, setRender] = useState(false)
        const [accordion, setAccordion] = useState([])
        const [id, setId] = useState(ID)

        const breadcumb = (id) => {
            return appContext.handleBreadcumb(true, [
                { url: '', name: "Proceso" },
                { url: '/proceso/trabajo', name: "Trabajo" },
                { url: '', name: id ? 'Editar' : 'Crear' }
            ]);
        }

        const handleSetId = (id) => {
            setId(id);
        }

        let secciones = {
            childRef1: <CFlujoTrabajo ref={childRef1} id={id} />,
            childRef2: <CPrincipal ref={childRef2} id={id} onSetId={handleSetId} />,
            childRef3: <CAdjuntos ref={childRef3} id={id} />,
            childRef4: <CGastos ref={childRef4} id={id} />,
            childRef5: <CBitacora ref={childRef5} id={id} />,
            childRef6: <CInspeccion ref={childRef6} id={id} />,
            childRef7: <CControlCalidad ref={childRef7} id={id} />,
            childRef8: <CDatosInformes ref={childRef8} id={id} />,
        }

        useEffect(() => {
            createAccordion()
        }, [])

        useEffect(() => {
            breadcumb(ID)
            if (render) {
                let hasPrincipal = accordion.some(some => some.titulo == 'Principal')
                if (ID) {
                    if (hasPrincipal) {
                        initialExpand2()
                    } else {
                        accordion.map((item, index) => {
                            if (index == 0) {
                                if (item.key == 1) initialExpand1()
                                else if (item.key == 3) initialExpand3()
                                else if (item.key == 4) initialExpand4()
                                else if (item.key == 5) initialExpand5()
                                else if (item.key == 6) initialExpand6()
                                else if (item.key == 7) initialExpand7()
                                else if (item.key == 8) initialExpand8()
                            }
                        })
                    }
                } else {
                    initialExpand2()
                }
            }

            setRender(false)

        }, [render])

        const createAccordion = () => {
            AXIOS.get(smart.urlContext + smart.urlGetRolesNegocioContenedor, {})
                .then(({ data }) => {

                    if (data.apiEstado === 'ok') {

                        let accordion = data.data

                        let onOpen = {
                            childRef1: () => childRef1.current.init(),
                            childRef2: () => childRef2.current.init(),
                            childRef3: () => childRef3.current.init(),
                            childRef4: () => childRef4.current.init(),
                            childRef5: () => childRef5.current.init(),
                            childRef6: () => childRef6.current.init(),
                            childRef7: () => childRef7.current.init(),
                            childRef8: () => childRef8.current.init()
                        }

                        let pushData = accordion.map(item => {

                            return {
                                key: item.id,
                                open: false,
                                onOpen: onOpen[`childRef${item.id}`],
                                titulo: item.nombre
                            }

                        })


                        let hasPrincipal = pushData.some(some => some.titulo == 'Principal')
                        let postData = []

                        if (ID) {
                            if (hasPrincipal) {
                                postData = pushData.map(item => {
                                    if (item.titulo == 'Principal') {
                                        return {
                                            ...item,
                                            open: true
                                        }
                                    }
                                    return item
                                })
                            } else {
                                postData = pushData.map(item => {
                                    if (item.key == 1) {
                                        return {
                                            ...item,
                                            open: true
                                        }
                                    }
                                    return item
                                })
                            }
                        } else {
                            //let data = {}

                            postData = pushData.map(item => {
                                if (item.titulo == 'Principal') {
                                    return {
                                        ...item,
                                        open: true
                                    }
                                }
                                return item
                            })

                            //postData = [data]
                        }

                        setAccordion(postData)
                        setRender(true)


                    } else {
                        setAccordion([])
                    }


                })
                .catch((error) => {
                    // handleError(error);
                    console.error('Error ocurrido', error);
                })


        }

        const ExpandButtom = ({ eventKey, onClick, arrow, titulo }) => {

            const decoratedOnClick = useAccordionButton(eventKey, () => {

                let clone = [...accordion]
                let data = clone.map(item => {
                    return {
                        ...item,
                        open: item.key !== eventKey ? false : !item.open
                    }
                })

                setAccordion(data)

                onClick()
            });

            return (
                <div className="c-accordion-header" onClick={decoratedOnClick}>
                    <div className="c-accordion-header-left">
                        <span className=" u-text--gray-90">{titulo}</span>
                    </div>
                    <div className="c-accordion-header-right">
                        <Icon children={arrow ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} className="c-accordion-header-toggle u-text--gray-90" h="25" />
                    </div>
                </div>
            );
        }


        return (
            <div className="o-container c-header__wrapper flex mt-4" style={{ height: 'auto', alignItems: 'flex-start', marginBottom: '80px' }}>

                <>

                    <Accordion defaultActiveKey={2} className="p-0 w-100">
                        <Row>
                            <Col lg="12" md="12" sm="12" className="flex justify-flex-end gap-2 mb-1">
                                <a className="c-link" href="/Proceso/Trabajo">
                                    <CButton type="button" className="c-button--red">
                                        <Icon children="arrow_back" h="24" className="mr-2" />
                                        Volver
                                    </CButton>
                                </a>
                            </Col>
                        </Row>
                        {
                            accordion.map((item) => {

                                let mostrar = 0;

                                if (id) {
                                    mostrar = 1
                                }
                                else {
                                    if (item.key == 2) {
                                        mostrar = 1
                                    }
                                }

                                if (mostrar) {
                                    return (
                                        <div className="c-accordion-item" key={item.key}>

                                            <ExpandButtom eventKey={item.key} onClick={item.onOpen} arrow={item.open} titulo={item.titulo} />

                                            <Accordion.Collapse eventKey={item.key}>
                                                <div className="c-accordion-body">
                                                    {secciones[`childRef${item.key}`]}
                                                </div>
                                            </Accordion.Collapse>
                                        </div>
                                    )
                                }


                            })

                            // accordion.map((item) => (
                            //     <div className="c-accordion-item" key={item.key}>
                            //         <div className="c-accordion-header">
                            //             <div className="c-accordion-header-left">
                            //                 <span className=" u-text--gray-90">{item.titulo}</span>
                            //             </div>
                            //             <div className="c-accordion-header-right">
                            //                 <ExpandButtom eventKey={item.key} onClick={item.onOpen} arrow={item.open} />
                            //             </div>
                            //         </div>
                            //         <Accordion.Collapse eventKey={item.key}>
                            //             <div className="c-accordion-body">
                            //                 {item.body}
                            //             </div>
                            //         </Accordion.Collapse>
                            //     </div>
                            // ))
                        }
                    </Accordion>
                </>
            </div>
        )
    }
    Global.View = ViewIntl;
})()
