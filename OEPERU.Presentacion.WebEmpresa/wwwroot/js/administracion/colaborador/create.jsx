(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, handleError, AppContext, localSt, generateId } = Global
    const { useForm, Controller } = ReactHookForm;

    let smart = {
        urlContext: '/Administracion/Colaborador',
        urlSave: '/Save',
        urlGetSingle: '/GetSingle',
        urlGetRolList: '/Seguridad/Rol/GetList',
        urlGetClientList: '/Administracion/Cliente/GetList',
        urlGetCatalogoEstadoList: '/Administracion/CatalogoEstado/GetList',
    }

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        const [allDisabled, setAllDisabled] = useState(false)

        const [rendered, setRendered] = useState(false)
        const [renderedCliente, setRenderedCliente] = useState(false)

        //creación de manejadores
        const [dataEstado, setDataEstado] = useState([])
        const [dataRegion, setDataRegion] = useState([])
        const [dataRol, setDataRol] = useState([])

        const [dataCliente, setDataCliente] = useState([])

        const [cambiarContrasenia, setCambiarContrasenia] = useState(true)
        const [inputContrasenia, setInputContrasenia] = useState(true)
        const [autogenerar, setAutogenerar] = useState(false)

        const [codigo, setCodigo] = useState('')
        const [l_save, setL_save] = useState(false)

        const [l_dataCliente, setL_DataCliente] = useState(false)
        const [dataTipoCliente, setDataTipoCliente] = useState([])

        const [s_buttonSave, setS_buttonSave] = useState(false)

        //registro de formulario
        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();


        useEffect(() => {

            let menuPermiso = appContext.menuPermiso("administracion/colaborador")

            axios.all([menuPermiso])
                .then(response => {
                    setRendered(true);
                }).
                catch(error => {
                    setRendered(true);
                    console.log("error");
                });

            // NOTE: esto se ejecutará una sola ves al montarse el componente vista

        }, [])

        useEffect(() => {
            if (rendered) {
                ID = document.querySelector('#id').value;

                let estadoListar = catalogoEstadoBuscar(1);
                let regionListar = catalogoEstadoBuscar(2);
                let clienteListar = clienteBuscar();
                let rolListar = rolBuscar();

                axios.all([regionListar, estadoListar, clienteListar, rolListar]).
                    then(response => {

                        setValue('idRegion', 1);
                        setValue('estado', 1);

                        if (ID) {
                            setS_buttonSave(appContext.permisos.esUsuarioEditar)
                            getSingle();
                        }
                        else {
                            setS_buttonSave(appContext.permisos.esUsuarioCrear)

                            if (!appContext.permisos.esUsuarioCrear) {
                                setAllDisabled(true);
                            }

                            setInputContrasenia(false)
                            let setContrasenia = document.querySelector('#cambiarContraseniaCheck').remove();

                            appContext.handleBreadcumb(true, [
                                { url: '', name: "Administración" },
                                { url: '/administracion/colaborador/', name: "Colaborador" },
                                { url: '', name: "Crear" },
                            ]);
                        }
                    }).
                    catch(error => {
                        console.log("error");
                    });

            }
        }, [rendered])

        useEffect(async () => {

            if (renderedCliente) {
                dataTipoCliente.forEach((item) => {
                    setValue(`cliente${item.key}`, item.idCliente)
                    setValue(`clienEstado${item.key}`, item.idEstado)
                })

                setRenderedCliente(false);
            }
        }, [renderedCliente])

        /*Estado y Región*/
        const catalogoEstadoBuscar = (_tipo) => {
            /*
            Tipos :
            1.- Estado
            2.- Región
            */

            let _codigo = 0;

            if (_tipo == 1) {
                _codigo = 11200;
            }
            else if (_tipo == 2) {
                _codigo = 10402;
            }

            let params = {
                codigo: _codigo
            };

            let listar = AXIOS.get(`${smart.urlGetCatalogoEstadoList}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {

                        if (_tipo == 1) {
                            setDataEstado(data.data);
                        }
                        else if (_tipo == 2) {
                            setDataRegion(data.data);
                        }

                    }
                    else {
                        if (_tipo == 1) {
                            setDataEstado([]);
                        }
                        else if (_tipo == 2) {
                            setDataRegion([]);
                        }
                    }
                })
                .catch((error) => {
                    if (_tipo == 1) {
                        setDataEstado([]);
                    }
                    else if (_tipo == 2) {
                        setDataRegion([]);
                    }
                });

            return listar;
        }

        const clienteBuscar = () => {
            let params = {
                ordenamiento: 'nombre asc',
                pagina: 0
            }

            var clienteListar = AXIOS.get(`${smart.urlGetClientList}`, { params })
                .then(({ data: clientes }) => {
                    if (clientes.apiEstado == "ok") {
                        setDataCliente(clientes.data);
                    }
                    else {
                        setDataCliente([]);
                    }
                })
                .catch(() => {
                    setDataCliente([]);
                })

            return clienteListar;
        }

        const rolBuscar = () => {

            let params = {
                ordenamiento: 'nombre asc',
                pagina: 0
            }

            var rolListar = AXIOS.get(`${smart.urlGetRolList}`, { params })
                .then(({ data: roles }) => {
                    if (roles.apiEstado == "ok") {
                        setDataRol(roles.data);
                    }
                    else {
                        setDataRol([]);
                    }
                })
                .catch((error) => {
                    setDataRol([]);
                })

            return rolListar;
        }

        const getSingle = () => {

            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, {
                params: {
                    id: ID
                }
            })
                .then(({ data: resSingle }) => {
                    if (resSingle.apiEstado === 'ok') {

                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setAllDisabled(true);
                        }

                        if (!appContext.permisos.esUsuarioEditar) {
                            setAllDisabled(true);
                        }

                        setCodigo(resSingle.codigo)
                        setValue('nombre', resSingle.nombre)
                        setValue('apellido', resSingle.apellido)
                        setValue('idRegion', resSingle.idRegion)
                        setValue('documento', resSingle.documento)
                        setValue('telefono', resSingle.telefono)
                        setValue('correo', resSingle.usuario)
                        setValue('idRol', resSingle.idRol)
                        setValue('rol', resSingle.rol)
                        setValue('estado', resSingle.idEstado)

                        let resSingleDataCliente = resSingle.clientes.map(item => {
                            return { ...item, key: generateId() }
                        })

                        setCambiarContrasenia(false);

                        setDataTipoCliente(resSingleDataCliente);
                        setRenderedCliente(true);

                        appContext.handleBreadcumb(true, [
                            { url: '', name: "Administración" },
                            { url: '/administracion/colaborador/', name: "Colaborador" },
                            { url: '', name: "Editar" },
                        ]);

                    }
                })
                .catch(error => {
                    setAllDisabled(true);
                    handleError(error);
                })
        };

        const handleSave = (data) => {
            if (l_save) return
            setL_save(true)

            let clientesList = new Array();

            dataTipoCliente.map(item => {
                clientesList.push({
                    'idCliente': item.idCliente,
                    'estado': item.idEstado
                })
            })

            let pushData = {
                'id': ID,
                'nombre': data.nombre,
                'apellido': data.apellido,
                'idregion': data.idRegion,
                'documento': data.documento,
                'telefono': data.telefono,
                'correo': data.correo,
                'contrasenia': data.contrasenia,
                'cambiarContrasenia': cambiarContrasenia,
                'idrol': data.idRol,
                'estado': data.estado,
                'clientes': clientesList
            }

            AXIOS.post(smart.urlContext + smart.urlSave, pushData)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })
                        appContext.handleBreadcumb(true, [
                            { url: '', name: "Administración" },
                            { url: '/seguridad/Colaborador/', name: "Colaborador" },
                            { url: '', name: "Editar" },
                        ]);

                        if (!ID) {
                            setCodigo(data.codigo)
                            ID = data.id
                        }

                        getSingle();
                        setL_save(false)

                    } else {
                        swal({
                            // title: data.apiMensaje,
                            title: data.apiMensaje,
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

        const handleChange = (e) => {

            let name = e.target.name;
            let value = e.target.value;
            let checked = e.target.checked;

            if (name === "cambiarContrasenia") {
                setCambiarContrasenia(checked)
                setInputContrasenia(!checked)
                setValue('contrasenia', '')
            }
            else if (name === "autogenerar") {
                setAutogenerar(checked)
            }
        }

        /* Métodos Sección Tipos de Producto */

        const handleAddCliente = (e) => {

            e.preventDefault()

            let objCliente = {
                id: "",
                key: generateId(),
                idCliente: "",
                codigoCliente: "",
                idEstado: 1
            }

            let clone = [...dataTipoCliente]
            clone.push(objCliente)
            setDataTipoCliente(clone)

        }

        const handleChangeCliente = (e, _key) => {
            e.preventDefault()
            let name = e.target.name;
            let value = e.target.value;

            let newArrayCliente = [...dataTipoCliente]

            let pos = newArrayCliente.findIndex((item) => item.key === _key);

            if (name == `cliente${_key}`) {
                newArrayCliente[pos].idCliente = value;
                newArrayCliente[pos].codigoCliente = dataCliente.filter(filterkey => filterkey.id === value).map(item => item.codigo);
            }
            else if (name == `clienEstado${_key}`) {
                newArrayCliente[pos].idEstado = Number(value);
            }

            setDataTipoCliente(newArrayCliente)

        }

        const handleDeleteCliente = (event, _key) => {
            let clone = [...dataTipoCliente]
            let pos = clone.findIndex(item => item.key == _key)
            clone.splice(pos, 1)

            setDataTipoCliente(clone)
        }

        /*Fin Métodos Sección Tipos de Producto */




        let validate = {
            aLowercase: value => /(?=.*[a-z]){1}/.test(value) || 'Debe contener un caracter minúscula',
            aUppercase: value => /(?=.*[A-Z]){1}/.test(value) || 'Debe contener un caracter mayúscula',
            aCharacterSpecial: value => /(?=.*[@#$%^&+=?¿¡!|*\.]){1}/.test(value) || 'Debe contener un caracter especial',
            anNumber: value => /(?=.*[0-9]){1}/.test(value) || 'Debe contener un número'
        }

        return (
            <div className="o-container c-header__wrapper flex flex-column mt-3">
                <form className="w-100" onSubmit={handleSubmit(handleSave)}>
                    <Row>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="codigo"
                                {...register("codigo", {
                                    required: { value: false }
                                })}
                                label="Código"
                                error={errors.codigo?.type === 'required' && "El campo Código es requerido"}
                                disabled
                                value={codigo}
                                requerido="1"
                                placeholder="Autogenerado"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                disabled={allDisabled}
                                name="nombre"
                                {...register("nombre", {
                                    required: {
                                        value: true,
                                        message: 'El campo Nombres es requerido'
                                    },
                                    minLength: {
                                        value: 3,
                                        message: 'El campo nombre tiene que tener un mínimo de 3 caracteres'
                                    },
                                    pattern: {
                                        value: /[a-zA-Z\ ]/g,
                                        message: 'Ingrese un nombre válido'
                                    }
                                })}
                                error={errors.nombre?.message}
                                label="Nombres"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                disabled={allDisabled}
                                name="apellido"
                                {...register("apellido", {
                                    required: {
                                        value: true,
                                        message: 'El campo Apellidos es requerido'
                                    },
                                    minLength: {
                                        value: 3,
                                        message: 'El campo apellidos tiene que tener un mínimo de 3 caracteres'
                                    },
                                    pattern: {
                                        value: /[a-zA-Z\ ]/g,
                                        message: 'Ingrese un apellido válido'
                                    }
                                })}
                                error={errors.apellido?.type === 'required' && "El campo Apellidos es requerido"}
                                label="Apellidos"
                                requerido="1"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-2">
                            <CSelect
                                disabled={allDisabled}
                                name="idRegion"
                                {...register("idRegion", { required: true })}
                                options={[...dataRegion.map(el => ({ id: el.id, text: el.nombre }))]}
                                error={errors.idRegion?.type === 'required' && "El campo Región es requerido"}
                                label="Región"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                disabled={allDisabled}
                                name="documento"
                                {...register("documento", {
                                    required: {
                                        value: true,
                                        message: 'El campo Documento de Identidad es requerido'
                                    },
                                    maxLength: {
                                        value: 8,
                                        message: 'El documento de identidad no puede exceder los 8 caracteres'
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Sólo se permiten Números'
                                    }
                                })}
                                error={errors.documento?.message}
                                label="Documento de Identidad"
                                cRegex={'integer'}
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                disabled={allDisabled}
                                name="telefono"
                                {...register("telefono", {
                                    required: {
                                        value: true,
                                        message: 'El campo Documento de Identidad es requerido'
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Sólo se permiten Números'
                                    }
                                })}
                                error={errors.telefono?.type === 'required' && "El campo Teléfono es requerido"}
                                label="Teléfono"
                                cRegex={'integer'}
                                requerido="1"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-2">
                            <CInput
                                disabled={allDisabled}
                                name="correo"
                                {...register("correo", {
                                    required: {
                                        value: true,
                                        message: 'El campo Correo es requerido'
                                    },
                                    pattern: {
                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: 'Ingrese un correo electrónico válido'
                                    }
                                })}
                                error={errors.correo?.message}
                                label="Correo"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="contrasenia"
                                type="password"
                                {...register("contrasenia", {
                                    required: {
                                        value: cambiarContrasenia == false ? false : true,
                                        message: 'El campo Contraseña es requerido'
                                    },
                                    minLength: {
                                        value: 8,
                                        message: 'Debe contener mínimo 8 caracteres'
                                    },
                                    validate: cambiarContrasenia == false ? '' : validate
                                })}
                                error={errors.contrasenia?.message}
                                disabled={allDisabled ? true : (inputContrasenia)}
                                label="Contraseña"
                                requerido={cambiarContrasenia == false ? '' : '1'}
                            />
                        </Col>
                        <Col md="4" className="flex align-items-center mb-3" style={{ marginTop: "40px" }}>
                            <label className="c-checkbox me-3" >
                                <input name="autogenerar"
                                    //checked={autogenerar} 
                                    onChange={handleChange}
                                    checked={autogenerar == false ? "" : "checked"}
                                    className=" c-checkbox__input"
                                    type="checkbox"
                                    disabled={allDisabled ? true : (cambiarContrasenia == false ? "disabled" : "")}
                                //disabled={}
                                />
                                <span className="c-checkbox__icon mr-3"></span>
                                <span className="c-input__label u-text--gray-90">Autogenerado</span>
                            </label>

                            <label id="cambiarContraseniaCheck" className="c-checkbox">
                                <input
                                    disabled={allDisabled}
                                    name="cambiarContrasenia"
                                    onChange={handleChange}
                                    checked={cambiarContrasenia == false ? "" : "checked"}
                                    className=" c-checkbox__input"
                                    type="checkbox" />
                                <span className="c-checkbox__icon mr-3"></span>
                                <span className="c-input__label u-text--gray-90">Cambiar Contraseña</span>
                            </label>
                            {/* <label className="c-checkbox">
                                <input className="custom-control-input c-checkbox__input" type="checkbox"></input>
                                <span className="c-checkbox__icon mr-3"></span>
                            </label> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-2">
                            {appContext.permisos.esUsuarioSoloConsultar ?
                                (<CInput
                                    name="rol"
                                    disabled={allDisabled}
                                    {...register("rol", { required: false })}
                                    label="Rol"
                                />)
                                : (
                                    <CSelect
                                        name="idRol"
                                        disabled={allDisabled}
                                        {...register("idRol", { required: true })}
                                        options={[{ id: '', text: 'Seleccione' }, ...dataRol.map(el => ({ id: el.id, text: el.nombre }))]}
                                        label="Rol"
                                        error={errors.idRol?.type === 'required' && "El campo de rol es requerido"}
                                        requerido="1"
                                    />
                                )
                            }
                        </Col>
                        <Col md="4" className="mt-2">
                            <CSelect
                                disabled={allDisabled}
                                name="estado"
                                {...register("estado", { required: true })}
                                options={[...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Estado"
                                error={errors.estado?.type === 'required' && "El campo Estado es requerido"}
                                requerido="1"
                            />
                        </Col>

                    </Row>
                    <hr className="u-text--gray-60 mb-5" />
                    {/* end form 1 */}
                    <Row className="mb-2">
                        <div className="mt-2 flex gap-2 justify-space-between align-center w-100">
                            <span className=" title--20 u-text--gray-80 u-text--bold">Clientes</span>
                            {!appContext.permisos.esUsuarioSoloConsultar && <CButton
                                disabled={allDisabled}
                                type="button" onClick={(e) => handleAddCliente(e)}>
                                <Icon children="add_circle" h="24" className="material-icons-outlined mr-2" />
                                Agregar
                            </CButton>}

                        </div>
                    </Row>

                    <div className="c-table__container mt-0 mb-5">
                        <table className="c-table c-table__container--content mb-2">
                            <thead>
                                <tr>
                                    <th scope="c-table__options text-center">
                                    </th>
                                    <th scope="col">
                                        <div className="c-table__options text-center">
                                            N°
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="text-left">
                                            Cliente
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Código
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
                                    l_dataCliente ?
                                        <tr>
                                            <td colSpan="6">Cargando...</td>
                                        </tr> :
                                        dataTipoCliente.map((item, index) => {
                                            return (<tr key={item.key}>
                                                <td className="c-table__options text-center">
                                                    {!appContext.permisos.esUsuarioSoloConsultar &&
                                                        <button
                                                            disabled={allDisabled}
                                                            type="button" className="c-button--minimal u-text--red" onClick={(ev) => handleDeleteCliente(ev, item.key)}>
                                                            <Icon h="24">delete_outline</Icon>
                                                        </button>}

                                                </td>
                                                <td className="c-table__options text-center">{Number(index) + 1}</td>
                                                <td className="text-left">
                                                    {appContext.permisos.esUsuarioSoloConsultar ?
                                                        (<CInput
                                                            disabled={allDisabled}
                                                            value={item.cliente}
                                                            placeholder=""
                                                        />) :
                                                        (<CSelect
                                                            disabled={allDisabled}
                                                            name={`cliente${item.key}`}
                                                            options={[{ id: '', text: 'Seleccione' }, ...dataCliente.map(el => ({ id: el.id, text: el.nombre }))]}
                                                            {...register(`cliente${item.key}`, { required: true })}
                                                            error={errors[`cliente${item.key}`]?.type === 'required' && "Seleccione un cliente"}
                                                            onChange={(e) => handleChangeCliente(e, item.key)}
                                                            placeholder="data"
                                                        />)}

                                                </td>
                                                <td className="flex align-center justify-center">
                                                    {item.codigoCliente}
                                                </td>
                                                <td className="text-left">
                                                    {appContext.permisos.esUsuarioSoloConsultar ?
                                                        (<CInput
                                                            disabled={allDisabled}
                                                            value={item.estado}
                                                            placeholder=""
                                                        />) :
                                                        (<CSelect
                                                            disabled={allDisabled}
                                                            name={`clienEstado${item.key}`}
                                                            options={[...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                                                            {...register(`clienEstado${item.key}`, { required: true })}
                                                            error={errors[`clienEstado${item.key}`]?.type === 'required' && "Seleccione un estado"}
                                                            onChange={(e) => handleChangeCliente(e, item.key)}
                                                            placeholder="data"
                                                        />)}

                                                </td>
                                            </tr>)
                                        })
                                }
                            </tbody>
                        </table>

                    </div>
                    <Row className="mb-2">
                        <div className="mt-2 flex justify-flex-end gap-4">
                            <a className="c-link" href="/administracion/colaborador/">
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
            </div>
        )
    }

    Global.ViewLang = 'security/rol-listar';
    Global.View = ViewIntl;
})()
