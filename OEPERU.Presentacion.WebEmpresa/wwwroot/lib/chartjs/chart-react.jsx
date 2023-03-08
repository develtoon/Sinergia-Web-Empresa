(function () {
    CChart = {}
    const { useEffect, useRef, forwardRef }= React
    const { LineController, BarController, RadarController, DoughnutController, PolarAreaController, BubbleController, PieController, ScatterController } = Chart

    const defaultDatasetIdKey = 'label';

    function reforwardRef(ref, value) {
        if (typeof ref === 'function') {
            ref(value);
        } else if (ref) {
            ref.current = value;
        }
    }
    function setOptions(chart, nextOptions) {
        chart.options = { ...nextOptions };
    }
    function setLabels( currentData, nextLabels) {
        currentData.labels = nextLabels;
    }
    function setDatasets(currentData, nextDatasets, datasetIdKey = defaultDatasetIdKey) {
        const addedDatasets = [];
        currentData.datasets = nextDatasets.map(nextDataset => {
            // given the new set, find it's current match
            const currentDataset = currentData.datasets.find(
                dataset => dataset[datasetIdKey] === nextDataset[datasetIdKey]
            );

            // There is no original to update, so simply add new one
            if (
            !currentDataset ||
            !nextDataset.data ||
            addedDatasets.includes(currentDataset)
            ) {
            return { ...nextDataset };
            }

        addedDatasets.push(currentDataset);

        Object.assign(currentDataset, nextDataset);

        return currentDataset;
    });
    }
    function cloneData(data, datasetIdKey = defaultDatasetIdKey) {
        const nextData = {
            labels: [],
            datasets: [],
        };

        setLabels(nextData, data.labels);
        setDatasets(nextData, data.datasets, datasetIdKey);
        return nextData;
    }
    function getDatasetAtEvent(chart, event) {
        return chart.getElementsAtEventForMode(
            event.nativeEvent,
            'dataset',
            { intersect: true },
            false
        );
    }
    function getElementAtEvent(chart, event) {
        return chart.getElementsAtEventForMode(
            event.nativeEvent,
            'nearest',
            { intersect: true },
            false
        );
    }
    function getElementsAtEvent(chart, event) {
        return chart.getElementsAtEventForMode(
            event.nativeEvent,
            'index',
            { intersect: true },
            false
        );
    }

    function ChartComponent({
        height = 150,
        width = 300,
        redraw = false,
        datasetIdKey,
        type,
        data,
        options,
        plugins = [],
        fallbackContent,
        ...props
    },ref) {
        const canvasRef = useRef(null);
        const chartRef = useRef();

        const renderChart = () => {
            if (!canvasRef.current) return;
            chartRef.current = new Chart(canvasRef.current, {
                type,
                data: cloneData(data, datasetIdKey),
                options,
                plugins,
            });

            reforwardRef(ref, chartRef.current);
        };

        const destroyChart = () => {
            reforwardRef(ref, null);

            if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
            }
        };

        useEffect(() => {
            if (!redraw && chartRef.current && options) {
            setOptions(chartRef.current, options);
            }
        }, [redraw, options]);

        useEffect(() => {
            if (!redraw && chartRef.current) {
            setLabels(chartRef.current.config.data, data.labels);
            }
        }, [redraw, data.labels]);

        useEffect(() => {
            if (!redraw && chartRef.current && data.datasets) {
            setDatasets(chartRef.current.config.data, data.datasets, datasetIdKey);
            }
        }, [redraw, data.datasets]);

        useEffect(() => {
            if (!chartRef.current) return;

            if (redraw) {
            destroyChart();
            setTimeout(renderChart);
            } else {
            chartRef.current.update();
            }
        }, [redraw, options, data.labels, data.datasets]);

        useEffect(() => {
            renderChart();

            return () => destroyChart();
        }, []);

        return (
            <canvas ref={canvasRef} role='img' height={height} width={width} {...props}>
            {fallbackContent}
            </canvas>
        );
    }

    const CompChart = forwardRef(ChartComponent)

    function createTypedChart (
        type,
        registerables
    ) {
        Chart.register(registerables);

        return forwardRef(
            (props, ref) => <CompChart {...props} ref={ref} type={type} />
        )
    }

    window.CChart = {
        Line: createTypedChart('line', LineController),
        Bar: createTypedChart('bar', BarController),
        Radar: createTypedChart('radar', RadarController),
        Doughnut: createTypedChart('doughnut', DoughnutController),
        PolarArea: createTypedChart('polarArea', PolarAreaController),
        Bubble: createTypedChart('bubble', BubbleController),
        Pie: createTypedChart('pie', PieController),
        Scatter: createTypedChart('scatter', ScatterController)
    }
})()
