const express = require('express')
const app = express()
const path = require('path');
const methodOveride = require('method-override');

app.use(methodOveride('_method'))

const { v4: uuid } = require('uuid');  // Here in destructuring they have used the Renaming to uuid
uuid(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


app.use(express.json()) // for parsing application/json
//BELWO THING IS A MIDDLE WARE USED FOR PARSING DATA
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded //ALWASY RUNS THIS CODE ISPITE OF REQUESR


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


app.listen(3000, () => {
    console.log("listening on port 3000")
})


let comments = [
    {   id:uuid(),
        username: 'Todd',
        comment:'Lol thats so funny'
    },
    {   id:uuid(),
        username: 'Abhi',
        comment:'go to hell'
    },
    {
        id:uuid(),
        username: 'Naresh',
        comment:'go to mukesh'
    }

   
]


app.get('/comments',(req, res)=> {
    res.render('comments/index',{comments});
})



app.get('/comments/new',(req, res)=> {
    res.render('comments/new',{comments});
})

app.post('/comments', (req, res) => { 
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuid() })
   // console.log({ username, comment, id: uuid() })
    
    //redirecting to the /Comments
    res.redirect('comments')
   
})
// Actually after this point we have to relad the page to view changes . How to do it without reload lets see

// We can do thaqt using the redirection

app.get('/comments/:id', (req, res) => {
    const { id } = req.params;//her this id is a string , convert to int, no need in case pf uuid
    const comment = comments.find(c => c.id === id);
    
    res.render('comments/show',{comment});
})

app.get('/comments/:id/edit', (req, res) => {  //For editing the comments
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit',{comment})
})


app.patch('/comments/:id', (req, res) => {
     const { id } = req.params;
   
    // res.send('All good for now')
    const newComment = req.body.comment;
    console.log(newComment)
    const oldComment = comments.find(c => c.id === id);
    console.log(oldComment)
    oldComment.comment = newComment;
    console.log(oldComment)
    res.redirect('/comments');

    // whats the differnce between '/comments'   and   'comments'  and  '/comments/index'
    //first one goes to /comments get request and render index.ejs
    //second one gives an error coz it will search for folder in side view comments and can't render anything so error
    //third one gives an error there is no request for get in /comments/index so can't render anything

    //2 and 3 just redirecting but can't have render functionality in them..... so u will get error

    //const comment = comments.find(c => c.id === id);

    
})


app.delete('/comments/:id', (req, res) => {

      const { id } = req.params;
  
    comments = comments.filter(c => c.id !== id)//making a new array copy by filtering delete id from list n which means deleting
    //updating the let comments by filter comments
   // res.send("hey deleted")
    res.redirect('/comments')
})