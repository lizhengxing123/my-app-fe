import { SquareChartGantt, ChartColumn, ChartLine, Diamond, Columns3 } from "lucide-react";

export const chartMenus = {
  基础图表: [
    {
      title: "基础图表配置",
      herf: "/chart/base-option",
      icon: SquareChartGantt,
    },
    {
      title: "柱状图",
      herf: "/chart/column",
      icon: ChartColumn,
      items: [
        {
          title: "柱状图+点状折线图",
          herf: "/chart/column/1",
        },
        {
          title: "柱状图+纵向横坐标",
          herf: "/chart/column/2",
        },
        {
          title: "横向柱状图",
          herf: "/chart/column/3",
        },
        {
          title: "横向堆叠柱状图",
          herf: "/chart/column/4",
        },
        {
          title: "表格坐标轴柱状图",
          herf: "/chart/column/5",
        },
        {
          title: "换行表格坐标轴柱状图",
          herf: "/chart/column/6",
        },
        {
          title: "分组坐标轴柱状图",
          herf: "/chart/column/7",
        },
      ],
    },
    {
      title: "折线图",
      herf: "/chart/line",
      icon: ChartLine,
      items: [
        {
          title: "堆叠折线图",
          herf: "/chart/line/1",
        },
      ],
    },
  ],
};

export const chartMenuIconMap = {
  "SquareChartGantt": SquareChartGantt,
  "ChartColumn": ChartColumn,
  "ChartLine": ChartLine,
  "Columns3": Columns3
}
