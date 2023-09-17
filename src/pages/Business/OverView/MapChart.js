import React, { useEffect } from "react";
import * as echarts from 'echarts'
import chinaJson from '../../../assets/geoJson/china.json'

export default function (props) {
    const ref = React.createRef()
    useEffect(() => {
        echarts.registerMap('china', chinaJson)//注册中国地图
        const echart = echarts.init(ref.current)
        const options = {
            // 视觉映射
            visualMap:{
                show:false,
                dimension:'value',
                min:1000,
                max:10000,
                inRange: {
                    color: ['#ffd768', '#7f1100'],
                    symbolSize: [8, 16]
                },
                outOfRange: {
                    color: 'red'
                }
            },
            // 地理坐标系
            geo:{
                show:true,
                map:'china',
                zoom:1.6,
                top:100,
                itemStyle:{
                    areaColor:'#84bada',
                    borderColor:'#fff',
                    borderWidth:0.5
                },
                emphasis:{
                    itemStyle:{
                        areaColor:'#84bada',
                        opacity:0.6
                    },
                }

            },
            tooltip: {
                show: true,
            },
            series: [
                {
                    type: 'scatter',//饼图
                    coordinateSystem: 'geo',
                   encode:{
                    //    数据到视觉的一个映射
                    lng:'lng',
                    lat:'lat',
                    tooltip:['name','value']
                   }
                   
                }
            ]
        }
        echart.setOption(options)
        //    监听一下浏览器窗口大小的变化，从而改变图表的大小
        window.addEventListener('resize', () => {
            echart.resize()
        })

        global.service.get('/api/overview/mapsales').then(data => {
            echart.setOption({
                dataset: {
                    // 定义维度
                    dimensions:['name','lng','lat','value'],
                    source:data.records
                }
            })
        })

    }, [])
    return <div ref={ref} style={{ height: '100%' }}></div>
}