"use client";
import React from "react";
import { Chart } from "chart.js/auto";
import DefaultLayout from "@/layout/DefaultLayout";
import { handleCountBooks, handleCountUsers } from "@/api/handleApi";

export default function Home() {
  const [countUser, setCountUser] = React.useState(0);
  const [countBook, setCountBook] = React.useState(0);
  const [countOrder, setCountOrder] = React.useState(0);
  React.useEffect(() => {
    const requestFigures = async () => {
      const usersFigure = await handleCountUsers();
      const booksFigure = await handleCountBooks();
      if (usersFigure !== undefined && !usersFigure.errors)
        setCountUser(usersFigure);
      if (booksFigure !== undefined && !booksFigure.errors)
        setCountBook(booksFigure);
    };
    requestFigures();
  }, []);

  React.useEffect(() => {
    const canvas = document.getElementById("chart-user") as HTMLCanvasElement;
    if (canvas !== undefined) {
      const myChart = new Chart(canvas, {
        type: "doughnut",
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              beginAtZero: true,
            },
          },
        },
        data: {
          labels: ["registers"],
          datasets: [
            {
              label: "total registers",
              backgroundColor: "#7ace4c",
              data: [countUser > 0 ? countUser : 1],
            },
          ],
        },
      });
      return () => {
        myChart.destroy();
      };
    }
  }, [countUser]);

  React.useEffect(() => {
    const canvas = document.getElementById("chart-book") as HTMLCanvasElement;
    if (canvas !== undefined) {
      const myChart = new Chart(canvas, {
        type: "doughnut",
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              beginAtZero: true,
            },
          },
        },
        data: {
          labels: ["books"],
          datasets: [
            {
              label: "total books",
              backgroundColor: "#7460ee",
              data: [countBook > 0 ? countBook : 1],
            },
          ],
        },
      });
      return () => {
        myChart.destroy();
      };
    }
  }, [countBook]);

  React.useEffect(() => {
    const canvas = document.getElementById("chart-order") as HTMLCanvasElement;
    if (canvas !== undefined) {
      const myChart = new Chart(canvas, {
        type: "doughnut",
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              beginAtZero: true,
            },
          },
        },
        data: {
          labels: ["orders"],
          datasets: [
            {
              label: "total orders",
              backgroundColor: "#11a0f8",
              data: [countOrder > 0 ? countOrder : 1],
            },
          ],
        },
      });
      return () => {
        myChart.destroy();
      };
    }
  }, [countOrder]);

  React.useEffect(() => {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];
    const canvas = document.getElementById("chart-income") as HTMLCanvasElement;
    if (canvas !== undefined) {
      const myChart = new Chart(canvas, {
        type: "bar",
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: true,
            },
            y: {
              display: true,
              beginAtZero: true,
            },
          },
        },
        data: {
          labels: data.map((row) => row.year),
          datasets: [
            {
              label: "Income",
              backgroundColor: "#e3563d",
              data: data.map((row) => row.count),
            },
          ],
        },
      });
      return () => {
        myChart.destroy();
      };
    }
  }, []);

  return (
    <DefaultLayout>
      <div className="card card-table">
        <div className="flex w-full">
          <div className="card-chart_wrapper medium">
            <div className="card-chart_title">Total Registers</div>
            <div className="flex justify-between items-center">
              <canvas className="card-chart" id="chart-user"></canvas>
              <div className="card-chart_figure text-[#7ace4c]">
                {countUser > 0 ? `${countUser} users` : `1 register`}
              </div>
            </div>
          </div>
          <div className="card-chart_wrapper medium">
            <div className="card-chart_title">Total Books</div>
            <div className="flex justify-between items-center">
              <canvas className="card-chart" id="chart-book"></canvas>
              <div className="card-chart_figure text-[#7460ee]">
                {countBook > 0 ? `${countBook} books` : `1 book`}
              </div>
            </div>
          </div>
          <div className="card-chart_wrapper medium">
            <div className="card-chart_title">Total Orders</div>
            <div className="flex justify-between items-center">
              <canvas className="card-chart" id="chart-order"></canvas>
              <div className="card-chart_figure text-[#11a0f8]">
                {countOrder > 0 ? `${countOrder} orders` : `1 order`}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div className="card-chart_wrapper large">
            <div className="card-chart_title">Total Income</div>
            <div className="flex justify-between items-center">
              <canvas className="card-chart large" id="chart-income"></canvas>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
