const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.get("/", async(req,res)=>{
  const symbol = (req.query.crypto || '').toUpperCase();
  if(!symbol){
    return res.render("index.ejs", {
      price : null,
      symbol : null,
      error: null
    });
  }
  try{
    const response = await axios.get("https://blockchain.info/ticker");
    const priceData = response.data[symbol];
    if(priceData && priceData.last){
      res.render("index.ejs", {
        price : priceData.last,
        symbol : symbol,
        error: null
      })
    }else{
      res.render("index.ejs", {
        price : null,
        symbol : symbol,
        error :"Cryptocurrency not found or not supported."
      });
    }
  }catch(error){
    res.render("index.ejs", {
      price : null,
      symbol : symbol,
      error:"Failed to fetch data. Please try again later."
    })
  }
})

app.listen(PORT, (req,res)=>{
  console.log(`Server is running on port ${PORT}`);
})