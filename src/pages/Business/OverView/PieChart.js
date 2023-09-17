import React, { useEffect } from "react";
import * as echarts from "echarts";

export default function (props) {
  const ref = React.createRef();
  useEffect(() => {
    const echart = echarts.init(ref.current);
    const options = {
      tooltip: {
        show: true,
      },
      series: [
        {
          type: "pie", //饼图
          radius: "50%",
          label: {
            formatter: "{b}:{d}%", //b:数据名，d：数据值
          },
          data: [
            { name: "Book", value: 100 },
            { name: "Digital", value: 200 },
          ],
        },
      ],
    };
    echart.setOption(options);
    //    监听一下浏览器窗口大小的变化，从而改变图表的大小
    window.addEventListener("resize", () => {
      echart.resize();
    });

    global.service.get("/api/overview/producttypesales").then((data) => {
      echart.setOption({
        series: [{ data: data.records }],
      });
    });
  }, []);
  return <div ref={ref} style={{ height: "100%" }}></div>;
}
