import React, { useState, useEffect } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Form, Row } from 'react-bootstrap'
import axios from 'axios'
import { Label } from '@material-ui/icons'

function DashBoardComponent({ subject, calendar, handleMonth, monthName}){
    const [background, setBackground] = useState([])
    const [border, setBorder] = useState([])

    const backgrounds = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]

    const borders = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]

    useEffect(() => {
        let bg = []
        let br = []

        subject.map((item, index) => {
            const color_length = backgrounds.length
            const min = 0;
            const max = color_length - 1;
            const rand = min + Math.random() * (max - min); 

            bg.push(backgrounds[Math.floor(rand)])
            br.push(borders[Math.floor(rand)])
        })

        setBackground(bg)
        setBorder(br)
    }, [])  

    return (
        <React.Fragment>
            <div className="mt-1">
                <h5 className="font-weight-bold ml-1 mt-2 float-left">Monthly Dashboard - {monthName}</h5>
                <div className="float-right">
                    <Form.Group>
                        <Form.Control as="select">
                            <option onClick={() => handleMonth(1)}>January</option>
                            <option onClick={() => handleMonth(2)}>February</option>
                            <option onClick={() => handleMonth(3)}>March</option>
                            <option onClick={() => handleMonth(4)}>April</option>
                            <option onClick={() => handleMonth(5)}>May</option>
                            <option onClick={() => handleMonth(6)}>June</option>
                            <option onClick={() => handleMonth(7)}>July</option>
                            <option onClick={() => handleMonth(8)}>August</option>
                            <option onClick={() => handleMonth(9)}>September</option>
                            <option onClick={() => handleMonth(10)}>October</option>
                            <option onClick={() => handleMonth(11)}>November</option>
                            <option onClick={() => handleMonth(12)}>December</option>
                        </Form.Control>
                    </Form.Group>
                    </div>
                
                <Bar 
                    data={{
                        labels: subject.map((item) => item.subject),
                        datasets: [
                        {
                            label: 'Week 1',
                            data: calendar[0],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 99, 132, 1)',
                            ],
                            // backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                            // borderColor: ['rgba(255, 99, 132, 1)'],
                            borderWidth: 1
                        },
                        {
                            label: 'Week 2',
                            data: calendar[1],
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(54, 162, 235, 1)',
                            ],
                            // backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                            // borderColor: ['rgba(54, 162, 235, 1)'],
                            borderWidth: 1,
                        },
                        {
                            label: 'Week 3',
                            data: calendar[2],
                            backgroundColor: [
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            // backgroundColor: ['rgba(255, 206, 86, 0.2)'],
                            // borderColor: ['rgba(255, 206, 86, 1)'],
                            borderWidth: 1,
                        },
                        {
                            label: 'Week 4',
                            data: calendar[3],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            // backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                            // borderColor: ['rgba(75, 192, 192, 1)'],
                            borderWidth: 1,
                        },
                        {
                            label: 'Week 5',
                            data: calendar[4],
                            backgroundColor: [
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                            ],
                            borderColor: [
                                'rgba(153, 102, 255, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
                            // backgroundColor: ['rgba(153, 102, 255, 0.2)'],
                            // borderColor: ['rgba(153, 102, 255, 1)'],
                            borderWidth: 1,
                        }
                    ]
                    }}
                    options = {{
                        tooltips: {
                            enabled: true,
                            mode: 'single',
                            callbacks: {
                                label: function(tooltipItems, data){ 
                                    return 'Total time spent in seconds: ' + tooltipItems.yLabel;
                                },
                            }
                        },
                        maintainAspectRatio: true,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        // display: false,
                                        display: true,
                                        beginAtZero: true
                                    }
                                }
                            ]
                        }
                    }}
                />
            </div>
        </React.Fragment>
    )
}

export default DashBoardComponent