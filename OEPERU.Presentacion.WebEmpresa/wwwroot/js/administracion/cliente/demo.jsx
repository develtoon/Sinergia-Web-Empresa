(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Col, Row, Spinner } = ReactBootstrap
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CFlags, CPagination, AppContext, localSt, generateId } = Global
    const { useForm, Controller} = ReactHookForm;

    const dataDefault = [
        { id: 0, numero: '0001', permiso: 'Christian Aarón Palacios Velazco', forma: 'Activo'},
        { id: 1, numero: '0002', permiso: 'Leonel Enrique Palacios Jiménez', forma: 'Activo'},
    ]


    const ViewIntl = ({ intl }) => {
    
        const [rendered, setRendered] = useState(false)
        const [data, setData] = useState([])
        const [l_data, setL_data] = useState(false)

        const handleAdd = () => {

            let cont = 0

            let clone = {
                id: setData.lastIndexOf() + 1,
                numero:"<CInput/>",
                permiso:"adad ",
                forma:"asdasd",
            }
            
            data.push(clone)
            console.log(data)
        }

        const handleDelete = (_id) => {
            let clone = [...data]
            let pos = clone.findIndex( item => item.id == _id)
            clone.splice(pos, 1)

            setData(clone)
        }

        useEffect(() => {
            setData(dataDefault)

            setRendered(true)

        }, [])

        
        
        
        return (
            <div className="o-container c-header__wrapper mt-3 flex-column">
                <div className="mt-2 mb-4 flex gap-2 justify-flex-end w-100">
                    <CButton onClick={handleAdd}>
                        <Icon children="add_circle" h="24" className="material-icons-outlined mr-2" />
                        Agregar
                    </CButton>
                    <CButton children="Guardar" className="c-button--blue">
                        <Icon children="save" h="24" className="mr-2"/>
                        Guardar
                    </CButton>
                </div>
                <div className="c-table__container mt-0 w-100">
                    
                        <table className="c-table ">
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
                                            
                                            Permiso por Banco
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className="flex justify-center">
                                            Forma de Pago
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item)=>{
                                    return(                                        
                                        <tr key={item.numero}>
                                            <td className="text-center">
                                                <button className="c-button--minimal u-text--red" onClick={() => handleDelete(item.id)}><Icon h="20">delete_outline</Icon></button>
                                            </td>
                                            <td className="text-center"><CInput placeholder={item.numero}/></td>
                                            <td className="text-center"><CInput placeholder={item.permiso}/></td>
                                            <td className="text-center"><CInput placeholder={item.forma}/></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table> 
                    
                </div>
                
            </div>
        )
    }

    Global.ViewLang = 'security/rol-listar';
    Global.View = ViewIntl;
})()
