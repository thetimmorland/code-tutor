import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  toolBarSpacer: {
    flexGrow: 1,
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
  },
  appBarText: {
    marginLeft: theme.spacing(2),
  },
  appBarSpinner: {
    marginLeft: theme.spacing(2),
  },
  main: {
    flexGrow: 1,
    display: "flex",
    padding: theme.spacing(1),
  },
  paper: {
    height: "100%",
    width: "100%",
    minHeight: 500,
    padding: theme.spacing(1),
  },
}));

export default useStyles;
