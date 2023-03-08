(function () {
    const { CInput, CSelect, CInputFile, CBreadcrumbs, CButton, Icon, handleError, CTextArea, CFlags, CPagination, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext, forwardRef, useImperativeHandle } = React
    const { Dropdown, Offcanvas, Row, Col } = ReactBootstrap;
    const { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = CChart;
    const { useForm, Controller } = ReactHookForm;

    let smart = {
        urlContext: '/Proceso/Trabajo',
        urlGetSingle: '/GetPrincipalSingle',
        urlGetDataList: '/GetDataList',
        urlGetRolesNegocioDocumentoList: '/GetRolesNegocioDocumentoList',
        urlSaveDocumentosAdjuntos: '/SaveDocumentosAdjuntos',
        UrlDownloadDocumentoArchivo: '/DownloadDocumentoArchivo',
        UrlDownloadDocumentoArchivoZip: '/DownloadDocumentoArchivoZip',
        urlSave: '/Save',
        urlSaveArchivoDocumento: '/SaveArchivoDocumento',
    }

    const CAdjuntos = forwardRef(({ id }, ref) => {

        const appContext = useContext(AppContext)

        const [allDisabled, setAllDisabled] = useState(false)

        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();
        const [dataDocumentosAdjuntos, setDataDocumentosAdjuntos] = useState([])
        const [tipoDocumento, setTipoDocumento] = useState([])
        const [registro, setRegistro] = useState("")

        const [idEstado, setIdEstado] = useState(0)
        const [checkGeneral, setCheckedGeneral] = useState(false)

        const [esDocumentoPendiente, setEsDocumentoPendiente] = useState(false)
        const [l_save, setL_save] = useState(false)
        const [l_download, setL_download] = useState(false)

        const [rendered, setRendered] = useState(false)
        const [renderPermiso, setRenderPermiso] = useState(false)
        const [renderDataDocumentos, setRenderDataDocumentos] = useState(false)

        //let ID = document.querySelector('#id').value;

        useImperativeHandle(ref, () => ({
            init() {

                setRenderPermiso(false);
                setAllDisabled(false);
                setRendered(false);
                setRenderDataDocumentos(false);

                if (rendered) {
                    setRendered(false)
                } else {
                    setRendered(true);
                    let menuPermiso = appContext.menuPermiso("proceso/trabajo")

                    axios.all([
                        menuPermiso
                    ]).then(response => {
                        axios.all([listarPorCodigo()])
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
                getSingle(true);
            }
        }, [renderPermiso])

        useEffect(() => {
            if (renderDataDocumentos) {
                dataDocumentosAdjuntos.forEach(item => {

                    setValue(`idTipo${item.key}`, item.idTipo)
                    setValue(`tipo${item.key}`, item.tipo)
                    setValue(`referencia${item.key}`, item.referencia)
                })

                setRenderDataDocumentos(false);
            }
        }, [renderDataDocumentos])


        const getSingle = (verificar) => {

            let params = {
                id: id,
                tipo: 3
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

                        setRegistro(data.data.registro)
                        setEsDocumentoPendiente(data.data.esDocumentoPendiente)
                        setIdEstado(data.data.idEstado)

                        let dataSingle = data.data.archivos
                        const archivos = dataSingle.map(item => {
                            return {
                                ...item,
                                seleccionado: false,
                                key: generateId(),
                                esExistente: true,
                                esSubido: false,
                                l_document: false,
                            }
                        })
                        setDataDocumentosAdjuntos(archivos)
                        setRenderDataDocumentos(true)
                    }
                    else {
                        setAllDisabled(true);
                    }
                })
                .catch((error) => {
                    setAllDisabled(true);
                    if (verificar) {
                        handleError(error);
                    }
                })

        }

        const listarPorCodigo = () => {

            let listarPorCodigo =
                AXIOS.get(`${smart.urlContext}${smart.urlGetRolesNegocioDocumentoList}`)
                    .then(({ data }) => {
                        if (data.apiEstado == "ok") {
                            setTipoDocumento(data.data);
                        }
                        else {
                            setTipoDocumento([])
                        }
                    })
                    .catch(() => {
                        setTipoDocumento([])
                    });

            return listarPorCodigo;

        }



        const handleChange = (e, _key) => {

            let name = e.target.name
            let value = e.target.value
            let checked = e.target.checked

            if (name == `idTipo${_key}`) {
                let newArr = dataDocumentosAdjuntos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            idTipo: value,
                        }
                    }
                    return item
                })

                setDataDocumentosAdjuntos(newArr)
            } else if (name == `referencia${_key}`) {
                let newArr = dataDocumentosAdjuntos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            referencia: value,
                        }
                    }
                    return item
                })
                setDataDocumentosAdjuntos(newArr)
            }
            else if (name == `seleccionado${_key}`) {

                let checkedGeneral = false;

                let cantidadSeleccionado = 0;
                let cantidadDisponibleSeleccionar = dataDocumentosAdjuntos.filter(dda => dda.id !== "").length;

                let newArr = dataDocumentosAdjuntos.map(item => {
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
                setDataDocumentosAdjuntos(newArr);
            }

        }

        const handleGeneralChange = (e) => {

            let name = e.target.name
            let value = e.target.value
            let checked = e.target.checked

            if (name == "seleccionadoGeneral") {

                let dataDocumentosAdjuntosClone = [...dataDocumentosAdjuntos];


                dataDocumentosAdjuntosClone.map(dda => {
                    if (dda.id !== "") {
                        dda.seleccionado = checked;
                    }
                })

                setCheckedGeneral(checked);
                setDataDocumentosAdjuntos(dataDocumentosAdjuntosClone);
            }

        }


        const handleAddDocument = (files, _key) => {

            //console.log(idEstado < 4  && (watch(`idTipo${_key}`) == 2 || watch(`idTipo${_key}`) == 3))

            if (idEstado < 4 && (watch(`idTipo${_key}`) == 2 || watch(`idTipo${_key}`) == 3 || watch(`idTipo${_key}`) == 11 || watch(`idTipo${_key}`) == 12)) {

                swal({
                    title: "El estado del trabajo no es válido para registrar el informe",
                    // text: data.apiMensaje,
                    icon: "warning",
                })
            } else {

                let newArr = dataDocumentosAdjuntos.map(item => {
                    if (item.key == _key) {
                        return {
                            ...item,
                            l_data: true
                        }
                    }
                    return item
                })
                setDataDocumentosAdjuntos(newArr)

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

                        AXIOS.post(smart.urlContext + smart.urlSaveArchivoDocumento, formData)
                            .then(({ data }) => {
                                if (data.apiEstado === 'ok') {

                                    let newArr = dataDocumentosAdjuntos.map(item => {
                                        if (item.key == _key) {
                                            return {
                                                ...item,
                                                seleccionado: false,
                                                esExistente: true,
                                                esSubido: true,
                                                nombreOriginal: fileName,
                                                nombre: data.codigo,
                                                idArchivo: data.id,
                                                l_data: false
                                            }
                                        }
                                        return item
                                    })

                                    setDataDocumentosAdjuntos(newArr)

                                } else {
                                    swal({
                                        title: data.apiMensaje,
                                        // text: data.apiMensaje,
                                        icon: "error",
                                    })

                                    let newArr = dataDocumentosAdjuntos.map(item => {
                                        if (item.key == _key) {
                                            return {
                                                ...item,
                                                l_data: false
                                            }
                                        }
                                        return item
                                    })
                                    setDataDocumentosAdjuntos(newArr)
                                }

                            })
                            .catch((error) => {
                                handleError(error);
                                let newArr = dataDocumentosAdjuntos.map(item => {
                                    if (item.key == _key) {
                                        return {
                                            ...item,
                                            l_data: false
                                        }
                                    }
                                    return item
                                })
                                setDataDocumentosAdjuntos(newArr)
                            })
                    }
                    //}
                    //else {
                    //    swal({ title: "Error", text: "El archivo ingresado no es correcto", icon: "error" });
                    //}
                }
                catch (error) {
                    //console.log(error)
                }

            }



        }

        const handleAddArchivo = (e) => {

            e.preventDefault()

            let objArchivo = {
                seleccionado: false,
                esSubido: false,
                esExistente: false,
                fechaCreacion: "",
                id: "",
                idArchivo: "",
                idTipo: 0,
                nombre: "",
                nombreOriginal: "",
                referencia: "",
                tipo: "",
                l_data: false,
                key: generateId()
            }

            let clone = [...dataDocumentosAdjuntos]
            clone.push(objArchivo)
            setDataDocumentosAdjuntos(clone)
        }

        const downloadArchivo = (_key, idArchivo, nombre) => {
            //setL_data(true)
            //setErrorData('')

            let filename = nombre;

            const aEle = document.createElement('a');     // Create a label
            const href = `${smart.urlContext}${smart.UrlDownloadDocumentoArchivo}?idArchivo=${idArchivo}`       // Create downloaded link
            aEle.href = href;
            aEle.target = "_blank";
            //aEle.download = filename;  // File name after download
            document.body.appendChild(aEle);
            aEle.click();     // Click to download
            document.body.removeChild(aEle); // Download complete remove element
            window.URL.revokeObjectURL(href) // Release blob object

            /*
            let params = {
                idArchivo: idArchivo,
            }

            let filename = nombre;

            AXIOS({
                url: smart.urlContext + smart.UrlDownloadDocumentoArchivo, // Interface name
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
                    aEle.target = "_blank";
                    aEle.download = filename;  // File name after download
                    document.body.appendChild(aEle);
                    aEle.click();     // Click to download
                    document.body.removeChild(aEle); // Download complete remove element
                    window.URL.revokeObjectURL(href) // Release blob object

                })
                .catch((error) => {
                    handleError(error);
                })
             */

        }

        const downloadArchivoZip = () => {
            //setL_download(true)
            //setErrorData('')

            let idArchivos = dataDocumentosAdjuntos.filter(dda => dda.seleccionado).map(dda => dda.idArchivo).join("|");

            let date = new Date()

            let filename = registro +
                "_Documentos_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".zip"

            const aEle = document.createElement('a');     // Create a label
            const href = `${smart.urlContext}${smart.UrlDownloadDocumentoArchivoZip}?idPedido=${id}&idArchivos=${idArchivos}`       // Create downloaded link
            aEle.href = href;
            aEle.target = "_blank";
            //aEle.download = filename;  // File name after download
            document.body.appendChild(aEle);
            aEle.click();     // Click to download
            document.body.removeChild(aEle); // Download complete remove element
            //window.URL.revokeObjectURL(href) // Release blob object

            /*
            let params = {
                idPedido: id,
                idArchivos: idArchivos
            }

            let date = new Date()

            let filename = registro +
                "_Documentos_" +
                date.getFullYear() +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                ("0" + date.getDate()).slice(-2) +
                ("0" + date.getHours() + 1).slice(-2) +
                ("0" + date.getMinutes()).slice(-2) +
                ("0" + date.getSeconds()).slice(-2) +
                ".zip"

            AXIOS({
                url: smart.urlContext + smart.UrlDownloadDocumentoArchivoZip, // Interface name
                method: 'get',
                responseType: "blob",
                params: params
            })
                .then(function (response) {

                    console.log("response", response);

                    const blob = new Blob(
                        [response.data], { type: 'application/octet-stream' })
                    const aEle = document.createElement('a');     // Create a label
                    const href = window.URL.createObjectURL(blob);       // Create downloaded link
                    aEle.href = href;
                    aEle.target = "_blank";
                    aEle.download = filename;  // File name after download
                    document.body.appendChild(aEle);
                    aEle.click();     // Click to download
                    document.body.removeChild(aEle); // Download complete remove element
                    window.URL.revokeObjectURL(href) // Release blob object
                    setL_download(false)
                })
                .catch((error) => {


                    console.log("error", error);

                    handleError(error);
                    setL_download(false)
                })
                */
        }

        const handleDeleteArchivo = (event, _key) => {
            let clone = [...dataDocumentosAdjuntos]
            let pos = clone.findIndex(item => item.key == _key)
            clone.splice(pos, 1)

            setDataDocumentosAdjuntos(clone)
        }

        const handleSave = (data) => {

            setL_save(true)

            const archivosPush = dataDocumentosAdjuntos.map(item => {
                return {
                    id: item.id,
                    idTipo: item.idTipo,
                    idArchivo: item.idArchivo,
                    referencia: item.referencia
                }
            })

            let oData = {
                id: id,
                idContenedor: 3,
                archivos: archivosPush,
            }


            AXIOS.post(smart.urlContext + smart.urlSaveDocumentosAdjuntos, oData)
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {
                        swal({
                            title: data.apiMensaje,
                            // text: data.apiMensaje,
                            icon: "success",
                        });

                        setL_save(false)
                        setCheckedGeneral(false);
                        getSingle(false);

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
                    handleError(error)
                    setL_save(false)
                })

        }

        const handleCompletarDocumentacion = (e) => {

            let oData = {
                id: id,
                atributo: 1
            }

            swal({
                title: "¿Desea completar la Documentación?",
                icon: "info",
                buttons: true,
                dangerMode: true
            }).then((willDelete) => {
                if (willDelete) {
                    AXIOS.post(smart.urlContext + smart.urlSave, oData)
                        .then(({ data }) => {
                            if (data.apiEstado === 'ok') {
                                swal({
                                    title: data.apiMensaje,
                                    // text: data.apiMensaje,
                                    icon: "success",
                                })

                                getSingle(false);
                            } else {
                                swal({
                                    title: data.apiMensaje,
                                    // text: data.apiMensaje,
                                    icon: "error",
                                })
                            }
                        })
                }
            }).catch(error => {
                handleError(error);
            })
        }


        return (

            <form onSubmit={handleSubmit(handleSave)}>
                <>
                    <Row className="mb-2">
                        <div className="mt-2 flex gap-2 justify-flex-end w-100">
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton className={`c-button--green ${esDocumentoPendiente ? '' : 'is-disabled'}`} type="button" onClick={(e) => handleCompletarDocumentacion(e)}>
                                    <Icon children="check" h="24" className="material-icons-outlined mr-2" />
                                    Documentos Completos
                                </CButton>}
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
                                                Tipo de Documento
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Nombre
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <div className="flex justify-center">
                                                Referencia
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
                                        dataDocumentosAdjuntos.map((item, index) =>
                                        (
                                            <tr key={item.key}>
                                                <td className="text-center">
                                                    <div className="flex justify-content-md-end justify-content-md-start">
                                                        {!appContext.permisos.esUsuarioSoloConsultar && <label className="c-checkbox mt-2">
                                                            <input
                                                                disabled={allDisabled}
                                                                name={`seleccionado${item.key}`}
                                                                className=" c-checkbox__input"
                                                                disabled={item.id === "" ? true : false}
                                                                onChange={(e) => handleChange(e, item.key)}
                                                                type="checkbox"
                                                                checked={item.seleccionado}
                                                            />
                                                            <span className="c-checkbox__icon mr-3"></span>
                                                            <span className="c-input__label u-text--gray-90"></span>
                                                        </label>}

                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {!appContext.permisos.esUsuarioSoloConsultar && <button
                                                        disabled={allDisabled}
                                                        type="button" className="c-button--minimal u-text--red" onClick={(ev) => handleDeleteArchivo(ev, item.key)}>
                                                        <Icon h="26">delete_outline</Icon>
                                                    </button>}
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                                                        {Number(index) + 1}
                                                    </div>
                                                </td>
                                                <td className="text-left">
                                                    {appContext.permisos.esUsuarioSoloConsultar ? (<CInput
                                                        name={`tipo${item.key}`}
                                                        disabled={allDisabled}
                                                        {...register(`tipo${item.key}`, { required: false })}
                                                    />) : (<CSelect
                                                        disabled={item.l_data ? true : allDisabled}
                                                        name={`idTipo${item.key}`}
                                                        options={[{ id: '', text: 'Seleccione', eshabilitado: true }, ...tipoDocumento.map(el => ({ id: el.id, text: el.nombre, eshabilitado: el.eshabilitado }))]}
                                                        {...register(`idTipo${item.key}`, {
                                                            required: {
                                                                value: true,
                                                                message: 'El campo es requerido'
                                                            }
                                                        })}
                                                        isOptionDisabled={true}
                                                        error={errors[`idTipo${item.key}`]?.message}
                                                        onChange={(e) => handleChange(e, item.key)}
                                                    />)}
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        item.esExistente ?
                                                            appContext.permisos.esUsuarioSoloConsultar ? (<CInput
                                                                disabled={allDisabled}
                                                                value={item.nombreOriginal}
                                                            />) :
                                                                (<div className="c-inputfile" style={{ justifyContent: 'center' }}>
                                                                    <a className="c-inputfile__button justify-content-center"
                                                                        onClick={(e) => downloadArchivo(item.key, item.idArchivo, item.nombre)}
                                                                    >
                                                                        <div className="c-inputfile__button_text" title={item.nombreOriginal}>{item.nombreOriginal}</div>
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
                                                                icon="archive"
                                                                styleInput={{ width: '150px', justifyContent: 'center' }}
                                                            />
                                                    }

                                                    {/* <CInputFile
                                                type="file"
                                                name={`file_${item.key}`}
                                                onChange={e => handleAddDocument(e, item.key)}
                                                onClick={item.esExistente ? e => handleClickLink(e, item.key) : e => handleClick(e)}
                                                children={item.esExistente ? item.nombreOriginal : item.esSubido ? item.nombreOriginal : 'Subir Archivo'}
                                                icon="archive"
                                                styleInputFile={{
                                                    width:'200px'
                                                }}
                                                styleContInputFile={{
                                                    width:item.esExistente?'100%':'75%'
                                                }}
                                                styleInput={{
                                                    width:'100%',
                                                    display: 'inline-block',
                                                    verticalAlign: 'middle',
                                                    textOverflow: 'ellipsis',
                                                    lineHeight: '20px'
                                                }}
                                            /> */}
                                                </td>
                                                <td className="text-center">
                                                    <CInput
                                                        disabled={allDisabled}
                                                        name={`referencia${item.key}`}
                                                        {...register(`referencia${item.key}`, {
                                                            required: {
                                                                value: false,
                                                                message: 'El campo es requerido'
                                                            }
                                                        })}
                                                        error={errors[`referencia${item.key}`]?.message}
                                                        onChange={(e) => handleChange(e, item.key)}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    {item.fechaCreacion}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                        </div>
                    </Row>
                    <Row className="mb-2">
                        <div className="mt-2 flex justify-flex-end gap-2">
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton
                                    disabled={allDisabled}
                                    className="c-button--red" onClick={(e) => downloadArchivoZip()}
                                    isLoading={l_download}
                                ><Icon children="download" h="24" className="mr-2" />
                                    Descargar Archivos
                                </CButton>}
                            {!appContext.permisos.esUsuarioSoloConsultar &&
                                <CButton
                                    disabled={allDisabled}
                                    isLoading={l_save} type="submit" children="Guardar" className="c-button--blue">
                                    <Icon children="save" h="24" className="mr-2" />
                                    Guardar
                                </CButton>}
                        </div>
                    </Row>
                </>
            </form>
        )

    })

    // colocar como global
    window.DocumentosAdjuntos = {
        CAdjuntos
    }
})()
