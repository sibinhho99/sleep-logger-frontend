import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DeletableTipBox from "./DeletableTipBox";
import LoggedInNavBar from "../nav/LoggedInNavBar";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {BASE_URL} from "../../configs/configs";
import {Card} from "@material-ui/core";

export default function MyTips(props) {
  const [tips, setTips] = useState([]);
  const [hasNoTip, setHasNoTip] = useState(false);

  useEffect(() => {

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    fetch(BASE_URL + "/v1/tips", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        setTips(data);
        if (data.length === 0) {
          setHasNoTip(true);
        }
      });
  });

  const tipBoxes = [];
  tips.forEach((t) =>
    tipBoxes.push(
      <Grid item md={4} sm={6} xs={12}>
        <DeletableTipBox content={t.content} id={t.id} />
      </Grid>
    )
  );

  return (
    <div>
      <LoggedInNavBar history={props.history} />
      {hasNoTip && (
        <Grid container spacing={2}>
          <Grid container item md={4} sm={6} xs={12}>
            {/*empty*/}
          </Grid>
          <Grid container item md={4} sm={6} xs={12}>
            <Box p={"5%"} align={"center"}>
            <Card>
              <Box p={3} align={"center"}>
                <Typography variant={"h6"} color={"textPrimary"}>
                  You have not saved any tip. Time to save some!
                </Typography>
                <Box p={"2%"}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/diary"
                  >
                    Take me to my diary
                  </Button>
                </Box>
              </Box>
            </Card>
            </Box>
          </Grid>
          <Grid container item md={4} sm={6} xs={12}>
            {/*empty*/}
          </Grid>
        </Grid>
      )}
      <Box p={"5%"}>
        <Grid container spacing={2}>
          {tipBoxes}
        </Grid>
      </Box>
    </div>
  );
}
