'use client';

import { useEffect } from 'react';

export default function DashboardCharts() {
  useEffect(() => {
    const initCharts = () => {
      if (typeof window === 'undefined' || typeof window.ApexCharts === 'undefined') return;

      // ------- Total Revenue Chart -------
      const totalRevenueEl = document.querySelector('#totalRevenueChart');
      if (totalRevenueEl && !totalRevenueEl._chartInstance) {
        const c = new window.ApexCharts(totalRevenueEl, {
          series: [
            { name: `${new Date().getFullYear() - 1}`, data: [18, 7, 15, 29, 18, 12, 9] },
            { name: `${new Date().getFullYear() - 2}`, data: [9, 14, 12, 20, 8, 5, 7] },
          ],
          chart: { height: 300, type: 'bar', toolbar: { show: false } },
          plotOptions: { bar: { horizontal: false, columnWidth: '33%', borderRadius: 4 } },
          dataLabels: { enabled: false },
          stroke: { show: true, width: 2, colors: ['transparent'] },
          colors: ['#696cff', '#03c3ec'],
          xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
          yaxis: { labels: { formatter: (val) => `$${val}k` } },
          legend: { show: false },
          fill: { opacity: 1 },
          tooltip: { y: { formatter: (val) => `$${val}k` } },
          grid: { borderColor: '#f0f0f0' },
        });
        c.render();
        totalRevenueEl._chartInstance = c;
      }

      // ------- Growth (donut) Chart -------
      const growthEl = document.querySelector('#growthChart');
      if (growthEl && !growthEl._chartInstance) {
        const c = new window.ApexCharts(growthEl, {
          series: [78, 22],
          labels: ['Returning', 'New'],
          chart: { height: 160, type: 'donut' },
          colors: ['#696cff', '#e7e7ff'],
          stroke: { width: 5, colors: ['#fff'] },
          dataLabels: { enabled: false },
          legend: { show: false },
          grid: { padding: { top: 0, bottom: 0, right: 15 } },
          plotOptions: {
            pie: {
              donut: {
                size: '75%',
                labels: {
                  show: true,
                  value: { fontSize: '1.5rem', fontWeight: 600, color: '#000', offsetY: 15, formatter: (val) => `${val}%` },
                  total: { show: true, fontSize: '0.8125rem', label: 'Weekly\nSales', color: '#999', formatter: () => '62%' },
                },
              },
            },
          },
        });
        c.render();
        growthEl._chartInstance = c;
      }

      // ------- Order Statistics (donut) Chart -------
      const orderStatsEl = document.querySelector('#orderStatisticsChart');
      if (orderStatsEl && !orderStatsEl._chartInstance) {
        const c = new window.ApexCharts(orderStatsEl, {
          series: [70, 52, 60, 35],
          labels: ['Electronic', 'Fashion', 'Decor', 'Sports'],
          chart: { height: 165, type: 'donut' },
          colors: ['#696cff', '#71dd37', '#03c3ec', '#8592a3'],
          stroke: { width: 5, colors: ['#fff'] },
          dataLabels: { enabled: false },
          legend: { show: false },
          grid: { padding: { top: -3, bottom: -3 } },
          plotOptions: { pie: { donut: { size: '75%' } } },
        });
        c.render();
        orderStatsEl._chartInstance = c;
      }

      // ------- Income Chart -------
      const incomeEl = document.querySelector('#incomeChart');
      if (incomeEl && !incomeEl._chartInstance) {
        const c = new window.ApexCharts(incomeEl, {
          series: [{ data: [24, 21, 30, 22, 42, 26, 35, 29] }],
          chart: { height: 215, type: 'area', toolbar: { show: false } },
          dataLabels: { enabled: false },
          stroke: { width: 2, curve: 'smooth' },
          colors: ['#696cff'],
          fill: { type: 'gradient', gradient: { shadeIntensity: 0.6, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 95, 100] } },
          xaxis: { categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false } },
          yaxis: { labels: { show: false } },
          grid: { show: false, padding: { top: 0, bottom: 0 } },
          tooltip: { x: { show: false } },
        });
        c.render();
        incomeEl._chartInstance = c;
      }

      // ------- Profile Report (bar) Chart -------
      const profileReportEl = document.querySelector('#profileReportChart');
      if (profileReportEl && !profileReportEl._chartInstance) {
        const c = new window.ApexCharts(profileReportEl, {
          series: [{ data: [54, 66, 48, 60, 42, 60, 36, 52] }],
          chart: { height: 100, type: 'bar', toolbar: { show: false } },
          colors: ['#696cff'],
          plotOptions: { bar: { barHeight: '75%', columnWidth: '60%', borderRadius: 4, horizontal: false } },
          dataLabels: { enabled: false },
          xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
          yaxis: { labels: { show: false } },
          grid: { show: false, padding: { top: 0, bottom: 0, left: -10, right: -10 } },
          tooltip: { y: { formatter: (val) => `$${val}k` } },
        });
        c.render();
        profileReportEl._chartInstance = c;
      }

      // ------- Expenses of Week (radialBar) -------
      const expensesEl = document.querySelector('#expensesOfWeek');
      if (expensesEl && !expensesEl._chartInstance) {
        const c = new window.ApexCharts(expensesEl, {
          series: [65],
          chart: { height: 55, type: 'radialBar' },
          colors: ['#696cff'],
          plotOptions: {
            radialBar: {
              startAngle: -90, endAngle: 90,
              hollow: { size: '50%' },
              track: { background: '#e7e7ff' },
              dataLabels: { show: false },
            },
          },
          grid: { show: false, padding: { top: -15, bottom: -30, left: -10, right: -10 } },
          stroke: { lineCap: 'round' },
        });
        c.render();
        expensesEl._chartInstance = c;
      }
    };

    // Try immediately then retry after scripts load
    initCharts();
    const timer = setTimeout(initCharts, 2000);
    return () => clearTimeout(timer);
  }, []); // empty deps – run only once on mount

  return null; // renders nothing, just initializes charts
}
