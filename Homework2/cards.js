var counts = new Map();
counts.set('interest1',0);
counts.set('interest2',0);
counts.set('interest3',0);

function addCard(interestID){
    counts.set(interestID, counts.get(interestID) + 1);
    document.getElementById(interestID).innerHTML += `
        <div style='display: flex' id='` + interestID + `tweet` + counts.get(interestID) + `'>
            <a class="btn btn-primary" role="button" onclick="removeCard('` + interestID + `tweet` + counts.get(interestID) + `')"></a>
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