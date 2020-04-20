import React from 'react';
import { faBars, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { chooseView } from "../actions/actions";

class Menucomp extends React.Component {

    state = {
        menuBar: false,
        hamburgerBtn: true
    }

    openAboutPage = () => {
        const { dispatch } = this.props
        dispatch(chooseView('ABOUT_PAGE', true))
        dispatch(chooseView('INFO_PAGE', false))
        dispatch(chooseView('LOGIN_PAGE', false))
        this.setState({ menuBar: false, hamburgerBtn: true })
    }

    openLoginPage = () => {
        const { dispatch } = this.props
        dispatch(chooseView('ABOUT_PAGE', false))
        dispatch(chooseView('INFO_PAGE', false))
        dispatch(chooseView('LOGIN_PAGE', true))
        this.setState({ menuBar: false, hamburgerBtn: true })
    }

    openInfoPage = () => {
        const { dispatch } = this.props
        dispatch(chooseView('ABOUT_PAGE', false))
        dispatch(chooseView('INFO_PAGE', true))
        dispatch(chooseView('LOGIN_PAGE', false))
        this.setState({ menuBar: false, hamburgerBtn: true })
    }

    render() {
        const { dispatch, view } = this.props;
        const { menuBar, hamburgerBtn } = this.state;

        return view.mobileMenu && <div className="MenuComponent">
            {hamburgerBtn && <FontAwesomeIcon icon={faBars} className="menuIcon" size="large" onClick={() => this.setState({ menuBar: true, hamburgerBtn: false })} />}
            {!hamburgerBtn && <FontAwesomeIcon icon={faWindowClose} className="menuIcon" size="large" onClick={() => this.setState({ menuBar: false, hamburgerBtn: true })} />}

            <div className={`menuBar ${menuBar ? 'width80' : ''}`}>
                    <span className={`menuBtn ${menuBar ? 'inlineBlock' : ''}`} onClick={() => this.openLoginPage()}>Login</span>
                    <span className="lineMenu"></span>
                    <span className={`menuBtn ${menuBar ? 'inlineBlock' : ''}`} onClick={() => this.openAboutPage()}>About</span>
                    <span className="lineMenu"></span>
                    <span className={`menuBtn ${menuBar ? 'inlineBlock' : ''}`} onClick={() => this.openInfoPage()}>Info</span>
            </div>

        </div>
    }
}

const mapStateToProps = state => ({
    view: state.view
})

export default connect(mapStateToProps)(withRouter(Menucomp))