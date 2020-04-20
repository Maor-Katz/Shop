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
    width: 210,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 5
  },
  media: {
    height: 140,
  },
});

export default function MediaCard(props) {
  const classes = useStyles();
  return (
    <Card className={`${classes.root} specificCard`} >
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`https://maor-katz-new-bucket1990.s3.eu-west-2.amazonaws.com/${props.details.img_url}`}
          title="Contemplative Reptile"
          onClick={()=> props.editProduct(props.details)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.details.product_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.details.price} <FontAwesomeIcon icon={faShekelSign} className="size11" />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" className="addButton" onClick={() => props.openModal(props.details)}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}