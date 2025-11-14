//1) Call Backs


const posts = [
    {title:'post one', body:'This is post one'},
    {title:'post two', body:'This is post two'},
]
/*
function getPosts(){
    setTimeout(()=>{
        let output = '';
        posts.forEach((post,index)=>{
            output += `<li>${post.title} </li>`;
        });
        document.body.innerHTML = output;
    },1000);
}
/*
function createPost(post){
    setTimeout(()=>{
        posts.push(post);
    },2000);
}

getPosts();

createPost(
    {title:'post three', body:'This is post three'}
);

*/
//write now in this program get posts fetch two posts in 1 sec
//and create posts create post in 2 sec due to which even though third post is created 
// our browser displays only two posts 

// two solve this issu asynchronous programming comes in 
// here we use call baclk functions



//*************************************** */

// lets solve this problem using call bacaks the solution is given below

function createPost(post, callback){
    setTimeout(()=>{
        posts.push(post);
        callback();
    },2000);
}

createPost(
    {title:'post three', body:'This is post three'}
,getPosts);



