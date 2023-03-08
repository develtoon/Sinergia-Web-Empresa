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

            correoEnviado:false,

            formErrors: {
                error:''
            }
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

        dataPush = {
            usuario:'',
        }

        handleOnChange = (event) => {
            const name = event.target.name;
            const value = event.target.value;
            
            this.dataPush.usuario = value

            this.setState({ [name]: value }, () => { this.validateField(name, value) });
        }

        submit = (event) => {
            event.preventDefault()

            
            this.setState({l_login: true})
            // window.location.href = "/recuperarcontrasenia";

            if (this.state.correoEnviado) return
            

            
            axios.post('/recuperarcontrasenia/save', {
                usuario: this.state.email.trim(),
            })
                .then(({ data }) => {
                    if (data.apiEstado == 'ok') {
                        // window.location = '/'
                        this.setState({ correoEnviado: true, l_login: false })
                        // this.setState({ l_login: false })
                    }else if(data.apiEstado == 'error'){
                        this.setState({ l_login: false })
                        swal({
                            title: 'Error',
                            text: data.apiMensaje,
                            icon: "error"
                        });
                    }
                })
                .catch(({ response }) => {
                    this.setState({ l_login: false })
                    if (response?.data?.apiMensaje) {
                        swal({
                            title: "Comuníquese con soporte técnico",
                            text: response?.data?.apiMensaje,
                            icon: "error"
                        });
                    }
                })
                
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
                            <form style={{ height: 'auto'}} className="s-login-form-form s-field--login__form u-shadow--1 mt-3 flex flex-column justify-space-between">
                                <div className="">
                                    <p className="text-center u-text--bold paragraph paragraph--28 u-text--primary-blue mb-2">
                                        Sistema de Tasaciones
                                    </p>
                                    <p className="mb-5 text-center paragraph paragraph--24 u-text--primary-sky-blue mb-2">
                                        Recuperar Contraseña
                                    </p>
                                
                                        {
                                            this.state.correoEnviado==false ? 
                                            (<div className="mb-4">
                                                    <div className="c-input c-input--login mb-0">
                                                        <label className="c-input__label u-text--gray-90">
                                                            Correo Electrónico
                                                        </label>
                                                        <div className="c-input__cont-input">
                                                            <input
                                                                name="email"
                                                                type="text"
                                                                id="id-name"
                                                                placeholder="Ingrese Correo"
                                                                className={`c-input__input ${this.errorClass(this.state.formErrors.error)}`}
                                                                onChange={this.handleOnChange}
                                                                />
                                                            {/* <Global.Icon h="24" className="c-input__icon left u-text--primary-sky-blue">mail</Global.Icon> */}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-content-end align-center mt-3">
                                                        <CButton
                                                            isLoading={this.state.l_login}
                                                            className='c-button--sm c-button--skyblue' 
                                                            onClick={this.submit}
                                                            disabled={this.state.formValid}
                                                            >
                                                        Solicitar
                                                        </CButton>
                                                    </div>
                                                </div>)
                                                :
                                                (
                                                    <div className="text-center flex flex-column align-center">
                                                        <Global.Icon children="task_alt" className="u-text--green mb-0" h="80"/>
                                                        <p className="paragraph--24 u-text--primary-blue" style={{width:"250px"}}>Se envió satisfactoriamente el correo</p>
                                                    </div>
                                                )
                                                
                                                
                                            }
                                        
                                
                                            </div>

                                <div>
                                    <a href="/login" className="c-link">
                                        <p className="flex align-items-center paragraph-14 u-text--primary-blue gap-2 paragraph--14">
                                            <Global.Icon children="arrow_back" h="24"/>
                                                Volver
                                        </p>
                                    </a>
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
