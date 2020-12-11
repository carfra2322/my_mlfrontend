import React, {useState, useEffect } from "react";

import './App.css';
import axios from 'axios';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
    Typography,
    Link,
    ListItem,
    List,
    ListItemText,
    ListItemAvatar
}  from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';




const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '50',
        },
        width: '100%',
        maxWidth: '36ch',
    },
    inline: {
        display: 'inline',
    },
}));



const App = () => {

    var config = {
        headers: {'Access-Control-Allow-Origin': '*'}
    };

    // axios.get(`http://ec2-54-86-153-64.compute-1.amazonaws.com:5000/classify/whatonearthishappening`)
    //     .then(res => {
    //         const respdata = res.data;
    //         console.log(respdata)
    //     })

    const classes = useStyles();
    const [value, setValue] = useState('Enter your covid related text');
    const [resp, setResp] = useState('');
    const [apiStatus, setAPIStatus] = useState('');

    //const preventDefault = (event) => event.preventDefault();

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleClear = () => {
        setValue('')
    }

    const handleStatus = () => {
        axios.get('http://ec2-54-86-153-64.compute-1.amazonaws.com:5000/').then(
            res => {
                console.log('BACKEND', res.status)
                setAPIStatus(res.status)
            }
        )
    }

    const handleRecommend = () => {
        axios.get(`http://ec2-54-86-153-64.compute-1.amazonaws.com:5000/classify/${value}`)
            .then(res => {
                const respdata = res.data;
                console.log(respdata)
                const topics = respdata[0].matched_topics


                setResp(
                    <>
                        <h3>Based on your search you might want to look at ..</h3>
                        <h5>Click on the book icon </h5>
                        <List className={classes.root}>

                            {respdata.map(({ title, authors, doi,  }) => (
                                <ListItem alignItems="flex-start" key={authors}>
                                    <ListItemAvatar>
                                        <Link href={`https://doi.org/${doi}`} target="_blank">
                                            <MenuBookIcon/>
                                        </Link>
                                        <ListItemText
                                            primary= { Array.isArray(title) ?  `Title: ${title[0].substring(0,100)}..`: `Title: ${title.substring(0,100)}..`}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        className={classes.inline}
                                                        color="secondary"
                                                    >
                                                        {`By: ${authors}`}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />

                                    </ListItemAvatar>
                                </ListItem>
                            ))}
                        </List>
                        <h4>{`TOPIC STATISTICS: ${topics}`}</h4>

                    </>
                )


            })
    }

    useEffect(() => {
        // Anything in here gets triggered when something in the array gets updated
        handleStatus()
    }, []);


    return (
      <div className="App">
        <header className="App-header">
          <p>
            Covid 19 Recommendation System
          </p>

            <TextField
                id="outlined-multiline-static"
                label="COVID TEXT"
                multiline
                rows={4}
                defaultValue="Enter covid related text"
                variant="outlined"
                onChange={handleChange}
            />
            <Button
                variant="contained"
                color="primary"
                component="span"
                onClick={() => { handleRecommend() } }

            >
                Recommend
            </Button>


            <div>
                {resp}
            </div>
            <p>
                BACK-END IS CURRENTLY { apiStatus == 200 ? 'ON' : 'OFF' }
            </p>
        </header>
      </div>

    )
}


export default App;

//["initial","inherit","primary","secondary","textPrimary","textSecondary","error"]