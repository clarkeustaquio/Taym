import React, { useState, useEffect } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import axios from 'axios'
import { Label } from '@material-ui/icons'
import moment from 'moment'
import { domain } from '../../../static/api_request_urls'

const current_date = moment().format("DD-MM-YYYY hh:mm:ss")

function DashBoardComponent(){
    const token = localStorage.getItem('token')
    const [subject, setSubject] = useState([])
    const [data, setData] = useState([])
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
        axios.get(`${domain}api/dashboard/`, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setSubject(response.data.serializer)
                setData(response.data.data)
                
                let bg = []
                let br = []

                response.data.serializer.map((item, index) => { 
                    const color_length = backgrounds.length
                    const min = 0;
                    const max = color_length - 1;
                    const rand = min + Math.random() * (max - min); 

                    bg.push(backgrounds[Math.floor(rand)])
                    br.push(borders[Math.floor(rand)])
                })

                setBackground(bg)
                setBorder(br)
            }
        }).catch(() => {
            throw new Error('Server Failed. Try again later.')
        })
    }, [])

    return (
        <React.Fragment>
            <div className="mt-1">
                <h5 className="font-weight-bold ml-1">Daily Dashboard</h5>
                <Bar 
                    data={{
                        labels: subject.map((item) => item.subject),
                        datasets: [{
                            label: 'Student Time Spents',
                            data: data,
                            backgroundColor: background,
                            borderColor: border,
                            borderWidth: 1
                        },
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
                                // afterBody: function(tooltipItems, data) {
                                //     var multistringText = [`Time Spent: ${data}`];
                    
                                //     return multistringText;
                                // }
                            }
                            
                            // callbacks: {
                            //     label: function(tooltipItems, data){ 
                            //         return 'Total time spent in seconds: ' + tooltipItems.yLabel;
                            //     },
                            // }
                        },
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