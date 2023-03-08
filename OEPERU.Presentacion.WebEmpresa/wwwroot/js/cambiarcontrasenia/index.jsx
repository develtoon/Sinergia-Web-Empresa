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
            urlContext: '/CambiarContrasenia',
            urlGetSingle: '/GetSingle',
            urlChange: '/Change',
        }

        state = {
            contenido:'',
            contraseniaActualizada: false,
            dataSingle: {},
            contrasenia: "",
            repetircontrasenia:"",
            l_login: false,
            emailExist: true,




            apiEstado:"",
            apiMensaje:"",

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
            this.setState({ formValid: this.state.emailValid });
        }

        handleOnChange = (event) => {
            const name = event.target.name;
            const value = event.target.value;
            
            this.setState({ [name]: value });

        }

        submit = (event) => {
            event.preventDefault()

            // window.location.href = "/recuperarcontrasenia";

            if (this.state.l_login) return

            this.setState({ l_login: true })

            axios.post(`${this.smart.urlContext}${this.smart.urlChange}`,
                {contenido: this.state.contenido,
                    contrasenia: this.state.contrasenia,
                    repetircontrasenia: this.state.repetircontrasenia}
            )
                .then(({ data }) => {
                    if (data.apiEstado == 'ok') {
                        this.setState({ l_login: false, apiMensaje: data.apiMensaje, contraseniaActualizada: true})
                    }
                    else if(data.apiEstado == 'error')
                    {
                        this.setState({ l_login: false });
                        swal({
                            title: "Error",
                            text: data.apiMensaje,
                            icon: "error"
                        });
                    }

                    
                })
                .catch(({ response }) => {
                    this.setState({ l_login: false })
                    if (response?.data?.apiMensaje) {
                        swal({
                            title: "Error",
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

        errorClass(error) {
            return (error.length === 0 ? '' : 'is-invalid');
        }

        componentWillMount() {
            
            let ID = document.querySelector('#id').value;
            
            this.setState({contenido:ID});
            
            axios.get(`${this.smart.urlContext}${this.smart.urlGetSingle}`, { params: { id: ID } })
            .then(({ data: resSingle }) => {
                
                if (resSingle.apiEstado == 'ok') {
                    this.setState({dataSingle:resSingle});              
                }else if(resSingle.apiEstado == 'error'){
                    this.setState({dataSingle:resSingle, emailExist:true});
                }
                
            }).catch(error => {
                console.log('Error al obtener Cliente/Single', error)
            })
        }
        
        
        
        
        render() {
            
            
            
            // ID = document.querySelector('#id').value;
            
            
            
            // const loadingClass = this.state.l_login ? 'is-loading' : ''
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
                            <form className="s-login-form-form s-field--login__form u-shadow--1 mt-3 flex flex-column justify-space-between">
                                <div className="text-center" >
                                    <p className="paragraph paragraph--28 u-text--primary-blue mb-2">
                                        Sistema de Tasaciones
                                    </p>
                                    <p className="paragraph paragraph--24 u-text--primary-sky-blue mb-2">
                                        Actualizar Contraseña
                                    </p>
                                    {
                                        this.state.emailExist ?
                                            this.state.contraseniaActualizada==false ? (
                                                <p style={{ width: '300px' }} className="mb-2 u-text--gray-80 mb-2" >
                                                    Hola, {this.state.dataSingle.nombre} cambie su contraseña ahora
                                                </p>
                                            )
                                            :
                                            (<></>)
                                        :
                                        (
                                            <></>
                                        )
                                    }
                                </div>
                                <div>
                                    {
                                        this.state.emailExist ?
                                            this.state.contraseniaActualizada == false ?
                                            (
                                                <div>
                                                    <div className="c-input c-input--login mb-4">
                                                        <label className="c-input__label u-text--gray-90">
                                                            Contraseña
                                                        </label>
                                                        <div className="c-input__cont-input">
                                                            <input
                                                                name="contrasenia"
                                                                type="password"
                                                                id="id-name"
                                                                placeholder="Ingrese contraseña"
                                                                // onError={}
                                                                className={`c-input__input ${this.errorClass(this.state.formErrors.email)}`}
                                                                onChange={this.handleOnChange}
                                                            />
                                                            <Global.Icon h="24" className="c-input__icon left u-text--primary-sky-blue">eye</Global.Icon>
                                                        </div>
                                                    </div>
                                                    <CInput
                                                        mod="c-input--login mb-3"
                                                        name="repetircontrasenia"
                                                        label="Ingrese contraseña nuevamente"
                                                        type="password"
                                                        placeholder="Ingrese contraseña"
                                                        onChange={this.handleOnChange}
                                                        error={this.state.contrasenia == this.state.repetircontrasenia ? '' : 'La contraseña no coincide'}
                                                    />
                                                </div>
                                            )
                                            :
                                            (
                                                <div className="text-center flex flex-column align-center">
                                                    <Global.Icon children="task_alt" className="u-text--green" h="80"/>
                                                    <p className="paragraph--24 u-text--primary-blue" style={{width:"250px"}}>{this.state.apiMensaje}</p>
                                                </div>
                                            )
                                        :
                                        (
                                            <div className="text-center flex flex-column align-center mb-3">
                                                <Global.Icon children="error" className="u-text--red" h="80"/>
                                                <p className="paragraph--24 u-text--primary-blue" style={{width:"250px"}}>{this.state.dataSingle.apiMensaje}</p>
                                            </div>
                                        )
                                    }

                                </div>
                                {
                                    this.state.emailExist ?
                                    
                                        this.state.contraseniaActualizada==false ? 
                                        (
                                            <div className="flex justify-flex-end align-center mt-3">
                                                <CButton
                                                    isLoading={this.state.l_login}
                                                    className='c-button--sm c-button--skyblue'
                                                    onClick={this.submit}
                                                    disabled={this.state.formValid}
                                                >
                                                    Solicitar
                                                </CButton>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="flex justify-flex-end align-center mt-3">
                                                <a className="c-link" href="/">
                                                    <CButton
                                                        className='c-button--sm c-button--skyblue'
                                                    >
                                                        Volver al Login
                                                    </CButton>
                                                </a>
                                            </div>
                                            
                                        )
                                    :
                                    (
                                        <div className="flex justify-flex-end align-center mt-3">
                                            <a className="c-link" href="/">
                                                <CButton
                                                    className='c-button--sm c-button--skyblue'
                                                >
                                                    Volver al Login
                                                </CButton>
                                            </a>
                                        </div>
                                        
                                    )
                                }

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
