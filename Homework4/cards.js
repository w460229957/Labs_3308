var Num = new Map();
Num.set('interest1',0);
Num.set('interest2',0);
Num.set('interest3',0);

function addCard(ID){
    Num.set(ID, Num.get(ID) + 1);
    document.getElementById(ID).innerHTML += `
        <div style='display: flex' id='` + ID + `tweet` + Num.get(ID) + `'>
            <a class="btn" role="button" onclick="removeCard('` + ID + `tweet` + Num.get(ID) + `')"></a>
            <div class="card">
                <img class="card-img-top" src="https://i.ibb.co/84sdKqK/image.jpg" alt="Twitter Logo" height="300px" width="600px">
                <div class="card-body">
                    <h class="card-title">Tweet</h>
                    <p class="card-text">Sample tweet will go here!</p>
                </div>
            </div>
        </div>
    `;  
}

function removeCard(tweetID){
    document.getElementById(tweetID).remove();
}
