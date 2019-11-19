
EMS.CreateNameSpace("EMS.RolePrivage");

//电力处
EMS.RolePrivage.getElecRolePrivage=function () {
    return [
        {
            "text": "能源资源",
            "children": [
                {
                    "id": "node_1",
                    "text": "水资源",
                    "state": "closed",
                    "children": [
                        {
                            "id": "node_1_1",
                            "text": "流域蕴含量专题图",
                            "pid": "node_1",
                            "children": []
                        }, {
                            "id": "node_1_2",
                            "text": "区划蕴含量专题图",
                            "pid": "node_1",
                            "children": []
                        }
                    ]
                }, {
                    "id": "node_2",
                    "text": "风资源",
                    "state": "closed",
                    "children": [
                        {
                            "id": "node_2_1",
                            "text": "风速分布专题图",
                            "pid": "node_2",
                            "children": []
                        }, {
                            "id": "node_2_2",
                            "text": "风功率密度专题图",
                            "pid": "node_2",
                            "children": []
                        }
                    ]
                }, {
                    "id": "node_3",
                    "text": "太阳能资源",
                    "state": "closed",
                    "children": [
                        {
                            "id": "node_3_1",
                            "text": "年均总辐射分布专题图",
                            "pid": "node_3",
                            "children": []
                        }, {
                            "id": "node_3_2",
                            "text": "太阳能资源分区专题图",
                            "pid": "node_3",
                            "children": []
                        }
                    ]
                }
            ]
        }, {
            "text": "能源项目",
            "children": [
                {
                    "id": "node_7",
                    "text": "电站项目",
                    "children": [
                        {
                            "id": "node_7_1",
                            "text": "火电站",
                            "state": "closed",
                            "pid": "node_11",
                            "children": [
                                {
                                    "id": "node_7_1_1",
                                    "text": "燃煤电站分布",
                                    "pid": "node_7_1",
                                    "children": []
                                }, {
                                    "id": "node_7_1_2",
                                    "text": "燃气电站分布",
                                    "pid": "node_7_1",
                                    "children": []
                                }
                            ]
                        }, {
                            "id": "node_7_2",
                            "text": "水电站",
                            "state": "closed",
                            "pid": "node_7",
                            "children": [
                                {
                                    "id": "node_7_2_1",
                                    "text": "水电站热度图",
                                    "pid": "node_7_2",
                                    "children": []
                                }, {
                                    "id": "node_7_2_2",
                                    "text": "水电站分布",
                                    "pid": "node_7_2",
                                    "children": []
                                }
                            ]
                        }, {
                            "id": "node_7_3",
                            "text": "风电场",
                            "state": "closed",
                            "pid": "node_7",
                            "children": [
                                {
                                    "id": "node_7_3_1",
                                    "text": "风电场热度图",
                                    "pid": "node_7_3",
                                    "children": []
                                }, {
                                    "id": "node_7_3_2",
                                    "text": "风电场分布",
                                    "pid": "node_7_3",
                                    "children": []
                                }
                            ]
                        }, {
                            "id": "node_7_4",
                            "text": "太阳能电站",
                            "state": "closed",
                            "pid": "node_11",
                            "children": [
                                {
                                    "id": "node_7_4_1",
                                    "text": "太阳能电站热度图",
                                    "pid": "node_7_4",
                                    "children": []
                                }, {
                                    "id": "node_7_4_2",
                                    "text": "太阳能电站分布",
                                    "pid": "node_7_4",
                                    "children": []
                                }
                            ]
                        }, {
                            "id": "node_7_5",
                            "text": "生物质电站",
                            "pid": "node_7",
                            "children": []
                        }
                    ]
                }, {
                    "id": "node_11",
                    "text": "输电线路项目",
                    "children": []
                }, {
                    "id": "node_12",
                    "text": "变电站项目",
                    "children": []
                }
            ]
        }, {
            "text": "能源规划",
            "children": [
                {
                    "id": "node_13",
                    "text": "电网电站规划",
                    "state": "closed",
                    "children": [
                        {
                            "id": "node_13_1",
                            "text": "2015电网站点",
                            "pid": "node_13",
                            "children": []
                        }, {
                            "id": "node_13_2",
                            "text": "2020电网站点",
                            "pid": "node_13",
                            "children": []
                        }
                    ]
                }, {
                    "id": "node_14",
                    "text": "电网线路规划",
                    "state": "closed",
                    "children": [
                        {
                            "id": "node_14_1",
                            "text": "2015电网线路",
                            "pid": "node_15",
                            "children": []
                        }, {
                            "id": "node_14_2",
                            "text": "2020电网线路",
                            "pid": "node_15",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ];
}

//新能源处
EMS.RolePrivage.getNewEnergyRolePrivage=function () {

    return [
    {
        "text": "能源资源",
        "children": [
            {
                "id": "node_1",
                "text": "水资源",
                "state": "closed",
                "children": [
        {
                        "id": "node_1_1",
                        "text": "流域蕴含量专题图",
        "pid": "node_1",
        "children": []
    }, {
        "id": "node_1_2",
        "text": "区划蕴含量专题图",
        "pid": "node_1",
        "children": []
    }
    ]
}, {
    "id": "node_2",
    "text": "风资源",
    "state": "closed",
    "children": [
        {
            "id": "node_2_1",
            "text": "风速分布专题图",
            "pid": "node_2",
            "children": []
        }, {
            "id": "node_2_2",
            "text": "风功率密度专题图",
            "pid": "node_2",
            "children": []
        }
    ]
}, {
    "id": "node_3",
    "text": "太阳能资源",
    "state": "closed",
    "children": [
        {
            "id": "node_3_1",
            "text": "年均总辐射分布专题图",
            "pid": "node_3",
            "children": []
        }, {
            "id": "node_3_2",
            "text": "太阳能资源分区专题图",
            "pid": "node_3",
            "children": []
        }
    ]
}
]
}, {
        "text": "能源项目",
        "children": [
            {
                "id": "node_7",
                "text": "电站项目",
                "children": [
                     {
                         "id": "node_7_2",
                         "text": "水电站",
                         "state": "closed",
                         "pid": "node_7",
                         "children": [
                             {
                                 "id": "node_7_2_1",
                                 "text": "水电站热度图",
                                 "pid": "node_7_2",
                                 "children": []
                             }, {
                                 "id": "node_7_2_2",
                                 "text": "水电站分布",
                                 "pid": "node_7_2",
                                 "children": []
                             }
                         ]
                     }, {
                         "id": "node_7_3",
                         "text": "风电场",
                         "state": "closed",
                         "pid": "node_7",
                         "children": [
                             {
                                 "id": "node_7_3_1",
                                 "text": "风电场热度图",
                                 "pid": "node_7_3",
                                 "children": []
                             }, {
                                 "id": "node_7_3_2",
                                 "text": "风电场分布",
                                 "pid": "node_7_3",
                                 "children": []
                             }
                         ]
                     }, {
                         "id": "node_7_4",
                         "text": "太阳能电站",
                         "state": "closed",
                         "pid": "node_11",
                         "children": [
                             {
                                 "id": "node_7_4_1",
                                 "text": "太阳能电站热度图",
                                 "pid": "node_7_4",
                                 "children": []
                             }, {
                                 "id": "node_7_4_2",
                                 "text": "太阳能电站分布",
                                 "pid": "node_7_4",
                                 "children": []
                             }
                         ]
                     }, {
                         "id": "node_7_5",
                         "text": "生物质电站",
                         "pid": "node_7",
                         "children": []
                     }
                ]
            }
        ]
}
];
}

//油气处
EMS.RolePrivage.getOilRolePrivage= function () {
    return [
    {
        "text": "能源资源",
        "children": [
            {
                "id": "node_5",
                "text": "石油资源",
                "children": []
            }, {
                "id": "node_6",
                "text": "天然气资源",
                "children": []
            }
        ]
    }, {
        "text": "能源项目",
        "children": [
            {

                "id": "node_8",
                "text": "天然气项目",
                "state": "closed",
                "children": [
                    {
                        "id": "node_8_1",
                        "text": "加气站",
                        "pid": "node_8",
                        "children": []
                    }, {
                        "id": "node_8_2",
                        "text": "燃气公司",
                        "pid": "node_8",
                        "children": []
                    }, {
                        "id": "node_8_3",
                        "text": "输气管网",
                        "pid": "node_8",
                        "children": []
                    }
                ]
            }, {
                "id": "node_9",
                "text": "石油项目",
                "state": "closed",
                "children": [
                    {
                        "id": "node_9_1",
                        "text": "石油储存库",
                        "pid": "node_9",
                        "children": []
                    }, {
                        "id": "node_9_2",
                        "text": "输油管网",
                        "pid": "node_9",
                        "children": []
                    }, {
                        "id": "node_9_3",
                        "text": "加油站",
                        "pid": "node_9",
                        "children": []
                    }
                ]
            }
        ]
    }, {
        "text": "能源规划",
        "children": [
             {
                 "id": "node_15",
                 "text": "天然气管道规划",
                 "state": "closed",
                 "children": [
                     {
                         "id": "node_15_1",
                         "text": "2015天然气管道",
                         "pid": "node_15",
                         "children": []
                     }, {
                         "id": "node_15_2",
                         "text": "2020天然气管道",
                         "pid": "node_15",
                         "children": []
                     }
                 ]
             }
        ]
    }
    ];
}

//煤炭处
EMS.RolePrivage.getCoalRolePrivage=function () {
    return  [
        {
            "text": "能源资源",
            "children": [
                {
                    "id": "node_4",
                    "text": "煤炭资源",
                    "children": []
                }
            ]
        }, {
            "text": "能源项目",
            "children": [
                {
                    "id": "node_10",
                    "text": "煤炭项目",
                    "children": []
                }
            ]
        }
    ];
}
