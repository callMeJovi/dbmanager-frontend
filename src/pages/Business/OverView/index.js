import React, { useState, useEffect } from "react";
import { Panel } from "../../../components";
import { Row, Col, Card } from "antd";
import {
  MoneyCollectOutlined,
  FileDoneOutlined,
  FundViewOutlined,
  StarOutlined,
} from "@ant-design/icons";
import "./style/index.css";
import { numToThousand } from "../../../utils";
import PieChart from "./PieChart";
import MapChart from "./MapChart";
import TopChart from "./TopChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import WordCloudChart from "./WordCloudChart";

export default function (props) {
  const [statistic, setStatistic] = useState({});
  useEffect(() => {
    global.service.get("/api/overview/statistic").then((data) => {
      setStatistic(data.record);
    });
  }, []);
  return (
    <Panel title="Company Overview">
      <div className="m-overview">
        <Row gutter={10}>
          <Col span={6}>
            <Card>
              <div className="header">
                <div className="content">
                  <span>Total sales (Yuan)</span>
                  <span>{numToThousand(statistic.totalTurnover)}</span>
                </div>
                <div className="icon">
                  <MoneyCollectOutlined />
                </div>
              </div>
              <div className="footer">
                Year-over-year Growth:{statistic.turnoverGrowth}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="header">
                <div className="content">
                  <span>Total sales volume (item)</span>
                  <span>{numToThousand(statistic.totalQuantity)}</span>
                </div>
                <div
                  className="icon"
                  style={{ background: "rgba(110, 169, 191, 0.68)" }}
                >
                  <FileDoneOutlined />
                </div>
              </div>
              <div className="footer">
                Year-over-year Growth: {statistic.quantityGrowth}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="header">
                <div className="content">
                  <span>Total visits (times)</span>
                  <span>{numToThousand(statistic.totalVisited)}</span>
                </div>
                <div
                  className="icon"
                  style={{ background: "rgba(179, 165, 99, 0.68)" }}
                >
                  <FundViewOutlined />
                </div>
              </div>
              <div className="footer">
                Year-over-year Growth:{statistic.visitedGrowth}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="header">
                <div className="content">
                  <span>Total saves (item)</span>
                  <span>{numToThousand(statistic.totalStats)}</span>
                </div>
                <div
                  className="icon"
                  style={{ background: "rgba(88, 96, 154, 0.68)" }}
                >
                  <StarOutlined />
                </div>
              </div>
              <div className="footer">
                Year-over-year Growth: {statistic.statsGrowth}
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={10} style={{ marginTop: 10 }}>
          <Col span={7}>
            <Card className="chart-card" title="Category Sales Distribution">
              <PieChart />
            </Card>
          </Col>
          <Col span={10}>
            <Card
              className="chart-card"
              title="Nationwide Sales Revenue Distribution"
            >
              <MapChart />
            </Card>
          </Col>
          <Col span={7}>
            <Card className="chart-card" title="Sales volume ranking TOP 10">
              <TopChart />
            </Card>
          </Col>
        </Row>
        <Row gutter={10} style={{ marginTop: 10 }}>
          <Col span={7}>
            <Card className="chart-card" title="Sales revenue ranking TOP 10">
              <BarChart />
            </Card>
          </Col>
          <Col span={10}>
            <Card className="chart-card" title="Sales growth">
              <LineChart />
            </Card>
          </Col>
          <Col span={7}>
            <Card className="chart-card" title="Bestsellers">
              <WordCloudChart />
            </Card>
          </Col>
        </Row>
      </div>
    </Panel>
  );
}
