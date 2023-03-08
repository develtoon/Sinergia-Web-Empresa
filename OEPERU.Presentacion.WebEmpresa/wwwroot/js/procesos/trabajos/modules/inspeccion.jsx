(function () {
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, handleError, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas } = ReactBootstrap;
    const { useForm, Controller } = ReactHookForm;

    const CInspeccion = forwardRef(({ id }, ref) => {

        const appContext = useContext(AppContext)

        const [allDisabled, setAllDisabled] = useState(false)

        let smart = {
            urlContext: '/Proceso/Trabajo',
            urlGetSingle: '/GetPrincipalSingle',
            urlSave: '/SaveInspeccion'
        }

        const { register, formState: { errors }, handleSubmit, setValue, getValues, control, watch } = useForm();

        const [l_save, setL_save] = useState(false)
        const [l_save_conforme, setL_save_conforme] = useState(false)

        const [render, setRender] = useState(false)
        const [renderPermiso, setRenderPermiso] = useState(false)

        const [esInspeccionConforme, setEsInspeccionConforme] = useState(false)

        const [dataComponent, setDataComponent] = useState([
            { id: generateId(), name: 'tipo1', value: 0, nombre: '% Inspección realizada:' },
            { id: generateId(), name: 'tipo2', value: 0, nombre: '% Uso de inmueble como Vivienda:' },
            { id: generateId(), name: 'tipo3', value: 0, nombre: '% Uso de inmueble como Comercio:' },
            { id: generateId(), name: 'tipo4', value: 0, nombre: '% Uso de inmueble como Industria:' },
            { id: generateId(), name: 'tipo5', value: 0, nombre: '% Uso de inmueble como Depósito:' },
            { id: generateId(), name: 'tipo6', value: 0, nombre: '% Uso de inmueble como Oficina:' },
            { id: generateId(), name: 'tipo7', value: 0, nombre: '% Uso de inmueble como Terreno:' }
        ])

        const [errorData, setErrorData] = useState('')

        //let ID = document.querySelector('#id').value;

        useImperativeHandle(ref, () => ({
            init() {

                setRender(false);
                setRenderPermiso(false);
                setAllDisabled(false);

                if (render) {
                    setRender(false)
                } else {
                    [1, 2, 3, 4, 5, 6, 7].map(item => {
                        setValue(`tipo${item}`, 0)
                        setValue(`tipo${item}_bar`, 0)
                    })

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
        }));

        useEffect(() => {
            if (renderPermiso) {
                buscar()
            }
        }, [renderPermiso])

        useEffect(() => {
            let e = (s) => Number(watch(s))

            setValue('total_bar',
                e('tipo2_bar') +
                e('tipo3_bar') +
                e('tipo4_bar') +
                e('tipo5_bar') +
                e('tipo6_bar') +
                e('tipo7_bar')
            )

            for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
                e.style.setProperty('--value', e.value);
                e.style.setProperty('--min', e.min == '' ? '0' : e.min);
                e.style.setProperty('--max', e.max == '' ? '100' : e.max);
                e.addEventListener('input', () => e.style.setProperty('--value', e.value));
            }


        }, [watch(['tipo1', 'tipo2', 'tipo3', 'tipo4', 'tipo5', 'tipo6', 'tipo7'])])


        const buscar = () => {
            let params = {
                id: id,
                tipo: 6
            }
            AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                .then(({ data }) => {
                    if (data.apiEstado == "ok") {


                        if (appContext.permisos.esUsuarioSoloConsultar) {
                            setAllDisabled(true);
                        }

                        if (!appContext.permisos.esUsuarioEditar) {
                            setAllDisabled(true);
                        }

                        let dataSingle = data.data

                        dataSingle.tipos.map(item => {
                            setValue(`tipo${item.idTipo}`, item.valor ? item.valor : 0)
                            setValue(`tipo${item.idTipo}_bar`, item.valor ? item.valor : 0)
                        })


                        setEsInspeccionConforme(data.data.esInspeccionConforme)
                        setValue('comentarioPedidoInspeccion', dataSingle.comentario)
                        setValue('otros', watch('comentarioPedidoInspeccion') ? true : false)

                        setValue('esDireccionValida', dataSingle.esDireccionValida ? 'si' : 'no')

                    }
                })
                .catch((error) => {
                    handleError(error);
                })
        }



        const handleSave = (data, e) => {

            let a = (s) => Number(s)

            let dataTotal =
                a(data.tipo2_bar) +
                    a(data.tipo3_bar) +
                    a(data.tipo4_bar) +
                    a(data.tipo5_bar) +
                    a(data.tipo6_bar) +
                    a(data.tipo7_bar) == 100 ? false : true


            let oData = {
                id: id,
                idContenedor: 6,
                esDireccionValida: data.esDireccionValida == 'si' ? true : false,
                comentarioPedidoInspeccion: data.comentarioPedidoInspeccion,
                estado: e.target.id ? 2 : 1,
                detalle: [
                    { idTipo: 1, valor: Number(data.tipo1_bar) },
                    { idTipo: 2, valor: Number(data.tipo2_bar) },
                    { idTipo: 3, valor: Number(data.tipo3_bar) },
                    { idTipo: 4, valor: Number(data.tipo4_bar) },
                    { idTipo: 5, valor: Number(data.tipo5_bar) },
                    { idTipo: 6, valor: Number(data.tipo6_bar) },
                    { idTipo: 7, valor: Number(data.tipo7_bar) }
                ]
            }


            if (dataTotal) {
                setErrorData('La suma de todos los porcentajes de uso debe ser 100%')
            } else {
                setErrorData('')
                if (oData.estado == 1) {
                    if (l_save) return
                    setL_save(true)
                    save(oData, 1)


                } else if (oData.estado == 2) {
                    if (l_save_conforme) return
                    setL_save_conforme(true)
                    swal({
                        title: "¿Desea guardar y dar conformidad?",
                        icon: "info",
                        buttons: true,
                        dangerMode: true
                    }).then((willDelete) => {
                        if (willDelete) {

                            save(oData, 2)
                        } else {
                            setL_save_conforme(false)

                        }

                    })
                }
            }
        }

        const save = (_oData, estado) => {
            AXIOS.post(smart.urlContext + smart.urlSave, _oData)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })
                        estado == 1 ? setL_save(false) : setL_save_conforme(false)
                    } else {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })
                        estado == 1 ? setL_save(false) : setL_save_conforme(false)
                    }
                })
                .catch(error => {
                    handleError(error);

                    estado == 1 ? setL_save(false) : setL_save_conforme(false)

                })
        }


        return (
            <form onSubmit={handleSubmit(handleSave)}>
                <>
                    {
                        dataComponent.map(el => {
                            return (
                                <div key={el.id}>

                                    <div className={el.name == 'tipo1' ? 'row' : 'row mb-3'}>
                                        {/* Texto Descriptivo */}
                                        <div className="col-lg-3 col-sm-12 col-md-12 flex align-center justify-content-md-start justify-content-sm-start justify-content-lg-end">
                                            <span className=" paragraph--14 text-end u-text--gray-90">{el.nombre}</span>
                                        </div>

                                        {/* Barra de Rango */}
                                        <div className="col-lg-8 col-sm-12 col-md-12 flex align-center">
                                            <input
                                                name={`${el.name}_bar`}
                                                {...register(`${el.name}_bar`, {
                                                    required: false,
                                                    onChange: (e => {
                                                        setValue(el.name, Number(e.target.value));
                                                    })
                                                })}
                                                className="w-100 styled-slider slider-progress"
                                                type="range"
                                                disabled={allDisabled ? true : (esInspeccionConforme ? true : false)}

                                            />
                                        </div>

                                        {/* Input de numero */}
                                        <div className="col-lg-1 col-sm-12 col-md-12">
                                            <CInput
                                                modInput="u-text--right"
                                                placeholder="0"
                                                name={el.name}
                                                {...register(`${el.name}`, {
                                                    required: false,
                                                    onChange: (e => {
                                                        setValue(`${el.name}_bar`, Number(e.target.value))
                                                    })
                                                })}
                                                // onChange={(e)=>handleChange(e)}
                                                disabled={allDisabled ? true : (esInspeccionConforme ? true : false)}
                                                type="number"
                                                min="0"
                                                cRegex="integer"
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                    {el.name == 'tipo1' && <hr className=" u-text--gray-60 my-2" />}
                                </div>
                            )
                        })
                    }
                    <div className="row mb-2">
                        <div className="col-lg-3 col-sm-12 col-md-12"></div>
                        <div className="col-lg-8 col-sm-12 col-md-12"></div>

                        <div className="col-lg-1 col-sm-12 col-md-12">
                            <div>
                                <span className="paragraph--11 u-text--gray-80 u-text--bold u-text--right d-block">Total % Uso</span>
                                <CInput
                                    modInput="u-text--right u-text--bold"
                                    name="total_bar"
                                    {...register(`total_bar`)}
                                    // onChange={(e)=>handleChange(e)}
                                    type="number"
                                    disabled={true}
                                    cRegex="integer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-flex-end u-text--bold u-text--red paragraph--14">
                        {errorData}
                    </div>
                    <div className="row mt-5 u-text--gray-90">
                        <div className="col-sm-12 col-md-12 col-lg-2 flex justify-content-md-end justify-content-md-start">
                            <label className="c-checkbox mb-2">
                                <input
                                    name="otros"
                                    className=" c-checkbox__input"
                                    {...register("otros", {
                                        required: false,
                                        disabled: allDisabled ? true : (esInspeccionConforme ? true : false)
                                    })}
                                    type="checkbox"
                                />
                                <span className="c-checkbox__icon mr-3"></span>
                                <span className="c-input__label u-text--gray-90">Otros</span>
                            </label>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-10">
                            <CTextArea
                                name="comentarioPedidoInspeccion"
                                {...register("comentarioPedidoInspeccion", {
                                    required: false,
                                    disabled: allDisabled ? true : (watch('otros') ? false : true)
                                })}
                                error={errors.comentarioPedidoInspeccion?.type === 'required' && "El campo Tipo de Visita es requerido"}
                                mod=""
                            />
                        </div>
                    </div>
                    <div className="row mt-5 mb-4 u-text--gray-90">
                        <div className="col-sm-4 col-lg-2 flex justify-flex-end">
                            Dirección Validada:
                        </div>
                        <div className="col-sm-4 col-lg-2 flex align-top">
                            <div className="col-2 flex align-center  me-3">
                                <label htmlFor="si" className="me-2">Sí</label>
                                <input
                                    name="esDireccionValida"
                                    {...register("esDireccionValida", { required: false })}
                                    type="radio"
                                    value="si"
                                    disabled={allDisabled ? true : (esInspeccionConforme ? true : false)}
                                // checked={data.esValidada == 'no' ? 'false':'true'}
                                />
                            </div>

                            <div className="col-sm-4 col-lg-2 flex align-center  me-3">
                                <label htmlFor="no" className="me-2">No</label>
                                <input
                                    name="esDireccionValida"
                                    {...register("esDireccionValida", { required: false })}
                                    type="radio"
                                    value="no"
                                    disabled={allDisabled ? true : (esInspeccionConforme ? true : false)}
                                // checked={data.esValidada == 'no' ? 'false':'true'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col flex justify-flex-end gap-3">
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton
                                    disabled={allDisabled}
                                    type="submit" isLoading={l_save} className={`c-button--green ${esInspeccionConforme ? 'is-disabled' : ''}`}>
                                    <Icon classname="mr-2" h="26">save</Icon>
                                    Guardar
                                </CButton>}
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton
                                    disabled={allDisabled}
                                    id="segundo" type="button" isLoading={l_save_conforme} onClick={handleSubmit(handleSave)} className={`c-button--green ${esInspeccionConforme ? 'is-disabled' : ''}`}>
                                    <Icon classname="mr-2" h="26">check</Icon>
                                    Guardar y dar conformidad
                                </CButton>}
                        </div>
                    </div>
                </>
            </form>
        )

    })

    // colocar como global
    window.Inspeccion = {
        CInspeccion
    }
})()
