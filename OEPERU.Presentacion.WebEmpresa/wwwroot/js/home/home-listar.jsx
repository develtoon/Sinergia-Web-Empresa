(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Alert, Button, Form, Col, Row } = ReactBootstrap;
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CPagination, AppContext } = Global;


    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        useEffect(() => {
            appContext.handleBreadcumb(true, [
                { ulr: '', name: "Bienvenido al Sistema Empresa" }
                //,{ ulr: '', name: "Rol" },
                //{ ulr: '', name: "Listar" }
            ]);

        }, [])

        return (

            <div className="o-container o-container--1110 o-container--main s-field--home">
               
            </div>
        )
    }

    // guardar la vista entre los componentes globales
    Global.ViewLang = 'home';
    Global.View = ViewIntl
})()

