
(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, handleError, AppContext, localSt, generateId, ErrorNotExistPage } = Global
    const { useForm, Controller } = ReactHookForm;

    let smart = {
        urlContext: '/Seguridad/Rol',
        urlSave: '/Save',
        urlGetSingle: '/GetSingle',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
        urlMenuGetList: '/Seguridad/Menu/GetList'
    }

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        const [allDisabled, setAllDisabled] = useState(false)

        const [rendered, setRendered] = useState(false)
        const [renderedMenu, setRenderedMenu] = useState(false)

        const [dataEstado, setDataEstado] = useState([])
        const [dataTipoRol, setDataTipoRol] = useState([])
        const [errorData, setErrorData] = useState('')

        const [codigo, setCodigo] = useState('')
        const [l_dataMenu, setL_DataMenu] = useState(false)
        const [l_dataSeccion, setL_DataSeccion] = useState(false)
        const [showSeccion, setShowSeccion] = useState(false)
        const [dataMenu, setDataMenu] = useState([])
        const [dataSeccion, setDataSeccion] = useState([])
        const [l_save, setL_save] = useState(false)

        const [s_buttonSave, setS_buttonSave] = useState(false)

        const { register, formState: { errors }, handleSubmit, setValue, getValues, control, watch } = useForm();
        // --------- useEffect Seccion -----

        useEffect(() => {

            let menuPermiso = appContext.menuPermiso("seguridad/rol")

            axios.all([menuPermiso])
                .then(response => {
                    setRendered(true);
                }).
                catch(error => {
                    setRendered(true);
                    console.log("error");
                });

        }, [])

        useEffect(() => {
            if (rendered) {

                let estadorListar = buscarCatalogoEstado(10301, 1);
                let rolListar = buscarCatalogoEstado(10303, 2);
                let seccionListar = buscarCatalogoEstado(12106, 3);
                let menuListar = menuBuscar();

                ID = document.querySelector('#id').value;
                menuTrabajo = document.querySelector('#menuTrabajo').value;

                axios.all([estadorListar, seccionListar, rolListar, menuListar])
                    .then(response => {
                        setRenderedMenu(true);
                    }).
                    catch(error => {
                        setRenderedMenu(true);
                        console.log("error");
                    });
            }

        }, [rendered])

        useEffect(() => {

            if (renderedMenu) {
                if (ID) {
                    setS_buttonSave(appContext.permisos.esUsuarioEditar)

                    appContext.handleBreadcumb(true, [
                        { url: '', name: "Seguridad" },
                        { url: '/seguridad/rol/', name: "Rol" },
                        { url: '', name: "Editar" },
                    ]);
                    getSingle();
                }
                else {

                    setS_buttonSave(appContext.permisos.esUsuarioCrear)

                    if (!appContext.permisos.esUsuarioCrear) {
                        setAllDisabled(true);
                    }

                    appContext.handleBreadcumb(true, [
                        { url: '', name: "Seguridad" },
                        { url: '/seguridad/rol/', name: "Rol" },
                        { url: '', name: "Crear" },
                    ]);
                }
            }
        }, [renderedMenu])

        const menuBuscar = () => {

            let menuListar = AXIOS.get(`${smart.urlMenuGetList}`)
                .then(({ data: resMenus }) => {

                    setDataMenu(resMenus.data.map(item => {
                        return {
                            ...item,
                            seleccionado: false,
                            esconsultarrol: false,
                            esexportarrol: false,
                            escrearrol: false,
                            eseditarrol: false,
                            eseliminarrol: false,
                        }
                    }))

                    setL_DataMenu(false);
                    setL_DataSeccion(false);

                })
                .catch(error => {
                    setDataMenu([]);
                    handleError(error, false);
                })

            return menuListar;
        }

        const getSingle = () => {
            setErrorData('')

            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, {
                params: { id: ID }
            })
                .then(({ data: resSingle }) => {
                    if (resSingle.apiEstado === 'ok') {

                        setCodigo(resSingle.codigo)
                        setValue('nombre', resSingle.nombre)
                        setValue('estado', resSingle.idEstado)
                        setValue('tipoRol', resSingle.tipoRol)
                        setValue('idTipoRol', resSingle.idTipoRol)

                        let menusCloned = [];

                        if (appContext.permisos.esUsuarioSoloConsultar) {

                            setAllDisabled(true);

                            menusCloned = resSingle.menus.map((m) => {

                                let seleccionado = false;

                                if ((m.esconsultarrol || m.esexportarrol || m.escrearrol || m.eseditarrol || m.eseliminarrol)) {
                                    seleccionado = true;
                                }

                                return { ...m, seleccionado: seleccionado };
                            })
                        }
                        else {
                            menusCloned = dataMenu.map(item => {
                                return {
                                    ...item,
                                    seleccionado: false,
                                    esconsultarrol: false,
                                    esexportarrol: false,
                                    escrearrol: false,
                                    eseditarrol: false,
                                    eseliminarrol: false,
                                }
                            })

                            resSingle.menus.forEach((m) => {
                                menusCloned.forEach(mc => {
                                    if (mc.id === m.id) {
                                        mc.seleccionado = true;
                                        mc.esconsultarrol = m.esconsultarrol;
                                        mc.esexportarrol = m.esexportarrol;
                                        mc.escrearrol = m.escrearrol;
                                        mc.eseditarrol = m.eseditarrol;
                                        mc.eseliminarrol = m.eseliminarrol;
                                    }
                                })
                            })
                        }

                        let showSeccion = false;

                        if (resSingle.idTipoRol == 3 || resSingle.idTipoRol == 5 || resSingle.idTipoRol == 6 || resSingle.idTipoRol == 7 || resSingle.idTipoRol == 8) {
                            showSeccion = true;
                        }

                        setShowSeccion(showSeccion);

                        let seccionesCloned = [];

                        if (appContext.permisos.esUsuarioSoloConsultar) {

                            setAllDisabled(true);

                            seccionesCloned = resSingle.secciones.map((m) => {
                                let seleccionado = false;
                                return { ...m, seleccionado: seleccionado };
                            })
                        }
                        else {
                            seccionesCloned = dataSeccion.map(item => {
                                return {
                                    ...item,
                                    seleccionado: false
                                }
                            })

                            resSingle.secciones.forEach((s) => {
                                seccionesCloned.forEach(sc => {
                                    if (sc.idTipo === s.idTipo) {
                                        sc.seleccionado = true;
                                    }
                                })
                            })
                        }

                        if (!appContext.permisos.esUsuarioEditar) {
                            setAllDisabled(true);
                        }

                        setDataMenu(menusCloned);
                        setDataSeccion(seccionesCloned);

                    }
                })
                .catch(error => {
                    setAllDisabled(true);
                    setErrorData(handleError(error));
                })
        }

        const buscarCatalogoEstado = (codigo, tipo) => {
            let params = {
                codigo: codigo
            }
            let listarCatalogoEstado = AXIOS.get(smart.urlGetCatalogoEstadoList, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        /*tipo:
                        1 Estados
                        2 Tipos de Rol
                        3 Sección
                        */

                        if (tipo == 1) {
                            setDataEstado(data.data);
                            setValue('estado', 1)
                        }
                        else if (tipo == 2) {
                            setDataTipoRol(data.data);
                        }
                        else if (tipo == 3) {

                            let dataSeccion = data.data.map(dt => {
                                return {
                                    idTipo: dt.id,
                                    tipo: dt.nombre,
                                    seleccionado: false
                                }
                            })

                            setDataSeccion(dataSeccion);
                        }
                    }
                    else {
                    }
                })
                .catch((error) => {
                    if (tipo == 1) {
                        setDataEstado([]);
                    }
                    else if (tipo == 2) {
                        setDataTipoRol([]);
                    }

                    handleError(error, false);
                })

            return listarCatalogoEstado;
        }

        const handleSelectMenu = (id, e) => {

            let checked = e.target.checked;
            let newArrayMenus = [...dataMenu];
            let pos = newArrayMenus.findIndex((item) => item.id === id)

            newArrayMenus[pos].seleccionado = checked;

            setDataMenu(newArrayMenus);

            let showSeccion = false;

            if (newArrayMenus.filter(mn => mn.seleccionado && mn.id === menuTrabajo).length != 0) {
                showSeccion = true;
            }

            setShowSeccion(showSeccion);

            if (!showSeccion) {
                let clonedSecciones = [...dataSeccion];

                clonedSecciones.map(cs => {
                    cs.seleccionado = false;
                });

                setDataSeccion(clonedSecciones);
            }
        }

        const handleSelectSeccion = (idTipo, e) => {

            let checked = e.target.checked;
            let newArraySecciones = [...dataSeccion];
            let pos = newArraySecciones.findIndex((item) => item.idTipo === idTipo)

            newArraySecciones[pos].seleccionado = checked;

            setDataSeccion(newArraySecciones);

        }

        const handleChecked = (id, e) => {
            let newArrayMenus = [...dataMenu]

            let name = e.target.name;
            let checked = e.target.checked;

            let pos = newArrayMenus.findIndex((item) => item.id === id)

            if (name === "esConsultarSelected") {
                newArrayMenus[pos].esconsultarrol = checked;
            }
            else if (name === "esExportarSelected") {
                newArrayMenus[pos].esexportarrol = checked;
            }
            else if (name === "esCrearSelected") {
                newArrayMenus[pos].escrearrol = checked;
            }
            else if (name === "esEditarSelected") {
                newArrayMenus[pos].eseditarrol = checked;
            }
            else if (name === "esEliminarSelected") {
                newArrayMenus[pos].eseliminarrol = checked;
            }
            setDataMenu(newArrayMenus)
        }

        const handleSave = (data) => {
            if (l_save) return
            setL_save(true)

            let menus = new Array();

            dataMenu.filter(dm => dm.seleccionado)
                .forEach(dm => {
                    let objMenu = {
                        "id": dm.id,
                        "esConsultar": dm.esconsultarrol,
                        "esExportar": dm.esexportarrol,
                        "esCrear": dm.escrearrol,
                        "esEditar": dm.eseditarrol,
                        "esEliminar": dm.eseliminarrol,
                    }

                    menus.push(objMenu);
                });

            let secciones = new Array();

            dataSeccion.filter(ds => ds.seleccionado)
                .forEach(ds => {
                    let objSeccion = {
                        "idTipo": ds.idTipo
                    }

                    secciones.push(objSeccion)
                })

            let oRol = {
                "id": ID,
                "nombre": data.nombre,
                "estado": data.estado,
                "idTipoRol": data.idTipoRol,
                "menus": menus,
                "secciones": secciones
            }

            AXIOS.post(smart.urlContext + smart.urlSave, oRol)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })

                        appContext.handleBreadcumb(true, [
                            { url: '', name: "Seguridad" },
                            { url: '/seguridad/rol/', name: "Rol" },
                            { url: '', name: "Editar" },
                        ]);

                        if (!ID) {
                            setCodigo(data.codigo)
                            ID = data.id
                        }
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






        return (
            <div className="o-container c-header__wrapper flex flex-column mt-3">
                <form className="w-100" onSubmit={handleSubmit(handleSave)}>
                    <Row className="mb-5">
                        <Col md="3" className="mt-2">
                            <CInput
                                value={codigo}
                                name="codigo"
                                disabled
                                label="Código"
                                placeholder="Autogenerado"
                            />
                        </Col>
                        <Col md="3" className="mt-2">
                            <CInput
                                name="nombre"
                                disabled={allDisabled}
                                {...register("nombre", { required: true })}
                                label="Nombre"
                                requerido="1"
                                error={errors.nombre?.type === 'required' && "El campo nombre es requerido"}
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            {appContext.permisos.esUsuarioSoloConsultar ?
                                (<CInput
                                    disabled={allDisabled}
                                    name="tipoRol"
                                    {...register("tipoRol", { required: false })}
                                    label="Tipo"
                                    placeholder=""
                                />) :
                                (<CSelect
                                    disabled={allDisabled}
                                    name="idTipoRol"
                                    {...register("idTipoRol", {
                                        required: {
                                            value: true,
                                            message: 'El campo tipo es requerido'
                                        },
                                        onChange: (e => {

                                            let value = e.target.value;

                                            let clonedSecciones = [...dataSeccion];

                                            clonedSecciones.map(cs => {
                                                cs.seleccionado = false;
                                            });

                                            setDataSeccion(clonedSecciones);

                                            let showSeccion = false;

                                            if (value == 3 || value == 5 || value == 6 || value == 7 || value == 8) {
                                                showSeccion = true;
                                            }

                                            setShowSeccion(showSeccion);

                                        }),
                                    })}
                                    label="Tipo"
                                    requerido="1"
                                    error={errors.idDepartamento?.message}
                                    options={[{ id: '', text: 'Seleccione' }, ...dataTipoRol.map(el => ({ id: el.id, text: el.nombre }))]}
                                />)}
                        </Col>
                        <Col md="2" className="mt-2">
                            <CSelect
                                disabled={allDisabled}
                                name="estado"
                                {...register("estado", { required: true })}
                                label="Estado"
                                requerido="1"
                                error={errors.estado?.type === 'required' && "El campo estado es requerido"}
                                options={[...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                            />
                        </Col>
                    </Row>

                    <hr className="u-text--gray-60 mb-3" />

                    <Row className="mb-2">
                        <div className="mt-2 flex gap-2 justify-space-between align-center w-100">
                            <span className=" title--20 u-text--gray-80 u-text--bold">Menús</span>
                        </div>
                    </Row>

                    <div className="c-table__container mt-0 w-100 mb-5">
                        <table className="c-table">
                            <thead>
                                <tr>
                                    <th scope="col">
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            N°
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex">
                                            Menu
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex">
                                            Módulo
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Consultar
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Exportar
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Crear
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Editar
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Eliminar
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    l_dataMenu ?
                                        <tr>
                                            <td colSpan="6">Cargando...</td>
                                        </tr> :
                                        errorData ?
                                            <tr>
                                                <td colSpan="6">{errorData}</td>
                                            </tr>
                                            :
                                            dataMenu.map((item, index) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td className="c-table__options text-center">
                                                            <label className="c-checkbox justify-content-center">
                                                                <input name="selectMenu" className=" c-checkbox__input"
                                                                    disabled={allDisabled}
                                                                    type="checkbox"
                                                                    checked={item.seleccionado}
                                                                    onChange={(e) => handleSelectMenu(item.id, e)} />
                                                                <span className="c-checkbox__icon"></span>
                                                            </label>
                                                        </td>
                                                        <td className="c-table__options text-center">{Number(index) + 1}</td>
                                                        <td className="text-left" style={{ width: "180px" }}>{item.nombre}</td>
                                                        <td className="text-left" style={{ width: "180px" }}>{item.nombrepadre}</td>
                                                        <td className="text-center">
                                                            {
                                                                item.esconsultar && <label className="c-checkbox justify-content-center">
                                                                    <input
                                                                        name="esConsultarSelected"
                                                                        className=" c-checkbox__input"
                                                                        type="checkbox"
                                                                        onChange={(e) => handleChecked(item.id, e)}
                                                                        disabled={allDisabled ? true : (item.seleccionado ? false : true)}
                                                                        checked={item.esconsultarrol}
                                                                    />
                                                                    <span className="c-checkbox__icon"></span>
                                                                </label>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                item.esexportar && <label className="c-checkbox justify-content-center">
                                                                    <input
                                                                        name="esExportarSelected"
                                                                        className=" c-checkbox__input"
                                                                        type="checkbox"
                                                                        onChange={(e) => handleChecked(item.id, e)}
                                                                        disabled={allDisabled ? true : (item.seleccionado ? false : true)}
                                                                        checked={item.esexportarrol}
                                                                    />
                                                                    <span className="c-checkbox__icon"></span>
                                                                </label>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                item.escrear && <label className="c-checkbox justify-content-center">
                                                                    <input
                                                                        name="esCrearSelected"
                                                                        className=" c-checkbox__input"
                                                                        type="checkbox"
                                                                        onChange={(e) => handleChecked(item.id, e)}
                                                                        disabled={allDisabled ? true : (item.seleccionado ? false : true)}
                                                                        checked={item.escrearrol}
                                                                    />
                                                                    <span className="c-checkbox__icon"></span>
                                                                </label>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                item.eseditar && <label className="c-checkbox justify-content-center">
                                                                    <input
                                                                        name="esEditarSelected"
                                                                        className=" c-checkbox__input"
                                                                        type="checkbox"
                                                                        onChange={(e) => handleChecked(item.id, e)}
                                                                        disabled={allDisabled ? true : (item.seleccionado ? false : true)}
                                                                        checked={item.eseditarrol}
                                                                    />
                                                                    <span className="c-checkbox__icon"></span>
                                                                </label>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                item.eseliminar && <label className="c-checkbox justify-content-center">
                                                                    <input
                                                                        name="esEliminarSelected"
                                                                        className=" c-checkbox__input"
                                                                        type="checkbox"
                                                                        onChange={(e) => handleChecked(item.id, e)}
                                                                        disabled={allDisabled ? true : (item.seleccionado ? false : true)}
                                                                        checked={item.eseliminarrol}
                                                                    />
                                                                    <span className="c-checkbox__icon"></span>
                                                                </label>
                                                            }
                                                        </td>
                                                    </tr>)
                                            })
                                }
                            </tbody>
                        </table>

                    </div>

                    {showSeccion && <>
                        <hr className="u-text--gray-60 mb-3" />

                        <Row className="mb-2">
                            <div className="mt-2 flex gap-2 justify-space-between align-center w-100">
                                <span className=" title--20 u-text--gray-80 u-text--bold">Restricción de Secciones</span>
                            </div>
                        </Row>

                        <div className="c-table__container mt-0 w-50 mb-5">
                            <table className="c-table">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                N°
                                        </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex">
                                                Sección
                                        </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        l_dataSeccion ?
                                            <tr>
                                                <td colSpan="6">Cargando...</td>
                                            </tr> :
                                            errorData ?
                                                <tr>
                                                    <td colSpan="6">{errorData}</td>
                                                </tr>
                                                :
                                                dataSeccion.map((item, index) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td className="c-table__options text-center">
                                                                <label className="c-checkbox justify-content-center">
                                                                    <input name="selectSeccion" className=" c-checkbox__input"
                                                                        disabled={allDisabled}
                                                                        type="checkbox"
                                                                        checked={item.seleccionado}
                                                                        onChange={(e) => handleSelectSeccion(item.idTipo, e)} />
                                                                    <span className="c-checkbox__icon"></span>
                                                                </label>
                                                            </td>
                                                            <td className="c-table__options text-center">{Number(index) + 1}</td>
                                                            <td className="text-left" style={{ width: "180px" }}>{item.tipo}</td>
                                                        </tr>)
                                                })
                                    }
                                </tbody>
                            </table>

                        </div>
                    </>}



                    <Row className="mb-2">
                        <div className="mt-2 flex justify-flex-end gap-4">
                            <a className="c-link" href="/seguridad/rol/">
                                <CButton type="button">
                                    <Icon children="arrow_back" h="24" className="material-icons-outlined mr-2" />
                                    Volver
                                </CButton>
                            </a>

                            {s_buttonSave && <CButton disabled={allDisabled} type="submit" isLoading={l_save} children="Guardar" className="c-button--blue">
                                <Icon children="save" h="24" className="mr-2" />
                                Guardar
                            </CButton>}
                        </div>
                    </Row>

                </form>
            </div>
        )
    }

    Global.View = ViewIntl;
})()
