const e = React.createElement; // Mengarahkan ke proses berikutnya, 
// Membuat element baru

function LikeButton(){
    const [liked, setLiked] = React.useState(false);
    // state salah satu 
    if(liked){
        return e('p', null, 'You like this');
    }
    return e (
        'button',
        { onClick: () => setLiked(true) },
        'Like'
    );
}

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton)); // proses ke function LikeButton