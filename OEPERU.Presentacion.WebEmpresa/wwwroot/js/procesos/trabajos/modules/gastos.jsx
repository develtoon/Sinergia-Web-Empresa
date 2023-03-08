(function () {
    const { CInput, CInputFile, CSelect, CBreadcrumbs, CButton, Icon, handleError, CTextArea, CFlags, CPagination, CCheckBox, AppContext, localSt, generateId, CSwitch } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas, Row, Col } = ReactBootstrap;
    const { useForm, Controller } = ReactHookForm;

    let smart = {
        urlContext: '/Proceso/Trabajo',
        urlGetSingle: '/GetPrincipalSingle',
        urlGetDataList: '/GetDataList',
        urlSaveSeccionGastos: '/SaveGastos',
        urlSaveArchivoGastos: '/SaveArchivoGastos',
        UrlDownloadGastoArchivo: '/DownloadGastoArchivo',
        UrlDownloadGastoArchivoZip: '/DownloadGastoArchivoZip',
    }


    const CGastos = forwardRef(({ id }, ref) => {

        const appContext = useContext(AppContext)

        const [allDisabled, setAllDisabled] = useState(false)

        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();
        const [dataGastos, setDataGastos] = useState([])
        const [conceptoGasto, setConceptoGasto] = useState([])


        const [rendered, setRendered] = useState(false)
        const [renderPermiso, setRenderPermiso] = useState(false)
        const [renderDataGastos, setRenderDataGastos] = useState(false)

        const [registro, setRegistro] = useState("")

        const [checkGeneral, setCheckedGeneral] = useState(false)

        const [l_save, setL_save] = useState(false)
        const [l_download, setL_download] = useState(false)

        //ID = document.querySelector('#id').value;

        useImperativeHandle(ref, () => ({
            init() {

                setRenderPermiso(false);
                setAllDisabled(false);
                setRendered(false);
                setRenderDataGastos(false);

                if (rendered) {
                    setRendered(false)
                } else {
                    setRendered(true);
                    let menuPermiso = appContext.menuPermiso("proceso/trabajo")

                    axios.all([
                        menuPermiso
                    ]).then(response => {
                        axios.all([listarPorCodigo('1100')])
                            .then(response => {
                                setRenderPermiso(true);
                            }).
                            catch(error => {
                                setRenderPermiso(true);
                            });

                    }).catch(error => {
                        console.log("error");
                    });
                }
            }
        }))

        useEffect(() => {
            if (renderPermiso) {
                getSingle();
            }
        }, [renderPermiso])

        useEffect(() => {
            if (renderDataGastos) {
                dataGastos.forEach(item => {
                    setValue(`idTipo${item.key}`, item.idTipo)
                    setValue(`tipo${item.key}`, item.tipo)
                    setValue(`monto${item.key}`, item.monto)
                })
                setRenderDataGastos(false);
            }
        }, [renderDataGastos])

        const getSingle = () => {

            let params = {
                id: id,
                tipo: 4
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

                        setRegistro(data.data.registro);
                        let dataSingle = data.data.archivos

                        const archivos = dataSingle.map(item => {

                            let esExistente = false;

                            if (item.idArchivo != "") {
                                esExistente = true;
                            }

                            return {
                                ...item,
                                seleccionado: false,
                                key: generateId(),
                                esExistente: esExistente,
                                esSubido: false,
                                l_data: false
                            }
                        })

                        setDataGastos(archivos)
                        setRenderDataGastos(true);
                    }
                    else {
                        setAllDisabled(true);
                    }

                }).catch((error) => {
                    setAllDisabled(true);
                    handleError(error);
                })
        }

        const listarPorCodigo = (codigo) => {
            let params = {
                codigo: codigo
            };

            let listarPorCodigo =
                AXIOS.get(`${smart.urlContext}${smart.urlGetDataList}`, { params })
                    .then(({ data }) => {
                        if (data.apiEstado == "ok") {
                            if (codigo == '1000') { setDocumento(data.data) }
                            else if (codigo == '1100') { setConceptoGasto(data.data) }
                            else if (codigo == '1300') { setFormaPago(data.data) }
                            else if (codigo == '2100') { setTipoVisita(data.data) }
                            else if (codigo == '2400') { setTipoDocumento(data.data) }
                            else if (codigo == '2500') { setFacturarA(data.data) }
                        }
                        else {
                            if (codigo == '1000') { setDocumento([]) }
                            else if (codigo == '1100') { setConceptoGasto([]) }
                            else if (codigo == '1300') { setFormaPago([]) }
                            else if (codigo == '2100') { setTipoVisita([]) }
                            else if (codigo == '2500') { setFacturarA([]) }
                        }
                    })
                    .catch(() => {
                        if (codigo == '1000') { setDocumento([]) }
                        else if (codigo == '1100') { setConceptoGasto([]) }
                        else if (codigo == '1300') { setFormaPago([]) }
                        else if (codigo == '2100') { setTipoVisita([]) }
                        else if (codigo == '2500') { setFacturarA([]) }
                    });

            return listarPorCodigo;

        }

        const handleChange = (e, _key) => {

            let name = e.target.name
            let value = e.target.value
            let checked = e.target.checked

            if (name == `idTipo${_key}`) {
                let newArr = dataGastos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            idTipo: value,
                        }
                    }
                    return item
                })
                setDataGastos(newArr)

            } else if (name == `monto${_key}`) {
                let newArr = dataGastos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            monto: Number(value),
                        }
                    }
                    return item
                })
                setDataGastos(newArr)

            } else if (name == `esFacturable${_key}`) {
                let newArr = dataGastos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            esFacturable: checked,
                        }
                    }
                    return item
                })
                setDataGastos(newArr)
            }
            else if (name == `seleccionado${_key}`) {

                let checkedGeneral = false;

                let cantidadSeleccionado = 0;
                let cantidadDisponibleSeleccionar = dataGastos.filter(dda => dda.id !== "").length;

                let newArr = dataGastos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            seleccionado: checked,
                        }
                    }
                    return item
                })

                cantidadSeleccionado = newArr.filter(dda => dda.seleccionado).length;

                if (cantidadSeleccionado == cantidadDisponibleSeleccionar) {
                    checkedGeneral = true;
                }

                setCheckedGeneral(checkedGeneral);
                setDataGastos(newArr)
            }

        }


        const handleGeneralChange = (e) => {

            let name = e.target.name
            let value = e.target.value
            let checked = e.target.checked

            if (name == "seleccionadoGeneral") {

                let dataGastosClone = [...dataGastos];

                dataGastosClone.map(dda => {
                    if (dda.id !== "") {
                        dda.seleccionado = checked;
                    }
                })

                setCheckedGeneral(checked);
                setDataGastos(dataGastosClone);
            }

        }

        const handleAddDocument = (files, _key) => {

            let newArr = dataGastos.map(item => {
                if (item.key == _key) {
                    return {
                        ...item,
                        l_data: true
                    }
                }
                return item
            })

            setDataGastos(newArr)
            try {
                let file = files[0]
                let fileType = file.type
                let fileName = file.name
                let validExtensions = ["image/jpeg", "image/jpg", "image/png"];

                //if (validExtensions.includes(fileType)) {
                if (file) {
                    var formData = new FormData();
                    formData.append("archivo", file);
                    formData.append("idPedido", id);

                    AXIOS.post(smart.urlContext + smart.urlSaveArchivoGastos, formData)
                        .then(({ data }) => {
                            if (data.apiEstado === 'ok') {


                                let newArr = dataGastos.map(item => {
                                    if (item.key == _key) {
                                        return {
                                            ...item,
                                            esExistente: true,
                                            esSubido: true,
                                            nombre: data.codigo,
                                            nombreOriginal: fileName,
                                            idArchivo: data.id,
                                            l_data: false
                                        }
                                    }
                                    return item
                                })

                                setDataGastos(newArr)

                            } else {
                                swal({
                                    title: data.apiMensaje,
                                    // text: data.apiMensaje,
                                    icon: "error",
                                })

                                let newArr = dataGastos.map(item => {
                                    if (item.key == _key) {
                                        return {
                                            ...item,
                                            l_data: true
                                        }
                                    }
                                    return item
                                })

                                setDataGastos(newArr)
                            }

                        })
                        .catch((error) => {
                            handleError(error);

                            let newArr = dataGastos.map(item => {
                                if (item.key == _key) {
                                    return {
                                        ...item,
                                        l_data: true
                                    }
                                }
                                return item
                            })

                            setDataGastos(newArr)
                        })
                }
                /*}
                else {
                    swal({ title: "Error", text: "El archivo ingresado no es correcto", icon: "error" });
                }*/
            }
            catch (error) {
                //console.log(error)
            }
        }

        const handleAddArchivo = (e) => {

            e.preventDefault()

            let objTipoProducto = {
                seleccionado: false,
                esExistente: false,
                esSubido: false,
                fechaCreacion: "",
                id: "",
                idArchivo: "",
                idTipo: 0,
                nombre: "",
                nombreOriginal: "",
                monto: "",
                tipo: "",
                l_data: false,
                key: generateId()
            }

            let clone = [...dataGastos]
            clone.push(objTipoProducto)
            setDataGastos(clone)
        }


        const handleDeleteArchivo = (event, _key) => {
            let clone = [...dataGastos]
            let pos = clone.findIndex(item => item.key == _key)
            clone.splice(pos, 1)

            setDataGastos(clone)
        }


        const downloadArchivo = (idArchivo, nombre) => {
            //setL_data(true)
            //setErrorData('')

            let params = {
                idArchivo: idArchivo,
            }

            let filename = nombre;

            AXIOS({
                url: smart.urlContext + smart.UrlDownloadGastoArchivo, // Interface name
                method: 'get',
                responseType: "blob",
                params: params
            })
                .then(function (response) {
                    const blob = new Blob(
                        [response.data], { type: 'application/octet-stream' })
                    const aEle = document.createElement('a');     // Create a label
                    const href = window.URL.createObjectURL(blob);       // Create downloaded link
                    aEle.href = href;
                    aEle.download = filename;  // File name after download
                    document.body.appendChild(aEle);
                    aEle.click();     // Click to download
                    document.body.removeChild(aEle); // Download complete remove element
                    window.URL.revokeObjectURL(href) // Release blob object
                })
                .catch((error) => {
                    handleError(error);
                })

        }

        const downloadArchivoZip = () => {
            setL_download(true)
            //setErrorData('')

            let idArchivos = dataGastos.filter(dda => dda.seleccionado).map(dda => dda.idArchivo).join("|");

            let params = {
                idPedido: id,
                idArchivos: idArchivos
            }

            let date = new Date()

            let filename = registro +
                "_Gastos_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".zip"

            AXIOS({
                url: smart.urlContext + smart.UrlDownloadGastoArchivoZip, // Interface name
                method: 'get',
                responseType: "blob",
                params: params
            })
                .then(function (response) {
                    const blob = new Blob(
                        [response.data], { type: 'application/octet-stream' })
                    const aEle = document.createElement('a');     // Create a label
                    const href = window.URL.createObjectURL(blob);       // Create downloaded link
                    aEle.href = href;
                    aEle.download = filename;  // File name after download
                    document.body.appendChild(aEle);
                    aEle.click();     // Click to download
                    document.body.removeChild(aEle); // Download complete remove element
                    window.URL.revokeObjectURL(href) // Release blob object
                    setL_download(false)
                })
                .catch((error) => {
                    handleError(error);
                    setL_download(false)
                })

        }


        const handleSave = (data) => {

            setL_save(true)

            const archivosPush = dataGastos.map(item => {
                return {
                    id: item.id,
                    idTipo: item.idTipo,
                    idArchivo: item.idArchivo,
                    monto: item.monto ? item.monto : 0,
                    esFacturable: item.esFacturable
                }
            })

            let oData = {
                id: id,
                idContenedor: 4,
                archivos: archivosPush,
            }



            AXIOS.post(smart.urlContext + smart.urlSaveSeccionGastos, oData)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        })

                        setL_save(false)
                        getSingle();
                        // let params = {
                        //     id: id,
                        //     tipo: 4
                        // }

                        // AXIOS.get(`${smart.urlContext}${smart.urlGetSingle}`, { params })
                        //     .then(({ data }) => {

                        //         let dataSingle = data.data.archivos

                        //         setDataDocumentosAdjuntos(dataSingle)
                        //     })
                        //     .catch(() => {
                        //         console.log('error')
                        //     })

                    } else {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "error",
                        })

                        setL_save(false)

                    }
                })
                .catch(error => {
                    handleError(error);
                    setL_save(false)
                })

        }

        return (
            <form onSubmit={handleSubmit(handleSave)}>
                <>
                    <Row className="mb-2">
                        <div className="mt-2 flex gap-2 justify-flex-end w-100">
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton
                                    disabled={allDisabled}
                                    type="button" onClick={(e) => handleAddArchivo(e)}>
                                    <Icon children="add_circle" h="24" className="material-icons-outlined mr-2" />
                                    Agregar
                                </CButton>}
                        </div>
                    </Row>
                    <Row>
                        <div className="c-table__container mt-0 mb-5">
                            <table className="c-table c-table__container--content mb-2">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <div className="flex justify-content-md-end justify-content-md-start">
                                                <label className="c-checkbox mt-2">
                                                    <input
                                                        name={`seleccionadoGeneral`}
                                                        className=" c-checkbox__input"
                                                        onChange={(e) => handleGeneralChange(e)}
                                                        checked={checkGeneral}
                                                        type="checkbox"
                                                    />
                                                    <span className="c-checkbox__icon mr-3"></span>
                                                    <span className="c-input__label u-text--gray-90"></span>
                                                </label>
                                            </div>
                                        </th>
                                        <th scope="col">
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                N°
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Concepto
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Nombre
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Monto
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Facturable
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Fecha de Creación
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataGastos.map((item, index) => {
                                            return (<tr key={item.key}>
                                                <td className="text-center">
                                                    <div className="flex justify-content-md-end justify-content-md-start">
                                                        {(!appContext.permisos.esUsuarioSoloConsultar &&
                                                            item.esExistente) &&
                                                            <label className="c-checkbox mt-2">                                                                    <input
                                                                name={`seleccionado${item.key}`}
                                                                className=" c-checkbox__input"
                                                                disabled={item.id === "" ? true : false}
                                                                onChange={(e) => handleChange(e, item.key)}
                                                                type="checkbox"
                                                                checked={item.seleccionado}
                                                            />
                                                                <span className="c-checkbox__icon mr-3"></span>
                                                                <span className="c-input__label u-text--gray-90"></span>
                                                            </label>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                                                        {!appContext.permisos.esUsuarioSoloConsultar && <button
                                                            disabled={allDisabled}
                                                            type="button" className="c-button--minimal u-text--red" onClick={(ev) => handleDeleteArchivo(ev, item.key)}>
                                                            <Icon h="20">delete_outline</Icon>
                                                        </button>}

                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                                                        {Number(index) + 1}
                                                    </div>
                                                </td>
                                                <td className="text-left" style={{ width: '250px' }}>
                                                    {appContext.permisos.esUsuarioSoloConsultar ? (<CInput
                                                        name={`tipo${item.key}`}
                                                        disabled={allDisabled}
                                                        {...register(`tipo${item.key}`, { required: false })}
                                                    />) : (<CSelect
                                                        disabled={item.l_data ? true : allDisabled}
                                                        name={`idTipo${item.key}`}
                                                        options={[{ id: '', text: 'Seleccione' }, ...conceptoGasto.map(el => ({ id: el.id, text: el.nombre }))]}
                                                        {...register(`idTipo${item.key}`, {
                                                            required: {
                                                                value: true,
                                                                message: 'El campo es requerido'
                                                            }
                                                        })}
                                                        error={errors[`idTipo${item.key}`]?.message}
                                                        onChange={(e) => handleChange(e, item.key)}
                                                        placeholder="data"
                                                    />)}

                                                </td>
                                                <td className="text-left">
                                                    {
                                                        item.esExistente ?

                                                            appContext.permisos.esUsuarioSoloConsultar ? (<CInput
                                                                disabled={allDisabled}
                                                                value={item.nombreOriginal}
                                                            />) :
                                                                (<div className="c-inputfile" style={{ justifyContent: 'center' }}>
                                                                    <a className="c-inputfile__button justify-content-center" style={{ width: '150px' }} onClick={(e) => downloadArchivo(item.idArchivo, item.nombre)}>
                                                                        <div className="c-inputfile__button_text">{item.nombreOriginal}</div>
                                                                        <Icon className="c-inputfile__icon u-text--blue" h="24" children="archive" />
                                                                    </a>
                                                                </div>)
                                                            :
                                                            <CInputFile
                                                                disabled={allDisabled}
                                                                styleInputFile={{ justifyContent: 'center' }}
                                                                type="file"
                                                                name={`file_${item.key}`}
                                                                onChange={files => handleAddDocument(files, item.key)}
                                                                isLoading={item.l_data}
                                                                // onClick={item.esExistente ? e => handleClickLink(e, item.key) : e => handleClick(e)}
                                                                children={item.esExistente ? item.nombreOriginal : item.esSubido ? item.nombreOriginal : 'Subir Archivo'}
                                                                icon="unarchive"
                                                                styleInput={{ width: '150px', justifyContent: 'center' }}
                                                            />
                                                    }
                                                </td>
                                                <td className="text-left" style={{ display: 'flex' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                                                        <span className="mr-3">S/</span>
                                                    </div>
                                                    <div className="w-100">
                                                        <CInput
                                                            disabled={allDisabled}
                                                            modInput="u-text--right"
                                                            name={`monto${item.key}`}
                                                            {...register(`monto${item.key}`, {
                                                                required: {
                                                                    value: true,
                                                                    message: 'El campo es requerido'
                                                                }
                                                            })}
                                                            error={errors[`monto${item.key}`]?.message}
                                                            onChange={(e) => handleChange(e, item.key)}
                                                            cRegex="integer"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                                                        <CSwitch
                                                            disabled={allDisabled}
                                                            name={`esFacturable${item.key}`}
                                                            onChange={(e) => handleChange(e, item.key)}
                                                            className=" c-checkbox__input"
                                                            defaultChecked={item.esFacturable}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                                                        {item.fechaCreacion}
                                                    </div>
                                                </td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <Row className="mb-2">
                            <div className="mt-2 flex justify-flex-end gap-2">
                                {!appContext.permisos.esUsuarioSoloConsultar && <CButton className="c-button--red" onClick={(e) => downloadArchivoZip()}
                                    isLoading={l_download}
                                >
                                    <Icon children="download" h="24" className="mr-2" />
                                    Descargar Archivos
                                </CButton>
                                }
                                {!appContext.permisos.esUsuarioSoloConsultar && <CButton type="submit" isLoading={l_save} children="Guardar" className="c-button--blue">
                                    <Icon children="save" h="24" className="mr-2" />
                                    Guardar
                                </CButton>
                                }
                            </div>
                        </Row>
                    </Row>
                </>
            </form>
        )

    })

    // colocar como global
    window.Gastos = {
        CGastos
    }
})()
