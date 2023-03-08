(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, AppContext, localSt, generateId } = Global
    const { useForm, Controller } = ReactHookForm;

    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        //creación de manejadores
        const [dataEstado, setDataEstado] = useState([])
        const [dataPermisoBanco, setDataPermisoBanco] = useState([])
        const [dataFormaPago, setFormaPago] = useState([])

        const [l_dataTipoProducto, setL_DataTipoProducto] = useState(false)
        const [dataTipoProducto, setDataTipoProducto] = useState([])

        //registro de formulario
        const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm();

        useEffect(() => {

            setDataEstado([
                { id: 1, nombre: 'Activo' },
                { id: 2, nombre: 'Inactivo' }
            ])

            setDataPermisoBanco([
                { id: 1, nombre: 'Comercial' },
                { id: 2, nombre: 'Hipotecario' },
                { id: 3, nombre: 'Activos' },
                { id: 4, nombre: 'Judicial' }
            ])

            setFormaPago([
                { id: 1, nombre: 'Cotizado' },
                { id: 2, nombre: 'Facturado' }
            ])

            appContext.handleBreadcumb(true, [
                { url: '', name: "Administración" },
                { url: '/administracion/catalogo/', name: "Catálogo" },
                { url: '', name: "Crear" },
            ]);

        }, [])


        const handleSave = (data) => {
            console.log("click");
        }

        /* Métodos Sección Tipos de Producto */

        const handleAddTipoProducto = (e) => {

            console.log("agregar fila");

            e.preventDefault()

            let objTipoProducto = {
                id: "",
                key: generateId(),
                idTipoPermiso: 0,
                idFormaPago: 0
            }

            let clone = [...dataTipoProducto]
            clone.push(objTipoProducto)
            setDataTipoProducto(clone)
        }

        const handleChangeTipoProducto = (e, _key) => {
            e.preventDefault()
            let name = e.target.name;
            let value = e.target.value;

            let newArrayTipoProducto = [...dataTipoProducto]

            let pos = newArrayTipoProducto.findIndex((item) => item.key === _key);

            if (name == `tipoProductoSelected${_key}`) {
                newArrayTipoProducto[pos].idTipoPermiso = Number(value);
            }
            else if(name == `formaPagoSelected${_key}`) {
                newArrayTipoProducto[pos].idFormaPago = Number(value);
            }

            setDataTipoProducto(newArrayTipoProducto)

            console.log(dataTipoProducto);

        }

        const handleDeleteTipoProducto = (event, _key) => {
            let clone = [...dataTipoProducto]
            let pos = clone.findIndex(item => item.key == _key)
            clone.splice(pos, 1)

            setDataTipoProducto(clone)
        }

        /*Fin Métodos Sección Tipos de Producto */

        return (
            <div className="o-container c-header__wrapper flex flex-column mt-3">
                <form className="w-100" onSubmit={handleSubmit(handleSave)}>
                    <Row>
                        <Col md="6" className="mt-2">
                            <CInput
                                name="codigo"
                                {...register("codigo", { required: true })}
                                label="Código"
                                requerido="1"
                                error={errors.codigo?.type === 'required' && "El campo código es requerido"}
                            />
                        </Col>
                        <Col md="6" className="mt-2">
                            <CInput
                                name="nombre"
                                {...register("nombre", { required: true })}
                                label="Nombre"
                                requerido="1"
                                error={errors.codigo?.type === 'required' && "El campo nombre es requerido"}
                            />
                        </Col>
                    </Row>
                    <hr className="u-text--gray-60 mb-5"/>
                    <Row className="mb-3">
                        <Col className="flex justify-flex-end">
                            <CButton type="button" onClick={(e) => handleAddTipoProducto(e)}>
                                <Icon children="add_circle" h="24" className="material-icons-outlined mr-2" />
                                Agregar
                            </CButton>
                        </Col>
                    </Row>
                    <div className="c-table__container mt-0 mb-5">
                        <table className="c-table c-table__container--content mb-2">
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
                                        <div className="flex justify-center">
                                            Nombre
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Cantidad
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Tipo
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Valor
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Estado
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    l_dataTipoProducto ?
                                        <tr>
                                            <td colSpan="6">Cargando...</td>
                                        </tr> :
                                        dataTipoProducto.map((item, index) => {
                                            return (<tr key={item.key}>
                                                <td className="text-center">
                                                    <button type="button" className="c-button--minimal u-text--red" onClick={(ev) => handleDeleteTipoProducto(ev, item.key)}>
                                                        <Icon h="20">delete_outline</Icon>
                                                    </button>
                                                </td>
                                                <td className="text-center">{Number(index) + 1}</td>
                                                <td className="text-left">
                                                    <CInput
                                                        name="nombre"
                                                    />
                                                </td>
                                                <td className="text-left">
                                                    <CInput
                                                        name="Cantidad"
                                                    />
                                                </td>
                                                <td className="text-left">
                                                    <CSelect
                                                        name={`tipoSelected${item.key}`}
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataPermisoBanco.map(el => ({ id: el.id, text: el.nombre }))]}
                                                        {...register(`tipoProductoSelected${item.key}`, { required: true })}
                                                        error={errors[`tipoProductoSelected${item.key}`]?.type === 'required' && "El campo es requerido"}
                                                        onChange={(e) => handleChangeTipoProducto(e, item.key)}
                                                        placeholder="data"
                                                    />
                                                </td>
                                                <td className="text-left">
                                                    <CInput
                                                        name="Valor"
                                                    />
                                                </td>
                                                <td className="text-left">
                                                    <CSelect
                                                        name={`estadoSelected${item.key}`}
                                                        options={[{ id: '', text: 'Seleccione' }, ...dataFormaPago.map(el => ({ id: el.id, text: el.nombre }))]}
                                                        {...register(`formaPagoSelected${item.key}`, { required: true })}
                                                        error={errors[`formaPagoSelected${item.key}`]?.type === 'required' && "El campo es requerido"}
                                                        onChange={(e) => handleChangeTipoProducto(e, item.key)}
                                                        placeholder="data"
                                                    />
                                                </td>
                                            </tr>)
                                        })
                                }
                            </tbody>
                        </table>

                    </div>
                    <Row className="mb-2">
                        <div className="mt-2 flex justify-space-between">
                            <a className="c-link" href="/administracion/catalogo/">
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
