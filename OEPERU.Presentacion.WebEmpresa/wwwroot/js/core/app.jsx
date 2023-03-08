(function () {
    const viewNode = document.getElementById('view');
    if (Global.View) {
        ReactDOM.render(
            <Global.AppProvider view={Global.ViewLang}>
                <Global.Header />
                <Global.CMenu />
                <Global.View />
            </Global.AppProvider>,
            viewNode
        );
    } else {
        const ErrorView = () => {
            return (
                <div className="flex align-center justify-center" style={{ minHeight: '100vh' }}>
                    Vista no encontrada
                </div>
            )
        }
        ReactDOM.render(<ErrorView />, viewNode)
    }
})()
