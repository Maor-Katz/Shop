import React from 'react';

class Loader extends React.Component {

    state = {

    }


    render() {

        return <div className="LoaderPage">
            <div className="loaderWrapper"><img src="https://media.giphy.com/media/11ASZtb7vdJagM/giphy.gif" className="loadGif"/></div>
        </div>
    }
}

export default Loader