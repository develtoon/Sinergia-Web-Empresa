(function () {
    // NOTE: instanciar componentes y hooks de React
    const { useState, useEffect, Fragment, useContext } = React;

    // NOTE: Instanciar componentes de ReactBootstrap
    const { Alert, Button, Form, Col, Row } = ReactBootstrap

    // NOTE: Instanciar componentes de React Intl
    const { CInput, CButton, Parrafo, CLogo } = Global

    

    const FormErrors = ({ formErrors }) => {
        return (
            <div className='formErrors'>
                {Object.keys(formErrors).map((fieldName, i) => {
                    if (formErrors[fieldName].length > 0) {
                        return (
                            <p key={i}>{fieldName} {formErrors[fieldName]}</p>
                        )
                    } else {
                        return '';
                    }
                })}
            </div>
        )
    }


    class View extends React.Component {
        // constructor (props) {
        //     super(props)
        //     this.state = {}
        // }

        smart = {
            urlContext: '/recuperarcontrasenia',
            urlGetList: '/Save',
        }

        state = {
            email: 'admin@oeperu.com',
            l_login: false,
            show: true,

            formErrors: {
                email: '',
                password: ''
            },
            emailValid: false,
            formValid: false
        }

        validateField(fieldName, value) {
            let fieldValidationErrors = this.state.formErrors;
            let emailValid = this.state.emailValid;
            switch (fieldName) {
                case 'email':
                    emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                    fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                    break;
            }
            this.setState({
                formErrors: fieldValidationErrors,
                emailValid: emailValid,
            }, this.validateForm);
        }

        validateForm() {
            this.setState({ formValid: this.state.emailValid});
        }

        handleOnChange = (event) => {
            const name = event.target.name;
            const value = event.target.value;
            console.log(value)
            this.setState({ [name]: value }, () => { this.validateField(name, value) });
        }

        submit = (event) => {
            event.preventDefault()

            // window.location.href = "/recuperarcontrasenia";

            if (this.state.l_login) return
            this.setState({ l_login: true })

            
            axios.post('/recuperarcontrasenia/save', {
                usuario: this.state.email,
            })
                .then(({ data }) => {
                    if (data.apiEstado == 'ok') {
                        window.location = '/'
                        // this.setState({ l_login: false })
                    }
                })
                .catch(({ response }) => {
                    this.setState({ l_login: false })
                    if (response?.data?.apiMensaje) {
                        swal({
                            title: "Error al iniciar sesión",
                            text: response?.data?.apiMensaje,
                            icon: "error"
                        });
                    }
                })
                
        }

        handleChangeDiv(event) {
            console.log('sda', event.nativeEvent);
        }

        errorClass(error) {
            return (error.length === 0 ? '' : 'is-invalid');
        }

        render() {
            //const loadingClass = this.state.l_login ? 'is-loading' : ''
            return (
                <>
                    <Global.Header alter onBack="home" />
                    <div className="o-container s-field--login s-login-wrapper align-items-center justify-content-center">
                        <div className="box grow s-login-form">
                            <div style={{ width: '200px' }} className="m-auto">
                                <a href="#">
                                    <img src="/images/logo.svg" loading="lazy" />
                                </a>
                            </div>
                            <form style={{ height: '408.4px'}} className="s-login-form-form s-field--login__form u-shadow--1 mt-3 flex flex-column justify-space-between">
                                <div className="text-center">
                                    <p className="paragraph paragraph--28 u-text--primary-blue mb-2">
                                        Sistema de Tasaciones
                                    </p>
                                    <p className="paragraph paragraph--24 u-text--primary-sky-blue mb-2">
                                        Recuperar Contraseña
                                    </p>
                                </div>
                                <div className="text-center flex flex-column align-center">
                                    <Global.Icon children="task_alt" className="u-text--green" h="80"/>
                                    <p className="paragraph--24 u-text--primary-blue">Se envió satisfactoriamente el correo</p>
                                </div>

                                <div>
                                    
                                    <p className="flex align-items-center paragraph-14 u-text--primary-blue gap-2 paragraph--14">
                                        <Global.Icon children="arrow_back" h="24"/>
                                        <a href="/login" className="c-link">
                                            Volver
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                        {/*<div style={{ width:'300px' }}>
                            <p className="paragraph paragraph--40 u-text--white mb-2 u-text--italic">
                                Gestion tu tiempo y obtén grandes resultados
                            </p>
                        </div>*/}
                    </div>
                    {/*<Global.Footer />*/}
                </>
            );
        }
    }

    ReactDOM.render(
        <Global.AppProvider view="recuperarcontrasenia">
            <View />
        </Global.AppProvider>,
        document.getElementById('view')
    );
})()
