import React, { useEffect } from "react";
import * as echarts from "echarts";

export default function (props) {
  const ref = React.createRef();
  useEffect(() => {
    const echart = echarts.init(ref.current);
    const options = {
      tooltip: {
        show: true,
        trigger: "axis",
      },
      grid: {
        left: 10,
        bottom: 10,
        top: 40,
        containLabel: true,
      },
      yAxis: [{ name: "trade volume" }, { name: "Total turnover" }],
      xAxis: {
        type: "category", //类型为类目
      },
      series: [
        {
          name: "成交量",
          type: "line", //折线图
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: "#73c0de",
          },
        },
        {
          name: "成交额",
          type: "line", //折线图
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: "red",
          },
          yAxisIndex: 1,
          datasetIndex: 1,
        },
      ],
    };
    echart.setOption(options);
    //    监听一下浏览器窗口大小的变化，从而改变图表的大小
    window.addEventListener("resize", () => {
      echart.resize();
    });
    Promise.all([
      global.service.get("/api/overview/salestrend", { type: 1 }),
      global.service.get("/api/overview/salestrend", { type: 2 }),
    ]).then((data = []) => {
      echart.setOption({
        dataset: [
          {
            source: data[0].records,
          },
          {
            source: data[1].records,
          },
        ],
      });
    });
  }, []);
  return <div ref={ref} style={{ height: "100%" }}></div>;
}
