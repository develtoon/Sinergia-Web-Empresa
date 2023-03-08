(function () {

    const { useState, useEffect, useContext} = React
    const { Col, Row, Spinner, Accordion, useAccordionButton } = ReactBootstrap
    const { CInput, CTextArea, CBreadcrumbs, CSelect, CButton, Icon, CFlags, CPagination, AppContext, localSt, CInputFile } = Global
    const dataDefault = {
        apiEstado: 'ok',
        total: 89,
        data: [
            { id: 'RTYYUI21311', codigo: '0001', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21312', codigo: '0002', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21313', codigo: '0003', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21314', codigo: '0004', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21315', codigo: '0005', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21316', codigo: '0006', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21317', codigo: '0007', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21318', codigo: '0008', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21319', codigo: '0009', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21310', codigo: '0010', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21311', codigo: '0011', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21312', codigo: '0012', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21313', codigo: '0013', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21314', codigo: '0014', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21315', codigo: '0015', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21316', codigo: '0016', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21317', codigo: '0017', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21318', codigo: '0018', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21319', codigo: '0019', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
            { id: 'RTYYUI21320', codigo: '0020', nombre: 'Christian Aarón Palacios Velazco', estado: 'Activo', tipo: 'tipo', fechacreacion: '10/05/2000', },
        ],
    }

    const ViewIntl = ({ intl }) => {

        const CustomToggle = ({ children, eventKey }) => {
            const decoratedOnClick = useAccordionButton(eventKey, () =>
              console.log('totally custom!'),
            );
          
            return (
              <button
                type="button"
                style={{ backgroundColor: 'pink' }}
                onClick={decoratedOnClick}
              >
                {children}
              </button>
            );
        }

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [65, 59, 80, 81, 56, 55, 40]
              }
            ]
          };

        const appContext = useContext(AppContext);

        const [text, setText] = useState('')
        const [rendered, setRendered] = useState(false)
        const [data1, setData] = useState([])
        const [order, setOrder] = useState('fechacreacion desc')
        const [l_buscar, setL_buscar] = useState(false)
        const [l_data, setL_data] = useState(true)
        const [errorData, setErrorData] = useState('')
        const [pagination, setPagination] = useState({
            total: 0,
            currentPage: 1,
            // totalPages: 0,
            perPage: 10
        })

        const options = [
            { id: '1', text: 'Seleccione' },
            { id: '2', text: 'Texto 2' },
            { id: '3', text: 'Texto 3' }
        ]

        const handleChange = (e) => {
            // e.target.name
            setText(e.target.value)
        }

        const handleBuscar = (e) => {
            buscar()
        }

        const handlePagination = (key, value) => {
            setPagination({ ...pagination, [key]: value })
            buscar()
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
                                    //setData(data.filter(r => r.id != _id))
                                    buscar()
                                }
                            })
                    }
                });
        }

        const buscar = () => {
            setL_data(true)
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
        }
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

        /*Se Ejecuta iniclamente*/
        useEffect(() => {

            appContext.handleBreadcumb(true, [
                { ulr: '', name: "Demo - Componentes" }
                //,{ ulr: '', name: "Rol" },
                //{ ulr: '', name: "Listar" }
            ]);

            /*let params = localSt.get("listRole")

            if (params) {
                setOrder(params.ordenamiento)
                setPagination({
                    total: 0,
                    currentPage: params.pagina,
                    // totalPages: 0,
                    perPage: params.tamanio
                })
                setText(params.texto)
            }
            */
            setRendered(true)
        }, [])


        useEffect(() => {
            if (rendered) {
                setData(dataDefault.data);
                setL_data(false);
                /*buscar()*/
            }
        }, [rendered])

        useEffect(() => {
            if (rendered) {
                setData([]);
                setL_data(true);

                setData(dataDefault.data);
                setL_data(false);
                /*buscar()*/
            }
        }, [order])


        return (
            //<div className="o-container o-container--1110 o-container--main">
            <div className="o-container c-header__wrapper flex-column mt-3">
                
                
                
                <div className="mb-5 w-100 row">



                    <Accordion bsPrefix="c-accordion">

                        <div className="c-accordion-item">


                            <div className="c-accordion-header">
                                <div className="c-accordion-header-left">
                                    <Icon h="25" children="delete" className="u-text--red"/>
                                    <CInput/>
                                </div>

                                <div className="c-accordion-header-right">
                                    <CustomToggle eventKey="0">Click me!</CustomToggle>
                                </div>

                            </div>

                            <Accordion.Collapse eventKey="0">
                                <div className="c-accordion-body">Hello! I'm the body</div>
                            </Accordion.Collapse>


                        </div>

                    </Accordion>




                </div>

                <Row className="mb-5 w-100">
                    <h1 className="mb-3 u-text--gray-90 title--40 u-text--bold">Inputs</h1>
                    <h1 className="mb-3 u-text--gray-90 paragraph--16">Inputs</h1>
                    <Col>
                        <CInput
                            mod="c-input--login"
                            label="login input"
                            placeholder="Nombre"
                        />
                    </Col>
                    <Col>
                        <CInput
                            label="input"
                            placeholder="Nombre"
                            mod="mb-3"
                        />
                        <CInput
                            label="input disabled"
                            placeholder="Disabled"
                            disabled="true"
                        />
                    </Col>
                    <Col>
                        <CInput
                            mod="c-input--search mb-3"
                            icon="search"
                            label="search input"
                            placeholder="Nombre"
                        />
                        <CInput
                            mod="c-input--search"
                            icon="search"
                            label="search input disabled"
                            placeholder="Nombre"
                            disabled="true"
                        />
                    </Col>
                </Row>
                <Row className="mb-5 w-100">
                    <h1 className="mb-3 u-text--gray-90">Text Área</h1>
                    <Col>
                        <CTextArea
                            placeholder="Seleccione"
                            disabled="true"
                        />
                    </Col>
                    <Col>
                        <CTextArea
                            placeholder="Seleccione"
                        />
                    </Col>
                </Row>
                <div className="mb-5 w-100 row">
                    <h1 className="mb-3 u-text--gray-90">Buttons</h1>
                    <Row className="mb-2">
                        <Col>
                            <CButton className="is-disabled" type='button'>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--red is-disabled" type='button'>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--blue is-disabled" type='button'>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--green is-disabled" type='button'>
                                Button
                            </CButton>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <CButton className="is-disabled" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--red is-disabled" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--blue is-disabled" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--green is-disabled" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <CButton className="" type='button'>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--red" type='button'>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--blue" type='button'>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--green" type='button'>
                                Button
                            </CButton>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <CButton className="" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--red" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--blue" type='button'>
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--green" type='button' children="">
                                <Icon h="24" className="mr-2">search</Icon>
                                Button
                            </CButton>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <CButton className="is-loading" type='button'>
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--red is-loading" type='button'>
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--blue is-loading" type='button'>
                            </CButton>
                        </Col>
                        <Col>
                            <CButton className="c-button--green is-loading" type='button' children="">
                            </CButton>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <CInputFile
                                icon="archive"
                                children="Mensajedsnflidsnvliufdnvliunal fivul di fvlidsf vi sdfvoñidfvo ñdsfv ñodfvñ ndfsvn ñsdfvn"
                            />
                        </Col>
                        <Col>
                            <CInputFile
                                isLoading={true}
                                icon="archive"
                                children="Mensajedsnflidsnvliufdnvliunal fivul di fvlidsf vi sdfvoñidfvo ñdsfv ñodfvñ ndfsvn ñsdfvn"
                            />
                        </Col>
                        <Col>
                            <CInputFile
                                icon="archive"
                                children="Holi"
                            />
                        </Col>
                        <Col>
                            <CInputFile
                                icon="archive"
                                children="Holi"
                            />
                        </Col>
                    </Row>
                </div>

                


                <div className="mb-5 w-100 row">
                    <h1 className="mb-3 u-text--gray-90">Select</h1>
                    <Row>
                        <CSelect
                            disabled
                            label="Seleccionar"
                            name="Seleccione un elemento"
                            options={options}
                        />
                    </Row>
                    <Row>
                        <CSelect
                            label="Seleccionar"
                            name="Seleccione un elemento"
                            options={options}
                        ></CSelect>
                    </Row>
                </div>

                

                {/*
                <hr />
                <div className="">
                    <div className="">
                        <h1 className="title title--70 u-text--blue u-text--light mb-2">
                            Título
                        </h1>
                    </div>
                    <div className="c-card p-4">
                        <h3 className="u-text--blue title title--18 mb-4">
                            Aplicar Filtros de Búsqueda
                        </h3>
                        <Row>
                            <Col sm="12">
                                <CInput name="text" placeholder="Buscar por nombre" label="Nombre de Rol" value={text} onChange={handleChange} />
                            </Col>
                        </Row>

                        <Row className="row justify-content-end mt-4">
                            <Col xs="6" sm="3" lg="2" >
                                <div className="d-grid">
                                    <a className="c-button u-text--center flex justify-center c-button--sm" href="/Security/Rol/Create">
                                        <Icon h="24" className="mr-2">add</Icon>
                                        Crear
                                    </a>
                                </div>
                            </Col>
                            <Col xs="6" sm="3" lg="2" >
                                <div className="d-grid">
                                    <CButton className="flex justify-center c-button--sm" isLoading={l_buscar} onClick={handleBuscar}>
                                        <Icon h="24" className="mr-2"> search</Icon>
                                        Buscar
                                    </CButton>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="c-table__container mt-4">
                        <table className="c-table ">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <div className="flex" onClick={() => { setOrderDir('codigo') }}>
                                            Código
                                            {getOrderDir('codigo')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex" onClick={() => { setOrderDir('nombre') }}>
                                            Nombre
                                            {getOrderDir('nombre')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex" onClick={() => { setOrderDir('tipo') }}>
                                            Tipo
                                            {getOrderDir('tipo')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center" onClick={() => { setOrderDir('estado') }}>
                                            Estado
                                            {getOrderDir('estado')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center" onClick={() => { setOrderDir('fechacreacion') }}>
                                            Fecha Creación
                                            {getOrderDir('fechacreacion')}
                                        </div>
                                    </th>
                                    <th scope="col">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    l_data ?
                                        <tr>
                                            <td colSpan="6">
                                                Loading
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
                                                        <td>{item.codigo}</td>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.tipo}</td>
                                                        <td className="u-text--center">
                                                            <span className={`c-tag ${item.idestado == 1 ? 'c-tag--green' : 'c-tag--red'}`} >
                                                                {item.estado}
                                                            </span>
                                                        </td>
                                                        <td className="u-text--center">

                                                            {item.fechacreacion}
                                                        </td>
                                                        <td>
                                                            <div className="flex align-center justify-flex-end">
                                                                <a href={`/Security/Rol/Edit/${item.id}`} className="c-button--minimal u-text--blue"><Icon block h="20">edit</Icon></a>
                                                                <button className="c-button--minimal u-text--red" onClick={(ev) => handleDelete(ev, item.id)}><Icon h="20">delete_outline</Icon></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                }
                            </tbody>
                        </table>
                        <CPagination data={pagination} onChangePag={handlePagination} />
                    </div>
                    
                </div>
            */}

                

            </div>

        )
    }

    Global.ViewLang = 'security/rol-listar';
    Global.View = ViewIntl;
})()

