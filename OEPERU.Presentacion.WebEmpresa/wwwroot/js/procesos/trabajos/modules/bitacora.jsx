(function () {
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, handleError, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas } = ReactBootstrap;
    const { useForm, Controller } = ReactHookForm;

    const CBitacora = forwardRef(({ id }, ref) => {

        const appContext = useContext(AppContext)

        const [allDisabled, setAllDisabled] = useState(false)

        let smart = {
            urlContext: '/Proceso/Trabajo',
            urlGetSingle: '/GetPrincipalSingle',
            urlSave: '/SaveBitacora',
            urlDelete: '/DeleteBitacora'
        }

        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();
        const [render, setRender] = useState(false)
        const [renderPermiso, setRenderPermiso] = useState(false)
        const [l_save, setL_save] = useState(false)
        const [comentario, setComentario] = useState([])

        //let ID = document.querySelector('#id').value;

        useImperativeHandle(ref, () => ({
            init() {

                setRender(false);
                setRenderPermiso(false);
                setAllDisabled(false);

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
            setL_save(true)
            let params = {
                id: id,
                tipo: 5
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

                        setComentario(data.data.comentario)
                        document.getElementsByClassName('c-bitacora-notification-area')[0].scrollTop = 99999
                        setL_save(false)
                    }
                    else {
                        setAllDisabled(true);
                    }
                })
                .catch((error) => {
                    handleError(error);
                    setAllDisabled(true);
                });

        }

        const handleDelete = (e, _id) => {
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

                                    buscar()
                                }
                                else {
                                    swal({
                                        title: res.apiMensaje,
                                        // text: data.apiMensaje,
                                        icon: "error",
                                    })
                                }
                            })
                    }
                });
        }



        const handleSave = (data) => {
            setL_save(true)
            let oData = {
                id: id,
                idContenedor: 5,
                idPedidoBitacora: '',
                comentarioPedidoBitacora: data.comentarioPedidoBitacora
            }

            AXIOS.post(smart.urlContext + smart.urlSave, oData)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })
                        setValue('comentarioPedidoBitacora', '')

                        setL_save(false)
                        buscar()


                    } else {
                        setL_save(false)
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })
                    }
                })
                .catch(error => {
                    handleError(error);
                    setL_save(false)
                })
        }

        return (
            <div className="c-bitacora">

                <div className="c-bitacora-notification-area">

                    {
                        comentario.map(item => (
                            <div className={`c-bitacora-card ${item.esEditable ? '' : 'c-bitacora-card-notme'}`} key={item.id}>
                                {/* Card Header */}
                                <div className="c-bitacora-card-header">
                                    <div>
                                        <img src="/images/user.png" alt="" className="c-bitacora-card-picture" />
                                        <span className="c-bitacora-card-name">{item.usuario}</span>
                                    </div>
                                    {
                                        item.esEditable &&
                                        (
                                            !appContext.permisos.esUsuarioSoloConsultar &&
                                            <Icon children="close" className="c-bitacora-card-close" h="26" onClick={e => handleDelete(e, item.id)}></Icon>
                                        )
                                    }
                                </div>

                                {/* Card Paragraph */}
                                <div className="c-bitacora-card-paragraph">
                                    {item.comentario}
                                </div>

                                {/* Card Date */}
                                <div className="c-bitacora-card-date">
                                    {item.fechaCreacion}
                                </div>
                            </div>
                        ))
                    }

                </div>

                <form onSubmit={handleSubmit(handleSave)} className=" m-0 mt-2">
                    <div>
                        {!appContext.permisos.esUsuarioSoloConsultar &&
                            <CInput
                                disable={allDisabled}
                                placeholder="Ingrese sus comentarios aquí"
                                mod="mb-2"
                                name="comentarioPedidoBitacora"
                                {...register("comentarioPedidoBitacora", {
                                    required: {
                                        value: true,
                                        message: 'Escriba un comentario antes de enviar'
                                    }
                                })}
                                error={errors.comentarioPedidoBitacora?.message}
                            />}

                    </div>
                    <div className="flex justify-flex-end">
                        {!appContext.permisos.esUsuarioSoloConsultar &&
                            <CButton
                                disable={allDisabled}
                                type="submit" isLoading={l_save}>
                                <Icon children="chat" h="24" />
                                Comentar
                            </CButton>}

                    </div>
                </form>
            </div>
        )

    })

    // colocar como global
    window.Bitacora = {
        CBitacora
    }
})()
