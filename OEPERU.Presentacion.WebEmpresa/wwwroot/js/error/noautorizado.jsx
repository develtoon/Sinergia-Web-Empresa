(function () {
    const { useState, useEffect, Fragment, useContext } = React;
    const { Alert, Button, Form, Col, Row } = ReactBootstrap;
    const { CInput, CSelect, CBreadcrumbs, CButton, Icon, CPagination, AppContext } = Global;


    const ViewIntl = ({ intl }) => {

        const appContext = useContext(AppContext);

        return (

            <div className="o-container o-container--1110 o-container--main s-field--noautorizado">

            </div>
        )
    }

    Global.ViewLang = 'no autorizado';
    Global.View = ViewIntl
})()
