(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, AppContext, localSt, generateId } = Global
    const { useForm, Controller } = ReactHookForm;

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        //creación de manejadores
        const [dataEstado, setDataEstado] = useState([])
        const [autogenerar, setAutogenerar] = useState(false)
        
        //registro de formulario
        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();

        useEffect(() => {            

            setDataEstado([
                { id: 1, nombre: 'Activo' },
                { id: 2, nombre: 'Inactivo' }
            ])

            

            setDataEstadoCliente([
                { id: 1, nombre: 'Cotizado' },
                { id: 2, nombre: 'Facturado' }
            ])

            appContext.handleBreadcumb(true, [
                { url: '', name: "Administración" },
                { url: '/administracion/usuarios', name: "Usuarios"},
                { url: '', name: "Crear" },
            ]);

        }, [])

        const handleSave = (data) => {
            console.log("click");
        }

        const handleChange = (e) => {
            
            let name = e.target.name;
            let value = e.target.value;
            let checked = e.target.checked;

            if (name === "cambiarContrasenia"){
                setCambiarContrasenia(checked)
            }
            else if (name ==="autogenerar"){
                setAutogenerar(checked)
            }
        }


        return (
            <div className="o-container c-header__wrapper flex flex-column mt-3">
                <form className="w-100" onSubmit={handleSubmit(handleSave)}>
                    <Row>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="codigoSelected"
                                {...register("codigoSelected", { 
                                    required: true 
                                })}
                                label="Código"
                                error={errors.codigoSelected?.type === 'required' && "El campo código es requerido"}
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="nombresSelected"
                                {...register("nombres", { 
                                    required: true 
                                })}
                                error={errors.nombresSelected?.type === 'required' && "El campo nombre es requerido"}
                                label="Nombres"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="apellidosSelected"
                                {...register("apellidosSelected", { 
                                    required: true 
                                })}
                                error={errors.apellidosSelected?.type === 'required' && "El campo apellido(s) es requerido"}
                                label="Apellidos"
                                requerido="1"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-2">
                            <CSelect
                                name="regionSelected"
                                {...register("regionSelected", { 
                                    required: true 
                                })}
                                options={[{ id: '', text: 'Seleccione' }, ...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                                error={errors.regionSelected?.type === 'required' && "Seleccione una región"}
                                label="Estado"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="docIdentidadSelected"
                                {...register("docIdentidadSelected", { 
                                    required: true 
                                })}
                                error={errors.docIdentidadSelected?.type === 'required' && "El campo documento de identidad es requerido"}
                                label="Documento de Identidad"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="telefonoSelected"
                                {...register("telefonoSelected", { 
                                    required: true 
                                })}
                                error={errors.telefonoSelected?.type === 'required' && "El campo teléfono es requerido"}
                                label="Teléfono"
                                requerido="1"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-2">
                            <CInput
                                name="correoSelected"
                                {...register("correoSelected", { 
                                    required: true 
                                })}
                                error={errors.correoSelected?.type === 'required' && "El campo correo es requerido"}
                                label="Correo"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CInput
                                type="passwordSelected"
                                name="passwordSelected"
                                {...register("passwordSelected", { 
                                    required: {value: true, message: 'El campo de contraseña es requerido'},
                                    validate: {
                                        aLowercase: value => /(?:.*[a-z]){1}/.test(value) || 'Debe contener al menos una minúscula',
                                        aUppercase: value => /(?:.*[A-Z]){1}/.test(value) || 'Debe contener al menos una mayúsula',
                                        anNumber: value => /(?:.*[0-9]){1}/.test(value) || 'Debe contener al menos un número'
                                    }
                                })}
                                error={errors.passwordSelected?.message}
                                label="Contraseña"
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2 flex align-items-center mb-3">
                            <label className="c-checkbox me-3">
                                <input name="autogenerar" 
                                //checked={autogenerar} 
                                onChange={handleChange} 
                                checked={autogenerar == false ? "" : "checked"}
                                className=" c-checkbox__input" 
                                type="checkbox"
                                />
                                <span className="c-checkbox__icon mr-3"></span>
                                <span className="c-input__label u-text--gray-90">Autogenerado</span>
                            </label>
                            
                            <label className="c-checkbox">
                                <input 
                                    name="cambiarContrasenia"
                                    onChange={handleChange} 
                                    //checked={cambiarContrasenia == false ? "" : "checked"}
                                    className=" c-checkbox__input"
                                    type="checkbox"
                                />
                                <span className="c-checkbox__icon mr-3"></span>
                                <span className="c-input__label u-text--gray-90">Cambiar Contraseña</span>
                            </label>
                            {/* <label className="c-checkbox">
                                <input className="custom-control-input c-checkbox__input" type="checkbox"></input>
                                <span className="c-checkbox__icon mr-3"></span>
                            </label> */}
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col md="4" className="mt-2">
                            <CSelect
                                name="rolSelected"
                                {...register("rolSelected", { 
                                    required: true 
                                })}
                                options={[{ id: '', text: 'Seleccione' }, ...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Rol"
                                error={errors.rolSelected?.type === 'required' && "El campo de rol es requerido"}
                                requerido="1"
                            />
                        </Col>
                        <Col md="4" className="mt-2">
                            <CSelect
                                {...register("forma", { 
                                    required: true 
                                })}
                                options={[{ id: '', text: 'Seleccione' }, ...dataEstado.map(el => ({ id: el.id, text: el.nombre }))]}
                                label="Estado"
                                error={errors.forma?.type === 'required' && "Seleccione un Estado"}
                                requerido="1"
                            />
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <div className="mt-2 flex justify-space-between">
                            <a className="c-link" href="/administracion/usuarios/">
                                <CButton type="button">
                                    <Icon children="arrow_back" h="24" className="material-icons-outlined mr-2" />
                                    Volver
                                </CButton>
                            </a>

                            <CButton type="submit" children="Guardar" className="c-button--blue">
                                <Icon children="save" h="24" className="mr-2" />
                                Guardar
                            </CButton>
                        </div>
                    </Row>
                </form>
            </div>
        )
    }

    Global.ViewLang = 'security/rol-listar';
    Global.View = ViewIntl;
})()
