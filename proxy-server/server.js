const express = require('express')
const axios = require('axios')
const app = express()

app.get("/api", async (request, response) =>  {
  
    try {
        const NASA = await axios.get(('http://api.open-notify.org/iss-now.json'))
        console.log(NASA.data.iss_position)
        response.json( { 'NASA' : NASA.data.iss_position})
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'Error fetching ISS position' });
    }
   
    
});

app.get("/api/astros", async (request, response) => {
    try {
        const ASTROs = await axios.get(('http://api.open-notify.org/astros.json'))
        console.log("this is ASTROs", ASTROs)
        response.json( { "astros" : ASTROs.data})
    } catch (error) {
        console.log('astros error', error)
        response.status(500).json({ error: 'Error fetching astros' });

    }
})


app.listen(5000, () => { console.log("server started on port 5000") })

