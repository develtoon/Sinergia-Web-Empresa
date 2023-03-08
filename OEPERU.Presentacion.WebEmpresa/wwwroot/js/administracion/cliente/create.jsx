(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner, Accordion, useAccordionButton } = ReactBootstrap
    const { maxValueMessage } = Utils
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CSwitch, CFlags, CPagination, handleError, AppContext, localSt, generateId } = Global
    const { useForm, Controller } = ReactHookForm;


    let smart = {
        urlContext: '/Administracion/Cliente',
        urlSave: '/Save',
        urlGetSingle: '/GetSingle',
        urlGetTasacion: '/GetTasacionList',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
    }


    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        const [allDisabled, setAllDisabled] = useState(false)


        //creación de manejadores
        const [dataEstado, setDataEstado] = useState([])
        const [dataTipoDocumento, setDataTipoDocumento] = useState([])
        const [dataTipoTasacion, setDataTipoTasacion] = useState([])

        const [renderedTipoTasacion, setTipoTasacionRendered] = useState(false)
        const [renderedProducto, setProductoRendered] = useState(false)
        const [renderedSubProducto, setSubProductoRendered] = useState(false)
        const [rendered, setRendered] = useState(false)

        const [l_save, setL_save] = useState(false)

        const [codigo, setCodigo] = useState('')
        const [dataProducto, setDataProducto] = useState([])
        const [dataSubProducto, setDataSubProducto] = useState([])

        const [s_buttonSave, setS_buttonSave] = useState(false)

        //registro de formulario
        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();

        useEffect(() => {

            let menuPermiso = appContext.menuPermiso("administracion/cliente")

            axios.all([menuPermiso])
                .then(response => {
                    setRendered(true);
                }).
                catch(error => {
                    setRendered(true);
                });

        }, [])

        useEffect(() => {
            if (rendered) {

                let listarEstado = catalogoEstadoBuscar(11300, 1);
                let listarTipoDocumento = catalogoEstadoBuscar(11301, 2);
                let listarTasacion = tipoTasacionBuscar();
                ID = document.querySelector('#id').value;

                axios.all([listarEstado, listarTipoDocumento, listarTasacion])
                    .then(response => {
                        setTipoTasacionRendered(true);
                    }).
                    catch(error => {
                        setTipoTasacionRendered(true);
                    });
            }
        }, [rendered])


        useEffect(() => {
            if (renderedTipoTasacion) {
                if (ID) {
                    setS_buttonSave(appContext.permisos.esUsuarioEditar)
                    getSingle();
                }
                else {
                    setS_buttonSave(appContext.permisos.esUsuarioCrear)

                    if (!appContext.permisos.esUsuarioCrear) {
                        setAllDisabled(true);
                    }

                    appContext.handleBreadcumb(true, [
                        { url: '', name: "Administración" },
                        { url: '/administracion/cliente/', name: "Cliente" },
                        { url: '', name: "Crear" },
                    ]);
                    setRendered(false);
                }
            }
        }, [renderedTipoTasacion])


        useEffect(() => {
            if (renderedProducto) {
                dataProducto.forEach((item) => {
                    setValue(`nombreProducto${item.key}`, item.nombre)
                })

                setProductoRendered(false);
            }
        }, [renderedProducto])


        const catalogoEstadoBuscar = (_codigo, _tipo) => {

            let params = {
                codigo: _codigo
            };

            let estadoListar = AXIOS.get(`${smart.urlGetCatalogoEstadoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        if (_tipo == 1) {
                            setDataEstado(data.data);
                            setValue('estado', 1);
                        }
                        else if (_tipo == 2) {
                            setDataTipoDocumento(data.data);
                        }

                    }
                    else {
                        if (_tipo == 1) {
                            setDataEstado([]);
                        }
                        else if (_tipo == 2) {
                            setDataTipoDocumento([]);
                        }
                    }
                })
                .catch((error) => {
                    if (_tipo == 1) {
                        setDataEstado([]);
                    }
                    else if (_tipo == 2) {
                        setDataTipoDocumento([]);
                    }
                });

            return estadoListar;
        }

        const tipoTasacionBuscar = () => {

            let params = {
                ordenamiento: 'tipotasacion asc',
                pagina: 0
            }

            let listarTipoTasacion = AXIOS.get(`${smart.urlContext}${smart.urlGetTasacion}`, { params })
                .then(({ data: tasacion }) => {

                    if (tasacion.apiEstado == "ok") {
                        let tasacionClonada = tasacion.data.map(tt => {

                            let subTiposTasacion = tt.subTiposTasacion.map(stt => {

                                return {
                                    ...stt,
                                    seleccionado: false
                                }
                            })

                            return {
                                ...tt,
                                seleccionado: false,
                                subTiposTasacion: subTiposTasacion,
                                visible: false
                            }
                        })

                        setDataTipoTasacion(tasacionClonada)
                    }
                    else {
                        setDataTipoTasacion([])
                    }
                })
                .catch((error) => {
                    setDataTipoTasacion([])
                });

            return listarTipoTasacion;
        }

        /*get Single*/
        const getSingle = () => {

            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params: { id: ID } })
                .then(({ data: resSingle }) => {

                    if (resSingle.apiEstado === 'ok') {
                        setCodigo(resSingle.codigo)
                        setValue('abreviatura', resSingle.abreviatura)
                        setValue('nombre', resSingle.nombre)
                        setValue('idTipoDocumento', resSingle.idTipoDocumento)
                        setValue('tipoDocumento', resSingle.tipoDocumento)
                        setValue('documento', resSingle.documento)
                        setValue('nombre', resSingle.nombre)
                        setValue('estado', resSingle.idEstado)
                        setValue('esParticular', resSingle.esParticular)

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setAllDisabled(true);
                        }

                        if (!appContext.permisos.esUsuarioEditar) {
                            setAllDisabled(true);
                        }

                        let productoLista = new Array();
                        let subProductoLista = new Array();

                        resSingle.productos.map(prod => {

                            let keyProducto = generateId();

                            prod.subProductos.map(subprod => {

                                let objSubProducto = {
                                    ...subprod,
                                    keyProducto: keyProducto,
                                    key: generateId(),
                                }

                                subProductoLista.push(objSubProducto);
                            })

                            let objProducto = {};

                            if (appContext.permisos.esUsuarioSoloConsultar) {
                                objProducto = {
                                    ...prod,
                                    key: keyProducto,
                                    tiposTasacion: prod.tiposTasacion.map(tipo => {

                                        let ttSel = true;
                                        let ttVisible = true;

                                        let subTiposTasacion = tipo.subTiposTasacion.map(subtipo => {

                                            let sttSel = true;

                                            return {
                                                ...subtipo,
                                                seleccionado: sttSel,
                                                key: generateId()
                                            }
                                        });

                                        return {
                                            ...tipo,
                                            subTiposTasacion: subTiposTasacion,
                                            seleccionado: ttSel,
                                            visible: ttVisible,
                                            key: generateId()
                                        }
                                    })
                                }
                            }
                            else {
                                objProducto = {
                                    ...prod,
                                    key: keyProducto,
                                    tiposTasacion: dataTipoTasacion.map(tipo => {

                                        let ttSel = false;
                                        let ttVisible = false;

                                        prod.tiposTasacion.filter(tt => tt.id === tipo.id).map(tt => {
                                            ttSel = true;
                                            ttVisible = true;
                                        })

                                        let subTiposTasacion = tipo.subTiposTasacion.map(subtipo => {

                                            let sttSel = false;

                                            prod.tiposTasacion.filter(tt => tt.id === tipo.id).map(tt => {
                                                if (tt.subTiposTasacion.filter(stt => stt.id === subtipo.id).length != 0) {
                                                    sttSel = true;
                                                }
                                            })

                                            return {
                                                ...subtipo,
                                                seleccionado: sttSel,
                                                key: generateId()
                                            }
                                        });

                                        return {
                                            ...tipo,
                                            subTiposTasacion: subTiposTasacion,
                                            seleccionado: ttSel,
                                            visible: ttVisible,
                                            key: generateId()
                                        }
                                    })
                                }
                            }



                            productoLista.push(objProducto);
                        })

                        setDataProducto(productoLista)
                        setProductoRendered(true);
                        setDataSubProducto(subProductoLista)
                        setSubProductoRendered(true);

                        appContext.handleBreadcumb(true, [
                            { url: '', name: "Administración" },
                            { url: '/administracion/cliente/', name: "Cliente" },
                            { url: '', name: "Editar" },
                        ])
                    }
                })
                .catch(error => {
                    setAllDisabled(true);
                    handleError(error);
                })
        }

        const handleChangeProducto = (e, _key) => {
            e.preventDefault()
            let name = e.target.name;
            let value = e.target.value;

            let newArrayProducto = [...dataProducto]

            let pos = newArrayProducto.findIndex((item) => item.key === _key);

            newArrayProducto[pos].nombre = value;

            setDataProducto(newArrayProducto)
        }

        const handleChangeSubProducto = (e, _key) => {
            e.preventDefault()
            let name = e.target.name;
            let value = e.target.value;

            let newArraySubProducto = [...dataSubProducto]

            let pos = newArraySubProducto.findIndex((item) => item.key === _key);

            newArraySubProducto[pos].nombre = value;

            setDataSubProducto(newArraySubProducto)
        }

        const handleSave = (data) => {
            if (l_save) return
            setL_save(true)

            let productos = new Array();

            dataProducto
                .forEach(dtp => {

                    let subProductos = new Array();

                    dataSubProducto.filter(sp => sp.keyProducto === dtp.key).forEach(sp => {

                        let objSubProducto = {
                            "id": sp.id,
                            "nombre": sp.nombre
                        }

                        subProductos.push(objSubProducto)
                    })

                    let tiposTasacion = new Array();

                    dtp.tiposTasacion.filter(tt => tt.seleccionado == true).forEach(tt => {

                        tt.subTiposTasacion.filter(stt => stt.seleccionado == true).forEach(stt => {

                            let objSubTipoTasacion = {
                                "id": stt.id
                            }
                            tiposTasacion.push(objSubTipoTasacion)

                        });

                        let objTipoTasacion = {
                            "id": tt.id
                        }

                        tiposTasacion.push(objTipoTasacion)
                    })


                    let objProducto = {
                        "id": dtp.id,
                        "nombre": dtp.nombre,
                        "subProductos": subProductos,
                        "tiposTasacion": tiposTasacion
                    }

                    productos.push(objProducto);
                });

            let objCliente = {
                "id": ID,
                "abreviatura": data.abreviatura,
                "nombre": data.nombre,
                "idTipoDocumento": data.idTipoDocumento,
                "documento": data.documento,
                "estado": data.estado,
                "esParticular": data.esParticular,
                "productos": productos
            }

            AXIOS.post(smart.urlContext + smart.urlSave, objCliente)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })

                        if (!ID) {
                            setCodigo(data.codigo)
                            ID = data.id
                        }

                        getSingle();
                        setL_save(false)

                    } else {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })
                    }
                    setL_save(false)
                })
                .catch(error => {
                    setL_save(false)
                    handleError(error);
                })
        }

        /* Métodos Sección Tipos de Producto */

        const handleChecked = (e, __itemkey, __childKey, __parentKey) => {
            let name = e.target.name;
            let checked = e.target.checked;

            let clone = [...dataProducto];

            clone = clone.map(prod => {

                if (!(prod.key === __parentKey)) {
                    return prod;
                }
                else {
                    prod.tiposTasacion.filter(tt => tt.key === __childKey)
                        .map(tt => {
                            tt.subTiposTasacion.filter(stt => stt.key === __itemkey)
                                .map(stt => {
                                    stt.seleccionado = checked;
                                })
                        })
                    return prod;
                }
            });

            setDataProducto(clone);
        }

        const handleExpand = (e, __itemkey, __parentKey) => {
            let name = e.target.name;
            let checked = e.target.checked;

            let clone = [...dataProducto];

            clone = clone.map(prod => {

                if (!(prod.key === __parentKey)) {
                    return prod;
                }
                else {
                    prod.tiposTasacion.filter(tt => tt.key === __itemkey)
                        .map(tt => {
                            tt.seleccionado = checked;
                            tt.visible = false;
                            if (checked) {
                                tt.visible = true;
                            }
                            else {
                                tt.subTiposTasacion
                                    .map(stt => {
                                        stt.seleccionado = false;
                                    })
                            }
                        })
                    return prod;
                }
            })

            setDataProducto(clone);
        }

        const handleAddTipoProducto = (e) => {

            e.preventDefault()

            let objTipoProducto = {
                id: "",
                nombre: "",
                key: generateId(),
                subProductos: [],
                tiposTasacion: dataTipoTasacion.map(tipo => {

                    let subTiposTasacion = tipo.subTiposTasacion.map(subtipo => {

                        return {
                            ...subtipo,
                            key: generateId()
                        }
                    });

                    return {
                        ...tipo,
                        subTiposTasacion: subTiposTasacion,
                        key: generateId()
                    }
                })
            }

            let clone = [...dataProducto]
            clone.push(objTipoProducto)
            setDataProducto(clone)
        }

        const handleAddTipoSubProducto = (e, __parentKey) => {

            e.preventDefault()

            let objSubProducto = {
                id: "",
                nombre: "",
                key: generateId(),
                keyProducto: __parentKey
            }

            let clone = [...dataSubProducto]

            clone.push(objSubProducto);

            setDataSubProducto(clone)
        }

        const handleDeleteTipoProducto = (event, _key) => {
            let clone = [...dataProducto]
            let pos = clone.findIndex(item => item.key === _key)
            clone.splice(pos, 1)

            setDataProducto(clone)
        }

        const handleDeleteTipoSubProducto = (event, _key) => {
            let clone = [...dataSubProducto]
            let pos = clone.findIndex(item => item.key === _key)
            clone.splice(pos, 1)

            setDataSubProducto(clone)
        }

        const ExpandButtom = ({ children, eventKey }) => {
            const [arrowUp, setArrowUp] = useState(false)
            const decoratedOnClick = useAccordionButton(eventKey, () =>
                setArrowUp(!arrowUp)
            );


            return (
                <Icon children={arrowUp ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} className="c-accordion-header-toggle u-text--gray-90" h="25" onClick={decoratedOnClick} />
            );
        }

        useEffect(() => {
            if (renderedSubProducto) {
                dataSubProducto.forEach((item) => {
                    setValue(`nombreSubProducto${item.key}`, item.nombre)
                })

                setSubProductoRendered(false);
            }
        }, [renderedSubProducto])


        return (

            <div className="o-container c-header__wrapper flex flex-column mt-3">
                <form className="w-100" onSubmit={handleSubmit(handleSave)}>
                    <Row className="mt-2 mb-2">
                        <Col md="4">
                            <CInput
                                value={codigo}
                                name="codigo"
                                disabled
                                label="Código"
                                placeholder="Autogenerado"
                            />
                        </Col>
                        <Col md="4">
                            <CInput
                                disabled={allDisabled}
                                name="abreviatura"
                                {...register("abreviatura", {
                                    required: true
                                })}
                                label="Abreviatura"
                                requerido="1"
                                error={errors.nombre?.type === 'required' && "El campo Abreviatura es requerido"}
                            />
                        </Col>
                        <Col md="4">
                            <CInput
                                disabled={allDisabled}
                                name="nombre"
                                {...register("nombre", {
                                    required: true
                                })}
                                label="Nombre"
                                requerido="1"
                                error={errors.nombre?.type === 'required' && "El campo Nombre es requerido"}
                            />
                        </Col>
                        <Col md="4">
                            <CSelect
                                disabled={allDisabled}
                                name="idTipoDocumento"
                                {...register("idTipoDocumento", {
                                    required: { value: false, message: 'El campo Tipo de Documento es requerido' },
                                    // minLength: {value:1, message: 'El valor mínimo es de tanto'},
                                    maxLength: {
                                        value: 20,
                                        message: maxValueMessage('maxlength', 20)
                                    },
                                })}
                                label="Tipo de Documento"
                                requerido="0"
                                error={errors.estado?.type === 'required' && "El campo Tipo de Documento es requerido"}
                                options={[{ id: 0, text: 'Seleccione' }, ...dataTipoDocumento.map(el => ({ id: el.id, text: el.nombre }))]}
                            />
                        </Col>
                        <Col md="4">
                            <CInput
                                disabled={allDisabled}
                                name="documento"
                                {...register("documento", {
                                    required: false
                                })}
                                label="Documento"
                                requerido="0"
                                error={errors.nombre?.type === 'required' && "El campo Documento es requerido"}
                            />
                        </Col>
                        <Col lg="4" className="mb-4">
                            <CSwitch
                                label="Es Particular"
                                name="esParticular"
                                {...register("esParticular", {
                                    required: false
                                })}
                                disabled={allDisabled}
                            />
                        </Col>
                        <Col md="4">
                            <CSelect
                                disabled={allDisabled}
                                name="estado"
                                {...register("estado", {
                                    required: true
                                })}
                                label="Estado"
                                requerido="1"
                                error={errors.estado?.type === 'required' && "El campo Estado es requerido"}
                                options={[...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                            />
                        </Col>
                    </Row>
                    <hr className="u-text--gray-60 mb-5" />
                    <Row>
                        <div className="flex gap-2 justify-content-between align-center w-100 my-3">
                            <span className=" u-text--gray-60 u-text--bold title--20">Productos</span>
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton
                                    disabled={allDisabled}
                                    type="button"
                                    onClick={(e) => handleAddTipoProducto(e)}>
                                    <Icon children="add_circle" h="24"
                                        className="material-icons-outlined mr-2" />
                                Agregar
                            </CButton>}

                        </div>
                    </Row>

                    <Row className="mb-4">
                        <Accordion defaultActiveKey>
                            {
                                dataProducto.map((item) => {
                                    return (
                                        <Accordion.Item bsPrefix="c-accordion-item" key={item.key}>
                                            <div className="c-accordion-header">
                                                <div className="c-accordion-header-left">
                                                    {!appContext.permisos.esUsuarioSoloConsultar &&
                                                        <CButton
                                                            disabled={allDisabled}
                                                            type="button" onClick={(ev) => handleDeleteTipoProducto(ev, item.id)} className=" border-0 c-button--minimal u-text--red mr-3">
                                                            <Icon h="24">delete_outline</Icon>
                                                        </CButton>}
                                                    <CInput
                                                        disabled={allDisabled}
                                                        name={`nombreProducto${item.key}`}
                                                        {...register(`nombreProducto${item.key}`, { required: true })}
                                                        error={errors[`nombreProducto${item.key}`]?.type === 'required' && "El campo es requerido"}
                                                        mod="c-accordion-header-input"
                                                        onChange={(e) => handleChangeProducto(e, item.key)}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="c-accordion-header-right">
                                                    <ExpandButtom eventKey={item.key} />
                                                </div>

                                            </div>
                                            <Accordion.Collapse eventKey={item.key}>
                                                <div className="c-accordion-body">
                                                    <Row className="mb-2">
                                                        <div className="flex gap-2 justify-content-between align-center w-100 ">
                                                            <span className="u-text--gray-60 u-text--bold title--20">Sub Productos</span>
                                                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                                                <CButton
                                                                    disabled={allDisabled}
                                                                    type="button"
                                                                    className="c-button--minimal border-0"
                                                                    onClick={(e) => handleAddTipoSubProducto(e, item.key)}>
                                                                    <Icon children="add_circle" h="24" className="material-icons-outlined" />
                                                                </CButton>}

                                                        </div>
                                                    </Row>
                                                    <hr className=" u-text--gray-60 m-0 mb-2" />
                                                    <Row className="mb-5">
                                                        {/* {dataTipoSubProducto.filter(filterKey => filterKey.id.includes(item.id) ).map(subItem => { */}
                                                        {dataSubProducto.filter(subItem => subItem.keyProducto === item.key).map(subItem => {
                                                            return (
                                                                <div className="flex align-center w-100 my-2" key={subItem.key}>
                                                                    {!appContext.permisos.esUsuarioSoloConsultar &&
                                                                        <CButton
                                                                            disabled={allDisabled}
                                                                            type="button" onClick={(ev) => handleDeleteTipoSubProducto(ev, subItem.key)} className="border-0 c-button--minimal u-text--red mr-3">
                                                                            <Icon h="24">delete_outline</Icon>
                                                                        </CButton>}

                                                                    <CInput
                                                                        disabled={allDisabled}
                                                                        name={`nombreSubProducto${subItem.key}`}
                                                                        {...register(`nombreSubProducto${subItem.key}`, { required: true })}
                                                                        error={errors[`nombreSubProducto${subItem.key}`]?.type === 'required' && "El campo es requerido"}
                                                                        onChange={(e) => handleChangeSubProducto(e, subItem.key)}
                                                                        mod="w-100"
                                                                        placeholder=""
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <span className=" u-text--gray-60 u-text--bold title--20">Tipo de Tasación</span>
                                                    </Row>
                                                    <hr className=" u-text--gray-60 m-0 mb-2" />
                                                    <Row className="mb-3">
                                                        <ul className="c-treeview">

                                                            {
                                                                item.tiposTasacion.map(itemTasa => {
                                                                    // let nombretasadata = item.tipostasacion.filter(filtronombre => filtronombre.nombre == itemtasa.nombre).map(tipotasadatax => tipotasadatax.nombre)
                                                                    // console.log(itemtasa.nombre,nombretasadata)

                                                                    return (
                                                                        <li className="mb-2" key={itemTasa.key}>
                                                                            <label className="c-checkbox mb-2">
                                                                                <input
                                                                                    disabled={allDisabled}
                                                                                    onChange={e => handleExpand(e, itemTasa.key, item.key)}
                                                                                    name={`${item.key}__${itemTasa.key}`}
                                                                                    // {...register(item.id, { required: false })}
                                                                                    // checked={itemTasa.nombre == nombreTasaData ? "checked" : ""}
                                                                                    checked={itemTasa.seleccionado}
                                                                                    className=" c-checkbox__input"
                                                                                    type="checkbox"
                                                                                />
                                                                                <span className="c-checkbox__icon mr-3"></span>
                                                                                <span className="u-text--gray-90">{itemTasa.nombre}</span>
                                                                            </label>
                                                                            <ul className={`nested nested${item.key}__${itemTasa.key} ${itemTasa.visible ? "active" : ""}`}>
                                                                                {itemTasa.subTiposTasacion.map(subtipo => {
                                                                                    return (
                                                                                        <li className="mb-2" key={subtipo.key}>
                                                                                            <label className="c-checkbox">
                                                                                                <input
                                                                                                    disabled={allDisabled}
                                                                                                    name={subtipo.key}
                                                                                                    onChange={e => handleChecked(e, subtipo.key, itemTasa.key, item.key)}
                                                                                                    checked={subtipo.seleccionado ? "checked" : ""}
                                                                                                    className=" c-checkbox__input"
                                                                                                    type="checkbox"
                                                                                                />
                                                                                                <span className="c-checkbox__icon mr-3"></span>
                                                                                                <span className="u-text--gray-90">{subtipo.nombre}</span>
                                                                                            </label>
                                                                                        </li>
                                                                                    )
                                                                                })}
                                                                            </ul>
                                                                        </li>
                                                                    )
                                                                })
                                                            }


                                                        </ul>
                                                    </Row>
                                                </div>
                                            </Accordion.Collapse>
                                            <Accordion.Body>

                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })
                            }
                        </Accordion>

                    </Row>

                    <Row className="mb-2">
                        <div className="mt-2 flex justify-flex-end gap-4">
                            <a className="c-link" href="/administracion/cliente/">
                                <CButton type="button">
                                    <Icon children="arrow_back" h="24" className="material-icons-outlined mr-2" />
                                    Volver
                                </CButton>
                            </a>

                            {s_buttonSave && <CButton type="submit" isLoading={l_save} children="Guardar" className="c-button--blue">
                                <Icon children="save" h="24" className="mr-2" />
                                Guardar
                            </CButton>}
                        </div>
                    </Row>
                </form>
                <div style={{ height: '60px' }}></div>
            </div>
        )
    }

    Global.ViewLang = 'security/rol-listar';
    Global.View = ViewIntl;
})()
