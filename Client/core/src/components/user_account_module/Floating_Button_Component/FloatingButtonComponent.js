import React from 'react';
import Fab from '@material-ui/core/Fab';
import PolicyIcon from '@material-ui/icons/Policy';
import { makeStyles } from '@material-ui/core/styles';

import PrivacyPolicyComponent from '../Privacy_Policy_Component/PrivacyPolicyComponent'

const useStyles = makeStyles(theme => ({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));
  
function FloatingButtonComponent() {
    const classes = useStyles()
    const [modalShow, setModalShow] = React.useState(false)

    return (
        <React.Fragment>
            <Fab className={classes.fab} aria-label="privacy_policy" onClick={() => setModalShow(true)}>
                <PolicyIcon />
            </Fab>
        
            <PrivacyPolicyComponent modalShow={modalShow} setModalShow={setModalShow}/>
        </React.Fragment>
        
    );
  }

export default FloatingButtonComponent