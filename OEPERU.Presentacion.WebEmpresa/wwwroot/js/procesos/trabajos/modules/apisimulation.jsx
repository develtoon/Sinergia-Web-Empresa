(function () {
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CTextArea, CFlags, CPagination, CCheckBox, AppContext, localSt, generateId } = Global
    const { useState, useEffect, useContext } = React
    const { Dropdown, Offcanvas } = ReactBootstrap;

    const flujoTrabajoAPI = {
        apiEstado: 'ok',
        total: 89,
        data: [
            {id: 1, nombre: 'Tipo Bien', fechacreacion:'10/05/2000', usuariocreacion:'ADMIN', idestado:'1', estado:'Activo'},
            {id: 2, nombre: 'Tipo Bien', fechacreacion:'10/05/2000', usuariocreacion:'ADMIN', idestado:'1', estado:'Activo'},
            {id: 3, nombre: 'Tipo Bien', fechacreacion:'10/05/2000', usuariocreacion:'ADMIN', idestado:'1', estado:'Activo'},
            {id: 4, nombre: 'Tipo Bien', fechacreacion:'10/05/2000', usuariocreacion:'ADMIN', idestado:'1', estado:'Activo'},
        ],

    }

    const principalAPI = {
        apiEstado: 'ok',
        numeroTrabajo:'',
        data: {
            datosUbicacion:{
                departamento:'',
            }
        },
    }

    const documentosAdjuntosAPI = {}

    const gastosAPI = {}

    const bitacoraAPI = {}

    const inspeccionAPI = {}

    const controlCalidadAPI = {}

    const datosInformeAPI = {}




    // colocar como global
    window.APIsimulator = {
        flujoTrabajoAPI,
        principalAPI,
        documentosAdjuntosAPI,
        gastosAPI,
        bitacoraAPI,
        inspeccionAPI,
        controlCalidadAPI,
        datosInformeAPI
    }
})()
