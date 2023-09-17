import React, { useEffect } from "react";
import * as echarts from "echarts";
import "echarts-wordcloud";

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
          type: "wordCloud", //词云图
          sizeRange: [12, 40],
          gridSize: 20,
          textStyle: {
            fontWeight: "bold",
            fontFamily: "sans-serif",
            color: function () {
              return `rgb(${[
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(",")})`;
            },
          },
          data: [],
        },
      ],
    };
    echart.setOption(options);
    //    监听一下浏览器窗口大小的变化，从而改变图表的大小
    window.addEventListener("resize", () => {
      echart.resize();
    });

    global.service.get("/api/overview/trending").then((data) => {
      echart.setOption({
        series: [{ data: data.records }],
      });
    });
  }, []);
  return <div ref={ref} style={{ height: "100%" }}></div>;
}
