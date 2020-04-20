import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { newUser, chooseView } from "../actions/actions";
import { fieldsCounter } from "../service"

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
    root: {
        height: '100vh', flexBasis: 'unset', maxWidth: 'none'
    },
    image: {
        backgroundImage: 'url(https://images.unsplash.com/photo-1582020086775-1c3fc831a1c7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(1, 1),
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

function Register(props) {
    const classes = useStyles();
    useEffect(() => {
        checkView()
      }, []);
    
    const checkView = () => {
        const { dispatch } = props
        // need to listen to resize event listener in order to choose the view
        window.addEventListener('resize', () => {
          if (window.innerWidth < 1200) {
            dispatch(chooseView('ABOUT_PAGE', false))
            dispatch(chooseView('INFO_PAGE', false))
          } else {
            dispatch(chooseView('ABOUT_PAGE', true))
            dispatch(chooseView('INFO_PAGE', true))
          }
        });
        //on the first upload of the page we must check the view:
        if (window.innerWidth < 1200) {
            dispatch(chooseView('ABOUT_PAGE', false))
            dispatch(chooseView('INFO_PAGE', false))
        }
      }

    function changeHandler(field, e) {
        const { dispatch } = props
        dispatch(newUser(field, e.target.value))
    }
    async function checkUserExists() {// check if email or id already exists
        try {
            const rawResponse = await fetch('/auth/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: props.newUser.email, Identity_num: props.newUser.id })
            });
            const content = await rawResponse.json();
            return 'success!'
        } catch (err) {
            return 'err'
        }
    }

    async function moveNextStep() {

        let counter = fieldsCounter(props.newUser)//count how many field are filled
        if (counter === 4) {
            let successOrNot = await checkUserExists();// check if email or id already exists
            if (props.newUser.password !== props.newUser.confirm_password) {
                setErrMsg('verify your password please!')
                return
            }
            if (successOrNot === 'success!') {
                setNextstep(true)
                setErrMsg('')
            } else {
                setErrMsg('Id or Email is already exists')
            }
        } else {
            setErrMsg('Please fill all fields!')
            return
        }
    }

    async function register() {
        const { newUser } = props;
        try {
            const rawResponse = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email,
                    Identity_num: newUser.id,
                    street: newUser.street,
                    role: newUser.role,
                    password: newUser.password,
                    city: newUser.city
                })
            });
            const content = await rawResponse.json();
            localStorage.token = content.token;
            localStorage.email = newUser.email;
            return 'success!'
        } catch (err) {
            return 'err'
        }
    }

    const [nextstep, setNextstep] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    return (
        <div className="registerPage">
            
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.root}>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Register
          </Typography>
                        <form className={classes.form} noValidate>
                            {!nextstep && <div> <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="identityNum"
                                label="id number"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => changeHandler('ID', e)}
                            />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => changeHandler('EMAIL', e)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) => changeHandler('PASSWORD', e)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="current-password"
                                    onChange={(e) => changeHandler('CONFIRM_PASSWORD', e)}
                                />
                            </div>
                            }
                            {nextstep && <div>  <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstname"
                                label="first name"
                                autoComplete="firstname"
                                autoFocus
                                onChange={(e) => changeHandler('FIRSTNAME', e)}
                            />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="lastname"
                                    label="last name"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => changeHandler('LASTNAME', e)}
                                />


                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="role"
                                    label="role"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => changeHandler('ROLE', e)}
                                />

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="street"
                                    label="street"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => changeHandler('STREET', e)}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Select City...</InputLabel>
                                    <Select
                                        required
                                        fullWidth
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={props.newUser.city}
                                        onChange={(e) => changeHandler('CITY', e)}
                                    >
                                        <MenuItem value="" disabled>
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Tel Aviv"}>Tel Aviv</MenuItem>
                                        <MenuItem value={"Haifa"}>Haifa</MenuItem>
                                        <MenuItem value={"Beer-Shave"}>Beer-Shave</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            }
                            {errMsg && <span className="errMsg">{errMsg}<span className="chat"></span></span>}
                            {nextstep ? <Button
                                disabled={!Object.values(props.newUser).every(x => x)}
                                type="submit"
                                href="/login"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={() => register()}
                            >
                                Sign Up
            </Button> : <div className="paddingClass"><Button variant="contained" color="primary" href="#"
                                    onClick={() => moveNextStep()} >
                                    Next
      </Button></div>}

                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"have an account? Sign In"}
                                </Link>
                            </Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div >
    );
}
const mapStateToProps = state => ({
    newUser: state.newUser,
    view: state.view
})

export default connect(mapStateToProps)(Register)