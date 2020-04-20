import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { existingUser, chooseView } from "../actions/actions";
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Maor © '}
      <Link color="inherit" href="https://material-ui.com/">
        Website
        </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const classes = useStyles();
  const [screenStatus, setScreenStatus] = useState('')
  const [menuBar, setMenuBar] = useState(false)

  useEffect(() => {
    
    checkView()
  },[]);

  const checkView = () => {
    const { dispatch } = props
    // need to listen to resize event listener in order to choose the view
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1200) {
        dispatch(chooseView('ABOUT_PAGE', false))
        dispatch(chooseView('INFO_PAGE', false))
        dispatch(chooseView('MOBILE_MENU', true))
        dispatch(chooseView('LOGIN_PAGE', true))
      } else {
        dispatch(chooseView('ABOUT_PAGE', true))
        dispatch(chooseView('INFO_PAGE', true))
        dispatch(chooseView('MOBILE_MENU', false))
        dispatch(chooseView('LOGIN_PAGE', true))
      }
    });
    //on the first upload of the page we must check the view:
    if (window.innerWidth < 1200) {
      dispatch(chooseView('ABOUT_PAGE', false))
      dispatch(chooseView('INFO_PAGE', false))
      dispatch(chooseView('MOBILE_MENU', true))
    }
  }

  async function login() {
    try {
      const rawResponse = await fetch('http://localhost/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(props.existingUser)
      });
      const content = await rawResponse.json();
      localStorage.token = content.token
      localStorage.email = props.existingUser.email
      setErrMsg('')
      window.location.reload(false);
    } catch (err) {
      setErrMsg('wrong credentials')
    }
  }

  function changeHandler(field, e) {
    const { dispatch } = props
    dispatch(existingUser(field, e.target.value))
  }

  const [errMsg, setErrMsg] = useState('');
  const { userStatus, view } = props;
  return view.loginPage && <div className="loginWrapper">
    <Container component="main" maxWidth="xs" className="flex1">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
          </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => changeHandler('EMAIL', e)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => changeHandler('PASSWORD', e)}
          />
          {errMsg && <span className="errMsg">{errMsg}<span className="chat"></span></span>}
          <Button
            disabled={localStorage.token}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => login()}
          >
            Sign In
            </Button>
          <Grid container>

            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {
        localStorage.token && <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => props.history.push('/shop')}
        >
          {userStatus.userOpenOrder ? 'Continue Shopping!' : 'Start Shopping'}
        </Button>
      }
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  </div>
}

const mapStateToProps = state => ({
  existingUser: state.existingUser,
  userStatus: state.userStatus,
  view: state.view
})

export default connect(mapStateToProps)(withRouter(Login))