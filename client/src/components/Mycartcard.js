import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { faShekelSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles({
    root: {
        width: 180,
        height: 190,
        marginTop: 20,
        margin: 'auto'
    },
});


export default function Mycartcard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="100"
                    image={`https://maor-katz-new-bucket1990.s3.eu-west-2.amazonaws.com/${props.details.img_url}`}
                    title="Contemplative Reptile"
                />
                <CardContent className="padding">
                    <Typography variant="body2" color="textSecondary" component="p" className="fontSize">
                        {props.details.quantity} X {props.details.product_name} - {props.details.price}  <FontAwesomeIcon icon={faShekelSign} className="size11" />
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {!props.atOrder && <Button size="small" color="primary" className="searchProduct" onClick={() => props.deleteProductItem(props.details.product_id)}>
                    Delete
        </Button>}
            </CardActions>
        </Card>
    );
}

