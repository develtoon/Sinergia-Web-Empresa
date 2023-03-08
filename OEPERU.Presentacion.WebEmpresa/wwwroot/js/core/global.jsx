
(function () {
    const { useState, useEffect, useContext } = React
    const { Dropdown, Offcanvas, useAccordionButton } = ReactBootstrap;

    const AppContext = React.createContext()


    const generateId = () => {
        return '_' + Math.random().toString(36).substr(2, 9)
    }

    const parseURLParams = (url) => {
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    const ls = window.localStorage
    const localSt = {
        get(key) {
            if (key) return JSON.parse(ls.getItem(key))
            return null
        },
        set(key, val) {
            const setting = arguments[0]
            if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
                for (const i in setting) {
                    ls.setItem(i, JSON.stringify(setting[i]))
                }
            } else {
                ls.setItem(key, JSON.stringify(val))
            }
        },
        remove(key) {
            ls.removeItem(key)
        },
        clear() {
            ls.clear()
        }
    }


    const AppProvider = ({ children, view }) => {
        const [dictionary, setDictionary] = useState({})

        const [userAuth, setUserAuth] = useState({
            name: '',
            urlFoto: ''
        });

        const [breadcumb, setBreadcumb] = useState([]);
        const [permisos, setPermisos] = useState({});

        const handleAvatar = (_user, changeAvatar = false) => {
            if (!changeAvatar) {
                setUserAuth({
                    name: _user.name,
                    urlFoto: _user.urlFoto
                });
            } else {
                setUserAuth(value => ({
                    ...value,
                    urlFoto: _user.urlFoto
                }))
            }
        }

        const menuPermiso = (url) => {

            let params = {
                url: url
            }

            let menuPermisoInd = AXIOS.get('/Cuenta/getmenuind', { params })
                .then(({ data }) => {
                    if (data.apiEstado === 'ok') {

                        let esUsuarioSoloConsultar = false;

                        if (data.esUsuarioConsultar == true && data.esUsuarioCrear == false && data.esUsuarioEditar == false) {
                            esUsuarioSoloConsultar = true;
                        }
                        setPermisos({ ...data, esUsuarioSoloConsultar: esUsuarioSoloConsultar })
                    }
                    else {
                        setPermisos({});
                    }
                })
                .catch(() => {
                    setPermisos({});
                });

            return menuPermisoInd;
        }

        const handleBreadcumb = (isBreadCumb = false, lista = []) => {
            setBreadcumb(lista);
        }

        return (
            <AppContext.Provider value={{ userAuth, handleAvatar, menuPermiso, permisos, breadcumb, handleBreadcumb }} >
                {children}
            </AppContext.Provider>
        )
    }

    const CBreadcrumbs = ({ items }) => {


        return (
            <div className="c-breadcumb">
                {/* <div className="c-divider c-divider--breadcumb"></div> */}
                <ul id="breadcrumb" className="c-breadcumb__list mb-0">
                    {
                        items.map((item, idx) => {
                            let isDiv = (idx < items.length - 1 && idx >= 0)
                            return (
                                <li key={item.name} className={`c-breadcumb__item title--30 ${isDiv && ' is-div'}`}>
                                    {isDiv ?
                                        <a className="c-link" href={item.url ? item.url : '#'}>{item.name}</a>
                                        :
                                        <span>{item.name}</span>
                                    }
                                    {isDiv && <span className=" ml-2 u-text--regular">{"/"}</span>}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }


    function Icon({ style, children, h, className = '', onClick, block = "" }) {
        const fz = `${h}px`;
        return <i className={`material-icons${className ? ' ' + className : ''}${block && ' d-block'}`} style={{ fontSize: fz, ...style }} onClick={onClick} >{children}</i>
    }

    function CLogo({ className, to = "##" }) {
        return (
            <div className={className}>
                {/* <picture>
                    <source
                        media="(min-width: 40em)"
                        srcSet="img-big.jpg 1x, img-big-hd.jpg 2x"
                    />
                    <source srcSet="img-small.jpg 1x, img-small-hd.jpg 2x" />
                    <img src="img-fallback.jpg" loading="lazy" />
                </picture> */}
                <a href={to}>
                    <img
                        src="/images/logo.png"
                        srcSet="/images/logo_lg.png 1024w, /images/logo@2x.png 640w, /images/logo.png 320w"
                        // sizes="(min-width: 36em) 33.3vw, 100vw"
                        loading="lazy"
                    />
                </a>
            </div>
        )
    }

    const Parrafo = ({ size = "16", color = '', weight = '', children }) => {
        const wgt = {
            l: 'light',
            r: 'regular',
            m: 'medium',
            s: 'semibold',
            b: 'bold'
        }
        return (
            <p
                className={`paragraph paragraph--${size}${color ? ` u-text--${color}` : ''} ${weight ? ` u-text--${wgt[weight]}` : ''}`}>
                {children}
            </p>
        )
    }

    Parrafo.propTypes = {
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string.isRequired,
        children: PropTypes.string.isRequired
    };

    const CInputFile = React.forwardRef(({ styleInputFile, styleInput, isLoading, name, mod = '', children = '', placeholder, maxLength, label, value = "", icon = "", type = "text", onChange, onBlur, onClick, error = "", disabled = false, requerido = "false", position = "right", esMultiple = false, modAccept = "" }, ref) => {

        const refInput = React.useRef()

        const onClickLink = (e) => {
            refInput.current.click()
            // onClick(e)
        }

        const onChangeInput = (e) => {
            let files = e.target.files
            setFile(files)
            onChange(files)
        }

        const onDragOverLink = (e) => {
            e.preventDefault();
        }
        const onDropLink = (e) => {
            e.preventDefault();
            let files = e.dataTransfer.files;
            setFile(files)
            onChange(files)
        }

        const [file, setFile] = useState('')

        return (
            <div className={'c-inputfile ' + mod} style={styleInputFile}>
                {
                    <>
                        <input className={`c-inputfile__input `}
                            ref={refInput}
                            name={name}
                            type={type}
                            multiple={esMultiple}
                            accept={modAccept}
                            defaultValue={value}
                            onChange={onChangeInput}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            disabled={disabled}
                            maxLength={maxLength}
                        />
                        <a className={`c-inputfile__button ${isLoading ? 'c-inputfile__button_isLoading' : ''}`} onClick={onClickLink} onDragOver={onDragOverLink} onDrop={onDropLink} name={name} style={styleInput}>
                            {
                                isLoading ?
                                    <>
                                        <div className={'is-loading'}></div>
                                    </>
                                    :
                                    <>
                                        {position === "right" ? (<>
                                            <div className="c-inputfile__button_text">{children}</div>
                                            {icon ? <Icon className="c-inputfile__icon u-text--blue" h="24"> {icon} </Icon> : ''}
                                        </>) : (<>
                                            {icon ? <Icon className="c-inputfile__icon u-text--blue" h="24"> {icon} </Icon> : ''}
                                            <div className="c-inputfile__button_text">{children}</div>
                                        </>)}

                                    </>
                            }
                        </a>
                    </>
                }
            </div>
        )
    })

    // NOTE: https://es.reactjs.org/docs/typechecking-with-proptypes.html
    CInputFile.propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string,
        onChange: PropTypes.func,
        onClickIncon: PropTypes.func
    };

    const CInput = React.forwardRef(({ min, requerido, id, step, name, mod = '', modInput = '', placeholder, maxLength, label, value = "", icon = "", type = "text", onChange, onBlur,
        onClickIncon, error = "", disabled = false, cRegex = '', autocomplete = 'on' }, ref) => {

        /* C-REGEX */
        let patterns = {
            all: /^[.*]$/,
            numeric: /^[\d.]$/,
            date: /^[\d\/]$/,
            integer: /^[\d]$/,
            currency: /^[\d.,]$/, // only digots(no symbol)
            letter: /^[a-z\u00C0-\u00FF]$/i, // include accents characters (áüñ)
            'simple-text': /^[a-z\u00C0-\u00FF\s]$/i,
            alphanumeric: /^[ña-z\d]$/i,
            email: /^[-a-z0-9\.+_@:]$/i,
            period: /^[\d-/\s]$/,
            'text-number': /^[a-z0-9\u00C0-\u00FF\s]$/i,
            decimals: /^([0-9]{0,2})*(\.[0-9]{0,4})?$/
        }

        const handleKeyPress = (event) => {
            if (!patterns[cRegex]) return
            var keyPressed = event.key || String.fromCharCode(event.keyCode);
            var patt = new RegExp(patterns[cRegex])

            if (!patt.test(keyPressed)) {
                event.preventDefault()
            }
        }

        return (
            <div className={'c-input ' + mod}>
                {
                    label ? <label className="c-input__label u-text--regular u-text--gray-90" htmlFor={id}>
                        {
                            requerido === "1" ? <span className="c-input__simbol-requerid">*</span> : ''
                        }
                        {label}
                    </label> : ''
                }
                <div className={`c-input__cont-input ${error && 'is-invalid'}`}>
                    {
                        onChange
                            ?
                            <input className={`c-input__input ${modInput}`}
                                ref={ref}
                                name={name}
                                type={type}
                                defaultValue={value}
                                step={step}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder={placeholder}
                                disabled={disabled}
                                min={min}
                                maxLength={maxLength}
                                onKeyPress={cRegex ? handleKeyPress : () => { }}
                                autoComplete={autocomplete}
                            />
                            :
                            <input className={`c-input__input ${modInput}`}
                                ref={ref}
                                name={name}
                                type={type}
                                defaultValue={value}
                                step={step}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder={placeholder}
                                disabled={disabled}
                                min={min}
                                maxLength={maxLength}
                                onKeyPress={cRegex ? handleKeyPress : () => { }}
                                autoComplete={autocomplete}
                            />
                    }
                    {
                        icon ? <Icon className="c-input__icon left u-text--primary-sky-blue" h="24" onClick={onClickIncon}> {icon} </Icon> : ''
                    }
                </div>
                {
                    error && <div className="invalid-feedback">
                        {error}
                    </div>
                }
            </div>
        )
    })

    // NOTE: https://es.reactjs.org/docs/typechecking-with-proptypes.html
    CInput.propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string,
        onChange: PropTypes.func,
        onClickIncon: PropTypes.func
    };

    /*AutoComplete*/

    const CAutoComplete = React.forwardRef(({ requerido, id, name, items = [], mod = '', modInput = '', label, error = "", value = "", onChange, onSelect, disabled = false }, ref) => {

        return (
            <div className={'c-input ' + mod}>
                {
                    label ? <label className="c-input__label u-text--regular u-text--gray-90" htmlFor={id}>
                        {
                            requerido === "1" ? <span className="c-input__simbol-requerid">*</span> : ''
                        }
                        {label}
                    </label> : ''
                }
                <div className={`c-input__cont-input ${error && 'is-invalid'}`}>
                    {
                        <ReactAutocomplete
                            ref={ref}
                            className={`c-input__input ${modInput}`}
                            items={items}
                            name={name}
                            shouldItemRender={(item, val) => item.label.toLowerCase().indexOf(val.toLowerCase()) > -1}
                            getItemValue={item => item.label}
                            renderItem={(item, highlighted) =>
                                <div
                                    key={item.id}
                                    //style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
                                    className="c-input__autocomplete-item"
                                >
                                    {item.label}
                                </div>
                            }
                            disabled={disabled}
                            value={value}
                            onChange={onChange}
                            onSelect={onSelect}
                        />
                    }
                </div>
                {
                    error && <div className="invalid-feedback">
                        {error}
                    </div>
                }
            </div>
        )
    })

    // NOTE: https://es.reactjs.org/docs/typechecking-with-proptypes.html
    CAutoComplete.propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string,
        onChange: PropTypes.func,
        onClickIncon: PropTypes.func
    };

    const CSwitch = React.forwardRef(({ onChange, mod = '', name = '', label = '', defaultChecked = false, checked, mapa, disabled }, ref) => {
        return (
            <>
                <label className="c-input__label u-text--regular u-text--gray-90">{label}</label>
                <label className={`switch ${mapa ? 'mapa' : ''}`}>
                    <input type="checkbox"
                        ref={ref}
                        name={name}
                        onChange={onChange}
                        defaultChecked={defaultChecked}
                        checked={checked}
                        disabled={disabled}
                    />
                    <span className={`slider round ${mapa ? 'mapa' : ''}`}></span>
                    {mapa && <Icon children="format_list_bulleted" className="icon icon_l"></Icon>}
                    {mapa && <Icon children="pin_drop" className="icon icon_r"></Icon>}
                </label>
            </>
        )
    })

    const CTextArea = React.forwardRef(({ id, name, mod = '', placeholder, maxLength, label, value = "", icon = "", type = "text", onChange, onBlur, error = "", disabled = false, rows = 1 }, ref) => {
        return (
            <div className={'c-input ' + mod}>
                {
                    label ? <label className="c-input__label u-text--regular u-text--gray-90" htmlFor={id}>{label}</label> : ''
                }
                <div className={`c-input__cont-input ${error && 'is-invalid'}`}>
                    {
                        <textarea className={`c-input__textarea `}
                            ref={ref}
                            name={name}
                            type={type}
                            defaultValue={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            disabled={disabled}
                            maxLength={maxLength}
                            rows={rows}
                        />
                    }
                    {
                        icon ? <Icon className="c-input__icon left u-text--blue" h="24"> {icon} </Icon> : ''
                    }
                </div>
                {
                    error && <div className="invalid-feedback">
                        {error}
                    </div>
                }
            </div>
        )
    })



    // NOTE: https://es.reactjs.org/docs/typechecking-with-proptypes.html
    CTextArea.propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        placeholder: PropTypes.string,
        label: PropTypes.string,
        onChange: PropTypes.func,
    };

    const COPagination = React.forwardRef(({ currentPage, onClickPrev, onChangeCurrentPage, onClickNext }, ref) => {

        return (
            <>

                <ul className="c-pagination">
                    <li className="c-pagination c-pagination-before" onClick={onClickPrev}>Previo</li>
                    <li className="c-pagination-numbers">
                        <ul>
                            <li>
                                {currentPage}
                            </li>
                        </ul>
                    </li>
                    <li className="c-pagination c-pagination-after" onClick={onClickNext}>Siguiente</li>
                </ul>
            </>

        )
    })

    // const ExpandButtom = ({ eventKey }) => {

    //     const [arrowUp, setArrowUp] = useState(false)
    //     const decoratedOnClick = useAccordionButton(eventKey, () =>{
    //         setArrowUp(!arrowUp)

    //     });


    //     return (
    //         <Icon children={arrowUp ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} className="c-accordion-header-toggle u-text--gray-90" h="25" onClick={decoratedOnClick}/>
    //     );
    // }

    const CPagination = ({ data = {}, onChangePag }) => {



        const handlePrev = () => {
            if (data.currentPage === 1) return
            onChangePag('currentPage', data.currentPage - 1)
        }



        const handleNext = () => {

            if (data.currentPage + 1 > Math.ceil(data.total / data.perPage)) return
            onChangePag('currentPage', data.currentPage + 1)
        }



        const handleChange = (event) => {
            onChangePag('perPage', event.target.value)
        }



        let from = ((data.currentPage - 1) * data.perPage) + 1;
        let to = data.currentPage * data.perPage > data.total ? data.total : data.currentPage * data.perPage

        return (
            <div className="c-table__actions flex paragraph paragraph--14 u-text--gray-80">
                <div className="c-table__actions-block-1">

                    Filas por página

                    <select className="browser-default js-pagination__rows" defaultValue={data.perPage} name="number_of_rows" onChange={handleChange}>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>


                <div className="">
                    <span className="js-pagination__count-start"> {from} </span>
                    -
                    <span className="js-pagination__count-end"> {to} </span>
                    de
                    <span className="js-pagination__total"> {data.total} </span>
                    registros
                </div>


                <div className="flex">

                    <Icon h="24" className="u-pointer" onClick={() => handlePrev()}>keyboard_arrow_left</Icon>
                    <span className="js-pagination__page">{data.currentPage}</span>
                    <Icon h="24" className="u-pointer" onClick={() => handleNext()}>keyboard_arrow_right</Icon>
                </div>
            </div>
        )
    }

    CPagination.propTypes = {
        data: PropTypes.object,
        onChange: PropTypes.func,
    };


    const CPaginationCustom = ({ totalCount, currentPage, pageSize, onPageChange, onSizeChange, mod }) => {
        // if (currentPage === 0) {
        //     return null
        // }

        const onPrevious = () => {
            onPageChange(currentPage - 1);
        }
        const onNext = () => {
            onPageChange(currentPage + 1);
        }

        const handleChange = (event) => {
            onSizeChange(event.target.value)
        }

        const to = currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize
        let from = ((currentPage - 1) * pageSize) + 1;
        let lastPage = Math.ceil(totalCount / pageSize)

        if (totalCount == 0) {
            from = 0;
        }

        if (lastPage == 0) {
            lastPage = 1;
        }

        return (
            <div className="c-table__actions flex paragraph paragraph--14 u-text--gray-80">
                <div className="c-table__actions-block-1">
                    Filas por página
                    <select className="browser-default js-pagination__rows" value={pageSize} name="number_of_rows" onChange={handleChange}>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div className="">
                    <span className="js-pagination__count-start"> {from} </span>
                    -
                    <span className="js-pagination__count-end"> {to} </span>
                    de
                    <span className="js-pagination__total"> {totalCount} </span>
                    registros
                </div>

                <div className="flex">
                    <Icon h="24" className={`u-pointer${currentPage == 1 ? ' disabled' : ' enabled'}`} onClick={() => onPrevious()}>keyboard_arrow_left</Icon>
                    <span>{currentPage}</span>
                    <Icon h="24" className={`u-pointer${currentPage == lastPage ? ' disabled' : ' enabled'}`} onClick={() => onNext()}>keyboard_arrow_right</Icon>
                </div>
            </div>
        )
    }


    const CCheckBox = React.forwardRef(({ isButtonCheckBox = false, modLabel = '', mod = '', onChange, checked = false, label = '' }, ref) => {

        return (
            <div className="custom-control custom-checkbox">
                {
                    isButtonCheckBox
                        ?
                        <label className={`c-checkbox c-button c-button--outline c-button--sm ${modLabel}`}>
                            <input
                                ref={ref}
                                className={`custom-control-input c-checkbox__input ${mod}`}
                                type="checkbox"
                                onChange={onChange}
                            />
                            <span className="c-checkbox__icon"></span>
                            {
                                label ? label : ''
                            }
                        </label>
                        :
                        <label className={`c-checkbox ${modLabel}`}>
                            <input
                                ref={ref}
                                className={`custom-control-input c-checkbox__input ${mod}`}
                                type="checkbox"
                                onChange={onChange}
                                checked={checked}
                            />
                            <span className="c-checkbox__icon mr-3"></span>
                            {
                                label ? label : ''
                            }
                        </label>
                }
            </div>
        )
    })

    const CSelect = React.forwardRef(({ id, label, onChange, mod = '', value, onBlur, name, options = [], isOptionDisabled = false, esMultiple = false, isOptionState = false, error = "", placeholder = "", requerido = "0", disabled = false }, ref) => {
        return (
            <div className={'c-select ' + mod}>
                {
                    label ? <label className="c-select__label u-text--regular u-text--gray-90" htmlFor={id}>
                        {
                            requerido === "1" ? <span className="c-input__simbol-requerid">*</span> : ''
                        }
                        {label}
                    </label> : ''
                }
                <div className={`c-input__cont-select ${error && 'is-invalid'}`}>
                    <select
                        disabled={disabled} name={name} className="c-select__select" ref={ref} id={id} value={value} onChange={onChange} onBlur={onBlur}>
                        {
                            options.map(option => {

                                /*tipos
                                1 Habilitado
                                2 Deshabilitado
                                */

                                let tipoOpcion = 2;
                                let classState = "";

                                if (isOptionDisabled) {
                                    if (option.eshabilitado) {
                                        tipoOpcion = 1;
                                    }
                                }
                                else {
                                    tipoOpcion = 1;
                                }

                                if (isOptionState) {
                                    if (option.idestado == 2) {
                                        classState = "u-bg--gray-30";
                                    }
                                }

                                if (tipoOpcion == 1) {
                                    return (
                                        <option className={classState}
                                            value={option.id} key={option.id}
                                        >{option.text}</option>
                                    )
                                }
                                else {

                                    return (
                                        <option className={classState}
                                            value={option.id} key={option.id}
                                            disabled={true}
                                        >{option.text}</option>
                                    )
                                }

                            })
                        }
                    </select>
                </div>
                {
                    error && <div className="invalid-feedback">
                        {error}
                    </div>
                }
            </div >
        )
    })


    const CNotification = ({ icon = "", children = "", className = "", iconClassName = "" }) => {
        return (
            <div className={`c-notification ${className}`}>
                <Icon className={iconClassName} h="26" children={icon} />
                {children}
            </div>
        )
    }

    const CButton = ({ id, children, isLoading, className, onClick, type = 'button', icon = '', disabled }) => {
        return (
            <button
                id={id}
                type={type}
                className={`c-button${className ? ' ' + className : ''} ${isLoading ? ' is-loading' : ''} ${disabled ? ' is-disabled' : ''} flex align-center`}
                onClick={onClick}
            >
                {isLoading ? "" : children}
            </button>
        )
    }

    function HeaderBack({ children = 'volver', to = '/' }) {
        return (
            <div className="d-flex align-items-center">
                <Icon h="24">keyboard_arrow_left</Icon>
                <a className="c-link paragraph u-text--light" href={to}>
                    {children}
                </a>
            </div>
        )
    }



    function CMenu() {
        const managerContext = useContext(AppContext);

        const [l_menu, setL_menu] = useState(false)

        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        /*
         const [menus, setMenus] = useState([
             { id: 1, url: '#', nombre: 'Administración', icono: 'storage', visible: false },
             { id: 2, url: '#', nombre: 'Reportes', icono: 'pie_chart', visible: false },
             { id: 3, url: '#', nombre: 'Procesos', icono: 'tune', visible: false },
             { id: 4, url: '#', nombre: 'Seguridad', icono: 'security', visible: false }
         ])
         */

        const [menus, setMenus] = useState([
        ])
        /*
        const [submenus, setSubmenus] = useState([
            { id: 5, idPadre: 1, url: '/Administracion/Colaborador', nombre: 'Colaborador' },
            { id: 7, idPadre: 1, url: '/Administracion/Cliente', nombre: 'Cliente' },
            { id: 8, idPadre: 2, url: '/reportes/reportegeneral', nombre: 'Reporte General de Pedidos' },
            { id: 9, idPadre: 2, url: '/reportes/reportecontrol', nombre: 'Reporte de Control' },
            { id: 10, idPadre: 3, url: '/Procesos/Trabajos', nombre: 'Trabajos' },
            { id: 11, idPadre: 3, url: '#', nombre: 'Calendario' },
            { id: 13, idPadre: 4, url: '/Seguridad/Rol', nombre: 'Rol' }
        ])
        */

        const handleShow = (id) => {
            let clone = [...menus]
            let pos = clone.findIndex(item => item.id == id)
            clone.filter(item => item.id != id).map(item => item.visible = false);
            clone[pos].visible = !clone[pos].visible;
            setMenus(clone);
            setShow(true);
        }

        useEffect(() => {
            AXIOS.post('/Cuenta/getmenus', {

            })
                .then(({ data }) => {

                    let menusCloned = data.menus.map(item => {

                        let subMenus = item.subMenus.map(sm => {
                            return {
                                ...sm,
                                key: generateId()
                            }
                        });

                        return {
                            ...item,
                            subMenus: subMenus,
                            key: generateId(),
                            visible: false
                        }
                    });


                    setMenus(menusCloned)
                    managerContext.handleAvatar({
                        name: data.persona,
                        urlFoto: '/images/user.png'
                    });
                })
        }, []);



        return (
            <nav className="c-nav box">
                {
                    l_menu ?
                        ''
                        :
                        <>
                            <div className="c-nav__logo-cont">
                                <a href="/">
                                    <figure className="c-menu__logo">
                                        <img className="logoOEPERU" src="/images/logo-white.png" alt="OEPERU" hidden="" style={{ display: "inline" }} />
                                    </figure>
                                </a>
                            </div>
                            <ul className="c-nav__menu p-0 h-100">
                                {menus.map((menu, idx) => {
                                    return (
                                        <div key={menu.id}>
                                            <a className="c-link" href={menu.enlace} target="_self" onClick={(e) => handleShow(menu.id)}>
                                                <li className="c-nav__list-item u-pointer">
                                                    <Icon className="" h="30">{menu.icono}</Icon>
                                                </li>
                                            </a>
                                            {menu.visible &&
                                                <Offcanvas show={show} onHide={handleClose} key={menu.key} >
                                                    <Offcanvas.Header closeButton>
                                                        <Offcanvas.Title className="title--30 u-text--gray-90 u-text--bold">{menu.nombre}</Offcanvas.Title>
                                                    </Offcanvas.Header>
                                                    <hr className="u-text--gray-60 m-0" />
                                                    <Offcanvas.Body className="paragraph--16 u-text--gray-90">
                                                        <ul className="c-submenu flex flex-column align-items-left justify-flex-start h-100 p-0">
                                                            {menu.subMenus.map((sm, idx) => {
                                                                return (
                                                                    <a className="c-link" href={sm.enlace} target="_self" key={sm.key}>
                                                                        <li className="c-nav__list" key={sm.id}>
                                                                            {sm.nombre}
                                                                        </li>
                                                                    </a>
                                                                )
                                                            })}
                                                        </ul>
                                                    </Offcanvas.Body>
                                                </Offcanvas>}
                                        </div>
                                    )
                                })}

                            </ul>
                            <div className="c-nav__logo-cont"></div>
                        </>
                }
            </nav>
        )
    }



    function CDropDownSession({ className }) {
        return (
            <div className={className}>
                <Dropdown>
                    <Dropdown.Toggle className="u-text--primary-blue paragraph--24" variant="" id="dropdown-basic">

                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {/* <Dropdown.Item href="#">Mi Perfil</Dropdown.Item> */}
                        <Dropdown.Item href="/Home/LogOut">Cerrar Sesión</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </div>
        );
    }

    const CustomToggle = React.forwardRef(({ onClick }, ref) => (
        <a className="c-link" onClick={(e) => { e.preventDefault(); onClick(e); }}>
            <Icon children="more_vert" h="20" className="c-icon" />
        </a>
    ));

    function CAvatar({ name, alt, className, src }) {
        return (
            <div className={className}>
                <figure width="40" className="c-avatar c-avatar--rounded c-avatar--gradient">
                    <img src={src} alt={alt} className="h-100" />
                </figure>
                {
                    name ?
                        <span className="u-text--regular u-text--gray-90 paragraph--14 mr-1 ml-2 c-avatar--span">
                            Hola, {name}
                        </span>
                        :
                        ''
                }
                <CDropDownSession className='flex align-center' />
            </div>
        )
    }

    function Header({ alter = false, onBack = '' }) {
        const managerContext = useContext(AppContext);
        const [menus, setMenus] = useState([{ 'id': '1', 'url': '', 'nombre': 'Procesos', 'icono': 'menu' }])
        const [user, setUser] = useState({})
        const [l_auth, setL_auth] = useState(true)

        function parseMenus(_menus) {
            let menus = []
            const menusSaved = {}
            _menus.forEach(menu => {
                let mainMenu = menusSaved[menu.nombrePrincipal]
                if (!mainMenu) {
                    let pos = menus.push({
                        id: menu.nombrePrincipal,
                        nombre: menu.nombrePrincipal,
                        orden: menu.ordenPrincipal,
                        children: [
                            {
                                id: menu.id,
                                url: menu.url,
                                nombre: menu.nombre
                            }
                        ]
                    })
                    menusSaved[menu.nombrePrincipal] = {
                        id: menu.nombrePrincipal,
                        pos
                    }
                } else {
                    menus[mainMenu.pos - 1].children.push(
                        {
                            id: menu.id,
                            url: menu.url,
                            nombre: menu.nombre
                        }
                    )
                }
            })
            setMenus(menus)
        }

        /* activar para llamar menús
        useEffect(() => {
            if (alter) return
            axios('/Cuenta/getmenus', {
                
            })
                .then(({ data }) => {
                    parseMenus(data.menus)
                    authContext.handleAvatar({
                        name: data.persona,
                        urlFoto: data.urlFoto
                    });
                    setL_auth(false)
                })
        }, []);
        */

        const className = alter ? 'c-header__logo c-header__logo--alter' : 'c-header__logo'
        return (
            <>
                {alter ? <></> :
                    <header className="c-header">
                        <div className="o-container o-container-header c-header__wrapper flex justify-space-between">
                            <CBreadcrumbs items={managerContext.breadcumb} />
                            <CAvatar className='c-header__avatar flex align-center' name={managerContext.userAuth.name} src={managerContext.userAuth.urlFoto} />

                            {/*
                                alter ?
                                    <>
                                        <HeaderBack to={onBack}>
                                            Ir atrás
                                        </HeaderBack>
                                        <CLogo className={className} />
                                    </>
                                    :
                                    <>
                                        <CLogo className={className} to="/" />
                                        <CMenu menus={menus} />
                                        <CBreadcrumbs items={managerContext.breadcumb} />

                                        <CAvatar className='c-header__avatar flex align-center' name={managerContext.userAuth.name} src={managerContext.userAuth.urlFoto} />
                                    </>
                            */}
                        </div>
                        <div className="c-divider  c-dividir--gray-20 w-100"></div>

                    </header>
                }
            </>
        )
    }

    const IconSocialNetworks = ({ type }) => {
        const fb = <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.3"> <rect y="0.396851" width="34" height="34" rx="17" fill="white" /> <path d="M17 11.3969C18.1 11.3969 19 12.2969 19 13.3969C19 14.4969 18.1 15.3969 17 15.3969C15.9 15.3969 15 14.4969 15 13.3969C15 12.2969 15.9 11.3969 17 11.3969ZM17 21.3969C19.7 21.3969 22.8 22.6869 23 23.3969H11C11.23 22.6769 14.31 21.3969 17 21.3969ZM17 9.39685C14.79 9.39685 13 11.1869 13 13.3969C13 15.6069 14.79 17.3969 17 17.3969C19.21 17.3969 21 15.6069 21 13.3969C21 11.1869 19.21 9.39685 17 9.39685ZM17 19.3969C14.33 19.3969 9 20.7369 9 23.3969V25.3969H25V23.3969C25 20.7369 19.67 19.3969 17 19.3969Z" fill="#343A40" /> </g> </svg>
        return (
            fb
        )
    }

    const Footer = () => {
        return (
            <footer className="c-footer">
                {/*<div className="o-container o-container--1440">
                    <div className="u-bg--black-1 c-footer__logo-wrapper">
                        <div className="c-footer__logo">
                            <Global.CLogo />
                        </div>
                    </div>
                    <div className="flex u-bg--black-1 c-footer__nav u-text--white">
                        <div className="c-footer__nav-item paragraph paragraph--14 u-text--light">
                            <h4 className="subtitle subtitle--14 u-text--medium">
                                Título
                            </h4>
                        </div>
                        <div className="c-footer__nav-item paragraph paragraph--14 u-text--light">
                            <h4 className="subtitle subtitle--14 u-text--medium">
                                Título
                            </h4>
                        </div>
                        <div className="c-footer__nav-item paragraph paragraph--14 u-text--light">
                            <h4 className="subtitle subtitle--14 u-text--medium">
                                Título
                            </h4>
                        </div>
                        <div className="c-footer__nav-item-4">
                            <p>
                                Link
                            </p>
                            <IconSocialNetworks />

                        </div>
                    </div>
                    <div className="u-bg--red c-footer__copy-right">
                       
                        <Global.Parrafo size="14" color="white" weight="m">© Copyright - Todos los derechos Reservados, 2021</Global.Parrafo>
                    </div>
                </div>*/}
            </footer>
        )
    }

    const CLoader = ({ size = "lg" }) => {
        return (
            <div className={`c-loader c-loader--${size}`}>
                {
                    size !== 'lg' ?
                        <div className="lds-ripple"><div></div><div></div></div>
                        :
                        <div className="c-loader__logo">
                            <svg width="220" height="54" viewBox="0 0 220 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M38.6771 25.8907L52.492 50.6418L35.285 40.9008L35.6331 39.3385L38.6771 25.8907Z" fill="url(#paint0_linear_249_5468)" />
                                <path d="M-1.04904e-05 21.5574L5.93954 15.6389L8.87842 21.5574H-1.04904e-05Z" fill="url(#paint1_linear_249_5468)" />
                                <path d="M37.1122 24.5139L37.0532 24.1462L37.1569 24.3934C37.1448 24.4266 37.1292 24.4668 37.1122 24.5139Z" fill="url(#paint2_linear_249_5468)" />
                                <path d="M37.6207 25.066L37.5834 25.085L37.6164 25.0576L37.6207 25.066Z" fill="url(#paint3_linear_249_5468)" />
                                <path d="M21.578 15.6389L21.7215 15.7332L29.5735 20.9398L14.6859 31.4038L14.6603 31.4218L9.76358 21.5574L6.82471 15.6389H21.578Z" fill="url(#paint4_linear_249_5468)" />
                                <path d="M37.4816 25.1664L37.4703 25.1401L37.5838 25.0847L37.4816 25.1664Z" fill="url(#paint5_linear_249_5468)" />
                                <path d="M31.0482 20.9399L23.1956 15.7332C27.1304 10.5314 31.2557 5.40859 32.6572 3.67789L32.1735 12.5352L37.7919 25.3723L34.7472 38.8201L34.2407 38.6177L16.1691 31.4218L16.1613 31.4038L31.0482 20.9399Z" fill="url(#paint6_linear_249_5468)" />
                                <path d="M53.6812 14.8086L61.7803 14.9604L39.391 25.4153L53.375 15.0456L53.6812 14.8086Z" fill="url(#paint7_linear_249_5468)" />
                                <path d="M33.8372 3.72364L33.8422 3.7174L33.8748 3.375L63.871 4.87074L52.6888 13.8951L52.3876 14.1383L38.611 24.77L33.3534 12.5802L33.8372 3.72364Z" fill="url(#paint8_linear_249_5468)" />
                                <path d="M86.8817 33.2181C81.7523 33.2181 78.0645 29.8489 78.0645 24.6153C78.0645 19.8069 81.4841 16.0779 86.58 16.0779C91.9106 16.0779 94.9614 19.7088 94.9614 24.2555C94.9614 24.7134 94.9614 25.0078 94.8943 25.4331H80.6125C80.8471 28.7041 83.1604 30.9938 86.8817 30.9938C89.7649 30.9938 91.6088 29.4891 92.4135 27.8209L94.7938 28.5078C93.6874 30.8303 91.1395 33.2181 86.8817 33.2181ZM80.6125 23.5686L92.4135 23.5359C92.1788 20.4938 90.1002 18.3022 86.58 18.3022C83.1939 18.3022 80.8471 20.7228 80.6125 23.5686ZM111.354 8.91437H113.935V32.7929H111.354V29.8162C110.013 31.9097 107.733 33.2181 104.749 33.2181C99.9215 33.2181 96.3007 29.5218 96.3007 24.6153C96.3007 19.7088 99.9215 16.0779 104.749 16.0779C107.733 16.0779 110.013 17.3863 111.354 19.4144V8.91437ZM105.118 30.9284C108.571 30.9284 111.421 28.2461 111.421 24.648C111.421 21.0499 108.571 18.3676 105.118 18.3676C101.43 18.3676 98.8487 21.0172 98.8487 24.648C98.8487 28.2461 101.43 30.9284 105.118 30.9284ZM130.16 16.4704H132.741V32.7929H130.16V29.9471C128.986 31.8116 126.908 33.2181 123.991 33.2181C119.8 33.2181 117.253 30.5359 117.253 26.0546V16.4704H119.834V25.6947C119.834 28.8676 121.477 30.8303 124.528 30.8303C127.914 30.8303 130.16 28.3443 130.16 24.6807V16.4704ZM159.225 21.2789C159.225 24.5826 157.984 27.4938 155.906 29.62L158.655 32.7929H155.805L154.263 31.0265C152.285 32.4003 149.838 33.2181 147.189 33.2181C140.384 33.2181 135.12 28.0499 135.12 21.2789C135.12 14.606 140.384 9.47044 147.189 9.47044C153.961 9.47044 159.225 14.606 159.225 21.2789ZM147.189 30.7975C149.301 30.7975 151.145 30.2088 152.62 29.1947L147.055 22.8817H150.139L154.297 27.7228C155.772 26.0218 156.61 23.7648 156.61 21.2789C156.61 16.1106 152.821 11.891 147.189 11.891C141.557 11.891 137.735 16.1106 137.735 21.2789C137.735 26.5452 141.557 30.7975 147.189 30.7975ZM169.013 33.2181C164.185 33.2181 160.564 29.5218 160.564 24.6153C160.564 19.7088 164.185 16.0779 169.013 16.0779C171.996 16.0779 174.276 17.3863 175.617 19.4144V16.4704H178.199V32.7929H175.617V29.8162C174.276 31.9097 171.996 33.2181 169.013 33.2181ZM169.381 30.9284C172.835 30.9284 175.684 28.2461 175.684 24.648C175.684 21.0499 172.835 18.3676 169.381 18.3676C165.694 18.3676 163.112 21.0172 163.112 24.648C163.112 28.2461 165.694 30.9284 169.381 30.9284ZM184.265 19.2835C185.271 17.1574 187.316 15.8817 190.266 16.2742V18.6293C186.645 18.1714 184.265 20.0359 184.265 25.1714V32.7929H181.684V16.4704H184.265V19.2835ZM201.194 30.1433L201.898 32.3022C200.724 32.7929 199.652 33.0218 198.411 33.0218C195.059 33.0218 193.517 30.9611 193.517 27.8209V18.7602H190.197V16.4704H193.517V10.8443H196.098V16.4704H201.831V18.7602H196.098V27.8209C196.098 29.6527 196.97 30.6994 198.814 30.6994C199.685 30.6994 200.322 30.5686 201.194 30.1433ZM211.92 33.2181C206.791 33.2181 203.103 29.8489 203.103 24.6153C203.103 19.8069 206.523 16.0779 211.619 16.0779C216.949 16.0779 220 19.7088 220 24.2555C220 24.7134 220 25.0078 219.933 25.4331H205.651C205.886 28.7041 208.199 30.9938 211.92 30.9938C214.804 30.9938 216.647 29.4891 217.452 27.8209L219.832 28.5078C218.726 30.8303 216.178 33.2181 211.92 33.2181ZM205.651 23.5686L217.452 23.5359C217.217 20.4938 215.139 18.3022 211.619 18.3022C208.233 18.3022 205.886 20.7228 205.651 23.5686Z" fill="url(#paint9_linear_249_5468)" />
                                <path d="M84.947 43.1029C85.864 43.1029 86.366 43.8163 86.366 44.4692C86.366 45.1343 85.8702 45.8295 84.9222 45.8295H83.5218V47.3349H83.0323V43.1029H84.947ZM84.9098 45.3942C85.5294 45.3942 85.8888 44.9408 85.8888 44.4692C85.8888 43.9916 85.5109 43.5442 84.9346 43.5442H83.5218V45.3942H84.9098ZM91.9282 47.4135C91.0359 47.4135 90.3667 46.7303 90.3667 45.8235C90.3667 44.9166 91.0359 44.2455 91.9282 44.2455C92.4797 44.2455 92.9011 44.4874 93.1489 44.8622V44.3181H93.6261V47.3349H93.1489V46.7848C92.9011 47.1717 92.4797 47.4135 91.9282 47.4135ZM91.9964 46.9903C92.6346 46.9903 93.1613 46.4946 93.1613 45.8295C93.1613 45.1645 92.6346 44.6687 91.9964 44.6687C91.3148 44.6687 90.8377 45.1584 90.8377 45.8295C90.8377 46.4946 91.3148 46.9903 91.9964 46.9903ZM99.399 47.4135C98.6926 47.4135 98.1349 47.0024 97.98 46.5006L98.4262 46.3797C98.5377 46.7303 98.9219 47.0085 99.4114 47.0085C99.8762 47.0085 100.186 46.7787 100.186 46.5127C100.186 46.2769 100.05 46.1681 99.7336 46.0774L98.8537 45.8235C98.4696 45.7146 98.1349 45.5151 98.1349 45.0919C98.1349 44.6385 98.6245 44.2455 99.2689 44.2455C99.9319 44.2455 100.397 44.578 100.576 44.9952L100.143 45.1222C100.031 44.8622 99.715 44.6385 99.2627 44.6385C98.8475 44.6385 98.6059 44.8743 98.6059 45.0859C98.6059 45.2794 98.767 45.3761 99.021 45.4486L99.9009 45.7026C100.31 45.8235 100.657 46.0169 100.657 46.4885C100.657 47.0145 100.13 47.4135 99.399 47.4135ZM106.269 47.4135C105.562 47.4135 105.005 47.0024 104.85 46.5006L105.296 46.3797C105.407 46.7303 105.792 47.0085 106.281 47.0085C106.746 47.0085 107.056 46.7787 107.056 46.5127C107.056 46.2769 106.919 46.1681 106.603 46.0774L105.723 45.8235C105.339 45.7146 105.005 45.5151 105.005 45.0919C105.005 44.6385 105.494 44.2455 106.139 44.2455C106.802 44.2455 107.266 44.578 107.446 44.9952L107.012 45.1222C106.901 44.8622 106.585 44.6385 106.132 44.6385C105.717 44.6385 105.476 44.8743 105.476 45.0859C105.476 45.2794 105.637 45.3761 105.891 45.4486L106.771 45.7026C107.18 45.8235 107.527 46.0169 107.527 46.4885C107.527 47.0145 107 47.4135 106.269 47.4135ZM112.265 43.7558C112.079 43.7558 111.936 43.6168 111.936 43.4354C111.936 43.2661 112.079 43.127 112.265 43.127C112.451 43.127 112.593 43.2661 112.593 43.4354C112.593 43.6168 112.451 43.7558 112.265 43.7558ZM112.029 47.3349V44.3181H112.506V47.3349H112.029ZM118.608 47.4135C117.672 47.4135 116.972 46.7243 116.972 45.8235C116.972 44.9227 117.672 44.2455 118.608 44.2455C119.543 44.2455 120.237 44.9227 120.237 45.8235C120.237 46.7243 119.543 47.4135 118.608 47.4135ZM118.608 46.9843C119.271 46.9843 119.767 46.4885 119.767 45.8295C119.767 45.1705 119.271 44.6687 118.608 44.6687C117.939 44.6687 117.437 45.1705 117.437 45.8295C117.437 46.4885 117.939 46.9843 118.608 46.9843ZM126.302 44.2455C127.07 44.2455 127.541 44.7352 127.541 45.5635V47.3349H127.064V45.63C127.064 45.0436 126.76 44.6808 126.196 44.6808C125.577 44.6808 125.155 45.1403 125.155 45.8174V47.3349H124.678V44.3181H125.155V44.8501C125.372 44.5055 125.763 44.2455 126.302 44.2455ZM138.281 43.9311V44.3181H139.391V44.7413H138.281V47.3349H137.81V44.7413H137.16V44.3181H137.81V43.919C137.81 43.248 138.133 42.8429 138.783 42.8429C139.025 42.8429 139.223 42.8792 139.409 42.9699L139.285 43.3628C139.143 43.2903 139 43.2601 138.827 43.2601C138.461 43.2601 138.281 43.5019 138.281 43.9311ZM145.089 47.4135C144.153 47.4135 143.453 46.7243 143.453 45.8235C143.453 44.9227 144.153 44.2455 145.089 44.2455C146.025 44.2455 146.719 44.9227 146.719 45.8235C146.719 46.7243 146.025 47.4135 145.089 47.4135ZM145.089 46.9843C145.752 46.9843 146.248 46.4885 146.248 45.8295C146.248 45.1705 145.752 44.6687 145.089 44.6687C144.42 44.6687 143.918 45.1705 143.918 45.8295C143.918 46.4885 144.42 46.9843 145.089 46.9843ZM151.637 44.838C151.823 44.445 152.2 44.2092 152.746 44.2818V44.7171C152.077 44.6325 151.637 44.9771 151.637 45.9263V47.3349H151.159V44.3181H151.637V44.838ZM162.873 46.8936H165.277V47.3349H162.377V43.1029H162.873V46.8936ZM170.92 47.4135C169.972 47.4135 169.29 46.7908 169.29 45.8235C169.29 44.9347 169.922 44.2455 170.864 44.2455C171.849 44.2455 172.413 44.9166 172.413 45.757C172.413 45.8416 172.413 45.896 172.401 45.9746H169.761C169.804 46.5792 170.232 47.0024 170.92 47.0024C171.453 47.0024 171.793 46.7243 171.942 46.416L172.382 46.5429C172.178 46.9722 171.707 47.4135 170.92 47.4135ZM169.761 45.63L171.942 45.624C171.899 45.0617 171.515 44.6566 170.864 44.6566C170.238 44.6566 169.804 45.104 169.761 45.63ZM178.217 47.4135C177.325 47.4135 176.656 46.7303 176.656 45.8235C176.656 44.9166 177.325 44.2455 178.217 44.2455C178.769 44.2455 179.19 44.4874 179.438 44.8622V44.3181H179.915V47.3349H179.438V46.7848C179.19 47.1717 178.769 47.4135 178.217 47.4135ZM178.285 46.9903C178.923 46.9903 179.45 46.4946 179.45 45.8295C179.45 45.1645 178.923 44.6687 178.285 44.6687C177.604 44.6687 177.126 45.1584 177.126 45.8295C177.126 46.4946 177.604 46.9903 178.285 46.9903ZM185.031 44.838C185.217 44.445 185.595 44.2092 186.14 44.2818V44.7171C185.471 44.6325 185.031 44.9771 185.031 45.9263V47.3349H184.554V44.3181H185.031V44.838ZM192.08 44.2455C192.849 44.2455 193.32 44.7352 193.32 45.5635V47.3349H192.843V45.63C192.843 45.0436 192.539 44.6808 191.975 44.6808C191.355 44.6808 190.934 45.1403 190.934 45.8174V47.3349H190.457V44.3181H190.934V44.8501C191.151 44.5055 191.541 44.2455 192.08 44.2455ZM198.188 43.7558C198.002 43.7558 197.86 43.6168 197.86 43.4354C197.86 43.2661 198.002 43.127 198.188 43.127C198.374 43.127 198.516 43.2661 198.516 43.4354C198.516 43.6168 198.374 43.7558 198.188 43.7558ZM197.953 47.3349V44.3181H198.43V47.3349H197.953ZM204.717 44.2455C205.485 44.2455 205.956 44.7352 205.956 45.5635V47.3349H205.479V45.63C205.479 45.0436 205.175 44.6808 204.612 44.6808C203.992 44.6808 203.571 45.1403 203.571 45.8174V47.3349H203.093V44.3181H203.571V44.8501C203.787 44.5055 204.178 44.2455 204.717 44.2455ZM213.142 44.3181H213.613V47.2321C213.613 48.0665 212.993 48.6831 212.082 48.6831C211.351 48.6831 210.874 48.3446 210.614 47.8911L211.035 47.74C211.246 48.0846 211.587 48.2781 212.089 48.2781C212.752 48.2781 213.13 47.8186 213.142 47.2321V46.7183C212.894 47.075 212.467 47.2986 211.927 47.2986C211.023 47.2986 210.366 46.6336 210.366 45.7691C210.366 44.8864 211.023 44.2455 211.927 44.2455C212.467 44.2455 212.894 44.4632 213.142 44.8199V44.3181ZM211.996 46.8754C212.634 46.8754 213.148 46.4039 213.148 45.7751C213.148 45.1403 212.634 44.6687 211.996 44.6687C211.314 44.6687 210.837 45.1343 210.837 45.7751C210.837 46.4039 211.314 46.8754 211.996 46.8754Z" fill="#362CA3" />
                                <defs>
                                    <linearGradient id="paint0_linear_249_5468" x1="52.492" y1="25.8907" x2="35.285" y2="25.8907" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_249_5468" x1="8.87842" y1="15.6389" x2="-1.04904e-05" y2="15.6389" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_249_5468" x1="37.1569" y1="24.1462" x2="37.0532" y2="24.1462" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint3_linear_249_5468" x1="37.6207" y1="25.0576" x2="37.5834" y2="25.0576" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint4_linear_249_5468" x1="29.5735" y1="15.6389" x2="6.82471" y2="15.6389" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint5_linear_249_5468" x1="37.5838" y1="25.0847" x2="37.4703" y2="25.0847" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint6_linear_249_5468" x1="37.7919" y1="3.67789" x2="16.1613" y2="3.67789" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint7_linear_249_5468" x1="61.7803" y1="14.8086" x2="39.391" y2="14.8086" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint8_linear_249_5468" x1="63.871" y1="3.375" x2="33.3534" y2="3.375" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                    <linearGradient id="paint9_linear_249_5468" x1="78.0645" y1="8.91437" x2="220" y2="8.91437" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#2D388A" />
                                        <stop offset="1" stopColor="#00AEEF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                }
            </div>
        )
    }

    const customStylesCbo = {
        option: (base) => ({
            ...base,
            height: '100%',
            paddingLeft: '7px',
            paddingTop: '1px',
            paddingBottom: '1px',
            color: '#68809e',
            fontSize: '14px',
            marginBottom: '10px'
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';
            const fontSize = '14px'
            return { ...provided, opacity, transition, fontSize };
        },
        placeholder: () => ({
            fontSize: '14px',
            color: '#81a0c5'
        }),
        clearIndicator: () => ({
            color: '#3b47b7'
        }),
        dropdownIndicator: () => {
            return { color: '#3b47b7' }
        },
        menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
        menu: (provided) => ({ ...provided, zIndex: 9999 })
    }

    const validateXSS = (value) => {
        return !/<([^\s>]+)\s?[^>]>(.)(?:<\/\1)>/.test(value) // reconocer etiquetas xml, html, javascript modo <h4></h4>
            && !/<([^\s>]+)\s?[^>]*>/.test(value) //sola la parte inicial <h4>
            && !/<\/([^\s>]+)\s?[^>]*>/.test(value) //sola la parte final </h4>
    }

    const validateSql = (value) => {
        let val = value.toUpperCase()
        var respuesta = !/(DECLARE|GRANT|REVOKE|ROLLBACK|INSERT INTO|UPDATE|SELECT |WITH|DELETE|CREATE|ALTER|FUNCTION|EXEC|EXECUTE|TABLE |DROP|INNER JOIN|LEFT JOIN|LEFT OUTER JOIN|RIGHT JOIN|RIGHT OUTER JOIN|TRUNCATE|DATABASE|UNION ALL|GROUP BY|ORDER BY|WHERE|FROM|VIEW|SCHEMA|SYS)/.test(val);
        if (respuesta) {
            var posicion = val.indexOf("CHAR(")
            if (posicion >= 0) {
                return false
            }
        }
        return respuesta
    }

    const validateCharacters = (value) => {
        return !/(\*|\'|\")/g.test(value)
    }


    const handleError = function (error, showAlert = true) {
        let { response } = error
        let msj = ''

        let esListado = false;

        switch (response.status) {
            case 401:
                msj = response.data.apiMensaje ? response.data.apiMensaje : "No tiene permiso para esta acción"
                break;
            case 404:
                msj = response.data.apiMensaje
                break;
            case 422:
                var arreglo = Array();
                arreglo = response.data.apiMensaje.split(".");

                if (arreglo.length > 2) {
                    esListado = true;
                    let texto = "";
                    arreglo.forEach(function (elemento) {
                        if (elemento.length != 0) {
                            texto += '<li class="u-text--left">' + elemento + '.</li>';
                        }
                    });
                    const wrapper = document.createElement('ul');
                    wrapper.innerHTML = texto;

                    swal({
                        content: wrapper,
                        icon: "error"
                    })
                }
                else {
                    msj = response.data.apiMensaje;
                }
                break;
            case 500:
                msj = 'Comuníquese con soporte técnico'
                break;
            default:
                msj = 'Error desconocido, intente luego'
                break;
        }

        if (showAlert) {

            if (!esListado) {
                swal({
                    title: msj,
                    icon: "error"
                })
            }
        }
        return msj
    }

    const ErrorNotExistPage = () => {
        return (
            <div className="o-container o-container--1110 o-container--main s-field--error">
            </div>
        )
    }

    // Config a instance of  A X I O S
    window.AXIOS = axios.create()
    const AXIOS_CONFIG = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }

    window.AXIOS.interceptors.request.use(function (AXIOS_CONFIG) {
        AXIOS_CONFIG.headers['X-CSRF-TOKEN-HEADERNAME'] = document.querySelector('input[name="AntiforgeryFieldname"]').value
        // if (!$('.select2-container--open').get(0)) window.ModalLoading.open()
        return AXIOS_CONFIG
    }, function (error) {
        return Promise.reject(error)
    });

    AXIOS.interceptors.response.use(function (response) {
        // window.ModalLoading.close()
        return response
    }, function (error) {
        // window.ModalLoading.close()
        return Promise.reject(error)
    });


    // colocar como global
    window.Global = {
        customStylesCbo,
        validateXSS,
        validateSql,
        validateCharacters,
        handleError,
        COPagination,
        AppContext,
        CNotification,
        CLoader,
        CustomToggle,
        Icon,
        CLogo,
        CAvatar,
        CDropDownSession,
        Header,
        CMenu,
        CSwitch,
        Footer,
        AppProvider,
        CInput,
        CAutoComplete,
        CInputFile,
        CTextArea,
        CSelect,
        CButton,
        // ExpandButtom,
        CBreadcrumbs,
        CCheckBox,
        CPagination,
        CPaginationCustom,
        Parrafo,
        generateId,
        parseURLParams,
        localSt,
        ErrorNotExistPage
    }
})()
