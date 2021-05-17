$(function () {
    $("#designer").boldReportViewer({
        // serviceUrl: '/demos/services/api/ReportDesignerWebApi',
        serviceUrl: "https://demos.boldreports.com/services/api/ReportingAPI",
        reportServiceUrl: "https://demos.boldreports.com/services/api/ReportViewer",
        reportPath: '~/Resources/docs/sales-order-detail.rdl'

    });
});