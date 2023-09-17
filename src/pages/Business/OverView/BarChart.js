import React, { useEffect } from "react";
import * as echarts from 'echarts'

export default function (props) {
    const ref = React.createRef()
    useEffect(() => {
        const echart = echarts.init(ref.current)
        const options = {
            tooltip: {
                show: true,
            },
            grid: {
                left: 10,
                bottom: 10,
                top: 10,
                containLabel: true
            },
            yAxis: {

            },
            xAxis: {
                type: 'category',//类型为类目
            },
            series: [
                {
                    name: "销售额",
                    type: 'bar',//
                    itemStyle: {
                        color: '#73c0de'
                    },
                    
                }
            ]
        }
        echart.setOption(options)
        //    监听一下浏览器窗口大小的变化，从而改变图表的大小
        window.addEventListener('resize', () => {
            echart.resize()
        })

        global.service.get('/api/overview/volumetop10').then(data => {
            echart.setOption({
                dataset: { source: data.records }
            })
        })

    }, [])
    return <div ref={ref} style={{ height: '100%' }}></div>
}