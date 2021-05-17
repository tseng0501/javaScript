$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: countries,
        columnAutoWidth: true,
        allowColumnReordering: true,
        showBorders: true,
        columnChooser: {
            enabled: true
        },
        editing: {
            mode: "popup",
            allowUpdating: true,
            popup: {
                title: "Employee Info",
                showTitle: true,
                width: 800,
                height: 525,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }
            },
            // form: {
            //     items: [{
            //         itemType: "group",
            //         colCount: 2,
            //         colSpan: 2,
            //         items: ["FirstName", "LastName", "Prefix", "BirthDate", "Position", "HireDate", {
            //             dataField: "Notes",
            //             colSpan: 2,
            //             editorOptions: {
            //                 height: 100
            //             }
            //         }]
            //     }, {
            //         itemType: "group",
            //         colCount: 2,
            //         colSpan: 2,
            //         caption: "Home Address",
            //         items: ["StateID", "Address"]
            //     }]
            // }
        },
        columns: [ 
        {
            dataField: "Unit",
            caption: "點位",
            width: 100
        },
       {
            caption: "流速",
            columns: [{
                caption: "異常-低",
                dataField: "FlowRate_LL",
            }, {
                caption: "警告-低",
                dataField: "FlowRate_L",
            },{
                caption: "警告-高",
                dataField: "FlowRate_H",
            }, {
                caption: "異常-高",
                dataField: "FlowRate_HH",
                // format: "percent"
            }
        ]
        }, {
            caption: "溫度",
            columns: [{
                caption: "異常-低",
                dataField: "Temperature_LL",
            }, {
                caption: "警告-低",
                dataField: "Temperature_L",
            },{
                caption: "警告-高",
                dataField: "Temperature_H",
            }, {
                caption: "異常-高",
                dataField: "Temperature_HH",
            }
        ]
        }, {
            caption: "熱負荷",
            columns: [{
                caption: "異常-低",
                dataField: "HeatLoad_LL",
            }, {
                caption: "警告-低",
                dataField: "HeatLoad_L",
            },{
                caption: "警告-高",
                dataField: "HeatLoad_H",
            }, {
                caption: "異常-高",
                dataField: "HeatLoad_HH",
            }
        ]
        }, {
            caption: "天然氣",
            columns: [{
                caption: "異常-低",
                dataField: "NaturalGas_LL",
            }, {
                caption: "警告-低",
                dataField: "NaturalGas_L",
            },{
                caption: "警告-高",
                dataField: "NaturalGas_H",
            }, {
                caption: "異常-高",
                dataField: "NaturalGas_HH",
            }
        ]
        }, {
            caption: "流量",
            columns: [{
                caption: "異常-低",
                dataField: "Flow_LL",
            }, {
                caption: "警告-低",
                dataField: "Flow_L",
            },{
                caption: "警告-高",
                dataField: "Flow_H",
            }, {
                caption: "異常-高",
                dataField: "Flow_HH",
            }
        ]
        }, {
            caption: "電壓",
            columns: [{
                caption: "異常-低",
                dataField: "Voltage_LL",
            }, {
                caption: "警告-低",
                dataField: "Voltage_L",
            },{
                caption: "警告-高",
                dataField: "Voltage_H",
            }, {
                caption: "異常-高",
                dataField: "Voltage_HH",
            }
        ]
        }
    ]
    });
});

var countries = [{
    "ID": 1,
    "Unit": "G0",
    "FlowRate_LL": 0.85,
    "FlowRate_L": 0.15,
    "FlowRate_H": 20580,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.054,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 2,
    "Unit": "G1",
    "FlowRate_LL": 0.54,
    "FlowRate_L": 0.46,
    "FlowRate_H": 130,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.091,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 3,
    "Unit": "G2",
    "FlowRate_LL": 0.79,
    "FlowRate_L": 0.21,
    "FlowRate_H": 600,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.019,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 4,
    "Unit": "G3",
    "FlowRate_LL": 0.75,
    "FlowRate_L": 0.25,
    "FlowRate_H": 81,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.008,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 5,
    "Unit": "G4",
    "FlowRate_LL": 0.32,
    "FlowRate_L": 0.68,
    "FlowRate_H": 120,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.174,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 6,
    "Unit": "G5",
    "FlowRate_LL": 0.69,
    "FlowRate_L": 0.31,
    "FlowRate_H": 61,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.02,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 7,
    "Unit": "G6",
    "FlowRate_LL": 0.93,
    "FlowRate_L": 0.07,
    "FlowRate_H": 120,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.012,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 8,
    "Unit": "G7",
    "FlowRate_LL": 0.74,
    "FlowRate_L": 0.26,
    "FlowRate_H": 110,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.039,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 9,
    "Unit": "G8",
    "FlowRate_LL": 0.81,
    "FlowRate_L": 0.19,
    "FlowRate_H": 30,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.0112,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}, {
    "ID": 10,
    "Unit": "G9",
    "FlowRate_LL": 0.82,
    "FlowRate_L": 0.18,
    "FlowRate_H": 650,
    "FlowRate_HH":6556,
    "Temperature_LL":456,
    "Temperature_L":88,
    "Temperature_H":5452,
    "Temperature_HH": 0.007,
    "HeatLoad_LL":548,
    "HeatLoad_L":878,
    "HeatLoad_H":54,
    "HeatLoad_HH":5748,
    "NaturalGas_LL":78,
    "NaturalGas_L":87,
    "NaturalGas_H":722,
    "NaturalGas_HH":99,
    "Flow_LL":100,
    "Flow_L":120,
    "Flow_H":150,
    "Flow_HH":100,
    "Voltage_LL":120,
    "Voltage_L":110,
    "Voltage_H":100,
    "Voltage_HH":200
}];