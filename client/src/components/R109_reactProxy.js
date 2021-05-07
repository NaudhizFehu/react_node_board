import React, {Component} from 'react';
const axios = require('axios');

class R109_reactProxy extends Component{
    componentDidMount = async () => {
        this.CallGet();
        this.CallPost();  
    }

    CallGet = async () => {
        const response = await fetch('/users');
        const body = await response.json();
        console.log("Get body.message : " + body.message);
    }

    CallPost = async () => {
        const response = await axios.post('/users');
        console.log("Post response.data.message : " + response.data.message);
    }

    render(){
        return(
            <><h1>Call Node Api Get</h1></>
        );
    }
}

export default R109_reactProxy;