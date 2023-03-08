(function () {
    // NOTE: instanciar componentes y hooks de React
    const { useState, useEffect, Fragment, useContext } = React;

    // NOTE: Instanciar componentes de ReactBootstrap
    const { Alert, Button, Form, Col, Row } = ReactBootstrap

    // NOTE: Instanciar componentes de React Intl
    const { CInput, CButton, Parrafo, CLogo, localSt } = Global

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


        state = {
            email: '',
            password: '',
            l_login: false,
            show: true,

            formErrors: {
                email: '',
                password: ''
            },
            emailValid: false,
            passwordValid: false,
            formValid: false
        }

        validateField(fieldName, value) {
            let fieldValidationErrors = this.state.formErrors;
            let emailValid = this.state.emailValid;
            let passwordValid = this.state.passwordValid;
            switch (fieldName) {
                case 'email':
                    emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                    fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                    break;
                //case 'password':
                //    passwordValid = value.length >= 6;
                //    fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                    break;
                default:
                    break;
            }
            this.setState({
                formErrors: fieldValidationErrors,
                emailValid: emailValid,
                passwordValid: passwordValid
            }, this.validateForm);
        }

        validateForm() {
            this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
        }

        handleOnChange = (event) => {
            const name = event.target.name;
            const value = event.target.value;
            this.setState({ [name]: value }, () => { this.validateField(name, value) });
        }

        submit = (event) => {
            event.preventDefault()

            /*window.location.href = "/Home";*/

            if (this.state.l_login) return
            this.setState({ l_login: true })
            
            axios.post('/Login/Index', {
                correo: this.state.email,
                contrasenia: this.state.password
            })
                .then(({ data }) => {
                    if (data.apiEstado == 'ok') {

                        localSt.remove("listTrabajoPagination")
                        localSt.remove("listTrabajoFilterData")

                        window.location = '/'
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
            console.log('changeDiv', event.nativeEvent);
        }

        errorClass(error) {
            return (error.length === 0 ? '' : 'is-invalid');
        }

        render() {
            const loadingClass = this.state.l_login ? 'is-loading' : ''
            return (
                <>
                    <Global.Header alter onBack="home" />
                    <div className="o-container s-field--login s-login-wrapper align-items-center">
                        <div className="box grow s-login-form">
                            <div style={{ width: '200px' }} className="m-auto">
                                <a href="#">
                                    <img src="/images/logo.svg" loading="lazy" />
                                </a>
                            </div>
                            <form className="s-login-form-form s-field--login__form u-shadow--1 mt-3">
                                <p className="u-text--bold paragraph paragraph--28 u-text--primary-blue mb-2">
                                    Sistema de Tasaciones
                                </p>
                                <p className="u-text--bold paragraph u-text--gray-90 mb-2">
                                    Bienvenido al Portal de Empresa
                                </p>
                                <p className="paragraph paragraph--24 u-text--primary-sky-blue mb-2">
                                    Iniciar sesión
                                </p>
                                <div className={`mb-3`} >
                                    <div className="c-input c-input--login">
                                        <label className="c-input__label u-text--gray-90">
                                            Usuario
                                        </label>
                                        <div className="c-input__cont-input">
                                            <input
                                                type="text"
                                                id="id-name"
                                                name="email"
                                                value={this.state.email}
                                                className={`c-input__input ${this.errorClass(this.state.formErrors.email)}`}
                                                onChange={this.handleOnChange}
                                            />
                                            <Global.Icon h="24" className="c-input__icon left u-text--primary-sky-blue">mail</Global.Icon>
                                        </div>
                                    </div>

                                </div>

                                <div className={`mb-3 ${this.errorClass(this.state.formErrors.password)}`} onChange={this.handleChangeDiv}>
                                    <div className="c-input c-input--login">
                                        <label className="c-input__label u-text--gray-90">
                                            Contraseña
                                        </label>
                                        <div className="c-input__cont-input">
                                            <input
                                                id="id-password"
                                                name="password"
                                                type="password"
                                                value={this.state.password}
                                                className={`c-input__input ${this.errorClass(this.state.formErrors.password)}`}
                                                onChange={this.handleOnChange}
                                            />
                                            <Global.Icon h="24" className="c-input__icon left u-text--primary-sky-blue">password</Global.Icon>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex justify-space-between align-center s-login-mt-40">
                                    <CButton isLoading={this.state.l_login} className='c-button--sm c-button--skyblue' onClick={this.submit} disabled={this.state.formValid} >
                                        Ingresar
                                    </CButton>
                                    <p className="paragraph paragraph--12 forgot-password text-right u-text--primary-blue">
                                        <a href="/recuperarcontrasenia">
                                            ¿Olvidaste tu contraseña?
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
        <Global.AppProvider view="login">
            <View />
        </Global.AppProvider>,
        document.getElementById('view')
    );
})()
